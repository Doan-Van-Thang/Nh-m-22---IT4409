// File: client/src/components/MainMenu.jsx
import React, { useEffect, useState } from 'react'; // [SỬA] Import thêm useEffect và useState
import CreateRoomModal from './CreateRoomModal.jsx';
// === CÁC ICON (Sử dụng SVG placeholder, bạn có thể thay bằng thư viện icon) ===
const BellIcon = () => (
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
const SettingsIcon = () => (
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const CoinIcon = () => (
    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.99 6.66a.75.75 0 01.9-.51l1.6 1.06a.75.75 0 00.9-.51l1.06-1.6a.75.75 0 011.36.9l-1.06 1.6a.75.75 0 00.51.9l1.6 1.06a.75.75 0 01-.51.9l-1.6-1.06a.75.75 0 00-.9.51l-1.06 1.6a.75.75 0 01-1.36-.9l1.06-1.6a.75.75 0 00-.51-.9L7.5 7.56a.75.75 0 01-.51-.9z" />
    </svg>
);

// [THÊM MỚI] Icon Đăng xuất
const LogoutIcon = () => (
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


// ===== 1. COMPONENT GÓC TRÊN BÊN PHẢI (ĐÃ CẬP NHẬT) =====
// [SỬA] Nhận props `auth` và `onLogout`
const UserProfile = ({ auth, onLogout }) => {
    return (
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md animate-fade-in-down">
            {/* [ENHANCED] Avatar with glow effect */}
            <div className="relative">
                <img
                    src={auth?.avatarUrl || '/avatar.png'}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full bg-gray-300 ring-2 ring-blue-400 shadow-lg hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
                {/* [ENHANCED] Username with gradient */}
                <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{auth?.name || 'Guest'}</div>
                <div className="flex items-center text-sm">
                    {/* [ENHANCED] Points with styling */}
                    <span className="font-semibold text-yellow-600">{auth?.highScore || 0}</span>
                    <span className="ml-1"><CoinIcon /></span>
                </div>
            </div>
            <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-110">
                <BellIcon />
            </button>
            <button className="text-gray-500 hover:text-purple-600 p-2 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-110">
                <SettingsIcon />
            </button>
            {/* [ENHANCED] Logout button */}
            <button
                onClick={onLogout}
                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
                title="Đăng xuất"
            >
                <LogoutIcon />
            </button>
        </div>
    );
};

// ===== 2. COMPONENT SIDEBAR (LEADERBOARD) (CẬP NHẬT) =====
// [SỬA] Nhận prop 'leaderboard'
const Leaderboard = ({ leaderboard }) => {

    // [SỬA] Sử dụng dữ liệu thật từ prop, bỏ mock data
    const users = leaderboard || []; // Nếu leaderboard chưa có thì dùng mảng rỗng

    return (
        <div className="w-full h-full bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Bảng xếp hạng</h2>

            {/* [SỬA] Thêm kiểm tra trạng thái loading/rỗng */}
            {users.length === 0 ? (
                <div className="text-gray-500 text-center">Đang tải...</div>
            ) : (
                <ul className="space-y-3">
                    {/* [SỬA] Map qua dữ liệu thật từ server */}
                    {users.map((user, index) => (
                        <li key={user._id || index} className="flex items-baseline justify-between p-2 rounded-lg hover:bg-gray-50">                            <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg">{index + 1}.</span>

                            {/* [SỬA ĐỔI] Dùng user.avatarUrl, nếu không có thì dùng /avatar.png */}
                            <img
                                src={user.avatarUrl || '/avatar.png'}
                                alt={user.name}
                                className="w-8 h-8 rounded-full bg-gray-300" // Thêm bg-gray-300
                            />
                            <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                {/* Bỏ 'ml-2' vì đã xuống dòng */}
                                <span className="text-sm text-gray-500">{user.province || '...'}</span>
                            </div>
                        </div>
                            {/* Hiển thị điểm số thật */}
                            <span className="font-semibold text-blue-600 text-lg">{user.highScore}</span>
                        </li>
                    ))}
                </ul>
            )}

            <button className="w-full mt-4 text-blue-500 hover:underline">
                Nhìn thấy tất cả
            </button>
            <div className="mt-6 text-center text-gray-500">
                Bảng xếp hạng hàng ngày, kết thúc vào
                <div className="text-3xl font-bold text-black mt-2">00 : 25 : 29</div>
            </div>
        </div>
    );
};

// ===== 3. COMPONENT NỘI DUNG CHÍNH (DANH SÁCH PHÒNG) (ĐÃ CẬP NHẬT) =====
// [SỬA] Nhận prop `onPlay`
const RoomList = ({ onCreateRoom, onJoinRoom, roomList, auth, onOpenCreateModal }) => {
    const getGameModeLabel = (mode) => {
        const modes = {
            '1V1': '1 vs 1',
            '2V2': '2 vs 2',
            'DEATHMATCH': 'Sinh tử chiến',
            'TEAM_DEATHMATCH': 'Đội sinh tử'
        };
        return modes[mode] || mode;
    };

    return (
        <div className="p-6">
            <div className="flex items-center mb-6 animate-fade-in-down">
                <span className="text-4xl mr-3">🎯</span>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sảnh Chờ</h1>
            </div>

            {/* === [ENHANCED] CREATE ROOM BUTTON === */}
            <button
                onClick={onOpenCreateModal}
                className="w-full py-5 mb-8 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-2xl transition-all text-xl transform hover:scale-105 active:scale-95 animate-gradient hover-glow"
            >
                <span className="text-2xl mr-2">✨</span>
                Tạo phòng mới
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomList.length === 0 && (
                    <div className="col-span-3 text-center py-12">
                        <span className="text-6xl mb-4 block">🎮</span>
                        <p className="text-gray-500 text-lg">Chưa có phòng nào. Hãy tạo phòng đầu tiên!</p>
                    </div>
                )}
                {roomList.map((room, index) => (
                    <div
                        key={room.id}
                        className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-blue-300 hover-lift animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex-1 line-clamp-2">{room.name}</h3>
                            {room.bettingPoints > 0 && (
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg animate-pulse-glow">
                                    <CoinIcon />
                                    {room.bettingPoints}
                                </span>
                            )}
                        </div>
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center bg-blue-50 p-2 rounded-lg">
                                <span className="text-blue-600 mr-2">🎮</span>
                                <span className="text-sm font-semibold text-blue-800">{getGameModeLabel(room.gameMode)}</span>
                            </div>
                            <div className="flex items-center bg-purple-50 p-2 rounded-lg">
                                <span className="text-purple-600 mr-2">👥</span>
                                <span className="text-sm font-semibold text-purple-800">{room.playerCount}/{room.maxPlayers} người chơi</span>
                            </div>
                            {room.status && (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-md ${room.status === 'waiting'
                                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white animate-pulse'
                                        : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                                    }`}>
                                    {room.status === 'waiting' ? '⏳ Đang chờ' : '🎯 Đang chơi'}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onJoinRoom(room.id)}
                            disabled={room.status === 'in-game' || room.playerCount >= room.maxPlayers}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                            {room.status === 'in-game' ? '🔒 Đang chơi' : room.playerCount >= room.maxPlayers ? '🚫 Đã đầy' : '🚀 Vào phòng'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function MainMenu({ auth, onCreateRoom, onJoinRoom, roomList, onLogout, socket, leaderboard }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // [MỚI] Thêm useEffect để gửi yêu cầu lấy leaderboard khi component được hiển thị
    useEffect(() => {
        // Hàm để gửi yêu cầu
        const requestData = () => {
            if (socket) {
                console.log("Client: Gửi yêu cầu getLeaderboard và getRoomList");
                socket.send({ type: 'getLeaderboard' });
                socket.send({ type: 'getRoomList' }); // Lấy danh sách phòng
            }
        };

        // Kiểm tra xem socket đã sẵn sàng chưa
        if (socket && socket.socket && socket.socket.readyState === WebSocket.OPEN) {
            requestData();
        } else if (socket) {
            // Nếu socket chưa mở (ví dụ: F5 trang), đợi sự kiện onOpen
            socket.onOpen(requestData);
        }

        // Không cần cleanup, vì socket được quản lý bởi App.jsx
    }, [socket]); // Chỉ chạy khi 'socket' prop thay đổi (thường là 1 lần)

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateRoom={onCreateRoom}
                userPoints={auth?.highScore || 0}
            />

            {/* === CỘT 1: SIDEBAR === */}
            <aside className="w-1/4 h-screen p-4 overflow-y-auto relative z-10">
                {/* [SỬA] Truyền 'leaderboard' xuống component con */}
                <Leaderboard leaderboard={leaderboard} />
            </aside>

            {/* === CỘT 2: NỘI DUNG CHÍNH === */}
            <main className="flex-1 h-screen flex flex-col relative z-10">
                <header className="flex justify-end w-full">
                    <UserProfile auth={auth} onLogout={onLogout} />
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    <RoomList
                        onCreateRoom={onCreateRoom}
                        onJoinRoom={onJoinRoom}
                        roomList={roomList}
                        auth={auth}
                        onOpenCreateModal={() => setIsCreateModalOpen(true)}
                    />
                </div>
            </main>
        </div>
    );
}