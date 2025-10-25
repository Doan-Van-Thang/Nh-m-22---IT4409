import { User } from "User.js";

export class Tank {
    constructor() {
        this.tankNumber = 0;
        this.type = "";
        this.health = 100;
        this.user = new User();
    }
}