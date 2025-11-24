export class Bullet {
    constructor(ctx) {
        this.ctx = ctx;
        this.state = {
            id: null,
            x: 0,
            y: 0,
            radius: 5,
            damage: 10
        };
        this.trail = [];
        this.maxTrailLength = 5;
    }

    updateState(serverState) {
        // Store previous position for trail
        if (this.state.x !== 0 && this.state.y !== 0) {
            this.trail.push({ x: this.state.x, y: this.state.y });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }

        this.state.id = serverState.id;
        this.state.x = serverState.x;
        this.state.y = serverState.y;
        this.state.damage = serverState.damage || 10;
    }

    draw() {
        const { x, y, radius, damage } = this.state;
        const ctx = this.ctx;

        // Determine if it's a super bullet (damage > 10)
        const isSuperBullet = damage > 10;

        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const trailPoint = this.trail[i];
            const alpha = (i + 1) / this.trail.length * 0.5;
            const trailRadius = radius * ((i + 1) / this.trail.length) * 0.8;

            // Super bullets have cyan trail, normal bullets have yellow trail
            const trailColor = isSuperBullet ?
                `rgba(168, 218, 220, ${alpha})` :
                `rgba(255, 200, 50, ${alpha})`;

            ctx.fillStyle = trailColor;
            ctx.beginPath();
            ctx.arc(trailPoint.x, trailPoint.y, trailRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw bullet glow
        ctx.shadowColor = isSuperBullet ? '#4ecdc4' : '#ffd700';
        ctx.shadowBlur = isSuperBullet ? 20 : 15;

        // Outer glow
        const outerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        if (isSuperBullet) {
            outerGradient.addColorStop(0, 'rgba(168, 218, 220, 0.9)');
            outerGradient.addColorStop(0.5, 'rgba(78, 205, 196, 0.5)');
            outerGradient.addColorStop(1, 'rgba(29, 120, 116, 0)');
        } else {
            outerGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            outerGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.4)');
            outerGradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
        }

        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Main bullet body with gradient
        const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
        if (isSuperBullet) {
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(0.3, '#a8dadc');
            gradient.addColorStop(0.7, '#4ecdc4');
            gradient.addColorStop(1, '#1d7874');
        } else {
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(0.3, '#ffff00');
            gradient.addColorStop(0.7, '#ffa500');
            gradient.addColorStop(1, '#ff8c00');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Bullet outline
        ctx.strokeStyle = isSuperBullet ? '#1d7874' : '#d97706';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Highlight spot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}
