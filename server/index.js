// server/index.js

import http from 'http';
import mongoose from 'mongoose'; // Thêm
import dotenv from 'dotenv'; // Thêm
import GameEngine from './src/GameEngine.js';
import NetworkManager from './src/NetworkManager.js';
import AuthManager from './src/managers/AuthManager.js'; // Thêm
import RoomManager from './src/managers/RoomManager.js'; // THÊM MỚI
import GameManager from './src/managers/GameManager.js';
dotenv.config();

const PORT = process.env.PORT || 5174; // Sử dụng biến môi trường

// --- THÊM PHẦN KẾT NỐI DB ---
console.log("[Server] Đang kết nối tới MongoDB...");
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("[Server] Đã kết nối MongoDB.");
        // Khởi động server CHỈ KHI đã kết nối DB
        startServer();
    })
    .catch(error => {
        console.error("[Server] Lỗi kết nối MongoDB:", error.message);
    });

// 1. Tạo HTTP server (như cũ)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Game Server is running.\n');
});

function startServer() {
    try {
        // 1. Khởi tạo các Manager
        const authManager = new AuthManager();

        // Tạo một NetworkManager "trống"
        const networkManager = new NetworkManager(server, authManager);

        // 2. Khởi tạo các Manager mới
        const gameManager = new GameManager(networkManager);
        const roomManager = new RoomManager(gameManager);

        // 3. Gán các manager vào NetworkManager để nó truy cập được
        networkManager.setManagers(roomManager, gameManager);

        // 4. Bắt đầu NetworkManager (Nó sẽ chờ kết nối)
        networkManager.start();

        // 5. KHÔNG khởi động GameEngine ở đây nữa
        // gameEngine.start(); // XÓA DÒNG NÀY

        server.listen(PORT, () => {
            console.log(`[Server] Đã khởi động tại http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("[Server] Không thể khởi động:", error);
    }
}