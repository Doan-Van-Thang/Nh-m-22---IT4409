

export class Bullet {
    constructor(x, y, angle) {
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