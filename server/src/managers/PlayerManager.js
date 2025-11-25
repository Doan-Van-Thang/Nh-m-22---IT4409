import User from '../model/User.js';
import { createId } from '../model/utils.js';

const RESPAWNTIME = 3000;
export default class PlayerManager {
    constructor(world, bulletManager) {
        this.world = world;
        this.bulletManager = bulletManager;
        this.players = new Map();
    }

    addPlayer(playerId, teamId) {

        const spawn = this.world.getSpawnPoint(teamId);//Hồi sinh về đúng đội
        const player = new User(playerId, spawn.x, spawn.y, teamId);
        this.players.set(playerId, player);
        return player;
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    update() {
        const {mapWidth, mapHeight } = this.world;

        this.players.forEach((player) => {
            if (player.active) {
                const nearbyObstacles = this.world.getNearbyObstacles(player.x, player.y);
                player.updateMovement(nearbyObstacles); // Va chạm tường
                player.clampToMap(mapWidth, mapHeight); // Va chạm biên
            }
            else if (player.deathTime > 0) {
                if (Date.now() - player.deathTime > RESPAWNTIME) {
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
            // Check rapid fire cooldown
            const now = Date.now();
            const baseFireRate = 250; // Normal fire rate (ms)
            let fireRate = baseFireRate;

            // Apply rapid fire effect
            if (player.activeEffects.rapidFire.active) {
                fireRate = baseFireRate / player.activeEffects.rapidFire.multiplier;
            }

            // Check if enough time has passed since last shot
            if (!player.lastFireTime || now - player.lastFireTime >= fireRate) {
                this.bulletManager.spawnBullet(player);
                player.lastFireTime = now;
            }
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

            return {
                id: p.id,
                teamId: p.teamId,
                x: p.x,
                y: p.y,
                rotation: p.rotation,
                health: p.health,
                level: p.level,
                radius: p.radius,
                kills: p.kills,
                deaths: p.deaths,
                score: p.score,
                activeEffects: {
                    rapidFire: p.activeEffects.rapidFire.active,
                    shield: p.activeEffects.shield.active,
                    speedBoost: p.activeEffects.speedBoost.active,
                    superBullet: p.activeEffects.superBullet.active
                }
            };
        });
    }

    // Get all player instances (for game mode logic)
    getAllPlayers() {
        return Array.from(this.players.values());
    }
}