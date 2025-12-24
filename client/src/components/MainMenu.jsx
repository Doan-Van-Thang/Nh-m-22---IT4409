// File: client/src/components/MainMenu.jsx
import React, { useEffect, useState } from 'react'; 
import CreateRoomModal from './CreateRoomModal.jsx';
import { getGameModeInfo } from '../config/gameModes';
import ChatBox from './ChatBox';
// === CÁC ICON  ===
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

// Icon Đăng xuất
const LogoutIcon = () => (
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


// ===== 1. COMPONENT GÓC TRÊN BÊN PHẢI =====
//  Nhận props `auth` và `onLogout`
const UserProfile = ({ auth, onLogout }) => {
    return (
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md animate-fade-in-down">
            {/*Avatar with glow effect */}
            <div className="relative">
                <img
                    src={auth?.avatarUrl || '/avatar.png'}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full bg-gray-300 ring-2 ring-blue-400 shadow-lg hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
                {/*Username with gradient */}
                <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{auth?.name || 'Guest'}</div>
                <div className="flex items-center text-sm">
                    {/* Points with styling */}
                    <span className="font-semibold text-yellow-600">{auth?.highScore || 0}</span>
                    <span className="ml-1"><CoinIcon /></span>
                </div>
            </div>
            {/* Logout button */}
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

// ===== 2. COMPONENT SIDEBAR (LEADERBOARD) =====
const Leaderboard = ({ leaderboard }) => {
    const users = leaderboard || [];

    return (
        <div className="w-full h-full bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-lg border border-white/50 flex flex-col">

            {/* Header cố định */}
            <div className="flex-shrink-0 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    🏆 Bảng Xếp Hạng
                </h2>
            </div>

            {/* Danh sách cuộn (flex-1 overflow-y-auto) */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 italic">
                        <span>Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {users.map((user, index) => (
                            <li key={user._id || index} className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group">
                                <div className="flex items-center space-x-3">
                                    {/* Top 3 Styling */}
                                    <div className={`
                                        flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' :
                                            index === 1 ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-400' :
                                                index === 2 ? 'bg-orange-100 text-orange-800 ring-2 ring-orange-400' :
                                                    'bg-white text-gray-500 border border-gray-200'}
                                    `}>
                                        {index + 1}
                                    </div>

                                    <img
                                        src={user.avatarUrl || '/avatar.png'}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 object-cover"
                                    />

                                    <div className="flex flex-col min-w-0">
                                        {/* Truncate tên nếu quá dài */}
                                        <span className="font-bold text-gray-800 truncate max-w-[120px]">{user.name}</span>
                                        <span className="text-xs text-gray-500 truncate">{user.province || 'Ẩn danh'}</span>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-blue-600 text-sm md:text-base group-hover:scale-110 transition-transform">
                                    {user.highScore.toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

// ===== 3. COMPONENT NỘI DUNG CHÍNH (DANH SÁCH PHÒNG)  =====
//  Nhận prop `onPlay`
const RoomList = ({ onCreateRoom, onJoinRoom, roomList, auth, onOpenCreateModal }) => {
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
                                <span className="text-blue-600 mr-2">{getGameModeInfo(room.gameMode).icon}</span>
                                <span className="text-sm font-semibold text-blue-800">{getGameModeInfo(room.gameMode).name}</span>
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
    // State để bật tắt BXH trên mobile
    const [showMobileLeaderboard, setShowMobileLeaderboard] = useState(false);

    useEffect(() => {
        const requestData = () => {
            if (socket) {
                console.log("Client: Gửi yêu cầu getLeaderboard và getRoomList");
                socket.send({ type: 'getLeaderboard' });
                socket.send({ type: 'getRoomList' });
            }
        };

        if (socket && socket.socket && socket.socket.readyState === WebSocket.OPEN) {
            requestData();
        } else if (socket) {
            socket.onOpen(requestData);
        }
    }, [socket]);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateRoom={onCreateRoom}
                userPoints={auth?.highScore || 0}
            />

            {/* CỘT 1: SIDEBAR (LEADERBOARD) */}
            <aside className={`
                md:w-96 flex-shrink-0 p-4 z-20 transition-all duration-300 ease-in-out
                ${showMobileLeaderboard ? 'h-[60%] block border-b-2 border-gray-200' : 'hidden'} 
                md:block md:h-screen md:border-r md:border-white/50
            `}>
                <Leaderboard leaderboard={leaderboard} />
            </aside>

            {/*CỘT 2: NỘI DUNG CHÍNH (ROOM LIST) */}
            <main className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
                <header className="flex justify-between items-center p-4 w-full bg-white/50 backdrop-blur-md md:bg-transparent">
                    <button
                        onClick={() => setShowMobileLeaderboard(!showMobileLeaderboard)}
                        className="md:hidden px-4 py-2 bg-white rounded-xl shadow-md text-blue-600 font-bold border border-blue-100 active:scale-95 transition-transform"
                    >
                        {showMobileLeaderboard ? '✕ Đóng BXH' : '🏆 Xem BXH'}
                    </button>

                    <div className="ml-auto">
                        <UserProfile auth={auth} onLogout={onLogout} />
                    </div>
                </header>

                <div className="flex-1 p-0 overflow-y-auto custom-scrollbar scroll-smooth">
                    <RoomList
                        onCreateRoom={onCreateRoom}
                        onJoinRoom={onJoinRoom}
                        roomList={roomList}
                        auth={auth}
                        onOpenCreateModal={() => setIsCreateModalOpen(true)}
                    />
                </div>
                <div className="p-4 pt-0">
                    <ChatBox scope="GLOBAL" className="h-64 shadow-2xl" />
                </div>
            </main>
        </div>
    );
}