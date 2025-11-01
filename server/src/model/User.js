export default class User{
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y =y;
        this.width = 50;
        this.height = 40;
        this.rotation =0;
        this.health = 100;
        this.level = 1;
        this.kills = 0;
        this.active = false;
        this.velocity = {x: 0, y:0};
        this.speed = 2;
    }

    update(data){
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
    }

    takeDamage(amount){
        this.health -= amount; 
    }

    levelUp(){
        this.kills++;
        this.level++;
        this.health = Math.min(this.health+20,100);
        this.width = 40 + this.level*3;
    }

    isDead(){
        return this.health <=0;
    }

    updateMovement(InputState){
        if (InputState.up) this.velocity.y -= this.speed;
        else if (InputState.down) this.velocity.y += this.speed;
        else if (InputState.left) this.velocity.x -= this.speed;
        else if (InputState.right) this.velocity.x += this.speed;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;
        }

    clampToMap(mapWidth, mapHeight) {
        const halfW = this.width / 2;
        const halfH = this.height / 2;

        this.x = Math.max(halfW, Math.min(mapWidth - halfW, this.x));
        this.y = Math.max(halfH, Math.min(mapHeight - halfH, this.y));
    }
}