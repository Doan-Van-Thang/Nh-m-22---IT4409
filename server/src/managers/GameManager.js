// server/src/managers/GameManager.js
import GameEngine from '../GameEngine.js';

export default class GameManager {
    constructor(networkManager) {
        this.activeGames = new Map(); // <roomId, GameEngine>
        this.networkManager = networkManager;
    }

    createGame(room) {
        console.log(`[GameManager] Đang tạo game cho phòng ${room.id} with mode ${room.gameMode}...`);

        // Create game engine with the room's game mode
        const gameEngine = new GameEngine(room.gameMode);
        gameEngine.setNetworkManager(this.networkManager, room.id);

        // Lấy mapData ra trước
        const mapData = gameEngine.getMapData();

        // Thêm người chơi từ phòng vào GameEngine
        for (const playerInfo of room.players.values()) {
            // Sửa đổi addPlayer trong PlayerManager để nhận teamId
            const player = gameEngine.playerManager.addPlayer(playerInfo.id, playerInfo.teamId);
            gameEngine.playerManager.handleActivate(player.id);

            // THÊM ĐOẠN NÀY: Gửi 'initialSetup' cho từng người
            this.networkManager.sendToPlayer(player.id, {
                type: 'initialSetup',
                playerId: player.id,
                teamId: player.teamId,
                startX: player.x,
                startY: player.y
            });
        }

        this.activeGames.set(room.id, gameEngine);

        // Send initial game started message (countdown begins on client)
        this.networkManager.broadcastToRoom(room.id, {
            type: 'gameStarted',
            mapData: mapData,
            gameMode: room.gameMode,
            modeConfig: room.modeConfig
        });

        // Start game loop after 3 second countdown
        setTimeout(() => {
            gameEngine.start();
            this.networkManager.broadcastToRoom(room.id, {
                type: 'matchStart',
                message: 'Fight!'
            });
        }, 3000);
    }

    // Xóa game khi kết thúc
    endGame(roomId) {
        const game = this.activeGames.get(roomId);
        if (game) {
            game.stop();
            this.activeGames.delete(roomId);
            console.log(`[GameManager] Đã xóa game của phòng ${roomId}.`);
        }
    }

    // Chuyển tiếp input của người chơi vào đúng GameEngine
    handleGameInput(playerId, data) {
        // Cần một cách để biết 'playerId' này thuộc 'game' nào
        // Chúng ta có thể dùng `playerToRoom` từ RoomManager
        const roomId = this.networkManager.roomManager.playerToRoom.get(playerId);
        const game = this.activeGames.get(roomId);

        if (game) {
            const playerManager = game.playerManager;
            switch (data.type) {
                case 'update':
                    playerManager.handleInput(playerId, data);
                    break;
                case 'fire':
                    playerManager.handleFire(playerId);
                    break;
            }
        }
    }
}