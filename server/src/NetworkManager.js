import { WebSocketServer } from 'ws';

export default class NetworkManager {
    constructor(server, gameEngine) {
        this.wss = new WebSocketServer({ server });
        this.gameEngine = gameEngine;
    }

    start() {
        this.wss.on('connection', ws => this.handleConnection(ws));

        console.log("[NetworkManager] Đã khởi động.");
    }

    handleConnection(ws) {
        // [SỬA] Gọi PlayerManager
        const player = this.gameEngine.playerManager.addPlayer();
        const playerId = player.id;
        console.log(`[NetworkManager] Người chơi ${playerId} đã kết nối.`);

        // Gửi thông tin ban đầu (Giữ nguyên)
        ws.send(JSON.stringify({
            type: 'playerId',
            playerId: playerId,
            startX: player.x,
            startY: player.y
        }));
        ws.send(JSON.stringify({
            type: 'mapData',
            ...this.gameEngine.getMapData()
        }));

        ws.on('message', msg => this.handleMessage(ws, playerId, msg));
        ws.on('close', () => this.handleDisconnect(playerId));
    }

    handleDisconnect(playerId) {
        console.log(`[NetworkManager] Người chơi ${playerId} đã ngắt kết nối.`);
        // [SỬA] Gọi PlayerManager
        this.gameEngine.playerManager.removePlayer(playerId);
    }

    handleMessage(ws, playerId, msg) {
        let data;
        try { data = JSON.parse(msg); }
        catch (err) {
            console.warn('[NetworkManager] Invalid JSON:', msg);
            return;
        }

        // [SỬA] Chuyển tiếp lệnh cho các manager tương ứng
        const playerManager = this.gameEngine.playerManager;

        switch (data.type) {
            case 'update':
                playerManager.handleInput(playerId, data);
                break;
            case 'fire':
                playerManager.handleFire(playerId);
                break;
            case 'activatePlayer':
                playerManager.handleActivate(playerId);
                break;
        }
    }

    broadcastState() {
        // Lấy trạng thái (Giữ nguyên)
        const state = this.gameEngine.getGameState();
        const payload = JSON.stringify({
            type: 'update',
            ...state
        });

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }
}