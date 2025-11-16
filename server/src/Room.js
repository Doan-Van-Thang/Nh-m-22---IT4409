// server/src/Room.js
import { createId } from './model/utils.js';

export default class Room {
    constructor(hostPlayer, name) {
        this.id = createId(); // Dùng hàm tạo ID của bạn
        this.name = name || `Phòng của ${hostPlayer.name}`;
        this.hostId = hostPlayer.id;
        this.players = new Map(); // Sẽ lưu { id, name, avatarUrl, teamId }
        this.status = "waiting"; // 'waiting' hoặc 'in-game'
        this.maxPlayers = 4; // Ví dụ: tối đa 4 người

        this.addPlayer(hostPlayer); // Thêm chủ phòng vào
    }

    addPlayer(player) {
        if (this.players.size >= this.maxPlayers || this.status === 'in-game') {
            throw new Error("Phòng đã đầy hoặc đang trong trận.");
        }
        // Gán đội cho người chơi, logic 1v1 hoặc 2v2...
        // Ví dụ đơn giản: xen kẽ
        const teamId = (this.players.size % 2) + 1;

        const playerInfo = {
            id: player.id,
            name: player.name, // Bạn sẽ cần lấy 'name' từ lúc xác thực
            avatarUrl: player.avatarUrl, // Tương tự
            teamId: teamId
        };
        this.players.set(player.id, playerInfo);
        console.log(`[Room ${this.id}] Người chơi ${player.id} đã vào.`);
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
        console.log(`[Room ${this.id}] Người chơi ${playerId} đã rời.`);
        // Nếu chủ phòng rời đi, cần logic Hủy phòng hoặc chọn chủ phòng mới
        if (playerId === this.hostId && this.players.size > 0) {
            // Chọn người chơi đầu tiên làm host mới
            this.hostId = this.players.keys().next().value;
        }
    }

    // Lấy thông tin phòng để gửi về client
    getState() {
        return {
            id: this.id,
            name: this.name,
            hostId: this.hostId,
            status: this.status,
            players: Array.from(this.players.values()) // Gửi danh sách người chơi
        };
    }
}