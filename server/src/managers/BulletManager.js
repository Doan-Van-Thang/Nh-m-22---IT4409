import Bullet from '../model/Bullet.js';
import { createId, collides } from '../model/utils.js';

export default class BulletManager {
    constructor(world) {
        this.world = world;
        this.bullets = new Map();
    }

    spawnBullet(player) {
        // [SỬA] Với xe tăng hình tròn, (x,y) là tâm
        const bullet = new Bullet(createId(), player.x, player.y, player.rotation, player.id, 10, 5);
        this.bullets.set(bullet.id, bullet);
    }

    update() {
        const { mapWidth, mapHeight, obstacles } = this.world;

        this.bullets.forEach((bullet, id) => {
            bullet.update();

            // Kiểm tra ra ngoài biên
            if (bullet.isExpired() || bullet.isOutofBounds(mapWidth, mapHeight)) {
                this.bullets.delete(id);
                return;
            }

            // Kiểm tra va chạm vật cản
            for (const obs of obstacles) {
                if (collides(bullet, obs)) {
                    this.bullets.delete(id);
                    return;
                }
            }

            // (TODO: Thêm va chạm đạn với người chơi ở đây)
        });
    }

    getState() {
        return Array.from(this.bullets.values()).map(b => ({
            id: b.id,
            x: b.x,
            y: b.y,
            rotation: b.rotation,
            playerId: b.playerId,
        }));
    }
}