export class Tank {
    constructor(ctx, teamId = 1) {
        this.ctx = ctx;
        this.teamId = teamId;
        this.state = {
            id: null,
            x: 0,
            y: 0,
            angleBody: 0,
            angleTurret: 0,
            health: 100,
            radius: 25,
            teamId: teamId,
            activeEffects: {
                rapidFire: false,
                shield: false,
                speedBoost: false,
                superBullet: false
            }
        };
        this.effectAnimPhase = 0;
    }

    updateState(serverState) {
        console.log(`[CLIENT] Received health ${serverState.health} for tank ${serverState.id}`);
        this.state.id = serverState.id;
        this.state.x = serverState.x;
        this.state.y = serverState.y;
        this.state.angleBody = serverState.rotation;
        this.state.angleTurret = serverState.rotation;
        this.state.health = serverState.health;
        this.state.radius = serverState.radius;
        this.state.teamId = serverState.teamId || this.teamId;
        this.state.activeEffects = serverState.activeEffects || this.state.activeEffects;
    }

    draw() {
        const { x, y, angleBody, angleTurret, health, radius, teamId, activeEffects } = this.state;
        const ctx = this.ctx;

        // Update animation phase
        this.effectAnimPhase += 0.1;

        // Draw active effect auras BEFORE the tank
        this.drawEffectAuras(x, y, radius, activeEffects);

        // Team colors
        const teamColors = {
            1: { body: '#e74c3c', dark: '#c0392b', track: '#8b0000' },  // Red team
            2: { body: '#3498db', dark: '#2980b9', track: '#00008b' }   // Blue team
        };
        const colors = teamColors[teamId] || teamColors[1];

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angleBody);

        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // Draw tank tracks (left and right)
        const trackWidth = radius * 0.5;
        const trackLength = radius * 1.6;

