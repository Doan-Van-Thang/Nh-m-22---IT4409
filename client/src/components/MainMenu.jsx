// File: client/src/components/MainMenu.jsx
import React from 'react';

// [SỬA] Nhận { auth, onPlay, onLogout }
function MainMenu({ auth, onPlay, onLogout, navigateTo, SCREENS }) {
    return (
        <div className="menu-container">
            {/* Hiển thị tên người dùng đã đăng nhập */}
            {auth && <h2>Chào, {auth.username}!</h2>}

            <h1>Game Tank 2D</h1>

            <button
                className="menu-button"
                onClick={onPlay} // [SỬA] Gọi hàm onPlay từ App
            >
                Chơi ngay
            </button>
            <button
                className="menu-button"
                onClick={() => alert('Chức năng đang phát triển!')}
            >
                Tạo phòng (Lobby)
            </button>
            <button
                className="menu-button"
                onClick={() => alert('Chức năng đang phát triển!')}
            >
                Bảng xếp hạng
            </button>

            <button
                className="menu-button"
                style={{ backgroundColor: '#dc3545' }}
                onClick={onLogout} // [THÊM] Nút Đăng xuất
            >
                Đăng xuất
            </button>
        </div>
    );
}
export default MainMenu;