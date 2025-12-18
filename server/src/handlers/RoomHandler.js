import { isValidGameMode } from '../config/gameModes.js';
export default class RoomHandler {
    constructor(roomManager, networkManager) {
        this.roomManager = roomManager;
        this.networkManager = networkManager;
    }

    async handle(ws, player, data) {
        // Các hành động này yêu cầu người chơi phải đăng nhập trước
        if (!player) {
            ws.send(JSON.stringify({ type: 'error', message: "Chưa xác thực." }));
            return;
        }

        try {
            switch (data.type) {
                case 'getRoomList':
                    const rooms = this.roomManager.getRoomList();
                    ws.send(JSON.stringify({ type: 'roomListData', rooms: rooms }));
                    break;

                case 'createRoom': {
                    // Cắt khoảng trắng, giới hạn độ dài 20 ký tự, nếu rỗng thì lấy tên mặc định
                    const rawName = data.name ? data.name.trim() : "";
                    const safeName = rawName.substring(0, 20) || `Phòng của ${player.name}`;

                    // Validate Max Players 
                    let safeMaxPlayers = parseInt(data.maxPlayers);
                    if (isNaN(safeMaxPlayers)) safeMaxPlayers = 4; 
                    safeMaxPlayers = Math.max(2, Math.min(safeMaxPlayers, 10)); 

                    // Validate Betting Points 
                    let safeBettingPoints = parseInt(data.bettingPoints);
                    if (isNaN(safeBettingPoints)) safeBettingPoints = 0;
                    safeBettingPoints = Math.max(0, safeBettingPoints); 
                    
                    // Kiểm tra xem người chơi có đủ tiền cược không ngay tại đây 
                    if (safeBettingPoints > 0 && player.highScore < safeBettingPoints) {
                        ws.send(JSON.stringify({ type: 'error', message: "Bạn không đủ điểm để tạo phòng cược này!" }));
                        return;
                    }

                    // Validate Game Mode
                    if (!isValidGameMode(data.gameMode)) {
                        ws.send(JSON.stringify({ type: 'error', message: "Chế độ chơi không hợp lệ!" }));
                        return;
                    }
                    const roomConfig = {
                        name: safeName,
                        gameMode: data.gameMode,
                        maxPlayers: safeMaxPlayers,
                        bettingPoints: safeBettingPoints
                    };
                    const newRoom = this.roomManager.handleCreateRoom(player, roomConfig);
                    ws.send(JSON.stringify({ type: 'joinRoomSuccess', room: newRoom.getState() }));
                    this.networkManager.broadcastRoomList();
                    break;
                }

                case 'joinRoom': {
                    const joinedRoom = this.roomManager.handleJoinRoom(data.roomId, player);
                    ws.send(JSON.stringify({ type: 'joinRoomSuccess', room: joinedRoom.getState() }));

                    // Báo cho người khác trong phòng
                    this.networkManager.broadcastToRoom(joinedRoom.id, {
                        type: 'roomUpdate',
                        room: joinedRoom.getState()
                    }, ws);

                    this.networkManager.broadcastRoomList();
                    break;
                }

                case 'leaveRoom': {
                    const currentRoomId = this.roomManager.playerToRoom.get(player.id);
                    const room = this.roomManager.rooms.get(currentRoomId);
                    if (room) {
                        if (room.status === 'in-game') {
                            this.networkManager.gameManager.removePlayerFromGame(currentRoomId, player.id);
                        }
                        this.roomManager.handleLeaveRoom(player.id);
                        ws.send(JSON.stringify({ type: 'leaveRoomSuccess' }));
                        this.networkManager.broadcastRoomList();

                        if (this.roomManager.rooms.has(currentRoomId)) {
                             const updatedRoom = this.roomManager.rooms.get(currentRoomId);
                             this.networkManager.broadcastToRoom(currentRoomId, {
                                type: 'roomUpdate',
                                room: updatedRoom.getState()
                            });
                        }
                    }
                    break;
                }

                case 'switchTeam': {
                    const roomId = this.roomManager.playerToRoom.get(player.id);
                    const room = this.roomManager.rooms.get(roomId);
                    if (room) {
                        if (room.status === 'in-game') {
                            ws.send(JSON.stringify({ type: 'error', message: "Không thể đổi đội khi trận đấu đang diễn ra!" }));
                            return;
                        }
                        room.switchPlayerTeam(player.id, data.teamId);
                        this.networkManager.broadcastToRoom(roomId, {
                            type: 'roomUpdate',
                            room: room.getState()
                        });
                    }
                    break;
                }

                case 'updateRoomSettings': {
                    const roomId = this.roomManager.playerToRoom.get(player.id);
                    const room = this.roomManager.rooms.get(roomId);
                    if (room && room.hostId === player.id) {
                        if (room.status === 'in-game') {
                             ws.send(JSON.stringify({ type: 'error', message: "Không thể thay đổi cài đặt khi trận đấu đang diễn ra!" }));
                             return;
                        }
                        // Validate maxPlayers update
                        let safeMaxPlayers = parseInt(data.maxPlayers);
                        if (!isNaN(safeMaxPlayers)) {
                             safeMaxPlayers = Math.max(2, Math.min(safeMaxPlayers, 10));
                        }

                         // Validate bettingPoints update
                        let safeBettingPoints = parseInt(data.bettingPoints);
                        if (!isNaN(safeBettingPoints)) {
                            safeBettingPoints = Math.max(0, safeBettingPoints);
                        }
                        room.updateSettings({
                            gameMode: data.gameMode,
                            maxPlayers: safeMaxPlayers,
                            bettingPoints: safeBettingPoints
                        });
                        this.networkManager.broadcastToRoom(roomId, {
                            type: 'roomUpdate',
                            room: room.getState()
                        });
                        this.networkManager.broadcastRoomList();
                    }
                    break;
                }

                case 'startGame': {
                    const roomId = this.roomManager.playerToRoom.get(player.id);
                    // roomManager.handleStartGame sẽ gọi GameManager để bắt đầu
                    await this.roomManager.handleStartGame(roomId, player.id);
                    break;
                }

                case 'syncRoomState': {
                    // Logic reload trang web
                    if (data.roomId) {
                        const room = this.roomManager.rooms.get(data.roomId);
                        if (room && room.players.has(player.id)) {
                            const response = {
                                type: 'roomStateSync',
                                room: room.getState(),
                                playerSetup: { playerId: player.id, teamId: room.players.get(player.id).teamId }
                            };
                            // Nếu đang trong game, gửi thêm map data
                            if (room.status === 'in-game') {
                                const game = this.networkManager.gameManager.activeGames.get(data.roomId);
                                if (game) {
                                    response.mapData = game.getMapData();
                                    response.gameState = game.getGameState();
                                }
                            }
                            ws.send(JSON.stringify(response));
                        } else {
                            ws.send(JSON.stringify({ type: 'roomStateSync', room: null }));
                        }
                    }
                    break;
                }
            }
        } catch (error) {
            ws.send(JSON.stringify({ type: 'lobbyError', message: error.message }));
        }
    }
}