export class Flag {
    constructor(ctx, initialState) {
        this.ctx = ctx;
        this.state = initialState;
        this.animPhase = 0;
    }

    updateState(serverState) {
        this.state = serverState;
    }

    draw() {
        const { x, y, teamId, state } = this.state;
        const ctx = this.ctx;

        this.animPhase += 0.1;
        const wave = Math.sin(this.animPhase) * 5;

        ctx.save();
        ctx.translate(x, y);

        // Nếu cờ đang rơi (DROPPED), vẽ hiệu ứng cảnh báo
        if (state === 'DROPPED') {
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 15;
        }

        // Vẽ cán cờ
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -40);
        ctx.stroke();

        // Vẽ lá cờ
        ctx.fillStyle = teamId === 1 ? '#e74c3c' : '#3498db'; 
        ctx.beginPath();
        ctx.moveTo(0, -40);
        ctx.lineTo(30, -30 + wave); // Hiệu ứng bay
        ctx.lineTo(0, -20);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Nếu đang được cầm, vẽ vòng tròn dưới chân
        if (state === 'CARRIED') {
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }

        ctx.restore();
    }
}