export default class User{
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y =y;
        this.width = 20;
        this.height = 40;
        this.rotation =0;
        this.health = 100;
        this.level = 1;
        this.kills = 0;
        this.active = false;
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
}