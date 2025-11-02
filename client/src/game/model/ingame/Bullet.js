export class Bullet {
    // Constructor đơn giản hơn, chỉ cần ctx
    constructor(ctx) {
        this.ctx = ctx;

        // "state" là dữ liệu "chuẩn" được gửi từ server
        this.state = {
            id: null,
            x: 0,
            y: 0,
            radius: 5
        };
    }

    // HÀM MỚI: Cập nhật trạng thái từ server
    updateState(serverState) {
        this.state.id = serverState.id;
        this.state.x = serverState.x;
        this.state.y = serverState.y;
    }

    // BỎ: update() - Server sẽ làm việc này

    // Hàm draw bây giờ vẽ dựa trên "this.state"
    draw() {
        const { x, y, radius } = this.state;

        this.ctx.fillStyle = "yellow";
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
