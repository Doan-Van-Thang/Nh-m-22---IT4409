// server/src/Room.js
import { createId } from './model/utils.js';

export default class Room {
    constructor(hostPlayer, name, gameMode = '2V2', maxPlayers = 4, bettingPoints = 0) {
        this.id = createId(); // Dùng hàm tạo ID của bạn
        this.name = name || `Phòng của ${hostPlayer.name}`;
        this.hostId = hostPlayer.id;
        this.players = new Map(); // Sẽ lưu { id, name, avatarUrl, teamId }
        this.status = "waiting"; // 'waiting' hoặc 'in-game'
        this.maxPlayers = maxPlayers; // Số người chơi tối đa
        this.gameMode = gameMode; // Chế độ chơi (1V1, 2V2, DEATHMATCH, etc.)
        this.bettingPoints = bettingPoints; // Điểm cược
        this.playersBet = new Map(); // Track who has paid the bet

        this.addPlayer(hostPlayer); // Thêm chủ phòng vào
    }

    addPlayer(player) {
        if (this.players.size >= this.maxPlayers || this.status === 'in-game') {
            throw new Error("Phòng đã đầy hoặc đang trong trận.");
        }

        // Check if player has enough points for betting room
        if (this.bettingPoints > 0 && player.highScore < this.bettingPoints) {
            throw new Error(`Bạn cần ít nhất ${this.bettingPoints} điểm để tham gia phòng này.`);
        }

        // Gán đội cho người chơi, logic 1v1 hoặc 2v2...
        // Ví dụ đơn giản: xen kẽ
        const team1Count = this.countPlayersInTeam(1);
        const team2Count = this.countPlayersInTeam(2);
        const teamId = (team1Count <= team2Count) ? 1 : 2;

        const playerInfo = {
            id: player.id,
            name: player.name, // Bạn sẽ cần lấy 'name' từ lúc xác thực
            avatarUrl: player.avatarUrl, // Tương tự
            highScore: player.highScore || 0, // Add player's points
            teamId: teamId
        };
        this.players.set(player.id, playerInfo);
        console.log(`[Room ${this.id}] Người chơi ${player.id} đã vào.`);
    }

    countPlayersInTeam(teamId) {
        let count = 0;
        for (const p of this.players.values()) {
            if (p.teamId === teamId) count++;
        }
        return count;
    }

    switchPlayerTeam(playerId, newTeamId) {
        const player = this.players.get(playerId);
        if (!player) return;

        if (player.teamId === newTeamId) return;
        const maxPerTeam = this.maxPlayers / 2;
        if (this.countPlayersInTeam(newTeamId) >= maxPerTeam) {
            throw new Error("Đội này đã đầy");
        }

        player.teamId = newTeamId;
        console.log(`[Room ${this.id}] Người chơi ${player.name} chuyển sang đội ${newTeamId}`);
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

    // Update player's points in the room
    updatePlayerPoints(playerId, newPoints) {
        const player = this.players.get(playerId);
        if (player) {
            player.highScore = newPoints;
            console.log(`[Room ${this.id}] Updated ${player.name}'s points to ${newPoints}`);
        }
    }

    // Deduct betting points from all players (called when game starts)
    async deductBettingPoints(authManager, networkManager) {
        if (this.bettingPoints === 0) return true;

        const playerIds = Array.from(this.players.keys());
        for (const playerId of playerIds) {
            try {
                const newPoints = await authManager.deductPoints(playerId, this.bettingPoints);
                this.playersBet.set(playerId, this.bettingPoints);

                // Broadcast point update to the player
                if (networkManager) {
                    networkManager.sendPointsUpdate(playerId, newPoints);
                }
            } catch (error) {
                console.error(`Failed to deduct points from player ${playerId}:`, error);
                // Rollback previous deductions
                for (const [pId, points] of this.playersBet.entries()) {
                    const restoredPoints = await authManager.addPoints(pId, points);
                    if (networkManager) {
                        networkManager.sendPointsUpdate(pId, restoredPoints);
                    }
                }
                this.playersBet.clear();
                throw new Error(`Không thể trừ điểm cược của người chơi. Game không thể bắt đầu.`);
            }
        }
        return true;
    }

    // Distribute winnings to winners (called when game ends)
    async distributeBettingPoints(authManager, winningTeamId, networkManager) {
        if (this.bettingPoints === 0) return;

        const totalPot = this.bettingPoints * this.players.size;
        const winners = Array.from(this.players.values()).filter(p => p.teamId === winningTeamId);

        if (winners.length === 0) return;

        const winningsPerPlayer = Math.floor(totalPot / winners.length);

        for (const winner of winners) {
            try {
                const newPoints = await authManager.addPoints(winner.id, winningsPerPlayer);
                console.log(`[Room ${this.id}] Player ${winner.name} won ${winningsPerPlayer} points`);

                // Broadcast point update to the winner
                if (networkManager) {
                    networkManager.sendPointsUpdate(winner.id, newPoints);
                }
            } catch (error) {
                console.error(`Failed to add points to winner ${winner.id}:`, error);
            }
        }

        this.playersBet.clear();
    }    // Lấy thông tin phòng để gửi về client
    getState() {
        return {
            id: this.id,
            name: this.name,
            hostId: this.hostId,
            status: this.status,
            maxPlayers: this.maxPlayers,
            gameMode: this.gameMode,
            bettingPoints: this.bettingPoints,
            playerCount: this.players.size,
            players: Array.from(this.players.values()) // Gửi danh sách người chơi
        };
    }
}