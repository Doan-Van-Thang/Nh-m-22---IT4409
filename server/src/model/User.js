// server/src/model/User.js
import { collides } from './utils.js';

export default class User {
    constructor(id, x, y, teamId) {
        this.id = id;
        this.teamId = teamId;
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
        this.baseSpeed = 0.5;
        this.deathTime = 0;

        // Power-up effects
        this.activeEffects = {
            rapidFire: { active: false, endTime: 0, multiplier: 1 },
            shield: { active: false, endTime: 0, reduction: 0 },
            speedBoost: { active: false, endTime: 0, multiplier: 1 },
            superBullet: { active: false, endTime: 0, multiplier: 1 }
        };

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
        // Apply shield reduction if active
        if (this.activeEffects.shield.active) {
            const now = Date.now();
            if (now < this.activeEffects.shield.endTime) {
                amount *= (1 - this.activeEffects.shield.reduction);
            } else {
                this.activeEffects.shield.active = false;
            }
        }
        this.health -= amount;
    }

    heal(amount) {
        this.health = Math.min(this.health + amount, 100);
    }

    activateEffect(effectType, duration, value) {
        const now = Date.now();

        switch (effectType) {
            case 'rapidFire':
                this.activeEffects.rapidFire = {
                    active: true,
                    endTime: now + duration,
                    multiplier: value
                };
                break;
            case 'shield':
                this.activeEffects.shield = {
                    active: true,
                    endTime: now + duration,
                    reduction: value
                };
                break;
            case 'speedBoost':
                this.activeEffects.speedBoost = {
                    active: true,
                    endTime: now + duration,
                    multiplier: value
                };
                this.speed = this.baseSpeed * value;
                break;
            case 'superBullet':
                this.activeEffects.superBullet = {
                    active: true,
                    endTime: now + duration,
                    multiplier: value
                };
                break;
        }
    }

    updateEffects() {
        const now = Date.now();

        // Check if speed boost expired
        if (this.activeEffects.speedBoost.active && now >= this.activeEffects.speedBoost.endTime) {
            this.activeEffects.speedBoost.active = false;
            this.speed = this.baseSpeed;
        }

        // Check if other effects expired
        ['rapidFire', 'shield', 'superBullet'].forEach(effect => {
            if (this.activeEffects[effect].active && now >= this.activeEffects[effect].endTime) {
                this.activeEffects[effect].active = false;
            }
        });
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
        // Update active effects
        this.updateEffects();

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
            if (obs.teamId && obs.teamId === this.teamId) continue;
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