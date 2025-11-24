export class Bullet {
    constructor(ctx) {
        this.ctx = ctx;
        this.state = {
            id: null,
            x: 0,
            y: 0,
            radius: 5
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
    }

    draw() {
        const { x, y, radius } = this.state;
        const ctx = this.ctx;

        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const trailPoint = this.trail[i];
            const alpha = (i + 1) / this.trail.length * 0.5;
            const trailRadius = radius * ((i + 1) / this.trail.length) * 0.8;

            ctx.fillStyle = `rgba(255, 200, 50, ${alpha})`;
            ctx.beginPath();
            ctx.arc(trailPoint.x, trailPoint.y, trailRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw bullet glow
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 15;

        // Outer glow
        const outerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        outerGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        outerGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.4)');
        outerGradient.addColorStop(1, 'rgba(255, 140, 0, 0)');

        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Main bullet body with gradient
        const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.3, '#ffff00');
        gradient.addColorStop(0.7, '#ffa500');
        gradient.addColorStop(1, '#ff8c00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Bullet outline
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Highlight spot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}
