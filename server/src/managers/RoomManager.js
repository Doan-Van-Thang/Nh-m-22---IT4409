// server/src/managers/RoomManager.js
import Room from '../Room.js';

export default class RoomManager {
    constructor(gameManager) {
        this.rooms = new Map(); // <roomId, Room>
        this.playerToRoom = new Map(); // <playerId, roomId>
        this.gameManager = gameManager; // Trình quản lý các trận đấu (sẽ tạo ở bước 3)
    }

    // (Hàm này sẽ được NetworkManager gọi)
    handleCreateRoom(player) {
        const room = new Room(player);
        this.rooms.set(room.id, room);
        this.playerToRoom.set(player.id, room.id);
        return room;
    }

    handleJoinRoom(roomId, player) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new Error("Phòng không tồn tại.");
        }
        room.addPlayer(player);
        this.playerToRoom.set(player.id, room.id);
        return room;
    }

    handleLeaveRoom(playerId) {
        const roomId = this.playerToRoom.get(playerId);
        const room = this.rooms.get(roomId);
        if (room) {
            room.removePlayer(playerId);
            this.playerToRoom.delete(playerId);
            // Nếu phòng trống, xóa phòng
            if (room.players.size === 0) {
                this.rooms.delete(roomId);
            }
        }
    }

    // (Hàm này sẽ được NetworkManager gọi khi nhận 'startGame')
    handleStartGame(roomId, playerId) {
        const room = this.rooms.get(roomId);
        if (!room) throw new Error("Phòng không tồn tại.");
        if (room.hostId !== playerId) throw new Error("Chỉ chủ phòng mới được bắt đầu.");
        if (room.status === 'in-game') throw new Error("Game đã bắt đầu.");

        room.status = 'in-game';

        // Yêu cầu GameManager tạo một GameEngine mới cho phòng này
        this.gameManager.createGame(room);
    }

    getRoomList() {
        return Array.from(this.rooms.values())
            .filter(room => room.status === 'waiting')
            .map(room => ({
                id: room.id,
                name: room.name,
                playerCount: room.players.size,
                maxPlayers: room.maxPlayers
            }));
    }
}