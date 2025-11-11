import User from '../model/User.js';
import { createId } from '../model/utils.js';

const RESPAWNTIME = 3000;
export default class PlayerManager {
    constructor(world, bulletManager) {
        this.world = world;
        this.bulletManager = bulletManager;
        this.players = new Map();
        this.nextTeam = 1;
    }

    addPlayer() {
        const playerId = createId();
        const teamId = this.nextTeam;
        this.nextTeam = (this.nextTeam === 1) ? 2 : 1;
        const spawn = this.world.getSpawnPoint(teamId);//Hồi sinh về đúng đội
        const player = new User(playerId, spawn.x, spawn.y, teamId);
        this.players.set(playerId, player);
        return player;
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    update() {
        const { obstacles, mapWidth, mapHeight } = this.world;

        this.players.forEach((player) => {
            if (player.active) {
                player.updateMovement(obstacles); // Va chạm tường
                player.clampToMap(mapWidth, mapHeight); // Va chạm biên
            }
            else if(player.deathTime > 0) {
                if(Date.now() - player.deathTime > RESPAWNTIME) {
                    this.respawnPlayer(player);
                }
            }
        });
    }

    // Xử lý hành động
    handleInput(playerId, data) {
        const player = this.players.get(playerId);
        if (player) {
            player.setInput(data.input);
            player.rotation = data.rotation;
        }
    }

    handleFire(playerId) {
        const player = this.players.get(playerId);
        if (player && player.active) {
            this.bulletManager.spawnBullet(player);
        }
    }

    handleActivate(playerId) {
        const player = this.players.get(playerId);
        if (player) {
            player.active = true;
        }
    }

    respawnPlayer(player) {
        if (!player) return;
        const spawn = this.world.getSpawnPoint(player.teamId);
        player.respawn(spawn.x, spawn.y);
        console.log(`[PlayerManager] Người chơi ${player.id} đã hồi sinh.`);
    }

    getState() {
        return Array.from(this.players.values()).map((p) => {

            // --- [THÊM DÒNG NÀY ĐỂ DEBUG] ---
            if (p.health < 100) {
                console.log(`[SERVER] Sending player ${p.id} health: ${p.health}`);
            }
            // --- [HẾT PHẦN THÊM] ---

            return {
                id: p.id,
                teamId: p.teamId,
                x: p.x,
                y: p.y,
                rotation: p.rotation,
                health: p.health, //
                level: p.level,
                radius: p.radius,
            };
        });
    }
}