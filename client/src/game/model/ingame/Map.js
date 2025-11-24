// client/src/game/model/ingame/Map.js
import { Wall } from "./Wall.js";

export class Map {
    constructor(ctx) {
        this.ctx = ctx;
        this.walls = [];
        this.mapWidth = 0;
        this.mapHeight = 0;
    }

    updateMapData(mapData) {
        this.mapWidth = mapData.width;
        this.mapHeight = mapData.height;

        this.walls = [];
        mapData.obstacles.forEach(obs => {
            this.walls.push(
                new Wall(this.ctx, obs.x, obs.y, obs.width, obs.height, 'brown')
            );
        });
    }

    draw() {
        const ctx = this.ctx;

        // Draw background with texture
        if (this.mapWidth > 0 && this.mapHeight > 0) {
            // Base background gradient
            const bgGradient = ctx.createRadialGradient(
                this.mapWidth / 2, this.mapHeight / 2, 0,
                this.mapWidth / 2, this.mapHeight / 2, this.mapWidth
            );
            bgGradient.addColorStop(0, '#3a4a3a');
            bgGradient.addColorStop(0.5, '#2d3d2d');
            bgGradient.addColorStop(1, '#1a2a1a');

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);

            // Draw grid pattern
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;

            const gridSize = 50;
            for (let x = 0; x <= this.mapWidth; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, this.mapHeight);
                ctx.stroke();
            }

            for (let y = 0; y <= this.mapHeight; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(this.mapWidth, y);
                ctx.stroke();
            }

            // Draw map border with 3D effect
            const borderWidth = 15;

            // Outer shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Border gradient
            const borderGradient = ctx.createLinearGradient(0, 0, borderWidth, 0);
            borderGradient.addColorStop(0, '#1a1a1a');
            borderGradient.addColorStop(0.5, '#2d2d2d');
            borderGradient.addColorStop(1, '#404040');

            // Top border
            ctx.fillStyle = borderGradient;
            ctx.fillRect(0, 0, this.mapWidth, borderWidth);

            // Bottom border
            ctx.fillRect(0, this.mapHeight - borderWidth, this.mapWidth, borderWidth);

            // Left border
            const vBorderGradient = ctx.createLinearGradient(0, 0, 0, borderWidth);
            vBorderGradient.addColorStop(0, '#1a1a1a');
            vBorderGradient.addColorStop(0.5, '#2d2d2d');
            vBorderGradient.addColorStop(1, '#404040');
            ctx.fillStyle = vBorderGradient;
            ctx.fillRect(0, 0, borderWidth, this.mapHeight);

            // Right border
            ctx.fillRect(this.mapWidth - borderWidth, 0, borderWidth, this.mapHeight);

            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            // Inner border highlight
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.strokeRect(borderWidth, borderWidth,
                this.mapWidth - borderWidth * 2,
                this.mapHeight - borderWidth * 2);

            // Outer border
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(0, 0, this.mapWidth, this.mapHeight);
        }

        // Draw walls
        this.walls.forEach(wall => wall.draw());
    }
}