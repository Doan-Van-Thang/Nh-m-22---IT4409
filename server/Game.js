// src/Game.js
import Bullet from "./src/model/Bullet.js";
import User from "./src/model/User.js";
import { createId, collides } from "./src/model/utils.js"; // Giả sử utils.js ở đây

export default class Game {
    constructor() {
        this.players = new Map();
        this.bullets = new Map();
        this.mapWidth = Math.random() * 1000 + 1000;
        this.mapHeight = Math.random() * 1000 + 1000;
        this.obstacles = this.generateRandomObstacles();
    }

    // Bắt đầu vòng lặp game
    startLoop(broadcastCallback) {
        setInterval(() => {
            // 1. Cập nhật logic game
            this.update(); 
            
            // 2. Lấy trạng thái mới nhất
            const state = this.getState();

            // 3. Gọi callback để "phát" trạng thái ra ngoài
            broadcastCallback(state);
        }, 1000 / 60);
    }

    // Thêm người chơi mới
    addPlayer(playerId) {
        const spawn = this.getRandomSpawn();
        const player = new User(playerId, spawn.x, spawn.y);
        this.players.set(playerId, player);
        
        // Trả về dữ liệu khởi tạo cho chỉ người chơi đó
        return {
            playerId,
            startX: spawn.x,
            startY: spawn.y,
            mapData: {
                width: this.mapWidth,
                height: this.mapHeight,
                obstacles: this.obstacles,
            }
        };
    }

    // Xóa người chơi
    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    // Xử lý thông điệp từ người chơi
    handleMessage(playerId, data) {
        const player = this.players.get(playerId);
        if (!player) return;

        switch (data.type) {
            case "input": // Đã sửa theo góp ý trước
                player.inputState = data.state || {};
                player.rotation = data.rotation || 0;
                break;
            case "fire":
                this.spawnBullet(player);
                break;
            case "activatePlayer":
                player.active = true;
                break;
        }
    }

    // Cập nhật toàn bộ trạng thái game (tách ra từ loop)
    update() {
        this.players.forEach((player) => {
            player.updateMovement();
            player.clampToMap(this.mapWidth, this.mapHeight);
        });
        this.updateBullets();
    }

    // Lấy trạng thái hiện tại của game
    getState() {
        // Hàm này không gửi đi, chỉ trả về chuỗi JSON
        return JSON.stringify({
            type: "update",
            players: Array.from(this.players.values()).map((p) => ({
                id: p.id, x: p.x, y: p.y, rotation: p.rotation,
                health: p.health, level: p.level,
            })),
            bullets: Array.from(this.bullets.values()).map(b => ({
                id: b.id, x: b.x, y: b.y, rotation: b.rotation, playerId: b.playerId,
            })),
            // Không cần gửi obstacles liên tục, chỉ gửi 1 lần lúc kết nối
        });
    }

    // --- Các hàm logic (không thay đổi) ---
    
    spawnBullet(player) {
        const bullet = new Bullet(createId(), player.x, player.y, player.rotation, player.id);
        this.bullets.set(bullet.id, bullet);
    }

    updateBullets() {
        this.bullets.forEach((bullet, id) => {
            bullet.update();
            if (bullet.isExpired() || bullet.isOutofBounds(this.mapWidth, this.mapHeight)) {
                this.bullets.delete(id);
                return;
            }

            for (const obs of this.obstacles) {
                if (collides(bullet, obs)) {
                    this.bullets.delete(id);
                    return;
                }
            }

            for (const [playerId, player] of this.players.entries()) {
                if (bullet.playerId === playerId) continue;
                if (collides(bullet, player)) {
                    player.takeDamage(10);
                    this.bullets.delete(id);
                    if (player.isDead()) {
                        const shooter = this.players.get(bullet.playerId);
                        if (shooter) shooter.levelUp();
                        this.players.delete(playerId);
                    }
                    return;
                }
            }
        });
    }

    generateRandomObstacles() {
        // ... (code y như cũ) ...
        const obstacles = [];
        const density = 0.00001;
        const num = Math.floor(density * this.mapWidth * this.mapHeight);
        for (let i = 0; i < num; i++) {
            const w = 50 + Math.random() * 100;
            const h = 50 + Math.random() * 100;
            obstacles.push({
                x: Math.random() * (this.mapWidth - w),
                y: Math.random() * (this.mapHeight - h),
                width: w,
                height: h,
            });
        }
        return obstacles;
    }

    getRandomSpawn() {
        let x, y;
        let safe = false;
        while (!safe) {
            x = Math.random() * (this.mapWidth - 100) + 50;
            y = Math.random() * (this.mapHeight - 100) + 50;
            safe = true; // Cần logic kiểm tra va chạm vật cản
        }
        return { x, y };
    }
}