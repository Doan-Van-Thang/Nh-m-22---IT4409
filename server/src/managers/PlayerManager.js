import User from '../model/User.js';
import { createId } from '../model/utils.js';

const RESPAWNTIME = 3000;
export default class PlayerManager {
    constructor(world, bulletManager) {
        this.world = world;
        this.bulletManager = bulletManager;
        this.players = new Map();
    }

    addPlayer(playerId, teamId,name) {

        const spawn = this.world.getSpawnPoint(teamId);//Hồi sinh về đúng đội
        const player = new User(playerId, spawn.x, spawn.y, teamId, name);
        this.players.set(playerId, player);
        return player;
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    update() {
        const {mapWidth, mapHeight } = this.world;
        const playersArray = Array.from(this.players.values());

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

        for (let i = 0; i < playersArray.length; i++) {
            for (let j = i + 1; j < playersArray.length; j++) {
                const p1 = playersArray[i];
                const p2 = playersArray[j];

                // Chỉ check nếu cả 2 đều đang sống
                if (!p1.active || !p2.active) continue;

                // Tính khoảng cách giữa 2 xe tăng
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = p1.radius + p2.radius; // Tổng bán kính

                // Nếu khoảng cách nhỏ hơn tổng bán kính => Đang đè lên nhau
                if (distance < minDistance) {
                    // Tính độ lún (overlap)
                    const overlap = minDistance - distance;
                    
                    // Tính góc đẩy
                    const angle = distance === 0 ? Math.random() * Math.PI * 2 : Math.atan2(dy, dx);

                    const pushX = Math.cos(angle) * (overlap / 2);
                    const pushY = Math.sin(angle) * (overlap / 2);

                    p1.x += pushX;
                    p1.y += pushY;

                    p2.x -= pushX;
                    p2.y -= pushY;
                    
                    p1.clampToMap(mapWidth, mapHeight);
                    p2.clampToMap(mapWidth, mapHeight);
                }
            }
        }
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
                name:p.name,
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