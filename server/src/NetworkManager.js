import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import Account from './model/account.js';
import dotenv from 'dotenv';

export default class NetworkManager {
    constructor(server, authManager) {
        this.wss = new WebSocketServer({ server });
        this.authManager = authManager;
        this.clients = new Map(); // <ws, { id: playerId, name, avatarUrl }>

        // Sẽ được gán bởi index.js
        this.roomManager = null;
        this.gameManager = null;
    }

    setManagers(roomManager, gameManager) {
        this.roomManager = roomManager;
        this.gameManager = gameManager;
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
        const player = this.clients.get(ws);
        if (player) {
            console.log(`[NetworkManager] Người chơi ${player.id} đã ngắt kết nối.`);

            // THÊM MỚI: Rời khỏi phòng/game
            this.roomManager.handleLeaveRoom(player.id);
            // ... logic xóa khỏi game đang chơi nếu có ...

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

        // [SỬA ĐỔI] Lấy thông tin người chơi
        const player = this.clients.get(ws);

        // Nếu người chơi đã đăng nhập VÀ đang chơi game
        if (player && this.roomManager.playerToRoom.has(player.id)) {
            const roomId = this.roomManager.playerToRoom.get(player.id);
            const room = this.roomManager.rooms.get(roomId);

            // 1. Xử lý input trong game
            if (room && room.status === 'in-game') {
                if (data.type === 'update' || data.type === 'fire') {
                    // Thêm 'playerId' vào data để gameManager biết là ai
                    data.playerId = player.id;
                    this.gameManager.handleGameInput(player.id, data);
                    return;
                }
            }

            // 2. Xử lý các lệnh trong sảnh (lobby)
            try {
                switch (data.type) {
                    case 'leaveRoom': { // <-- Thêm dấu ngoặc {
                        // Lấy roomId TRƯỚC khi rời phòng
                        const currentRoomId = this.roomManager.playerToRoom.get(player.id);

                        this.roomManager.handleLeaveRoom(player.id);
                        ws.send(JSON.stringify({ type: 'leaveRoomSuccess' }));
                        this.broadcastRoomList(); // Cập nhật sảnh

                        // Lấy phòng bằng ID vừa lấy
                        const currentRoom = this.roomManager.rooms.get(currentRoomId);

                        // Nếu phòng vẫn còn (tức là host không rời), cập nhật cho người khác
                        if (currentRoom) {
                            this.broadcastToRoom(currentRoomId, {
                                type: 'roomUpdate',
                                room: currentRoom.getState()
                            });
                        }
                        break;
                    }
                    case 'startGame':
                        try {
                            await this.roomManager.handleStartGame(room.id, player.id);
                            // gameManager sẽ broadcast 'gameStarted'
                        } catch (error) {
                            console.error('[NetworkManager] Start game error:', error);
                            ws.send(JSON.stringify({
                                type: 'error',
                                message: error.message
                            }));
                        }
                        break;
                    case 'switchTeam': {
                        const roomId = this.roomManager.playerToRoom.get(player.id);
                        const room = this.roomManager.rooms.get(roomId);

                        if (room) {
                            try {
                                room.switchPlayerTeam(player.id, data.teamId);
                                this.broadcastToRoom(roomId, {
                                    type: 'roomUpdate',
                                    room: room.getState()
                                });
                            } catch (err) {
                                console.log(err.message);
                            }
                        }
                        break;
                    }
                    case 'updateRoomSettings': {
                        const roomId = this.roomManager.playerToRoom.get(player.id);
                        const room = this.roomManager.rooms.get(roomId);

                        if (room) {
                            // Only host can update settings
                            if (room.hostId !== player.id) {
                                ws.send(JSON.stringify({
                                    type: 'error',
                                    message: 'Chỉ chủ phòng mới có thể thay đổi cài đặt!'
                                }));
                                break;
                            }

                            try {
                                room.updateSettings({
                                    gameMode: data.gameMode,
                                    maxPlayers: data.maxPlayers,
                                    bettingPoints: data.bettingPoints
                                });

                                // Broadcast updated room to all players
                                this.broadcastToRoom(roomId, {
                                    type: 'roomUpdate',
                                    room: room.getState()
                                });

                                // Update room list
                                this.broadcastRoomList();
                            } catch (err) {
                                ws.send(JSON.stringify({
                                    type: 'error',
                                    message: err.message
                                }));
                            }
                        }
                        break;
                    }
                }
            } catch (error) {
                ws.send(JSON.stringify({ type: 'lobbyError', message: error.message }));
            }
            // return; // Không return vội, để lọt xuống xử lý chung
        }

        // Client chưa đăng nhập HOẶC chưa vào phòng (đang ở MainMenu)
        try {
            switch (data.type) {
                // ... (case 'register', 'login', 'checkAuth' như cũ) ...
                case 'register':
                    await this.authManager.register(data.username, data.password, data.name, data.province, data.avatarUrl);
                    ws.send(JSON.stringify({ type: 'registerSuccess' }));
                    break;

                // Sửa 'login' và 'checkAuth' để lưu thêm thông tin
                case 'login':
                    const loginData = await this.authManager.login(data.username, data.password);
                    // LƯU LẠI THÔNG TIN PLAYER KHI LOGIN
                    this.clients.set(ws, {
                        id: loginData.id,
                        name: loginData.name,
                        avatarUrl: loginData.avatarUrl,
                        highScore: loginData.highScore
                    });
                    ws.send(JSON.stringify({ type: 'loginSuccess', ...loginData }));
                    break;
                case 'checkAuth':
                    try {
                        const decodedToken = jwt.verify(data.token, process.env.JWT_SECRET);
                        const account = await Account.findById(decodedToken.id);
                        if (!account) {
                            throw new Error('Tài khoản không còn tồn tại');
                        }

                        // Lưu lại client khi xác thực thành công
                        this.clients.set(ws, {
                            id: account._id,
                            name: account.name,
                            avatarUrl: account.avatarUrl,
                            highScore: account.highScore
                        });

                        ws.send(JSON.stringify({
                            type: 'authSuccess',
                            token: data.token,
                            username: account.username,
                            id: account._id,
                            highScore: account.highScore,
                            name: account.name, // Gửi thêm name
                            avatarUrl: account.avatarUrl // Gửi thêm avatarUrl
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
                            .select('name province highScore avatarUrl'); // Chỉ lấy các trường cần thiết

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

                // === TIN NHẮN LOBBY MỚI ===
                case 'getRoomList':
                    const rooms = this.roomManager.getRoomList();
                    ws.send(JSON.stringify({ type: 'roomListData', rooms: rooms }));
                    break;

                case 'createRoom':
                    if (!player) throw new Error("Chưa xác thực.");
                    const roomConfig = {
                        name: data.name,
                        gameMode: data.gameMode,
                        maxPlayers: data.maxPlayers,
                        bettingPoints: data.bettingPoints
                    };
                    const newRoom = this.roomManager.handleCreateRoom(player, roomConfig);
                    ws.send(JSON.stringify({ type: 'joinRoomSuccess', room: newRoom.getState() }));
                    this.broadcastRoomList(); // Cập nhật sảnh cho mọi người
                    break;

                case 'joinRoom':
                    if (!player) throw new Error("Chưa xác thực.");
                    const joinedRoom = this.roomManager.handleJoinRoom(data.roomId, player);
                    ws.send(JSON.stringify({ type: 'joinRoomSuccess', room: joinedRoom.getState() }));
                    // Thông báo cho những người khác trong phòng
                    this.broadcastToRoom(joinedRoom.id, {
                        type: 'roomUpdate',
                        room: joinedRoom.getState()
                    }, ws); // (trừ người vừa join)
                    this.broadcastRoomList(); // Cập nhật sảnh
                    break;


            }
        } catch (error) {
            ws.send(JSON.stringify({ type: 'authError', message: error.message }));
        }
    }

    broadcastGameState(roomId, state) {
        const payload = JSON.stringify({
            type: 'update',
            ...state
        });
        // Lấy danh sách client thuộc phòng này
        const room = this.roomManager.rooms.get(roomId);
        if (!room) return;

        this.clients.forEach((playerInfo, ws) => {
            if (room.players.has(playerInfo.id) && ws.readyState === WebSocket.OPEN) {
                ws.send(payload);
            }
        });
    }
    // Gửi sự kiện kết thúc game
    async broadcastEndGame(roomId, winningTeamId) {
        const room = this.roomManager.rooms.get(roomId);

        // Distribute betting points to winners
        if (room && room.bettingPoints > 0) {
            try {
                await room.distributeBettingPoints(this.authManager, winningTeamId, this);
            } catch (error) {
                console.error('[NetworkManager] Failed to distribute betting points:', error);
            }
        }

        // Reset room status back to waiting
        if (room) {
            room.status = 'waiting';
            console.log(`[NetworkManager] Room ${roomId} status reset to waiting`);
        }

        const payload = JSON.stringify({
            type: 'gameOver',
            winningTeamId: winningTeamId,
            room: room ? room.getState() : null // Send updated room state
        });
        this.broadcastToRoom(roomId, payload, null);

        // Broadcast updated room list to lobby
        this.broadcastRoomList();
    }
    // Gửi cập nhật danh sách phòng (sảnh)
    broadcastRoomList() {
        const rooms = this.roomManager.getRoomList();
        const payload = JSON.stringify({ type: 'roomListData', rooms: rooms });

        this.wss.clients.forEach(client => {
            const player = this.clients.get(client);
            // Chỉ gửi cho những người đang ở sảnh (chưa vào phòng)
            if (player && !this.roomManager.playerToRoom.has(player.id)) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
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

    sendToPlayer(playerId, payload) {
        const message = (typeof payload === 'string') ? payload : JSON.stringify(payload);
        for (const [ws, playerInfo] of this.clients.entries()) {
            if (playerInfo.id === playerId && ws.readyState === WebSocket.OPEN) {
                ws.send(message);
                return; // Tìm thấy và gửi
            }
        }
        console.warn(`[NetworkManager] Không tìm thấy client cho playerId ${playerId} để gửi tin.`);
    }

    sendPointsUpdate(playerId, newPoints) {
        // Update player's highScore in clients map
        for (const [ws, playerInfo] of this.clients.entries()) {
            if (playerInfo.id === playerId) {
                playerInfo.highScore = newPoints;
                break;
            }
        }

        // Update player points in their current room
        const roomId = this.roomManager.playerToRoom.get(playerId);
        if (roomId) {
            const room = this.roomManager.rooms.get(roomId);
            if (room) {
                room.updatePlayerPoints(playerId, newPoints);
                // Broadcast updated room state to all players in the room
                this.broadcastToRoom(roomId, {
                    type: 'roomUpdate',
                    room: room.getState()
                });
            }
        }

        // Send points update to the specific player
        this.sendToPlayer(playerId, {
            type: 'pointsUpdate',
            playerId: playerId,
            newPoints: newPoints
        });
    }

    reset() {
        this.clients.clear();
        console.log("[NetworkManager] Đã reset trạng thái clients");
    }
}