// File: client/src/components/MainMenu.jsx
import React from 'react';

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
        <div className="flex items-center space-x-4 p-4">
            {/* Thay /avatar.png bằng đường dẫn thực tế */}
            <img src="/avatar.png" alt="Avatar" className="w-10 h-10 rounded-full" />
            <div>
                {/* [SỬA] Hiển thị tên người dùng từ auth */}
                <div className="font-semibold text-lg">{auth?.username || 'Guest'}</div>
                <div className="flex items-center text-sm text-gray-600">
                    {/* [SỬA] Hiển thị điểm số từ auth */}
                    {auth?.highScore || 0}
                    <span className="ml-1"><CoinIcon /></span>
                </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <BellIcon />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <SettingsIcon />
            </button>
            {/* [THÊM MỚI] Nút Đăng xuất */}
            <button
                onClick={onLogout}
                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"
                title="Đăng xuất"
            >
                <LogoutIcon />
            </button>
        </div>
    );
};

// ===== 2. COMPONENT SIDEBAR BÊN TRÁI (BẢNG XẾP HẠNG) =====
const Leaderboard = () => {
    // Mock data (dữ liệu giả) dựa trên hình ảnh
    const users = [
        { name: 'L A M Y', flag: '🇩🇪', score: 9423, rank: 1, avatar: '/avatar1.png' },
        { name: 'Guest Ebonee', flag: '🇨🇦', score: 6298, rank: 2, avatar: '/avatar2.png' },
        { name: '-BLUEWINGS-', flag: '🇺🇸', score: 5090, rank: 3, avatar: '/avatar3.png' },
        { name: 'Will', flag: '🇬🇧', score: 4548, rank: 4, avatar: '/avatar4.png' },
        { name: 'so.dak.sly-fb ...', flag: '🇺🇸', score: 4529, rank: 5, avatar: '/avatar5.png' },
        { name: 'Andy', flag: '🇬🇧', score: 3472, rank: 6, avatar: '/avatar6.png' },
    ];

    return (
        <div className="w-full h-full bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Bảng xếp hạng</h2>
            <ul className="space-y-3">
                {users.map((user) => (
                    <li key={user.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg">{user.rank}.</span>
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-300" />
                            <div>
                                <span className="font-medium">{user.name}</span>
                                <span className="ml-2">{user.flag}</span>
                            </div>
                        </div>
                        <span className="font-semibold text-blue-600 text-lg">{user.score}</span>
                    </li>
                ))}
            </ul>
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
const RoomList = ({ onPlay }) => {
    // Mock data cho các phòng
    const rooms = [
        { id: 1, name: 'Phòng 1: Giao lưu bạn bè', players: 5, maxPlayers: 10, status: 'Đang chờ' },
        { id: 2, name: 'Phòng 2: Cao thủ hội tụ', players: 8, maxPlayers: 10, status: 'Đang chơi' },
        { id: 3, name: 'Phòng 3: Tám chuyện vui vẻ', players: 2, maxPlayers: 6, status: 'Đang chờ' },
        { id: 4, name: 'Phòng 4: Đấu rank căng thẳng', players: 9, maxPlayers: 10, status: 'Đang chờ' },
        { id: 5, name: 'Phòng 5: Chỉ dành cho VIP', players: 1, maxPlayers: 4, status: 'Đang chờ' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Chọn phòng (Lobby)</h1>

            {/* === [THÊM MỚI] NÚT CHƠI NGAY === */}
            <button
                onClick={onPlay}
                className="w-full py-4 mb-8 bg-green-500 text-white rounded-lg text-xl font-bold hover:bg-green-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-green-700"
            >
                Chơi ngay!
            </button>
            {/* === KẾT THÚC NÚT MỚI === */}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-blue-500"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${room.status === 'Đang chờ' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {room.status}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Số người chơi: {room.players}/{room.maxPlayers}
                        </p>
                        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                            Vào phòng
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ===== COMPONENT TỔNG HỢP (TRANG CHÍNH) (ĐÃ CẬP NHẬT) =====
// [SỬA] Nhận props từ App.jsx
export default function MainMenu({ auth, onPlay, onLogout }) {
    return (
        <div className="flex h-screen bg-gray-100">

            {/* === CỘT 1: SIDEBAR (BẢNG XẾP HẠNG) === */}
            <aside className="w-1/4 h-screen p-4 overflow-y-auto">
                <Leaderboard />
            </aside>

            {/* === CỘT 2: NỘI DUNG CHÍNH === */}
            <main className="flex-1 h-screen flex flex-col">

                {/* 2a. Header chứa UserProfile (căn phải) */}
                <header className="flex justify-end w-full">
                    {/* [SỬA] Truyền props auth, onLogout xuống */}
                    <UserProfile auth={auth} onLogout={onLogout} />
                </header>

                {/* 2b. Danh sách phòng (chiếm phần còn lại) */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {/* [SỬA] Truyền prop onPlay xuống */}
                    <RoomList onPlay={onPlay} />
                </div>

            </main>
        </div>
    );
}