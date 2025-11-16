import { Tank } from "./model/ingame/Tank.js";
import { Bullet } from "./model/ingame/Bullet.js";
import { InputState } from "./InputState.js";
import { InputHandler } from "./InputHandler.js";
import { Base } from "./model/ingame/Base.js"
import { Map as GameMap } from "./model/ingame/Map.js"; // Đổi tên thành GameMap
// BỎ: import { CheckCollision } from "./CheckCollision.js"; (Server sẽ làm việc này)

// IMPORT LỚP MỚI
import { SocketClient } from "./SocketClient.js";

export class Game {
    // [SỬA] Nhận thêm `socket`
    constructor(canvas, ctx, navigateTo, SCREENS, socket, initialMapData, initialPlayerSetup) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.navigateTo = navigateTo;
        this.SCREENS = SCREENS;

        this.tanks = new Map();
        this.bullets = new Map();
        this.bases = new Map();
        this.myPlayerId = null;

        this.inputState = new InputState();
        this.inputHandler = new InputHandler(this.inputState, this.canvas);

        this.map = new GameMap(this.ctx);
        this.gameLoopId = null;
        this.camX = 0;
        this.camY = 0;

        // --- KẾT NỐI MẠNG ---
        // [SỬA] Dùng socket được truyền vào
        this.socket = socket;
        this.initialMapData = initialMapData;
        this.initialPlayerSetup = initialPlayerSetup;

        // Đăng ký lắng nghe ngay lập tức
        // App.jsx cũng lắng nghe, nhưng Game.js sẽ chỉ xử lý tin nhắn game
        this.socket.addMessageListener(this.handleServerMessage.bind(this));
    }

    start() {
        console.log("Game Logic: Starting...");
        this.inputHandler.start();

        // THÊM ĐOẠN CODE NÀY:
        if (this.initialMapData) {
            console.log("[Game.js] Loading map from initialMapData...");
            this.map.updateMapData(this.initialMapData);
            this.initialMapData.bases.forEach(baseState => {
                const newBase = new Base(this.ctx, baseState);
                this.bases.set(baseState.id, newBase);
            });
            this.initialMapData = null; // Xóa đi sau khi dùng
        }
        if (this.initialPlayerSetup) {
            this.myPlayerId = this.initialPlayerSetup.playerId;
            this.myTeamId = this.initialPlayerSetup.teamId;
            console.log("Server đã cấp ID (từ initialPlayerSetup):", this.myPlayerId);
            this.initialPlayerSetup = null; // Xóa đi sau khi dùng
        }

        // [SỬA] Không cần connect() nữa vì App.jsx đã làm
        this.gameLoop();
    }

    stop() {
        console.log("Game Logic: Stopping...");
        this.inputHandler.stop();
        // [SỬA] Không close() socket, vì App.jsx quản lý
        // (chỉ dừng game loop)
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    }

    // [SỬA] handleServerMessage
    handleServerMessage(data) {
        // App.jsx sẽ xử lý 'loginSuccess', 'authError'


        // Server gửi thông tin map
        // Server gửi thông tin map


        // Đây là tin nhắn quan trọng nhất, chạy 60 lần/giây
        if (data.type === 'update') {
            const { players, bullets, bases } = data;

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

            //Đồng bộ máu của Base
            bases.forEach(baseState => {
                const base = this.bases.get(baseState.id);
                if (base) {
                    base.updateHealth(baseState.health);
                }
            });
        }

        if (data.type === 'gameOver') {
            this.stop();
            alert(`ĐỘI ${data.winningTeamId} THẮNG!`);

            if (this.navigateTo) {
                this.navigateTo(this.SCREENS.MAIN_MENU);
            }

        }
    }

    gameLoop() {
        this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
        this.update();
        this.draw();
    }

    update() {

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
            // Giờ (x, y) là TÂM rồi, không cần tính centerX, centerY
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

        if (!this.lastSentAngle) this.lastSentAngle = 0;

        const angleChanged = Math.abs(turretAngle - this.lastSentAngle) > 0.05;

        // Gửi gói tin input (nên thống nhất với server tên là 'input')
        // Gửi tạm 'update' theo code server
        if (this.inputHandler.inputStateChanged || angleChanged) {
            this.socket.send({
                type: "update",
                input: this.inputState, // Gửi trạng thái phím
                rotation: turretAngle  // Gửi góc nòng súng
            });

            this.lastSentAngle = turretAngle; // Lưu lại góc đã gửi
            this.inputHandler.inputStateChanged = false; // [QUAN TRỌNG] Reset cờ hiệu
        }

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

        // 3. Vẽ bản đồ (tường) và vẽ nhà chính
        this.map.draw();
        this.bases.forEach(base => {
            base.draw(this.myTeamId);
        });

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
