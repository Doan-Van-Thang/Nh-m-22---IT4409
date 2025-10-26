
export function createId(){ //tạo id duy nhất
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function collides(rectA,rectB){//kiểm tra va chạm 
    return(
        rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width >rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y 
    );
}