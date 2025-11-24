// client/src/components/MiniMap.jsx
import React, { useRef, useEffect } from 'react';

function MiniMap({ game, size = 160 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!game || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = size;
        canvas.height = size;

        const drawMiniMap = () => {
            if (!game.map || !game.map.width || !game.map.height) return;

            const mapWidth = game.map.width;
            const mapHeight = game.map.height;
            const scaleX = size / mapWidth;
            const scaleY = size / mapHeight;

            // Clear canvas
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, size, size);

            // Draw border
            ctx.strokeStyle = '#4a5568';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, size, size);

            // Draw grid
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 0.5;
            const gridSize = 10;
            for (let i = 0; i <= gridSize; i++) {
                const x = (i / gridSize) * size;
                const y = (i / gridSize) * size;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, size);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(size, y);
                ctx.stroke();
            }

            // Draw obstacles/walls
            if (game.map.obstacles && Array.isArray(game.map.obstacles)) {
                ctx.fillStyle = '#8b7355';
                game.map.obstacles.forEach(obstacle => {
                    const x = obstacle.x * scaleX;
                    const y = obstacle.y * scaleY;
                    const w = obstacle.width * scaleX;
                    const h = obstacle.height * scaleY;
                    ctx.fillRect(x, y, w, h);
                });
            }

            // Draw bases
            game.bases.forEach(base => {
                const baseState = base.state;
                const x = baseState.x * scaleX;
                const y = baseState.y * scaleY;
                const w = baseState.width * scaleX;
                const h = baseState.height * scaleY;

                // Base color based on team
                if (baseState.teamId === 1) {
                    ctx.fillStyle = '#e74c3c'; // Red
                    ctx.strokeStyle = '#c0392b';
                } else {
                    ctx.fillStyle = '#3498db'; // Blue
                    ctx.strokeStyle = '#2980b9';
                }

                ctx.fillRect(x, y, w, h);
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, w, h);

                // Draw flag icon
                ctx.fillStyle = '#ffffff';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🏁', x + w / 2, y + h / 2);
            });

            // Draw power-ups
            game.powerUps.forEach(powerUp => {
                const x = powerUp.state.x * scaleX;
                const y = powerUp.state.y * scaleY;

                // Power-up glow
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 4;
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Draw tanks
            game.tanks.forEach((tank, id) => {
                const x = tank.state.x * scaleX;
                const y = tank.state.y * scaleY;
                const radius = Math.max(3, tank.state.radius * scaleX);

                // Tank color based on team
                if (tank.state.teamId === 1) {
                    ctx.fillStyle = '#e74c3c'; // Red
                    ctx.strokeStyle = '#c0392b';
                } else {
                    ctx.fillStyle = '#3498db'; // Blue
                    ctx.strokeStyle = '#2980b9';
                }

                // Highlight player's tank
                if (id === game.myPlayerId) {
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 6;
                    ctx.fillStyle = id === game.myPlayerId && tank.state.teamId === 1 ? '#ff6b6b' : '#4dabf7';
                }

                // Draw tank
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.stroke();

                // Reset shadow
                ctx.shadowBlur = 0;

                // Draw direction indicator for player
                if (id === game.myPlayerId) {
                    const angle = tank.state.angleBody || 0;
                    const dirLength = radius + 3;
                    const dirX = x + Math.cos(angle) * dirLength;
                    const dirY = y + Math.sin(angle) * dirLength;

                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(dirX, dirY);
                    ctx.stroke();
                }
            });

            // Draw camera viewport indicator
            if (game.myPlayerId) {
                const viewportWidth = game.canvas.width * scaleX;
                const viewportHeight = game.canvas.height * scaleY;
                const camX = game.camX * scaleX;
                const camY = game.camY * scaleY;

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([3, 3]);
                ctx.strokeRect(camX, camY, viewportWidth, viewportHeight);
                ctx.setLineDash([]);
            }

            // Draw legend
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('YOU', 5, size - 5);
        };

        // Update mini-map at 15 FPS for better performance
        const updateInterval = setInterval(drawMiniMap, 1000 / 15);

        // Initial draw
        drawMiniMap();

        return () => {
            clearInterval(updateInterval);
        };
    }, [game, size]);

    return (
        <div className="glass-dark p-2 rounded-xl">
            <canvas
                ref={canvasRef}
                className="rounded-lg border-2 border-gray-600"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    imageRendering: 'crisp-edges'
                }}
            />
            <div className="text-center text-xs text-gray-400 mt-1 font-bold">
                MINI MAP
            </div>
        </div>
    );
}

export default MiniMap;
