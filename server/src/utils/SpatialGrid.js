
export default class SpatialGrid {
    constructor(width, height, cellSize) {
        this.cellSize = cellSize;
        this.buckets = new Map();
        this.staticBuckets = new Map(); // Thêm bucket riêng cho vật cản tĩnh
    }

    getKey(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        return `${col}:${row}`;
    }

    // Dùng cho Player/Bullet (xóa mỗi frame)
    insertDynamic(obj) {
        const key = this.getKey(obj.x, obj.y);
        if (!this.buckets.has(key)) this.buckets.set(key, []);
        this.buckets.get(key).push(obj);
    }

    // Dùng cho Tường/Base (chỉ nạp 1 lần)
    insertStatic(obs) {
        // Vật cản có kích thước (width, height), nên nó có thể nằm trên nhiều ô grid
        // Ta cần loop qua các ô mà vật cản đè lên
        const startCol = Math.floor(obs.x / this.cellSize);
        const endCol = Math.floor((obs.x + obs.width) / this.cellSize);
        const startRow = Math.floor(obs.y / this.cellSize);
        const endRow = Math.floor((obs.y + obs.height) / this.cellSize);

        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                const key = `${c}:${r}`;
                if (!this.staticBuckets.has(key)) this.staticBuckets.set(key, []);
                this.staticBuckets.get(key).push(obs);
            }
        }
    }

    clearDynamic() {
        this.buckets.clear(); // Chỉ xóa dynamic, giữ lại static
    }

    // Lấy tất cả vật thể (động + tĩnh) ở gần
    retrieve(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        let results = [];

        // Quét 9 ô xung quanh (3x3)
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const key = `${col + i}:${row + j}`;
                
                // Lấy dynamic (Player khác, Bullet...)
                if (this.buckets.has(key)) {
                    results = results.concat(this.buckets.get(key));
                }
                // Lấy static (Tường, Base...)
                if (this.staticBuckets.has(key)) {
                    results = results.concat(this.staticBuckets.get(key));
                }
            }
        }
        return results;
    }
    
    // Hàm riêng chỉ lấy Static (dùng cho logic di chuyển của User)
    retrieveStaticOnly(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        let results = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const key = `${col + i}:${row + j}`;
                if (this.staticBuckets.has(key)) {
                    results = results.concat(this.staticBuckets.get(key));
                }
            }
        }
        return results;
    }
}