import Bullet from '../model/Bullet.js';
import { createId, collides } from '../model/utils.js';

export default class BulletManager {
    constructor(world) {
        this.world = world;
        this.bullets = new Map();
    }

    spawnBullet(player) {
        //Với xe tăng hình tròn, (x,y) là tâm
        let damage = 10;
        let bulletSpeed = 15;

        // Check if player has super bullet effect
        if (player.activeEffects.superBullet.active) {
            damage *= player.activeEffects.superBullet.multiplier;
            bulletSpeed *= 1.5; // Super bullets are faster
        }

        const bullet = new Bullet(createId(), player.x, player.y, player.rotation, player.id, bulletSpeed, damage);
        this.bullets.set(bullet.id, bullet);
    }

    update(playerManager) {
        const { mapWidth, mapHeight, obstacles } = this.world;
        const players = playerManager ? playerManager.players : null;
        if (!players) return;

        const bases = this.world.getBases();

        this.bullets.forEach((bullet, id) => {
            bullet.update();
            const shooter = players.get(bullet.playerId);

            // Kiểm tra ra ngoài biên (như cũ)
            if (!shooter || bullet.isExpired() || bullet.isOutofBounds(mapWidth, mapHeight)) {
                this.bullets.delete(id);
                return;
            }

            // Kiểm tra va chạm vật cản (như cũ)
            for (const obs of obstacles) {
                if (collides(bullet, obs)) {
                    if (obs.teamId && obs.health !== undefined) {
                        if (shooter.teamId === obs.teamId) {
                            this.bullets.delete(id);
                            return;
                        } else {
                            obs.health -= bullet.damage;
                            this.bullets.delete(id);
                            return;
                        }
                    } else {
                        this.bullets.delete(id);
                        return;
                    }
                }
            }

            // --- KIỂM TRA VA CHẠM VỚI NGƯỜI CHƠI ---

            for (const player of players.values()) {
                // 1. Bỏ qua nếu người chơi chưa active
                if (!player.active) continue;

                // 2. Bỏ qua nếu đạn là của chính người chơi đó
                if (bullet.playerId === player.id) continue;
                // 3.Kiểm tra đạn bắn đồng đội
                if (shooter && shooter.teamId && player.teamId && shooter.teamId === player.teamId) {
                    continue; 
                }

                // 3. Kiểm tra va chạm
                if (collides(bullet, player)) {
                    // Có va chạm!
                    player.takeDamage(bullet.damage); // Use bullet's damage value

                    // Xóa viên đạn
                    this.bullets.delete(id);

                    // Kiểm tra xem người chơi có chết không
                    if (player.isDead()) {
                        // Record death for killed player
                        player.recordDeath();

                        if (shooter) {
                            shooter.levelUp(); // Tăng kill/level cho người bắn
                        }

                        // Hồi sinh người chơi đã chết
                        //playerManager.respawnPlayer(player);
                        player.active = false;
                        player.deathTime = Date.now();
                    }

                    // Vì đạn đã nổ, không cần kiểm tra tiếp
                    return;
                }
            }

        });
    }

    getState() {
        return Array.from(this.bullets.values()).map(b => ({
            id: b.id,
            x: b.x,
            y: b.y,
            rotation: b.rotation,
            playerId: b.playerId,
            damage: b.damage
        }));
    }
}