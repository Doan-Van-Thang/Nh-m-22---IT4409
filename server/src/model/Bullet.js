export default class Bullet {
    constructor(id,x,y,rotation,playerId,speed = 5){
        this.id = id;
        this.x =x;
        this.y=y;
        this.rotation = rotation;
        this.playerId = playerId;
        this.time = Date.now();
        this.speed = speed;
    }

    update(){ //Update viên đạn theo hướng
        this.x += Math.cos(this.rotation)*thí.speed;
        this.y += Math.sin(this.rotation)*this.speed;
    }

    isExpired(){ //kiểm tra thời gian tồn tại của đạn
        return Date.now() - this.time > 4000;
    }

    isOutofBounds(mapWidth,mapHeight){ //kiểm tra đạn có ra ngoài bản đồ không
        return this.x <0 || this.x > mapWidth || this.y <0 || this.y > mapHeight;
}
}