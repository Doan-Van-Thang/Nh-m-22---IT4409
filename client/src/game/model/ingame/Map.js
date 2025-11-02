// client/src/game/model/ingame/Map.js
import { Wall } from "./Wall.js";

export class Map {
    constructor(ctx) {
        this.ctx = ctx;
        this.walls = [];
        this.mapWidth = 0;  // [THÊM MỚI]
        this.mapHeight = 0; // [THÊM MỚI]
    }

    // [SỬA] Đổi tên hàm và nhận toàn bộ mapData
    updateMapData(mapData) {
        // 1. Lưu lại kích thước map
        this.mapWidth = mapData.width;
        this.mapHeight = mapData.height;

        // 2. Tạo tường từ obstacles
        this.walls = [];
        mapData.obstacles.forEach(obs => {
            this.walls.push(
                new Wall(this.ctx, obs.x, obs.y, obs.width, obs.height, 'brown')
            );
        });
    }

    draw() {
        // 1. Vẽ các tường vật cản (như cũ)
        this.walls.forEach(wall => wall.draw());

        // 2. [THÊM MỚI] Vẽ đường viền map
        // Chỉ vẽ nếu kích thước map đã được cập nhật
        if (this.mapWidth > 0 && this.mapHeight > 0) {
            this.ctx.strokeStyle = 'black'; // Màu của đường viền
            this.ctx.lineWidth = 10;      // Độ dày của đường viền

            // Vẽ một hình chữ nhật rỗng bao quanh toàn bộ map
            this.ctx.strokeRect(0, 0, this.mapWidth, this.mapHeight);
        }
    }
}