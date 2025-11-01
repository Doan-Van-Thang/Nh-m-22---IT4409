import React, { useRef, useEffect } from 'react';
// Import LỚP Game (logic) từ thư mục game
import { Game } from '../game/Game.js';
import { User } from '../game/model/User.js'; // Import User

// Đây là component "Cầu nối"
function GameView({ navigateTo, SCREENS }) {

    // Dùng useRef để lấy thẻ <canvas>
    const canvasRef = useRef(null);
    // Dùng useRef để lưu trữ thực thể (instance) của game
    // để có thể stop() nó khi component bị hủy
    const gameInstanceRef = useRef(null);

    // Dùng useEffect để khởi động game (chỉ chạy 1 lần)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Thoát nếu canvas chưa sẵn sàng

        const ctx = canvas.getContext('2d');

        // --- Thiết lập kích thước Canvas ---
        // (Lấy từ file client.js cũ của bạn)
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // TODO: Bạn cần xử lý resize tốt hơn
        // const resizeObserver = new ResizeObserver(...)
        // ...

        // --- Khởi động Game ---
        // 1. Tạo thực thể game
        console.log("GameView: Khởi tạo Game...");
        gameInstanceRef.current = new Game(canvas, ctx);

        // 2. Tạo một user giả để test (lấy từ client.js cũ)
        const localPlayer = new User();
        localPlayer.id = "local";
        localPlayer.name = "Player 1";
        gameInstanceRef.current.addUser(localPlayer); // Thêm user

        // 3. Bắt đầu game
        gameInstanceRef.current.start();
        console.log("GameView: Game đã bắt đầu.");

        // 4. Hàm "Dọn dẹp" (Cleanup)
        // Sẽ tự động chạy khi component này bị hủy (ví dụ: quay về Menu)
        return () => {
            console.log("GameView: Hủy component, dừng game...");
            if (gameInstanceRef.current) {
                gameInstanceRef.current.stop();
            }
        };
    }, []); // Mảng dependency rỗng `[]` = chỉ chạy 1 lần khi component mount

    return (
        <div>
            {/* Nút quay về Menu */}
            <button
                onClick={() => navigateTo(SCREENS.MAIN_MENU)}
                style={{
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
                }}
            >
                Quay về Menu
            </button>

            {/* Thẻ canvas nơi game được vẽ */}
            <canvas id="gameCanvas" ref={canvasRef} />
        </div>
    );
}

export default GameView;
