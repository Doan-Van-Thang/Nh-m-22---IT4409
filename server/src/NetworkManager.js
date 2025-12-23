import { WebSocketServer, WebSocket } from 'ws';
import AuthHandler from './handlers/AuthHandler.js';
import RoomHandler from './handlers/RoomHandler.js';
import ChatHandler from './handlers/ChatHandler.js'; 
import { MESSAGE_TYPES } from './config/messageTypes.js';

export default class NetworkManager {
    constructor(server, authManager) {
        this.wss = new WebSocketServer({ server });
        this.authManager = authManager;
        this.clients = new Map(); // <ws, { id, name, ... }>

        this.roomManager = null;
        this.gameManager = null;
        
        // Handlers sẽ được khởi tạo trong setManagers
        this.authHandler = null;
        this.roomHandler = null;
        this.chatHandler = null;
    }

    setManagers(roomManager, gameManager) {
        this.roomManager = roomManager;
        this.gameManager = gameManager;

        // Khởi tạo các Handler
        this.authHandler = new AuthHandler(this.authManager, this);
        this.roomHandler = new RoomHandler(this.roomManager, this);
        this.chatHandler = new ChatHandler(this)
    }

    start() {
        this.wss.on('connection', ws => this.handleConnection(ws));
        console.log("[NetworkManager] Đã khởi động và sẵn sàng.");
    }

    handleConnection(ws) {
        ws.on('message', msg => this.handleMessage(ws, msg));
        ws.on('close', () => this.handleDisconnect(ws));
        ws.on('error', (err) => console.error("WS Error:", err));
    }

    // Hàm này được AuthHandler gọi khi login thành công
    onClientAuthenticated(ws, userData) {
        this.clients.set(ws, {
            id: userData.id,
            name: userData.name,
            avatarUrl: userData.avatarUrl,
            highScore: userData.highScore
        });
        console.log(`[NetworkManager] Client ${userData.id} (${userData.name}) đã xác thực.`);
    }

    async handleMessage(ws, msg) {
        let data;
        try { data = JSON.parse(msg); } catch (err) { return; }

        const player = this.clients.get(ws);

        // --- 1. ROUTING: GAME INPUT (Ưu tiên cao nhất) ---
        if (data.type === 'update' || data.type === 'fire') {
            if (player) {
                // Thêm playerId vào packet để GameManager biết ai gửi
                data.playerId = player.id;
                this.gameManager.handleGameInput(player.id, data);
            }
            return;
        }

        // --- 2. ROUTING: AUTH (Login, Register...) ---
        if (['login', 'register', 'checkAuth', 'getLeaderboard'].includes(data.type)) {
            await this.authHandler.handle(ws, data);
            return;
        }

        // --- 3. ROUTING: ROOM / LOBBY ---
        // Các message còn lại ném sang RoomHandler
        if (this.roomHandler) {
            await this.roomHandler.handle(ws, player, data);
        }

        // --- 4. ROUTING: CHAT MESSAGES ---
        if (data.type === MESSAGE_TYPES.CHAT_MESSAGE) {
            if (this.chatHandler) {
                this.chatHandler.handle(ws, player, data);
            }
            return;
        }
    }

    handleDisconnect(ws) {
        const player = this.clients.get(ws);
        if (player) {
            console.log(`[NetworkManager] Người chơi ${player.id} ngắt kết nối.`);
            
            // Logic giữ kết nối 30s
            const roomId = this.roomManager.playerToRoom.get(player.id);
            if (roomId) {
                const room = this.roomManager.rooms.get(roomId);
                // Nếu đang trong phòng, set timeout để kick sau 30s nếu ko quay lại
                setTimeout(() => {
                    const isReconnected = Array.from(this.clients.values()).some(p => p.id === player.id);
                    if (!isReconnected) {
                        if (room && room.status === 'in-game') {
                            this.gameManager.removePlayerFromGame(roomId, player.id);
                        }
                        this.roomManager.handleLeaveRoom(player.id);
                        this.broadcastRoomList();
                    }
                }, 30000);
            }
            this.clients.delete(ws);
        }
    }

    // --- CÁC HÀM BROADCAST (Giữ nguyên hoặc dùng lại) ---

    broadcastRoomList() {
        const rooms = this.roomManager.getRoomList();
        const payload = JSON.stringify({ type: 'roomListData', rooms: rooms });
        
        this.wss.clients.forEach(client => {
            const player = this.clients.get(client);
            // Chỉ gửi cho người đang ở sảnh (chưa vào phòng)
            if (player && !this.roomManager.playerToRoom.has(player.id) && client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }

    broadcastToRoom(roomId, payload, excludeWs = null) {
        const room = this.roomManager.rooms.get(roomId);
        if (!room) return;
        
        const message = (typeof payload === 'string') ? payload : JSON.stringify(payload);
        
        this.clients.forEach((playerInfo, ws) => {
            if (ws !== excludeWs && room.players.has(playerInfo.id) && ws.readyState === WebSocket.OPEN) {
                ws.send(message);
            }
        });
    }
    
    // BroadcastGameState dùng trong GameLoop
    broadcastGameState(roomId, state) {
        this.broadcastToRoom(roomId, { type: 'update', ...state });
    }

    sendToPlayer(playerId, payload) {
        const message = (typeof payload === 'string') ? payload : JSON.stringify(payload);
        for (const [ws, playerInfo] of this.clients.entries()) {
            if (playerInfo.id === playerId && ws.readyState === WebSocket.OPEN) {
                ws.send(message);
                return;
            }
        }
    }
    
    sendPointsUpdate(playerId, newPoints) {
        // Cập nhật điểm trong RAM
        for (const [ws, playerInfo] of this.clients.entries()) {
            if (playerInfo.id === playerId) {
                playerInfo.highScore = newPoints;
                break;
            }
        }
        // Gửi thông báo cho client
        this.sendToPlayer(playerId, { type: 'pointsUpdate', playerId, newPoints });
        
        // Update cho phòng nếu đang ở trong
        const roomId = this.roomManager.playerToRoom.get(playerId);
        if (roomId) {
            const room = this.roomManager.rooms.get(roomId);
            if(room) {
                 room.updatePlayerPoints(playerId, newPoints);
                 this.broadcastToRoom(roomId, { type: 'roomUpdate', room: room.getState() });
            }
        }
    }

    reset() {
        this.clients.clear();
    }
}