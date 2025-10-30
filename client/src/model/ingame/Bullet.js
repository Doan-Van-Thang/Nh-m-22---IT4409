export class Bullet {
    constructor(x, y, angle) {
        this.position = { x, y };
        this.direction = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
        this.speed = 5;
        this.radius = 5;
        this.toRemove = false; // Đánh dấu khi cần xóa
    }

    update(map, canvas) {
        // Cập nhật vị trí
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;

        // --- Kiểm tra va chạm tường ---
        for (let wall of map.walls) {
            const nearestX = Math.max(wall.x, Math.min(this.position.x, wall.x + wall.width));
            const nearestY = Math.max(wall.y, Math.min(this.position.y, wall.y + wall.height));

            const dx = this.position.x - nearestX;
            const dy = this.position.y - nearestY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius) {
                // Đạn chạm tường → nảy lại
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.direction.x *= -1; // Nảy ngang
                } else {
                    this.direction.y *= -1; // Nảy dọc
                }

                // Giảm tốc độ sau mỗi lần nảy
                this.speed *= 0.9;

                // Đẩy ra ngoài để tránh bị kẹt
                this.position.x += this.direction.x * this.speed;
                this.position.y += this.direction.y * this.speed;

                // Nếu tốc độ quá nhỏ → xóa đạn
                if (this.speed < 1.5) {
                    this.toRemove = true;
                }
            }
        }

        // --- Nếu đạn bay ra khỏi canvas ---
        if (
            this.position.x < 0 || this.position.x > canvas.width ||
            this.position.y < 0 || this.position.y > canvas.height
        ) {
            this.toRemove = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
