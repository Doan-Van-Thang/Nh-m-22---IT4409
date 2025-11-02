// server/index.js

import http from 'http';
import GameEngine from './src/GameEngine.js';
import NetworkManager from './src/NetworkManager.js';

const PORT = 8080;

// 1. Tạo HTTP server (như cũ)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Game Server is running.\n');
});

try {
    // 2. Khởi tạo Engine
    const gameEngine = new GameEngine();

    // 3. Khởi tạo Network, truyền engine vào
    const networkManager = new NetworkManager(server, gameEngine);

    // 4. Khởi động cả hai
    gameEngine.start();
    networkManager.start();

    // 5. Khởi động server (như cũ)
    server.listen(PORT, () => {
        console.log(`[Server] Đã khởi động tại http://localhost:${PORT}`);
    });

} catch (error) {
    console.error("[Server] Không thể khởi động:", error);
}