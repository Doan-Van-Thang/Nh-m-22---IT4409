import User from '../model/User.js';
import { createId } from '../model/utils.js';

export default class PlayerManager {
    constructor(world, bulletManager) {
        this.world = world;
        this.bulletManager = bulletManager;
        this.players = new Map();
    }

    addPlayer() {
        const playerId = createId();
        const spawn = this.world.getRandomSpawn();
        const player = new User(playerId, spawn.x, spawn.y);
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

    getState() {
        return Array.from(this.players.values()).map((p) => ({
            id: p.id,
            x: p.x,
            y: p.y,
            rotation: p.rotation,
            health: p.health,
            level: p.level,
            radius: p.radius, // [SỬA] Thay thế width/height bằng radius
        }));
    }
}