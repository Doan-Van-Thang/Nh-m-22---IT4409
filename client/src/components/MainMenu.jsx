import React from 'react';

// Đây là component UI cho Menu chính
function MainMenu({ navigateTo, SCREENS }) {
    return (
        <div className="menu-container">
            <h1>Game Tank 2D</h1>
            <button
                className="menu-button"
                onClick={() => navigateTo(SCREENS.GAME)}
            >
                Chơi ngay (Test)
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
        </div>
    );
}

export default MainMenu;
