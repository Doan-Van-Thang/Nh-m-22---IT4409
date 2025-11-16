import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import Account from './model/account.js';
import dotenv from 'dotenv';

export default class NetworkManager {
    constructor(server, gameEngine, authManager) {
        this.wss = new WebSocketServer({ server });
        this.gameEngine = gameEngine;
        this.authManager = authManager; // Lưu lại
        this.clients = new Map(); // Quản lý client và trạng thái auth
    }

    start() {
        this.wss.on('connection', ws => this.handleConnection(ws));

        console.log("[NetworkManager] Đã khởi động.");
    }

    handleConnection(ws) {
        // Tạm thời chưa làm gì, đợi client gửi tin nhắn login/register
        console.log("[NetworkManager] Client mới kết nối, đang chờ xác thực...");

        ws.on('message', msg => this.handleMessage(ws, msg));
        ws.on('close', () => this.handleDisconnect(ws));
    }

    handleDisconnect(ws) {
        const playerId = this.clients.get(ws);
        if (playerId) {
            console.log(`[NetworkManager] Người chơi ${playerId} đã ngắt kết nối.`);
            this.gameEngine.playerManager.removePlayer(playerId);
            this.clients.delete(ws);
        } else {
            console.log("[NetworkManager] Client chưa xác thực đã ngắt kết nối.");
        }
    }

    async handleMessage(ws, msg) {
        let data;
        try { data = JSON.parse(msg); }
        catch (err) {
            console.warn('[NetworkManager] Invalid JSON:', msg);
            return;
        }

        // [SỬA] Chuyển tiếp lệnh cho các manager tương ứng
        const playerId = this.clients.get(ws);
        if (playerId) {
            const playerManager = this.gameEngine.playerManager;
            switch (data.type) {
                case 'update':
                    playerManager.handleInput(playerId, data);
                    break;
                case 'fire':
                    playerManager.handleFire(playerId);
                    break;
                // (activatePlayer không cần nữa vì ta làm ở 'play')
            }
            return;
        }

        // Client chưa đăng nhập
        try {
            switch (data.type) {
                case 'register':
                    await this.authManager.register(data.username, data.password, data.name, data.province, data.avatarUrl);
                    ws.send(JSON.stringify({ type: 'registerSuccess' }));
                    break;

                case 'login':
                    const loginData = await this.authManager.login(data.username, data.password);
                    // Đăng nhập thành công, gửi token về client
                    ws.send(JSON.stringify({ type: 'loginSuccess', ...loginData }));
                    // *Quan trọng*: Chưa thêm vào game vội, chỉ xác thực.
                    break;
                case 'checkAuth':
                    try {
                        const decodedToken = jwt.verify(data.token, process.env.JWT_SECRET);
                        const account = await Account.findById(decodedToken.id);
                        if (!account) {
                            throw new Error('Tài khoản không còn tồn tại');
                        }
                        ws.send(JSON.stringify({
                            type: 'authSuccess',
                            token: data.token,
                            username: account.username,
                            id: account._id,
                            highScore: account.highScore
                        }));
                    } catch (error) {
                        throw new Error('Token không hợp lệ hoặc đã hết hạn')
                    }
                    break;

                case 'getLeaderboard':
                    try {
                        // Truy vấn 10 người chơi có điểm cao nhất
                        const leaderboard = await Account.find({})
                            .sort({ highScore: -1 }) // Sắp xếp giảm dần
                            .limit(10)               // Giới hạn 10 người
                            .select('name province highScore'); // Chỉ lấy các trường cần thiết

                        // Gửi dữ liệu về cho client đã yêu cầu
                        ws.send(JSON.stringify({
                            type: 'leaderboardData',
                            payload: leaderboard
                        }));
                    } catch (error) {
                        console.error("[NetworkManager] Lỗi khi lấy leaderboard:", error);
                        // Không cần gửi lỗi về client, chỉ log ra
                    }
                    break;
                case 'play': // Client gửi tin này KHI nhấn nút "Chơi"
                    // (Giả sử client đã đính kèm token vào tin nhắn 'play')
                    // TODO: Xác thực token (jwt.verify(data.token, ...))

                    // Nếu token hợp lệ:
                    const player = this.gameEngine.playerManager.addPlayer();
                    const newPlayerId = player.id;
                    this.gameEngine.playerManager.handleActivate(newPlayerId);
                    this.clients.set(ws, newPlayerId); // Liên kết ws với playerId
                    console.log(`[NetworkManager] Người chơi ${newPlayerId} (Đội ${player.teamId}) đã vào game.`);

                    // Gửi thông tin ban đầu (như code cũ của bạn)
                    ws.send(JSON.stringify({
                        type: 'initialSetup',
                        playerId: newPlayerId,
                        teamId: player.teamId,
                        startX: player.x,
                        startY: player.y
                    }));
                    ws.send(JSON.stringify({
                        type: 'mapData',
                        ...this.gameEngine.getMapData()
                    }));
                    break;
            }
        } catch (error) {
            // Gửi lỗi về client
            ws.send(JSON.stringify({ type: 'authError', message: error.message }));
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
    broadcastEndGame(winningTeamId) {
        const payload = JSON.stringify({
            type: 'gameOver',
            winningTeamId: winningTeamId
        });

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });

    }
    reset() {
        this.clients.clear();
        console.log("[NetworkManager] Đã reset trạng thái clients");
    }
}