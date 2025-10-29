// Sửa đường dẫn: từ 'User.js' thành '../User.js'
import { User } from "../User.js";

export class Tank {
    constructor(canvas, ctx) {
        this.tankNumber = 0;
        this.type = "";
        this.health = 100;
        this.user = new User();
        this.canvas = canvas;
        this.ctx = ctx;
        this.position = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        };
        this.radius = 25;
        this.speed = 1;
        this.turnSpeed = 0.05;
        this.angleBody = 0;
        this.angleTurret = 0;
        this.CheckCollision = false;
    }

    draw() {
        // Vẽ thân xe tăng
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        // Vẽ tháp pháo
        this.ctx.strokeStyle = 'darkgreen';
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(
            this.position.x + Math.cos(this.angleTurret) * 40,
            this.position.y + Math.sin(this.angleTurret) * 40
        );
        this.ctx.stroke();
    }
}