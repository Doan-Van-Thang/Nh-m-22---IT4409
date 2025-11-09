// Xóa hết import cũ
import World from './managers/World.js';
import PlayerManager from './managers/PlayerManager.js';
import BulletManager from './managers/BulletManager.js';

export default class GameEngine {
    constructor() {
        // 1. Khởi tạo các quản lý (theo thứ tự)
        this.world = new World();
        this.bulletManager = new BulletManager(this.world);
        this.playerManager = new PlayerManager(this.world, this.bulletManager);

        this.networkManager = null;

        console.log("[GameEngine] Đã khởi tạo các manager.");
    }
    setNetworkManager(manager){
        this.networkManager = manager;
    }

    start() {
        setInterval(() => {
            this.loop();
        }, 1000 / 60);
        console.log("[GameEngine] Vòng lặp game đã bắt đầu.");
    }

    loop() {
        // Cập nhật theo thứ tự
        this.playerManager.update();
        this.bulletManager.update(this.playerManager);
        // (World không cần update)
        if(this.networkManager){
            this.networkManager.broadcastState();
        }
    }

    // --- Cung cấp state cho NetworkManager ---
    getGameState() {
        return {
            players: this.playerManager.getState(),
            bullets: this.bulletManager.getState(),
        };
    }

    getMapData() {
        return this.world.getMapData();
    }
}