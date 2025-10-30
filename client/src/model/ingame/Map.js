import { Wall } from "./Wall.js";

export class Map {
    constructor(ctx) {
        this.ctx = ctx;
        this.walls = [];
        this.initWalls();
    }

    initWalls() {
        this.walls = [
            new Wall(this.ctx, 50, 50, 400, 20, 'brown'),   
            new Wall(this.ctx, 50, 430, 400, 20, 'brown'), 
            new Wall(this.ctx, 550, 50, 20, 360, 'brown'),
            new Wall(this.ctx, 200, 150, 20, 200, 'brown'),
        ];
    }

    draw() {
        this.walls.forEach(wall => wall.draw());
    }
}
