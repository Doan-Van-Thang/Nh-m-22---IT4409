
export class Base {
    constructor(ctx, initialState) {
        this.ctx = ctx;
        this.state = { ...initialState, health: 200 };
        this.pulseTime = 0;
    }

    updateHealth(health) {
        this.state.health = health;
    }

    draw(myTeamId) {
        const { x, y, width, height, teamId, health } = this.state;
        const ctx = this.ctx;
        const isMyBase = teamId === myTeamId;

        // Team colors
        const baseColors = isMyBase
            ? { main: '#3498db', dark: '#2980b9', accent: '#5dade2', flag: '#2874a6' }
            : { main: '#e74c3c', dark: '#c0392b', accent: '#ec7063', flag: '#a93226' };

        this.pulseTime += 0.05;
        const pulse = Math.sin(this.pulseTime) * 0.1 + 0.9;

        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // Draw base foundation (darker)
        const foundationGradient = ctx.createLinearGradient(x, y, x, y + height);
        foundationGradient.addColorStop(0, baseColors.dark);
        foundationGradient.addColorStop(1, '#2c3e50');

        ctx.fillStyle = foundationGradient;
        ctx.fillRect(x + 5, y + 5, width - 10, height - 5);

        // Draw main base structure with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, baseColors.accent);
        gradient.addColorStop(0.5, baseColors.main);
        gradient.addColorStop(1, baseColors.dark);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw windows/details
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        const windowSize = Math.min(width, height) * 0.15;
        const spacing = windowSize * 1.5;

        for (let wx = x + spacing; wx < x + width - windowSize; wx += spacing) {
            for (let wy = y + spacing; wy < y + height - windowSize; wy += spacing) {
                ctx.fillRect(wx, wy, windowSize, windowSize);
                // Window shine
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(wx, wy, windowSize * 0.4, windowSize * 0.4);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            }
        }

        // Draw border with 3D effect
        ctx.strokeStyle = baseColors.dark;
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        // Highlight edge
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

        // Draw flag on top
        const flagX = x + width / 2;
        const flagY = y - 5;
        const flagPoleHeight = 30;
        const flagWidth = 20;
        const flagHeight = 15;

        // Flag pole
        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(flagX, flagY);
        ctx.lineTo(flagX, flagY - flagPoleHeight);
        ctx.stroke();

        // Flag with wave effect
        const wave = Math.sin(this.pulseTime * 2) * 2;
        ctx.fillStyle = baseColors.flag;
        ctx.beginPath();
        ctx.moveTo(flagX, flagY - flagPoleHeight);
        ctx.lineTo(flagX + flagWidth + wave, flagY - flagPoleHeight + flagHeight / 2);
        ctx.lineTo(flagX + wave, flagY - flagPoleHeight + flagHeight);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = baseColors.dark;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Team icon on flag
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(teamId, flagX + flagWidth / 2, flagY - flagPoleHeight + flagHeight / 2 + 4);

        // Draw enhanced health bar
        const barWidth = width * 1.1;
        const barHeight = 8;
        const barX = x + width / 2 - barWidth / 2;
        const barY = y - 25;

        // Health bar background
        const barBgGradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
        barBgGradient.addColorStop(0, '#34495e');
        barBgGradient.addColorStop(1, '#2c3e50');
        ctx.fillStyle = barBgGradient;
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health fill with glow effect
        const healthPercent = health / 200;
        let healthGradient;

        if (healthPercent > 0.6) {
            healthGradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
            healthGradient.addColorStop(0, '#2ecc71');
            healthGradient.addColorStop(1, '#27ae60');
        } else if (healthPercent > 0.3) {
            healthGradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
            healthGradient.addColorStop(0, '#f39c12');
            healthGradient.addColorStop(1, '#e67e22');
        } else {
            healthGradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
            healthGradient.addColorStop(0, '#e74c3c');
            healthGradient.addColorStop(1, '#c0392b');

            // Pulse effect for low health
            ctx.shadowColor = '#e74c3c';
            ctx.shadowBlur = 10 * pulse;
        }

        ctx.fillStyle = healthGradient;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Health bar shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight * 0.4);

        // Health bar border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Health percentage text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(`${Math.ceil(healthPercent * 100)}%`, barX + barWidth / 2, barY + barHeight / 2 + 3);
        ctx.fillText(`${Math.ceil(healthPercent * 100)}%`, barX + barWidth / 2, barY + barHeight / 2 + 3);
    }
}