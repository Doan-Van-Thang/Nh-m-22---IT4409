import { Tank } from "./model/ingame/Tank.js";
import { Bullet } from "./model/ingame/Bullet.js";
import { InputState } from "./InputState.js";
import { InputHandler } from "./InputHandler.js";
import { Map } from "./model/ingame/Map.js";
// BỎ: import { CheckCollision } from "./CheckCollision.js"; (Server sẽ làm việc này)

// IMPORT LỚP MỚI
import { SocketClient } from "./SocketClient.js";

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // --- CẤU TRÚC LƯU TRỮ TRẠNG THÁI ---
        // Chúng ta không dùng mảng nữa, mà dùng Map để truy cập bằng ID
        this.tanks = new Map();
        this.bullets = new Map();
        // ID của người chơi này, sẽ được server cấp
        this.myPlayerId = null;

        // --- INPUT ---
        this.inputState = new InputState();
        this.inputHandler = new InputHandler(this.inputState, this.canvas);

        // --- MAP & VÒNG LẶP ---
        this.map = new Map(this.ctx); // Map vẫn do client vẽ
        this.gameLoopId = null;

        // --- KẾT NỐI MẠNG ---
        // Giả sử server chạy trên cổng 8080 (bạn của bạn cần xác nhận)
        this.socket = new SocketClient('ws://localhost:8080');
        this.socket.addMessageListener(this.handleServerMessage.bind(this));
    }

    // BỎ: addUser(user) - Server sẽ quản lý việc này

    start() {
        console.log("Game Logic: Starting...");
        this.inputHandler.start();
        this.socket.connect(); // Kết nối tới server
        this.gameLoop();
    }

    stop() {
        console.log("Game Logic: Stopping...");
        this.inputHandler.stop();
        this.socket.close(); // Ngắt kết nối
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    }

    // HÀM MỚI: Xử lý tin nhắn từ server
    handleServerMessage(data) {
        // Server sẽ gửi tin nhắn `playerId` khi kết nối
        if (data.type === 'playerId') {
            this.myPlayerId = data.playerId;
            console.log("Server đã cấp ID:", this.myPlayerId);
            // Gửi tin nhắn kích hoạt player (giống logic server của bạn)
            this.socket.send({ type: "activatePlayer" });
            return;
        }

        // Server gửi thông tin map
        if (data.type === 'mapData') {
            // TODO: Cập nhật Map.js với các vật cản (obstacles) từ server
            // this.map.updateObstacles(data.obstacles);
            console.log("Đã nhận dữ liệu map", data.obstacles);
            return;
        }

        // Đây là tin nhắn quan trọng nhất, chạy 60 lần/giây
        if (data.type === 'update') {
            const { players, bullets } = data;

            // --- Đồng bộ hóa XE TĂNG ---
            const seenTankIds = new Set();
            players.forEach(playerState => {
                seenTankIds.add(playerState.id);
                if (!this.tanks.has(playerState.id)) {
                    // Nếu là xe tăng mới, tạo và thêm vào
                    const newTank = new Tank(this.ctx);
                    this.tanks.set(playerState.id, newTank);
                }
                // Cập nhật trạng thái của xe tăng
                this.tanks.get(playerState.id).updateState(playerState);
            });
            // Xóa các xe tăng đã ngắt kết nối
            this.tanks.forEach((tank, id) => {
                if (!seenTankIds.has(id)) {
                    this.tanks.delete(id);
                }
            });

            // --- Đồng bộ hóa ĐẠN ---
            const seenBulletIds = new Set();
            bullets.forEach(bulletState => {
                seenBulletIds.add(bulletState.id);
                if (!this.bullets.has(bulletState.id)) {
                    this.bullets.set(bulletState.id, new Bullet(this.ctx));
                }
                this.bullets.get(bulletState.id).updateState(bulletState);
            });
            // Xóa các viên đạn đã biến mất
            this.bullets.forEach((bullet, id) => {
                if (!seenBulletIds.has(id)) {
                    this.bullets.delete(id);
                }
            });
        }
    }

    gameLoop() {
        this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
        this.update();
        this.draw();
    }

    update() {
        // --- LOGIC CŨ (ĐÃ XÓA) ---
        // (Xóa toàn bộ logic di chuyển xe tăng)
        // (Xóa toàn bộ logic cập nhật đạn)

        // --- LOGIC MỚI: GỬI INPUT LÊN SERVER ---

        // Gửi trạng thái phím bấm VÀ góc xoay nòng súng
        // TODO: Bạn và server cần thống nhất cấu trúc gửi đi
        // Server của bạn [server/server.js] đang mong chờ 
        // 1. Gói tin 'update' với data (x, y, rotation) -> Gói tin này nên là 'input'
        // 2. Gói tin 'fire'

        // Tính toán góc nòng súng (vẫn cần ở client)
        const playerTank = this.tanks.get(this.myPlayerId);
        let turretAngle = 0;
        if (playerTank) {
            turretAngle = Math.atan2(
                this.inputState.mouseY - playerTank.state.y,
                this.inputState.mouseX - playerTank.state.x
            );
        }

        // Gửi gói tin input (nên thống nhất với server tên là 'input')
        // Gửi tạm 'update' theo code server
        this.socket.send({
            type: "update",
            input: this.inputState, // Gửi trạng thái phím
            rotation: turretAngle  // Gửi góc nòng súng
        });

        // Gửi gói tin bắn
        if (this.inputState.justClicked) {
            this.socket.send({ type: "fire" });
            this.inputState.justClicked = false; // Reset cờ
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Vẽ bản đồ
        this.map.draw();

        // --- LOGIC VẼ MỚI ---
        // Chỉ vẽ dựa trên trạng thái server gửi về

        this.bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });

        this.tanks.forEach(tank => {
            tank.draw(this.ctx);
        });
    }
}
