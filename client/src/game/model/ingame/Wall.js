export class Wall {
    constructor(ctx, x, y, width, height, color = 'gray') {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        const ctx = this.ctx;
        const { x, y, width, height } = this;

        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        // Main wall gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, '#8b7355');
        gradient.addColorStop(0.5, '#6d5a47');
        gradient.addColorStop(1, '#4a3f35');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw brick pattern
        const brickWidth = 40;
        const brickHeight = 20;
        const mortar = 2;

        ctx.strokeStyle = '#3d2f26';
        ctx.lineWidth = mortar;

        for (let by = y; by < y + height; by += brickHeight) {
            const rowOffset = (Math.floor((by - y) / brickHeight) % 2) * (brickWidth / 2);
            for (let bx = x - rowOffset; bx < x + width; bx += brickWidth) {
                if (bx + brickWidth > x && bx < x + width) {
                    const brickX = Math.max(bx, x);
                    const brickW = Math.min(bx + brickWidth, x + width) - brickX;
                    const brickY = by;
                    const brickH = Math.min(brickHeight, y + height - by);

                    // Individual brick gradient
                    const brickGradient = ctx.createLinearGradient(
                        brickX, brickY,
                        brickX + brickW, brickY + brickH
                    );
                    brickGradient.addColorStop(0, '#9b8570');
                    brickGradient.addColorStop(1, '#7d6955');

                    ctx.fillStyle = brickGradient;
                    ctx.fillRect(brickX, brickY, brickW, brickH);

                    // Brick outline
                    ctx.strokeRect(brickX, brickY, brickW, brickH);

                    // Highlight on brick
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.fillRect(brickX, brickY, brickW, brickH * 0.3);
                }
            }
        }

        // Wall border/outline
        ctx.strokeStyle = '#2c1f18';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
    }
}


