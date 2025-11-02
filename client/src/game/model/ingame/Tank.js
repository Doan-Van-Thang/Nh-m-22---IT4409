export class Tank {
    constructor(ctx) {
        this.ctx = ctx;
        this.state = {
            id: null,
            x: 0,
            y: 0,
            angleBody: 0,
            angleTurret: 0,
            health: 100,
            radius: 25, // [SỬA LẠI] radius mặc định
        };
    }

    updateState(serverState) {
        this.state.id = serverState.id;
        this.state.x = serverState.x;
        this.state.y = serverState.y;
        this.state.angleBody = serverState.rotation;
        this.state.angleTurret = serverState.rotation;
        this.state.health = serverState.health;
        this.state.radius = serverState.radius; // [SỬA LẠI] Nhận radius từ server
    }

    draw() {
        // [SỬA TOÀN BỘ HÀM DRAW]
        const { x, y, angleBody, angleTurret, health, radius } = this.state;

        // (x, y) giờ là tâm của xe tăng

        // 1. Vẽ thân xe tăng (Hình tròn)
        this.ctx.save();
        this.ctx.translate(x, y); // Di chuyển gốc tọa độ về tâm xe tăng
        this.ctx.rotate(angleBody);           // Xoay

        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2); // Vẽ hình tròn tại (0,0)
        this.ctx.fill();

        this.ctx.restore(); // Trả lại gốc tọa độ

        // 2. Vẽ tháp pháo (Nòng súng)
        this.ctx.strokeStyle = 'darkgreen';
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y); // Bắt đầu từ tâm
        this.ctx.lineTo(
            x + Math.cos(angleTurret) * (radius + 15), // Kéo dài nòng súng ra ngoài bán kính
            y + Math.sin(angleTurret) * (radius + 15)
        );
        this.ctx.stroke();

        // TODO: Vẽ thanh máu dựa trên this.state.health
    }
}