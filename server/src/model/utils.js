
export function createId(){ //tạo id duy nhất
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function collides(a, b) { //kiêm tra va chạm giữa 2 đối tượng
    if (a.radius && b.radius) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < a.radius + b.radius;
    }

    if (a.radius && b.width && b.height) {
        return circleRectCollides(a, b);
    }

    if (b.radius && a.width && a.height) {
        return circleRectCollides(b, a);
    }


    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function circleRectCollides(circle, rect) {
    const distX = Math.abs(circle.x - (rect.x + rect.width / 2));
    const distY = Math.abs(circle.y - (rect.y + rect.height / 2));

    if (distX > (rect.width / 2 + circle.radius)) return false;
    if (distY > (rect.height / 2 + circle.radius)) return false;

    if (distX <= (rect.width / 2)) return true;
    if (distY <= (rect.height / 2)) return true;

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= circle.radius * circle.radius);
}
