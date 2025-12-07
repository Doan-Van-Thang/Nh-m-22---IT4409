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
                    const roomConfig = {
                        name: data.name,
                        gameMode: data.gameMode,
                        maxPlayers: data.maxPlayers,
                        bettingPoints: data.bettingPoints
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
                        room.updateSettings({
                            gameMode: data.gameMode,
                            maxPlayers: data.maxPlayers,
                            bettingPoints: data.bettingPoints
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