        // Left track
        ctx.fillStyle = colors.track;
        ctx.fillRect(-trackLength / 2, -radius - trackWidth / 2, trackLength, trackWidth);
        // Track details
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-trackLength / 2 + (i * trackLength / 4), -radius - trackWidth / 2);
            ctx.lineTo(-trackLength / 2 + (i * trackLength / 4), -radius + trackWidth / 2);
            ctx.stroke();
        }

        // Right track
        ctx.fillStyle = colors.track;
        ctx.fillRect(-trackLength / 2, radius - trackWidth / 2, trackLength, trackWidth);
        // Track details
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-trackLength / 2 + (i * trackLength / 4), radius - trackWidth / 2);
            ctx.lineTo(-trackLength / 2 + (i * trackLength / 4), radius + trackWidth / 2);
            ctx.stroke();
        }

        // Draw tank body with gradient
        const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, radius);
        gradient.addColorStop(0, colors.body);
        gradient.addColorStop(1, colors.dark);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Body outline
        ctx.strokeStyle = colors.dark;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Reset shadow for other elements
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw details on body
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(-5, -5, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Draw turret base (rotates with turret)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angleTurret);

        // Turret base circle
        const turretGradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, radius * 0.6);
        turretGradient.addColorStop(0, colors.body);
        turretGradient.addColorStop(1, colors.dark);

        ctx.fillStyle = turretGradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = colors.dark;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw cannon barrel with 3D effect
        const barrelLength = radius + 20;
        const barrelWidth = 8;

        // Barrel shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, -barrelWidth / 2 + 2, barrelLength, barrelWidth);

        // Barrel gradient
        const barrelGradient = ctx.createLinearGradient(0, -barrelWidth / 2, 0, barrelWidth / 2);
        barrelGradient.addColorStop(0, '#2c3e50');
        barrelGradient.addColorStop(0.5, '#34495e');
        barrelGradient.addColorStop(1, '#1a252f');

        ctx.fillStyle = barrelGradient;
        ctx.fillRect(0, -barrelWidth / 2, barrelLength, barrelWidth);

        // Barrel outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, -barrelWidth / 2, barrelLength, barrelWidth);

        // Barrel tip highlight
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(barrelLength - 3, -barrelWidth / 2, 3, barrelWidth);

        ctx.restore();

        // Draw health bar with enhanced styling
        if (health < 100) {
            const barWidth = radius * 2.2;
            const barHeight = 6;
            const barX = x - barWidth / 2;
            const barY = y - radius - 20;

            // Health bar background with gradient
            const bgGradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
            bgGradient.addColorStop(0, '#2c3e50');
            bgGradient.addColorStop(1, '#34495e');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // Health fill with color based on percentage
            const healthPercent = health / 100;
            let healthColor;
            if (healthPercent > 0.6) {
                healthColor = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
                healthColor.addColorStop(0, '#2ecc71');
                healthColor.addColorStop(1, '#27ae60');
            } else if (healthPercent > 0.3) {
                healthColor = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
                healthColor.addColorStop(0, '#f39c12');
                healthColor.addColorStop(1, '#e67e22');
            } else {
                healthColor = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
                healthColor.addColorStop(0, '#e74c3c');
                healthColor.addColorStop(1, '#c0392b');
            }

            ctx.fillStyle = healthColor;
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

            // Health bar border
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(barX, barY, barWidth, barHeight);

            // Shine effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight * 0.4);
        }

        // Draw effect indicators
        this.drawEffectIndicators(x, y, radius, activeEffects);
    }

    drawEffectAuras(x, y, radius, effects) {
        const ctx = this.ctx;

        // Shield aura
        if (effects.shield) {
            ctx.save();
            ctx.translate(x, y);

            const pulseSize = radius * (1.8 + Math.sin(this.effectAnimPhase) * 0.1);

            // Outer shield ring
            ctx.strokeStyle = 'rgba(78, 205, 196, 0.6)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
            ctx.stroke();

            // Inner shield ring
            ctx.strokeStyle = 'rgba(78, 205, 196, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, pulseSize * 0.9, 0, Math.PI * 2);
            ctx.stroke();

            // Hexagon shield pattern
            ctx.strokeStyle = 'rgba(78, 205, 196, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i + this.effectAnimPhase * 0.5;
                const hx = Math.cos(angle) * pulseSize;
                const hy = Math.sin(angle) * pulseSize;
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        }

        // Speed boost trail
        if (effects.speedBoost) {
            ctx.save();
            ctx.translate(x, y);

            for (let i = 0; i < 3; i++) {
                const offset = (i + 1) * 15;
                const alpha = 0.3 - i * 0.1;
                ctx.fillStyle = `rgba(255, 230, 109, ${alpha})`;
                ctx.beginPath();
                ctx.arc(-offset, 0, radius * 0.6, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    drawEffectIndicators(x, y, radius, effects) {
        const ctx = this.ctx;
        const indicators = [];

        // Collect active effects
        if (effects.rapidFire) indicators.push({ color: '#ff6b35', icon: '»' });
        if (effects.superBullet) indicators.push({ color: '#a8dadc', icon: '★' });
        if (effects.speedBoost) indicators.push({ color: '#ffe66d', icon: '⚡' });
        if (effects.shield) indicators.push({ color: '#4ecdc4', icon: '◈' });

        // Draw indicators above tank
        const indicatorSize = 12;
        const spacing = indicatorSize + 4;
        const startX = x - (indicators.length * spacing) / 2 + spacing / 2;
        const indicatorY = y - radius - 35;

        indicators.forEach((indicator, index) => {
            const ix = startX + index * spacing;

            // Glow effect
            ctx.shadowColor = indicator.color;
            ctx.shadowBlur = 8;

            // Circle background
            ctx.fillStyle = indicator.color;
            ctx.beginPath();
            ctx.arc(ix, indicatorY, indicatorSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // Icon
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(indicator.icon, ix, indicatorY);
        });

        ctx.shadowBlur = 0;
    }
}