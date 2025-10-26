import Bullet from ".src/model/Bullet.js";
import User from "./src/model/User.js";
import { createId, collides } from "./src/model/u"
import WebSocket from "ws";

export default class GameServer {
    constructor(server) {
        this.players = new Map();
        this.bullets = new Map();
        this.mapWidth = Math.random() * 1000 + 1000;
        this.mapHeight = Math.random() * 1000 + 1000;
        this.obstacles = this.generateRandomObstacles();

        this.loop();
    }

    loop() {
        setInterval(() => {
            this.updateBullets();

        }, 1000 / 60);
    }

    updateBullets() {
        this.bullets.forEach((bullet, id) => {
            bullet.update();
            if (bullet.isExpired()) this.bullets.delete(id);
        });
    }

    generateRandomObstacles(){ //sinh vật cản ngẫu nhiên
        const obstacles = [];
        const density = 0.00001;
        const num = Math.floor(density * this.mapWidth*this.mapHeight);
        for(let i =0; i <num; i++){
            const w = 50 + Math.random() * 100;
            const h =50 + Math.random() * 100;
            obstacles.push({
                x: Math.random() * (this.mapWidth - w),
                y: Math.random() * (this.mapHeight - h),
                width: w,
                height: h,
            });
        }
        return obstacles;
    }



}


