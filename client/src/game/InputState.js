// client/src/InputState.js

export class InputState {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.shooting = false; // Trạng thái đang giữ chuột
        this.justClicked = false; // Cờ hiệu: Vừa nhấn chuột
    }
}