import { createId, collides } from '../model/utils.js';
export default class World {
    constructor() {
        this.mapWidth = Math.random() * 1000 + 1000;
        this.mapHeight = Math.random() * 1000 + 1000;
        this.obstacles = this.generateRandomObstacles();
    }

    getMapData() {
        return {
            width: this.mapWidth,
            height: this.mapHeight,
            obstacles: this.obstacles
        };
    }

    generateRandomObstacles() {
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

            safe = true;

            // [SỬA] Tạo một "xe tăng giả" để kiểm tra (HÌNH TRÒN)
            const spawnCircle = {
                x: x,
                y: y,
                radius: 25, // Bán kính chuẩn của User
            };

            for (const obs of this.obstacles) {
                // collides() sẽ tự động dùng "circleRectCollides"
                if (collides(spawnCircle, obs)) {
                    safe = false;
                    break;
                }
            }
        }

        return { x, y };
    }
}