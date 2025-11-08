import { Tank } from "./model/ingame/Tank.js";
import { Bullet } from "./model/ingame/Bullet.js";
import { InputState } from "./InputState.js";
import { InputHandler } from "./InputHandler.js";
import { Map as GameMap } from "./model/ingame/Map.js"; // Đổi tên thành GameMap
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
        this.map = new GameMap(this.ctx); // Map vẫn do client vẽ
        this.gameLoopId = null;
        this.camX = 0; // [THÊM DÒNG NÀY]
        this.camY = 0; // [THÊM DÒNG NÀY]

        // --- KẾT NỐI MẠNG ---
        const socketUrl = `ws://${window.location.hostname}:5174`;
        console.log(`Đang kết nối động tới: ${socketUrl}`); // Thêm dòng này để debug
        this.socket = new SocketClient(socketUrl);
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
        // Server gửi thông tin map
        if (data.type === 'mapData') {
            // [SỬA] Gửi toàn bộ 'data' (bao gồm width, height, obstacles)
            this.map.updateMapData(data);
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
            // [SỬA] Giờ (x, y) là TÂM rồi, không cần tính centerX, centerY
            const { x, y } = playerTank.state;

            // Camera giờ sẽ căn giữa vào TÂM (x, y)
            this.camX = x - this.canvas.width / 2;
            this.camY = y - this.canvas.height / 2;

            // Chuyển tọa độ chuột (Giữ nguyên)
            const worldMouseX = this.inputState.mouseX + this.camX;
            const worldMouseY = this.inputState.mouseY + this.camY;

            // [SỬA] Tính góc xoay từ TÂM (x, y)
            turretAngle = Math.atan2(
                worldMouseY - y, // Chỉ dùng y
                worldMouseX - x  // Chỉ dùng x
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
        // 1. Vẽ nền (Giữ nguyên)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#556B2F'; // Màu xanh rêu
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. [SỬA LẠI] Áp dụng "di chuyển" camera
        // (Dùng this.camX, this.camY đã tính trong update)
        this.ctx.save();
        this.ctx.translate(-this.camX, -this.camY);

        // 3. Vẽ bản đồ (tường)
        this.map.draw();

        // 4. Vẽ đạn
        this.bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });

        // 5. Vẽ xe tăng
        this.tanks.forEach(tank => {
            tank.draw(this.ctx);
        });

        // 6. [SỬA LẠI] Khôi phục lại canvas
        this.ctx.restore();
    }
}
