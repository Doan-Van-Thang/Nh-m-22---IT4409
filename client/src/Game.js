import { Tank } from "model/ingame/Tank.js";
import { GameModes } from "./GameModes.js";

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.players = {};
        this.tanks = {};
        this.mode = GameModes.PVP2;
    }
    // Start the game loop as a method so it's valid inside the class
    startGame() {
        const loop = () => {
            update(); // Cập nhật logic
            draw();   // Vẽ lại màn hình

            // Yêu cầu trình duyệt gọi lại hàm gameLoop ở khung hình (frame) tiếp theo
            requestAnimationFrame(loop);
        };
        loop();
    }

    update() {
        // TODO: Thêm logic di chuyển cho xe tăng dựa vào 'inputState'
        // Ví dụ:
        if (inputState.up) {
            player.y -= player.speed;
        }
        if (inputState.down) {
            player.y += player.speed;
        }
        if (inputState.left) {
            player.x -= player.speed;
        }
        if (inputState.right) {
            player.x += player.speed;
        }

        // TODO: Cập nhật góc nòng súng (angleTurret) để luôn hướng về chuột
        // Gợi ý: Dùng Math.atan2()
        player.angleTurret = Math.atan2(inputState.mouseY - player.y, inputState.mouseX - player.x);
    }

    draw() {
        // 1. Xóa toàn bộ màn hình
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. TODO: Vẽ xe tăng tại vị trí player.x, player.y
        // Gợi ý: Dùng ctx.save(), ctx.translate(), ctx.rotate(), ctx.fillRect(), ctx.restore()

        // Vẽ tạm một hình tròn để đại diện cho xe tăng
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ tạm nòng súng
        ctx.strokeStyle = 'darkgreen';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(
            player.x + Math.cos(player.angleTurret) * 40, // 40 là chiều dài nòng súng
            player.y + Math.sin(player.angleTurret) * 40
        );
        ctx.stroke();
    }
}


// --- Thiết lập Canvas ---

// Đặt kích thước nội bộ của canvas bằng kích thước cửa sổ
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Xử lý khi người dùng thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- Trạng thái Game (Client-side) ---

// Đối tượng lưu trữ trạng thái của người chơi (vị trí, góc xoay)
// Đây là bước đầu để thực hiện Giai đoạn 1
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 40,
    speed: 1,
    turnSpeed: 0.05, // Tốc độ xoay thân xe
    angleBody: 0,    // Góc xoay thân xe (radian)
    angleTurret: 0,  // Góc xoay nòng súng (radian)
};

// Đối tượng lưu trữ trạng thái các phím được nhấn
const inputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    mouseX: 0,
    mouseY: 0,
    shooting: false
};

// --- Xử lý Input (Đầu vào) ---

window.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') inputState.up = true;
    if (e.key === 's' || e.key === 'ArrowDown') inputState.down = true;
    if (e.key === 'a' || e.key === 'ArrowLeft') inputState.left = true;
    if (e.key === 'd' || e.key === 'ArrowRight') inputState.right = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') inputState.up = false;
    if (e.key === 's' || e.key === 'ArrowDown') inputState.down = false;
    if (e.key === 'a' || e.key === 'ArrowLeft') inputState.left = false;
    if (e.key === 'd' || e.key === 'ArrowRight') inputState.right = false;
});

canvas.addEventListener('mousemove', (e) => {
    inputState.mouseX = e.clientX;
    inputState.mouseY = e.clientY;
});

canvas.addEventListener('mousedown', (e) => {
    inputState.shooting = true;
});

canvas.addEventListener('mouseup', (e) => {
    inputState.shooting = false;
});


// --- Game Loop (Vòng lặp Game) ---

// Hàm cập nhật logic game (vật lý, di chuyển)


// Hàm vẽ mọi thứ lên canvas



// --- Khởi động Game ---
console.log("Client.js đã tải. Bắt đầu game loop...");
