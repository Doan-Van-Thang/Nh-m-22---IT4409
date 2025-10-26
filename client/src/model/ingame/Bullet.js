// client/src/model/ingame/Bullet.js

// Bạn không cần import Tank ở đây nữa
// import { Tank } from "./Tank.js";

export class Bullet {
    // Sửa constructor:
    constructor(x, y, angle) {
        // this.tank = tank; // Không cần nữa
        this.position = { x: x, y: y };
        this.direction = {
            x: Math.cos(angle), // Tính toán hướng x
            y: Math.sin(angle)  // Tính toán hướng y
        };
        this.speed = 5;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}