// File: client/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import MainMenu from './components/MainMenu.jsx';
import GameView from './components/GameView.jsx';
import LoginScreen from './components/LoginScreen.jsx'; // Thêm
import RegisterScreen from './components/RegisterScreen.jsx'; // Thêm
import { SocketClient } from './game/SocketClient.js'; // Thêm
import LobbyScreen from './components/LobbyScreen.jsx';

// [SỬA] Định nghĩa các màn hình
const SCREENS = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    MAIN_MENU: 'MAIN_MENU',
    LOBBY: 'LOBBY',
    GAME: 'GAME',
};

// [SỬA] Địa chỉ server
const socketUrl = `ws://${window.location.hostname}:5174`;
const AUTH_STORAGE_KEY = 'authData'

function App() {
    const [initialPlayerSetup, setInitialPlayerSetup] = useState(null);
    const [initialMapData, setInitialMapData] = useState(null);
    const [roomList, setRoomList] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null); // Lưu phòng hiện tại
    const [leaderboard, setLeaderboard] = useState([]); // [MỚI] State cho bảng xếp hạng
    const [screen, setScreen] = useState(SCREENS.LOGIN); // Bắt đầu ở màn hình Login
    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        //Đọc auth từ local storage
        if (savedAuth) {
            try {
                return JSON.parse(savedAuth);

            } catch (e) {
                localStorage.removeItem(AUTH_STORAGE_KEY);
                return null;
            }
        }
        return null;
    }); // Lưu thông tin { token, username }
    const socketRef = useRef(null); // Dùng useRef để giữ SocketClient

    // Hàm kết nối socket
    const connectSocket = () => {
        if (socketRef.current) return; // Đã kết nối

        const socket = new SocketClient(socketUrl);
        socket.connect();
        socketRef.current = socket;

        socket.onOpen(() => {
            console.log("Socket đã mở");
            if (auth) {
                console.log("Đang gửi checkAuth");
                socket.send({ type: 'checkAuth', token: auth.token });
            }
        });

        // Lắng nghe tin nhắn từ server
        socket.addMessageListener(data => {
            if (data.type === 'roomListData') {
                setRoomList(data.rooms); // Cập nhật danh sách phòng
            }
            if (data.type === 'joinRoomSuccess' || data.type === 'roomUpdate') {
                setCurrentRoom(data.room); // Vào phòng
                setScreen(SCREENS.LOBBY); // Chuyển đến màn hình lobby
            }
            if (data.type === 'leaveRoomSuccess') {
                setCurrentRoom(null);
                setScreen(SCREENS.MAIN_MENU); // Quay về sảnh
            }
            if (data.type === 'gameStarted') {
                setInitialMapData(data.mapData); // <-- LƯU LẠI MAP DATA
                setScreen(SCREENS.GAME);
            }
            if (data.type === 'loginSuccess') {
                const authData = { token: data.token, username: data.username, highScore: data.highScore, name: data.name, province: data.province, avatarUrl: data.avatarUrl, id: data.id };
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
                setAuth(authData); // Lưu thông tin đăng nhập
                setScreen(SCREENS.MAIN_MENU); // Chuyển tới Menu chính
                alert('Đăng nhập thành công!');
            }
            if (data.type === 'authSuccess') {
                console.log("Xác thực token thành công.");
                // Server đã gửi đầy đủ thông tin, ta cần lưu lại tất cả
                const authData = {
                    token: data.token,
                    username: data.username,
                    highScore: data.highScore,
                    id: data.id,
                    name: data.name,
                    avatarUrl: data.avatarUrl
                };
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
                setAuth(authData);
                setScreen(SCREENS.MAIN_MENU);
            }
            if (data.type === 'leaderboardData') {
                setLeaderboard(data.payload); // Cập nhật state
            }
            if (data.type === 'registerSuccess') {
                setScreen(SCREENS.LOGIN); // Quay lại Login
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
            }
            if (data.type === 'authError') {
                alert(`Lỗi: ${data.message}`);
                if (auth) {
                    handleLogout();
                }

            }
            if (data.type === 'initialSetup') {
                setInitialPlayerSetup(data); // <-- LƯU LẠI THÔNG TIN SETUP
                return; // Game.js sẽ xử lý sau
            }
            // Các tin nhắn game (initialSetup, update...) sẽ được Game.js lắng nghe
        });
    };

    // Kết nối socket ngay khi App chạy
    useEffect(() => {
        connectSocket();

        // Dọn dẹp khi tắt app
        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, []);

    const navigateTo = (targetScreen) => setScreen(targetScreen);

    // --- Các hàm xử lý Auth ---
    const handleLogin = (username, password) => {
        socketRef.current.send({ type: 'login', username, password });
    };
    const handleRegister = (username, password, name, province, avatarUrl) => {
        socketRef.current.send({ type: 'register', username, password, name, province, avatarUrl });
    };
    const handleLogout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuth(null);
        setScreen(SCREENS.LOGIN);
    };

    // Hàm này sẽ được MainMenu gọi khi nhấn "Chơi"
    const handleCreateRoom = (roomName) => {
        socketRef.current.send({ type: 'createRoom', name: roomName });
    };
    const handleJoinRoom = (roomId) => {
        socketRef.current.send({ type: 'joinRoom', roomId: roomId });
    };

    // Render component tương ứng
    const renderScreen = () => {
        if (auth && screen === SCREENS.LOGIN) {
            setScreen(SCREENS.MAIN_MENU);
        }
        switch (screen) {
            case SCREENS.LOGIN:
                return <LoginScreen onLogin={handleLogin} navigateTo={navigateTo} SCREENS={SCREENS} />;
            case SCREENS.REGISTER:
                return <RegisterScreen onRegister={handleRegister} navigateTo={navigateTo} SCREENS={SCREENS} />;
            case SCREENS.LOBBY:
                return (
                    <LobbyScreen
                        auth={auth}
                        room={currentRoom}
                        socket={socketRef.current}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                    />
                );
            // [SỬA] Truyền auth và các hàm mới vào MainMenu
            case SCREENS.MAIN_MENU:
                return (
                    <MainMenu
                        auth={auth}
                        // Xóa onPlay, thay bằng 2 hàm mới
                        onCreateRoom={handleCreateRoom}
                        onJoinRoom={handleJoinRoom}
                        roomList={roomList} // Truyền danh sách phòng thật
                        onLogout={handleLogout}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                        socket={socketRef.current}
                        leaderboard={leaderboard}
                    />
                );
            // [SỬA] Truyền socket đã kết nối vào GameView
            case SCREENS.GAME:
                return (
                    <GameView
                        socket={socketRef.current} //
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                        initialPlayerSetup={initialPlayerSetup} // <-- TRUYỀN XUỐNG
                        initialMapData={initialMapData} // <-- TRUYỀN XUỐNG
                    />
                );
            default:
                return <LoginScreen onLogin={handleLogin} navigateTo={navigateTo} SCREENS={SCREENS} />;
        }
    };

    return <div style={{ width: '100%', height: '100%' }}>{renderScreen()}</div>;
}

export default App;