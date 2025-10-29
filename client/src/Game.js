// client/src/Game.js

import { Tank } from "./model/ingame/Tank.js";
import { GameModes } from "./GameModes.js";
import { User } from "./model/User.js";
import { Bullet } from "./model/ingame/Bullet.js";
import { InputState } from "./InputState.js";
import { InputHandler } from "./InputHandle.js";
import { Map } from "./model/ingame/Map.js";
import { CheckCollision } from "./CheckCollision.js";

export class Game {
    // constructor, addUser, start, stop (Giữ nguyên)
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.users = [];
        this.tanks = [];
        this.bullets = [];
        this.mode = GameModes.PVP2;

        this.inputState = new InputState();
        this.gameLoopId = null;

        this.inputHandler = new InputHandler(this.inputState, this.canvas);

        this.map = new Map(this.ctx);
    }

    addUser(user) {
        this.users.push(user);
        const tank = new Tank(this.canvas, this.ctx);
        tank.user = user;
        this.tanks.push(tank);
    }

    start() {
        this.inputHandler.start();
        this.gameLoop();
    }

    stop() {
        this.inputHandler.stop();
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    // Sửa hàm update()
    update() {
        // --- Cập nhật xe tăng ---
        this.tanks.forEach(tank => {
            // (Sau này bạn sẽ cần logic để chỉ input cho đúng tank của người chơi)

            // Kiểm tra va chạm trước khi di chuyển
            const colliding = CheckCollision.isColliding(tank, this.map);
            console.log("Collision:", colliding);

            // Lưu vị trí cũ để hoàn tác nếu di chuyển gây va chạm
            const oldX = tank.position.x;
            const oldY = tank.position.y;

            // Di chuyển theo phím bấm
            if (this.inputState.up) tank.position.y -= tank.speed;
            if (this.inputState.down) tank.position.y += tank.speed;
            if (this.inputState.left) tank.position.x -= tank.speed;
            if (this.inputState.right) tank.position.x += tank.speed;

            // Nếu sau khi di chuyển mà va chạm => quay lại vị trí cũ
            if (CheckCollision.isColliding(tank, this.map)) {
                tank.position.x = oldX;
                tank.position.y = oldY;
            }


            // Xoay nòng súng
            tank.angleTurret = Math.atan2(
                this.inputState.mouseY - tank.position.y,
                this.inputState.mouseX - tank.position.x
            );
        });

        // --- Logic bắn đạn ---
        // Nếu người chơi vừa nhấn chuột
        if (this.inputState.justClicked) {
            // Lấy xe tăng của người chơi (hiện tại giả sử là tank đầu tiên)
            const playerTank = this.tanks[0];

            if (playerTank) {
                // Tạo viên đạn mới từ vị trí và góc bắn của xe tăng
                const newBullet = new Bullet(
                    playerTank.position.x,
                    playerTank.position.y,
                    playerTank.angleTurret
                );
                // Thêm đạn vào danh sách
                this.bullets.push(newBullet);
            }

            // Đặt lại cờ để không bắn liên tục 60 lần/giây
            this.inputState.justClicked = false;
        }

        // --- Cập nhật đạn ---
        this.bullets.forEach(bullet => {
            bullet.position.x += bullet.direction.x * bullet.speed;
            bullet.position.y += bullet.direction.y * bullet.speed;
        });

        // (Bạn nên thêm logic xóa đạn khi ra khỏi màn hình ở đây)
    }

    // draw() (Giữ nguyên)
    draw() {
        // Xóa toàn bộ màn hình
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Vẽ bản đồ
        this.map.draw();

        // Lặp qua tất cả xe tăng và vẽ chúng
        this.tanks.forEach(tank => {
            tank.draw();
        });

        // Lặp qua tất cả đạn và vẽ chúng
        this.bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });
    }
}