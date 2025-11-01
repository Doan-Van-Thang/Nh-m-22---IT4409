// client/src/InputHandle.js

export class InputHandler {
    constructor(inputState, canvas) {
        this.inputState = inputState;
        this.canvas = canvas;

        // Bind 'this' (Giữ nguyên)
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);
        this.boundHandleMouseMove = this.handleMouseMove.bind(this);
        this.boundHandleMouseDown = this.handleMouseDown.bind(this);
        this.boundHandleMouseUp = this.handleMouseUp.bind(this);
    }

    // Gắn các trình nghe sự kiện (Giữ nguyên)
    start() {
        window.addEventListener('keydown', this.boundHandleKeyDown);
        window.addEventListener('keyup', this.boundHandleKeyUp);
        this.canvas.addEventListener('mousemove', this.boundHandleMouseMove);
        this.canvas.addEventListener('mousedown', this.boundHandleMouseDown);
        this.canvas.addEventListener('mouseup', this.boundHandleMouseUp);
    }

    // Gỡ các trình nghe sự kiện (Giữ nguyên)
    stop() {
        window.removeEventListener('keydown', this.boundHandleKeyDown);
        window.removeEventListener('keyup', this.boundHandleKeyUp);
        this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
        this.canvas.removeEventListener('mousedown', this.boundHandleMouseDown);
        this.canvas.removeEventListener('mouseup', this.boundHandleMouseUp);
    }

    // --- Các hàm xử lý input ---
    handleKeyDown(e) {
        if (e.key === 'w' || e.key === 'ArrowUp') this.inputState.up = true;
        if (e.key === 's' || e.key === 'ArrowDown') this.inputState.down = true;
        if (e.key === 'a' || e.key === 'ArrowLeft') this.inputState.left = true;
        if (e.key === 'd' || e.key === 'ArrowRight') this.inputState.right = true;
    }

    handleKeyUp(e) {
        if (e.key === 'w' || e.key === 'ArrowUp') this.inputState.up = false;
        if (e.key === 's' || e.key === 'ArrowDown') this.inputState.down = false;
        if (e.key === 'a' || e.key === 'ArrowLeft') this.inputState.left = false;
        if (e.key === 'd' || e.key === 'ArrowRight') this.inputState.right = false;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();

        this.inputState.mouseX = e.clientX - rect.left;
        this.inputState.mouseY = e.clientY - rect.top;
    }

    // Sửa logic nhấn chuột
    handleMouseDown(e) {
        // Nếu trước đó chưa nhấn, thì đây là cú click mới
        if (!this.inputState.shooting) {
            this.inputState.justClicked = true;
        }
        this.inputState.shooting = true; // Cập nhật trạng thái đang giữ
    }

    handleMouseUp(e) {
        this.inputState.shooting = false; // Cập nhật trạng thái nhả chuột
    }
}