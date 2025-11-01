const game = new Game();

// 2. Khởi tạo Server Mạng
const server = http.createServer();
const wss = new WebSocket.Server({ server });