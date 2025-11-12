// File: client/src/components/MainMenu.jsx
import React from 'react';
// Import các component mới
import Leaderboard from './Leaderboard.jsx';
import RoomList from './RoomList.jsx';

// [SỬA] Nhận { auth, onPlay, onLogout }
function MainMenu({ auth, onPlay, onLogout }) {

    // Lấy điểm số từ auth (mặc định là 0 nếu chưa có)
    const score = (auth && auth.highScore) ? auth.highScore : 0;

    return (
        <div className="menu-container">
            <h1>Game Tank 2D</h1>

            {/* THÔNG TIN NGƯỜI DÙNG */}
            {auth && (
                <div className="user-info-box">
                    <div className="user-avatar-placeholder">
                        {/* Đây là nơi cho "ảnh user" */}
                    </div>
                    <div className="user-details">
                        <h3>{auth.username}</h3>
                        <p>Điểm: {score}</p>
                    </div>
                    <button
                        className="menu-button"
                        style={{ backgroundColor: '#dc3545', marginLeft: 'auto' }}
                        onClick={onLogout} // Nút Đăng xuất
                    >
                        Đăng xuất
                    </button>
                </div>
            )}

            {/* LAYOUT 2 CỘT MỚI */}
            <div className="main-menu-layout">
                {/* CỘT TRÁI */}
                <div className="left-column">
                    <Leaderboard />
                </div>

                {/* CỘT PHẢI */}
                <div className="right-column">
                    <RoomList onPlay={onPlay} />
                </div>
            </div>
        </div>
    );
}
export default MainMenu;