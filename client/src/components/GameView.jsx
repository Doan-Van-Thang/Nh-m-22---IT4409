// File: client/src/components/GameView.jsx
import React, { useRef, useEffect } from 'react';
import { Game } from '../game/Game.js';
// (Bỏ: import { User } ... vì không dùng)

// [SỬA] Nhận `socket` từ App.jsx
function GameView({ socket, navigateTo, SCREENS }) {
    const canvasRef = useRef(null);
    const gameInstanceRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !socket) return; // [SỬA] Chờ cả socket

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        console.log("GameView: Khởi tạo Game...");
        // [SỬA] Truyền socket đã có vào Game
        gameInstanceRef.current = new Game(canvas, ctx, navigateTo, SCREENS, socket);

        // [SỬA] Game.js bây giờ sẽ tự start
        gameInstanceRef.current.start();
        console.log("GameView: Game đã bắt đầu.");

        return () => {
            console.log("GameView: Hủy component, dừng game...");
            if (gameInstanceRef.current) {
                gameInstanceRef.current.stop();
            }
        };
    }, [socket, navigateTo, SCREENS]); // [SỬA] Thêm socket vào dependency

    return (
        <div>
            <button onClick={() => navigateTo(SCREENS.MAIN_MENU)} style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 10,
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: '1px solid white',
                borderRadius: '5px',
                cursor: 'pointer'
            }}>
                Quay về Menu
            </button>
            <canvas id="gameCanvas" ref={canvasRef} />
        </div>
    );
}

export default GameView;