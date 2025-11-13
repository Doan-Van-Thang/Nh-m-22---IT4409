// Xóa hết import cũ
import World from './managers/World.js';
import PlayerManager from './managers/PlayerManager.js';
import BulletManager from './managers/BulletManager.js';

export default class GameEngine {
    constructor() {
        // 1. Khởi tạo các quản lý (theo thứ tự)
        this.gameState = "running";
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
        if(this.gameState === "game_over") return;
        // Cập nhật theo thứ tự
        this.playerManager.update();
        this.bulletManager.update(this.playerManager);
        // (World không cần update)

        //Kiểm tra điều kiện thắng
        const bases = this.world.getBases();
        for(const base of bases){
            if(base.health <= 0){
                this.endGame(base.teamId);
                return;
            }
        }

        if(this.networkManager){
            this.networkManager.broadcastState();
        }
    }

    //Xử lí game khi game kết thúc
    endGame(losingTeamId){
        this.gameState="game_over";
    const winningTeamId = (losingTeamId === 1) ? 2 : 1;
    console.log(`TRẬN ĐẤU KẾT THÚC! ĐỘI ${winningTeamId} THẮNG`);

    if (this.networkManager){
        this.networkManager.broadcastEndGame(winningTeamId);
    }
    setTimeout(() => {
        this.resetGame();

    },5000);
    }

    resetGame(){
        console.log("[GameEngine] Đang reset game về trạng thái ban đầu");
        //Khởi tạo lại trạng thái Game
        this.world = new World();
        this.bulletManager = new BulletManager(this.world);
        this.playerManager = new PlayerManager(this.world, this.bulletManager);
        //Khởi tạo cờ trạng thái
        this.gameState = "running";
        //reset lại networkManager
        if(this.networkManager){
            this.networkManager.reset();
        }

        console.log("[GameEngine] Game đã reset")

    }
    

    // --- Cung cấp state cho NetworkManager ---
    getGameState() {
        return {
            players: this.playerManager.getState(),
            bullets: this.bulletManager.getState(),
            bases: this.world.getBaseHealths()
        };
    }

    getMapData() {
        return this.world.getMapData();
    }
}