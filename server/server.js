import Bullet from "./src/model/Bullet.js";
import User from "./src/model/User.js";
import { createId, collides } from "./src/model/u"
import WebSocket from "ws";

export default class GameServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.players = new Map();
        this.bullets = new Map();
        this.mapWidth = Math.random() * 1000 + 1000;
        this.mapHeight = Math.random() * 1000 + 1000;
        this.obstacles = this.generateRandomObstacles();

        this.handleConnection();
        this.loop();
    }

    loop() {
        setInterval(() => {
            this.updateBullets();
            this.broadcastState();

        }, 1000 / 60);
    }

    handleConnection() { // Hàm xử lí kết nối client với server
        this.wss.on("connection", ws => {
            const playerId = createId();
            const spawn = this.getRandomSpawn();
            const player = new User(playerId, spawn.x, spawn.y);
            this.players.set(playerId, player);

            ws.send(JSON.stringify({ type: "playerId", playerId, startX: spawn.x, startY: spawn.y }));
            ws.send(JSON.stringify({ type: "mapData", width: this.mapWidth, height: this.mapHeight, obstacles: this.obstacles }));
            ws.on("message", msg => this.handleMessage(ws, playerId, msg));
            ws.on("close", () => this.players.delete(playerId));
        });


    }

    handleMessage(ws, playerId, msg) {//Xử lý thông điệp gửi từ client -> server
        let data;
        try {
            data = JSON.parse(msg);
        } catch (err) {
            console.warn("[GameServer] Invalid JSON from client:", msg);
            return;
        }
        const player = this.players.get(playerId);

        if (!player) return;

        switch (data.type) {
            case "update":
                player.update(data);
                player.clampToMap(this.mapWidth, this.mapHeight);
                break;
            case "fire":
                this.spawnBullet(player);
                break;
            case "activatePlayer":
                player.active = true;
                break;
            case "disconnect":
                this.players.delete(playerId);
                break;
        }
    }

    broadcastState() {//Gửi trạng thái game đến tất cả client
        const payload = JSON.stringify({
            type: "update",
            players: Array.from(this.players.values()).map((p) => ({
                id: p.id,
                x: p.x,
                y:p.y,
                rotation: p.rotation,
                health: p.health,
                level: p.level,
            })),
            bullets: Array.from(this.bullets.values()).map( b => ({
                id: b.id,
                x: b.x,
                y: b.y,
                rotation: b.rotation,
                playerId: b.playerId,
            })),
            obstacles: this.obstacles,
        });
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN)
                client.send(payload);
        });
    }

    spawnBullet(player) {
        const bullet = new Bullet(createId(), player.x, player.y, player.rotation, player.id);
        this.bullets.set(bullet.id, bullet);
    }



    updateBullets() {//Cập nhật vị trí đạn và kiểm tra va chạm
        this.bullets.forEach((bullet, id) => {
            bullet.update();
            if (bullet.isExpired() || bullet.isOutofBounds(this.mapWidth,this.mapHeight)) {
                this.bullets.delete(id);
                return;
            }

            for(const obs of this.obstacles){
                if(collides(bullet,obs)){
                    this.bullets.delete(id);
                    return;
                }
            }

        });


    }

    generateRandomObstacles() { //sinh vật cản ngẫu nhiên
        const obstacles = [];
        const density = 0.00001;
        const num = Math.floor(density * this.mapWidth * this.mapHeight);
        for (let i = 0; i < num; i++) {
            const w = 50 + Math.random() * 100;
            const h = 50 + Math.random() * 100;
            obstacles.push({
                x: Math.random() * (this.mapWidth - w),
                y: Math.random() * (this.mapHeight - h),
                width: w,
                height: h,
            });
        }
        return obstacles;
    }

    getRandomSpawn() {//sinh vị trí ngẫu nhiên cho player
        let x, y;
        let safe = false;
        while (!safe) {
            x = Math.random() * (this.mapWidth - 100) + 50;
            y = Math.random() * (this.mapHeight - 100) + 50;
            safe = true;

        }
        return { x, y };
    }




}


