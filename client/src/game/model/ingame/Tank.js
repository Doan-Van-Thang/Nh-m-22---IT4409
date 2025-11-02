// BỎ: import { User } from "../User.js"; (Không cần nữa)

export class Tank {
    // Constructor đơn giản hơn, chỉ cần ctx
    constructor(ctx) {
        this.ctx = ctx; // ctx để vẽ

        // "state" là dữ liệu "chuẩn" được gửi từ server
        this.state = {
            id: null,
            x: 0,
            y: 0,
            angleBody: 0,  // Server của bạn đang gọi là 'rotation'
            angleTurret: 0,// Server của bạn chưa có cái này
            health: 100
        };
    }

    // HÀM MỚI: Cập nhật trạng thái từ server
    updateState(serverState) {
        this.state.id = serverState.id;
        this.state.x = serverState.x;
        this.state.y = serverState.y;
        this.state.angleBody = serverState.rotation; // Đồng bộ tên
        this.state.angleTurret = serverState.rotation; // Tạm thời
        this.state.health = serverState.health;
    }

    // Hàm draw bây giờ vẽ dựa trên "this.state"
    draw() {
        // Lấy state ra cho dễ đọc
        const { x, y, angleBody, angleTurret, health } = this.state;
        const radius = 25; // (Lấy từ code cũ)

        // Vẽ thân xe tăng (code vẽ cũ của bạn)
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Vẽ tháp pháo (code vẽ cũ của bạn)
        this.ctx.strokeStyle = 'darkgreen';
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x + Math.cos(angleTurret) * 40,
            y + Math.sin(angleTurret) * 40
        );
        this.ctx.stroke();

        // TODO: Vẽ thanh máu dựa trên this.state.health
    }
}
