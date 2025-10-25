import { Tank } from "Tank.js";

export class Bullet {
    constructor() {
        this.tank = new Tank();
        this.position = { x: 0, y: 0 };
        this.direction = { x: 0, y: 0 };
        this.speed = 5;
    }
}