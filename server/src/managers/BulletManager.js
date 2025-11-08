import Bullet from '../model/Bullet.js';
import { createId, collides } from '../model/utils.js';

export default class BulletManager {
    constructor(world) {
        this.world = world;
        this.bullets = new Map();
    }

    spawnBullet(player) {
        // [SỬA] Với xe tăng hình tròn, (x,y) là tâm
        const bullet = new Bullet(createId(), player.x, player.y, player.rotation, player.id, 30, 5);
        this.bullets.set(bullet.id, bullet);
    }

    update(playerManager) {
        const { mapWidth, mapHeight, obstacles } = this.world;

        this.bullets.forEach((bullet, id) => {
            bullet.update();

            // Kiểm tra ra ngoài biên (như cũ)
            if (bullet.isExpired() || bullet.isOutofBounds(mapWidth, mapHeight)) {
                this.bullets.delete(id);
                return;
            }

            // Kiểm tra va chạm vật cản (như cũ)
            for (const obs of obstacles) {
                if (collides(bullet, obs)) {
                    this.bullets.delete(id);
                    return;
                }
            }

            // --- [THÊM MỚI] KIỂM TRA VA CHẠM VỚI NGƯỜI CHƠI ---

            // Lấy danh sách người chơi từ playerManager
            const players = playerManager ? playerManager.players : null;
            if (!players) return; // Nếu chưa có người chơi thì thôi

            for (const player of players.values()) {
                // 1. Bỏ qua nếu người chơi chưa active
                if (!player.active) continue;

                // 2. Bỏ qua nếu đạn là của chính người chơi đó
                if (bullet.playerId === player.id) continue;

                // 3. Kiểm tra va chạm
                if (collides(bullet, player)) {
                    // Có va chạm!
                    player.takeDamage(10); // Giả sử 1 viên đạn 10 damage

                    // Xóa viên đạn
                    this.bullets.delete(id);

                    // Kiểm tra xem người chơi có chết không
                    if (player.isDead()) {
                        // Tìm người bắn (shooter)
                        const shooter = players.get(bullet.playerId);
                        if (shooter) {
                            shooter.levelUp(); // Tăng kill/level cho người bắn
                        }

                        // Hồi sinh người chơi đã chết
                        playerManager.respawnPlayer(player);
                    }

                    // Vì đạn đã nổ, không cần kiểm tra tiếp
                    return;
                }
            }
            // --- KẾT THÚC PHẦN THÊM MỚI ---
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