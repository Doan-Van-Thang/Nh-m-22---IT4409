import { Tank } from "./model/ingame/Tank.js";
import { GameModes } from "./GameModes.js";
import { User } from "./model/User.js";
import { Bullet } from "./model/ingame/Bullet.js";
import { InputState } from "./InputState.js";
import { InputHandler } from "./InputHandler.js";
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

        // Truyền canvas vào InputHandler
        this.inputHandler = new InputHandler(this.inputState, this.canvas);

        this.map = new Map(this.ctx);
    }

    addUser(user) {
        this.users.push(user);
        // Truyền canvas và ctx cho Tank
        const tank = new Tank(this.canvas, this.ctx);
        tank.user = user;
        // Đặt vị trí ban đầu (lấy từ Tank.js)
        tank.position = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        };
        this.tanks.push(tank);
    }

    start() {
        console.log("Game Logic: Starting...");
        this.inputHandler.start(); // Gắn event listener
        this.gameLoop(); // Bắt đầu vòng lặp
    }

    stop() {
        console.log("Game Logic: Stopping...");
        this.inputHandler.stop(); // Gỡ event listener
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    }

    gameLoop() {
        // Bind 'this' và lưu ID
        this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
        // Cập nhật và vẽ
        this.update();
        this.draw();
    }

    update() {
        // --- Cập nhật xe tăng ---
        // TODO: Logic này sẽ được thay thế bằng việc nhận state từ Server
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
        if (this.inputState.justClicked) {
            const playerTank = this.tanks[0];
            if (playerTank) {
                const newBullet = new Bullet(
                    playerTank.position.x,
                    playerTank.position.y,
                    playerTank.angleTurret
                );
                this.bullets.push(newBullet);
            }
            this.inputState.justClicked = false;
        }

        // --- Cập nhật đạn ---
        this.bullets.forEach(bullet => bullet.update(this.map, this.canvas));
        this.bullets = this.bullets.filter(bullet => !bullet.toRemove);

    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Vẽ bản đồ
        this.map.draw();

        // Vẽ bản đồ
        this.map.draw();

        this.tanks.forEach(tank => {
            tank.draw();
        });

        this.bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });
    }
}
