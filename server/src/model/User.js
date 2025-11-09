// server/src/model/User.js
import { collides } from './utils.js';

export default class User {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 25; // Hình tròn
        this.rotation = 0;
        this.health = 100;
        this.level = 1;
        this.kills = 0;
        this.active = false;
        this.velocity = { x: 0, y: 0 };
        this.speed = 0.5;
        this.deathTime = 0;

        // [THÊM LẠI PHẦN NÀY]
        this.inputState = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    // [THÊM LẠI HÀM NÀY]
    // Hàm mới: nhận input từ PlayerManager
    setInput(inputState) {
        if (inputState) {
            this.inputState = inputState;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
    }

    levelUp() {
        this.kills++;
        this.level++;
        this.health = Math.min(this.health + 20, 100);
        this.radius = 25 + this.level * 2; // Tăng bán kính
    }

    isDead() {
        return this.health <= 0;
    }

    // Hàm va chạm hình tròn (đã sửa)
    updateMovement(obstacles) {
        // 1. Cập nhật vận tốc (Giữ nguyên)
        if (this.inputState.up) this.velocity.y -= this.speed;
        if (this.inputState.down) this.velocity.y += this.speed;
        if (this.inputState.left) this.velocity.x -= this.speed;
        if (this.inputState.right) this.velocity.x += this.speed;

        // 2. Lưu vị trí cũ
        const oldX = this.x;
        const oldY = this.y;

        // 3. Áp dụng vận tốc
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 4. Áp dụng ma sát
        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;

        // 5. Kiểm tra va chạm
        for (const obs of obstacles) {
            if (collides(this, obs)) {
                this.x = oldX;
                this.y = oldY;
                this.velocity.x = 0;
                this.velocity.y = 0;
                return;
            }
        }
    }

    // Hàm clamp hình tròn (đã sửa)
    clampToMap(mapWidth, mapHeight) {
        this.x = Math.max(this.radius, Math.min(mapWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(mapHeight - this.radius, this.y));
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.health = 100;
        this.level = 1;
        this.kills = 0;
        this.radius = 25; // Reset về bán kính gốc
        this.velocity = { x: 0, y: 0 };
        this.active = true; // Kích hoạt lại
        this.deathTime = 0;
    }
}