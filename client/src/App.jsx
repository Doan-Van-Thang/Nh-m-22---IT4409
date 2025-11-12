// File: client/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import MainMenu from './components/MainMenu.jsx';
import GameView from './components/GameView.jsx';
import LoginScreen from './components/LoginScreen.jsx'; // Thêm
import RegisterScreen from './components/RegisterScreen.jsx'; // Thêm
import { SocketClient } from './game/SocketClient.js'; // Thêm

// [SỬA] Định nghĩa các màn hình
const SCREENS = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    MAIN_MENU: 'MAIN_MENU',
    GAME: 'GAME',
};

// [SỬA] Địa chỉ server
const socketUrl = `ws://${window.location.hostname}:5174`;

function App() {
    const [screen, setScreen] = useState(SCREENS.LOGIN); // Bắt đầu ở màn hình Login
    const [auth, setAuth] = useState(null); // Lưu thông tin { token, username }
    const socketRef = useRef(null); // Dùng useRef để giữ SocketClient

    // Hàm kết nối socket
    const connectSocket = () => {
        if (socketRef.current) return; // Đã kết nối

        const socket = new SocketClient(socketUrl);
        socket.connect();
        socketRef.current = socket;

        // Lắng nghe tin nhắn từ server
        socket.addMessageListener(data => {
            if (data.type === 'loginSuccess') {
                setAuth({ token: data.token, username: data.username, highScore: data.highScore }); // Lưu thông tin đăng nhập
                setScreen(SCREENS.MAIN_MENU); // Chuyển tới Menu chính
                alert('Đăng nhập thành công!');
            }
            if (data.type === 'registerSuccess') {
                setScreen(SCREENS.LOGIN); // Quay lại Login
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
            }
            if (data.type === 'authError') {
                alert(`Lỗi: ${data.message}`);
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
    const handleRegister = (username, password) => {
        socketRef.current.send({ type: 'register', username, password });
    };
    const handleLogout = () => {
        setAuth(null);
        setScreen(SCREENS.LOGIN);
    };

    // Hàm này sẽ được MainMenu gọi khi nhấn "Chơi"
    const handlePlayGame = () => {
        // Gửi token đi để vào game
        socketRef.current.send({ type: 'play', token: auth.token });
        setScreen(SCREENS.GAME);
    };

    // Render component tương ứng
    const renderScreen = () => {
        switch (screen) {
            case SCREENS.LOGIN:
                return <LoginScreen onLogin={handleLogin} navigateTo={navigateTo} SCREENS={SCREENS} />;
            case SCREENS.REGISTER:
                return <RegisterScreen onRegister={handleRegister} navigateTo={navigateTo} SCREENS={SCREENS} />;

            // [SỬA] Truyền auth và các hàm mới vào MainMenu
            case SCREENS.MAIN_MENU:
                return (
                    <MainMenu
                        auth={auth} //
                        onPlay={handlePlayGame}
                        onLogout={handleLogout}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                    />
                );

            // [SỬA] Truyền socket đã kết nối vào GameView
            case SCREENS.GAME:
                return (
                    <GameView
                        socket={socketRef.current} //
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                    />
                );
            default:
                return <LoginScreen onLogin={handleLogin} navigateTo={navigateTo} SCREENS={SCREENS} />;
        }
    };

    return <div style={{ width: '100%', height: '100%' }}>{renderScreen()}</div>;
}

export default App;