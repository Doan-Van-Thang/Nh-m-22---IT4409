import { useEffect, useRef } from "react";

/**
 * Bullet component
 * props:
 *  - bullet: instance của Bullet (game/entities/Bullet)
 *  - camera: Camera instance
 */
export default function Bullet({ bullet, camera }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // canvas nhỏ, chỉ để vẽ 1 viên đạn
    canvas.width = bullet.radius * 2;
    canvas.height = bullet.radius * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(
      bullet.radius,
      bullet.radius,
      bullet.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [bullet]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        left: bullet.x - camera.x - bullet.radius,
        top: bullet.y - camera.y - bullet.radius,
        pointerEvents: "none"
      }}
    />
  );
}
