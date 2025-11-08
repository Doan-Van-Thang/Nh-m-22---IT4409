// client/src/InputHandle.js

export class InputHandler {
    constructor(inputState, canvas) {
        this.inputState = inputState;
        this.canvas = canvas;

        this.inputStateChanged = false;


        // Bind 'this' (Giữ nguyên)
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);
        this.boundHandleMouseMove = this.handleMouseMove.bind(this);
        this.boundHandleMouseDown = this.handleMouseDown.bind(this);
        this.boundHandleMouseUp = this.handleMouseUp.bind(this);

        this.previousInputState = JSON.stringify(this.inputState);
    }

    hasInputChanged() {
        const currentState = JSON.stringify(this.inputState);
        if (currentState !== this.previousInputState) {
            this.previousInputState = currentState;
            return true;
        }
        return false;
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
        let changed = false;
        if ((e.key === 'w' || e.key === 'ArrowUp') && !this.inputState.up) {
            this.inputState.up = true;
            changed = true;
        }
        if ((e.key === 's' || e.key === 'ArrowDown') && !this.inputState.down) {
            this.inputState.down = true;
            changed = true;
        }
        if ((e.key === 'a' || e.key === 'ArrowLeft') && !this.inputState.left) {
            this.inputState.left = true;
            changed = true;
        }
        if ((e.key === 'd' || e.key === 'ArrowRight') && !this.inputState.right) {
            this.inputState.right = true;
            changed = true;
        }

        if (changed) {
            this.inputStateChanged = true;
        }

    }

    handleKeyUp(e) {
        let changed = false;
        if ((e.key === 'w' || e.key === 'ArrowUp') && this.inputState.up) {
            this.inputState.up = false;
            changed = true;
        }
        if ((e.key === 's' || e.key === 'ArrowDown') && this.inputState.down) {
            this.inputState.down = false;
            changed = true;
        }
        if ((e.key === 'a' || e.key === 'ArrowLeft') && this.inputState.left) {
            this.inputState.left = false;
            changed = true;
        }
        if ((e.key === 'd' || e.key === 'ArrowRight') && this.inputState.right) {
            this.inputState.right = false;
            changed = true;
        }
        if (changed) {
            this.inputStateChanged = true;
        }
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