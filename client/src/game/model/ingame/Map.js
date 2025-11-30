// client/src/game/model/ingame/Map.js
import { Wall } from "./Wall.js";

export class Map {
    constructor(ctx) {
        this.ctx = ctx;
        this.walls = [];
        this.obstacles = []; // Store raw obstacle data for mini-map
        this.width = 0;
        this.height = 0;
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.cachedBackgroundGradient = null;

        this.controlZone = null;
        this.controllingTeam = null;
        this.animPulse = 0;

        this.safeZoneConfig = null;
        this.currentSafeRadius = 0;
    }

    updateMapData(mapData) {
        this.mapWidth = mapData.width;
        this.mapHeight = mapData.height;
        this.width = mapData.width;
        this.height = mapData.height;
        this.obstacles = mapData.obstacles; // Store for mini-map

        this.controlZone = mapData.controlZone;
        this.safeZoneConfig = mapData.safeZone;

        // Cache background gradient for performance
        this.cachedBackgroundGradient = this.ctx.createRadialGradient(
            this.mapWidth / 2, this.mapHeight / 2, 0,
            this.mapWidth / 2, this.mapHeight / 2, this.mapWidth
        );
        this.cachedBackgroundGradient.addColorStop(0, '#3a4a3a');
        this.cachedBackgroundGradient.addColorStop(0.5, '#2d3d2d');
        this.cachedBackgroundGradient.addColorStop(1, '#1a2a1a');

        this.walls = [];
        mapData.obstacles.forEach(obs => {
            this.walls.push(
                new Wall(this.ctx, obs.x, obs.y, obs.width, obs.height, 'brown')
            );
        });
    }
    setControllingTeam(teamId) {
        this.controllingTeam = teamId;
    }
    updateSafeZone(radius) {
        this.currentSafeRadius = radius;
    }

    draw() {
        const ctx = this.ctx;

        // Draw background with cached gradient
        if (this.mapWidth > 0 && this.mapHeight > 0) {
            ctx.fillStyle = this.cachedBackgroundGradient || '#2d3d2d';
            ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);

            // Draw grid pattern (reduced density for performance)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;

            const gridSize = 100; // Increased from 50 for better performance
            ctx.beginPath();
            for (let x = 0; x <= this.mapWidth; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, this.mapHeight);
            }
            for (let y = 0; y <= this.mapHeight; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(this.mapWidth, y);
            }
            ctx.stroke();

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
        if (this.controlZone) {
            this.drawControlZone();
        }
        if(this.safeZoneConfig && this.currentSafeRadius > 0) {
            this.drawSafeZone();
        }

        // Draw walls
        this.walls.forEach(wall => wall.draw());
    }

    drawControlZone() {
        const ctx = this.ctx;
        const zone = this.controlZone;

        // Tính tâm của zone
        const centerX = zone.x + zone.width / 2;
        const centerY = zone.y + zone.height / 2;
        const radius = zone.captureRadius || 250;

        this.animPulse += 0.05;
        const pulse = Math.sin(this.animPulse) * 10;

        ctx.save();
        ctx.translate(centerX, centerY);

        // Xác định màu dựa trên đội chiếm đóng
        let zoneColor, glowColor;
        if (this.controllingTeam === 1) {
            zoneColor = 'rgba(231, 76, 60, 0.3)';
            glowColor = 'rgba(231, 76, 60, 0.6)';
        } else if (this.controllingTeam === 2) {
            zoneColor = 'rgba(52, 152, 219, 0.3)';
            glowColor = 'rgba(52, 152, 219, 0.6)';
        } else {
            zoneColor = 'rgba(255, 255, 255, 0.1)';
            glowColor = 'rgba(255, 255, 255, 0.3)';
        }


        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = zoneColor;
        ctx.fill();

        // Vẽ viền phát sáng (Pulse effect)
        ctx.beginPath();
        ctx.arc(0, 0, radius + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 4;
        ctx.setLineDash([15, 10]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vẽ biểu tượng Vương miện 
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;
        ctx.fillText(this.controllingTeam ? '👑' : '⚔️', 0, 0);

        ctx.restore();
    }

    drawSafeZone() {
        const ctx = this.ctx;
        const cx = this.safeZoneConfig.centerX;
        const cy = this.safeZoneConfig.centerY;
        const r = this.currentSafeRadius;
        ctx.save();

        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.beginPath();

        ctx.rect(0, 0, this.mapWidth, this.mapHeight);
        ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();


    }
}

