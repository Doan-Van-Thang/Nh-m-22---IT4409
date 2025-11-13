import { createId, collides } from '../model/utils.js';
export default class World {
    constructor() {
        this.mapWidth = 2500;
        this.mapHeight = 1500;
        const baseWidth = 100;
        const baseHeight = 100;
        const baseHealth = 1000;
        const paddingFromEdge = 150;
        const centerY = (this.mapHeight / 2) - (baseHeight / 2);
        this.bases = [
            { id: 'base_1', teamId: 1, x: paddingFromEdge, y: centerY, width: baseWidth, height: baseHeight, health: baseHealth },
            { id: 'base_2', teamId: 2, x: this.mapWidth - paddingFromEdge - baseWidth, y: centerY, width: baseWidth, height: baseHeight, health: baseHealth }
        ];
        this.obstacles = this.generateRandomObstacles().concat(this.bases);
    }

    getMapData() {
        return {
            width: this.mapWidth,
            height: this.mapHeight,
            obstacles: this.obstacles,
            bases: this.bases.map(b => ({ id: b.id, teamId: b.teamId, x: b.x, y: b.y, width: b.width, height: b.height }))
        };
    }
    getBaseHealths() {
        return this.bases.map(b => ({ id: b.id, health: b.health }));
    }
    getBases() {
        return this.bases;
    }

    generateRandomObstacles() {
        const obstacles = [];
        const density = 0.00001;
        const num = Math.floor(density * this.mapWidth * this.mapHeight);
        for (let i = 0; i < num; i++) {
            const w = 50 + Math.random() * 100;
            const h = 50 + Math.random() * 100;
            const x = Math.random() * (this.mapWidth - w);
            const y = Math.random() * (this.mapHeight - h);

            let overlapsWithBase = false;
            const newObstacle = { x, y, width: w, height: h };
            for (const base of this.bases) {
                if (
                    newObstacle.x < base.x + base.width &&
                    newObstacle.x + newObstacle.width > base.x &&
                    newObstacle.y < base.y + base.height &&
                    newObstacle.y + newObstacle.height > base.y
                ) {
                    overlapsWithBase = true;
                    break;
                }
            }
            if (overlapsWithBase) {
                i--;

            } else {
                obstacles.push({ x, y, width: w, height: h });
            }

        }
        return obstacles;
    }

    getSpawnPoint(teamId) {
        const base = this.bases.find(b => b.teamId === teamId);
        if (!base) {
            return { x: 200, y: 200 };
        }
        let x, y;
        let safe = false;
        let attempts = 0;

        while (!safe && attempts < 200) {
            attempts++;
            x = base.x + 10 + Math.random() * (base.width - 20);
            y = base.y + 10 + Math.random() * (base.height - 20);

            safe = true;

            const spawnCircle = {
                x: x,
                y: y,
                radius: 25, // Bán kính chuẩn của User
            };

            for (const obs of this.obstacles) {
                if (obs.id === base.id) {
                    continue;
                }
                // collides() sẽ tự động dùng "circleRectCollides"
                if (collides(spawnCircle, obs)) {
                    safe = false;
                    break;
                }
            }
        }
        if (!safe) {
            x = base.x + base.width + 10;
            y = base.y + base.width + 10;
        }

        return { x, y };
    }
}