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
        console.log(`[CLIENT] Received health ${serverState.health} for tank ${serverState.id}`);
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

        // --- [THÊM MỚI] VẼ THANH MÁU ---
        if (health <= 100) { // Chỉ vẽ nếu không đầy máu

            console.log(`[DRAW] Drawing health bar with health: ${health}`);
            const barWidth = radius * 2;
            const barHeight = 8;
            const barX = x - radius;
            const barY = y - radius - 15; // 15px phía trên xe tăng

            // [BƯỚC 3] VẼ VIỀN (VẼ SAU CÙNG ĐỂ NỔI LÊN TRÊN)
            this.ctx.strokeStyle = '#333';
            this.ctx.strokeRect(barX, barY, barWidth, barHeight);

            // [BƯỚC 1] VẼ NỀN (MÀU ĐỎ)
            this.ctx.fillStyle = '#dc3545'; // Màu đỏ đậm
            this.ctx.fillRect(barX, barY, barWidth, barHeight);

            // [BƯỚC 2] VẼ MÁU HIỆN TẠI (MÀU XANH)
            const healthPercent = health / 100;
            this.ctx.fillStyle = '#28a745'; // Màu xanh lá
            this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);


        }
        // --- KẾT THÚC PHẦN THÊM MỚI ---
    }
}