// File: client/src/components/GameView.jsx
import React, { useRef, useEffect } from 'react';
import { Game } from '../game/Game.js';


//  Nhận `socket` từ App.jsx
function GameView({ socket, navigateTo, SCREENS, initialMapData, initialPlayerSetup }) {
    const canvasRef = useRef(null);
    const gameInstanceRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !socket) return; // [SỬA] Chờ cả socket

        const ctx = canvas.getContext('2d');
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        console.log("GameView: Khởi tạo Game...");
        // [SỬA] Truyền socket đã có vào Game
        gameInstanceRef.current = new Game(canvas, ctx, navigateTo, SCREENS, socket, initialMapData, initialPlayerSetup);
        // [SỬA] Game.js bây giờ sẽ tự start
        gameInstanceRef.current.start();
        console.log("GameView: Game đã bắt đầu.");

        return () => {
            console.log("GameView: Hủy component, dừng game...");
            window.removeEventListener('resize', handleResize);
            if (gameInstanceRef.current) {
                gameInstanceRef.current.stop();
            }
        };
    }, [socket, navigateTo, SCREENS, initialMapData, initialPlayerSetup]); // [SỬA] Thêm socket vào dependency

    return (
        <div>

            <canvas id="gameCanvas" ref={canvasRef} />
        </div>
    );
}

export default GameView;