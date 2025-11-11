
export class Base {
    constructor(ctx, initialState) {
        this.ctx = ctx;
        // initialState lấy từ 'mapData' (gồm id, teamId, x, y, width, height)
        this.state = { ...initialState, health: 1000 }; 
    }

    // Hàm cập nhật máu (từ gói 'update')
    updateHealth(health) {
        this.state.health = health;
    }

    draw(myTeamId) {
        const { x, y, width, height, teamId, health } = this.state;

        // 1. Vẽ thân nhà
        if (teamId === myTeamId) {
            this.ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; 
        } else {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; 
        }
        this.ctx.fillRect(x, y, width, height);

        // 2. Vẽ viền
        this.ctx.strokeStyle = (teamId === myTeamId) ? 'blue' : 'red';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, width, height);

        // 3. Vẽ thanh máu
        const barWidth = width;
        const barHeight = 10;
        const barX = x;
        const barY = y - 15;

        this.ctx.strokeStyle = '#333';
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);

        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        const healthPercent = health / 1000; 
        this.ctx.fillStyle = '#28a745';
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
}