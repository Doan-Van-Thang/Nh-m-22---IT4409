export default class Bullet {
    constructor(id,x,y,rotation,playerId){
        this.id = id;
        this.x =x;
        this.y=y;
        this.rotation = rotation;
        this.playerId = playerId;
        this.time = Date.now();
    }

    update(){ //Update viên đạn theo hướng
        this.x += Math.cos(this.rotation)*3;
        this.y += Math.sin(this.rotation)*3;
    }

    isExpired(){ //kiểm tra thời gian tồn tại của đạn
        return Date.now() - this.time > 4000;
    }
}