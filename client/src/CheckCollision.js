// export class CheckCollision {
//     static isColliding(tank, map) {
//         if (!map || !map.walls) return false;

//         for (let wall of map.walls) {
//             if (
//                 tank.position.x + tank.radius < wall.x ||
//                 tank.position.x - tank.radius > wall.x + wall.width ||
//                 tank.position.y + tank.radius < wall.y ||
//                 tank.position.y - tank.radius > wall.y + wall.height
//             ) {
//                 continue;
//             } else {
//                 return true;
//             }
//         }
//         return false;
//     }
// }

export class CheckCollision {
    static isColliding(tank, map) {
        for (let wall of map.walls) {
            // Lấy tọa độ gần nhất của tank (hình tròn)
            const nearestX = Math.max(
                wall.x,
                Math.min(tank.position.x, wall.x + wall.width)
            );
            const nearestY = Math.max(
                wall.y,
                Math.min(tank.position.y, wall.y + wall.height)
            );

            const dx = tank.position.x - nearestX;
            const dy = tank.position.y - nearestY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < tank.radius) {
                return true;
            }
        }
        return false;
    }
}
