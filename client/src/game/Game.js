import { Tank } from "./model/ingame/Tank.js";
import { GameModes } from "./GameModes.js";
import { User } from "./model/User.js";
import { Bullet } from "./model/ingame/Bullet.js";
import { InputState } from "./InputState.js";
import { InputHandler } from "./InputHandler.js";

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
            // Di chuyển
            // (Giữ nguyên logic client-side của bạn để test)
            if (this.inputState.up) {
                tank.position.y -= tank.speed;
            }
            if (this.inputState.down) {
                tank.position.y += tank.speed;
            }
            if (this.inputState.left) {
                tank.position.x -= tank.speed;
            }
            if (this.inputState.right) {
                tank.position.x += tank.speed;
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
        this.bullets.forEach(bullet => {
            bullet.position.x += bullet.direction.x * bullet.speed;
            bullet.position.y += bullet.direction.y * bullet.speed;
        });

        // TODO: Xóa đạn khi ra khỏi màn hình
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.tanks.forEach(tank => {
            tank.draw();
        });

        this.bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });
    }
}
