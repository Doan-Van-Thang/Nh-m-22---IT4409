// server/index.js

import http from 'http';
import mongoose from 'mongoose'; // Thêm
import dotenv from 'dotenv'; // Thêm
import GameEngine from './src/GameEngine.js';
import NetworkManager from './src/NetworkManager.js';
import AuthManager from './src/managers/AuthManager.js'; // Thêm
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

function startServer() { // Bọc logic khởi động server vào hàm
    try {
        const gameEngine = new GameEngine();
        // Khởi tạo AuthManager
        const authManager = new AuthManager();

        // [SỬA] Truyền authManager vào NetworkManager
        const networkManager = new NetworkManager(server, gameEngine, authManager);

        gameEngine.setNetworkManager(networkManager);
        gameEngine.start();
        networkManager.start();

        server.listen(PORT, () => {
            console.log(`[Server] Đã khởi động tại http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("[Server] Không thể khởi động:", error);
    }
}