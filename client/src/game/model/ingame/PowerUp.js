// client/src/game/model/ingame/PowerUp.js

export const POWERUP_TYPES = {
    RAPID_FIRE: 'rapidFire',
    SHIELD: 'shield',
    SPEED_BOOST: 'speedBoost',
    SUPER_BULLET: 'superBullet',
    HEALTH_PACK: 'healthPack'
};

export class PowerUp {
    constructor(ctx) {
        this.ctx = ctx;
        this.state = {
            id: null,
            x: 0,
            y: 0,
            type: POWERUP_TYPES.HEALTH_PACK
        };
        this.pulsePhase = 0;
    }

    updateState(serverState) {
        this.state.id = serverState.id;
        this.state.x = serverState.x;
        this.state.y = serverState.y;
        this.state.type = serverState.type;
    }

    draw() {
        const { x, y, type } = this.state;
        const ctx = this.ctx;

        // Pulse animation
        this.pulsePhase += 0.1;
        const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.15;
        const size = 30 * pulseScale;

        ctx.save();
        ctx.translate(x, y);

        // Glow effect
        ctx.shadowColor = this.getColorForType(type);
        ctx.shadowBlur = 20;

        // Outer ring
        ctx.strokeStyle = this.getColorForType(type);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        // Inner circle with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.5);
        gradient.addColorStop(0, this.getColorForType(type));
        gradient.addColorStop(1, this.getDarkColorForType(type));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Icon
        ctx.shadowBlur = 0;
        this.drawIcon(type, size * 0.3);

        ctx.restore();
    }

    drawIcon(type, size) {
        const ctx = this.ctx;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (type) {
            case POWERUP_TYPES.RAPID_FIRE:
                // Three bullets icon
                for (let i = 0; i < 3; i++) {
                    const offset = (i - 1) * size * 0.4;
                    ctx.beginPath();
                    ctx.arc(offset, 0, size * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;

            case POWERUP_TYPES.SHIELD:
                // Shield icon
                ctx.beginPath();
                ctx.moveTo(0, -size);
                ctx.quadraticCurveTo(size, -size * 0.5, size, 0);
                ctx.quadraticCurveTo(size, size * 0.5, 0, size);
                ctx.quadraticCurveTo(-size, size * 0.5, -size, 0);
                ctx.quadraticCurveTo(-size, -size * 0.5, 0, -size);
                ctx.stroke();
                break;

            case POWERUP_TYPES.SPEED_BOOST:
                // Lightning bolt icon
                ctx.beginPath();
                ctx.moveTo(-size * 0.3, -size);
                ctx.lineTo(size * 0.2, -size * 0.2);
                ctx.lineTo(-size * 0.1, -size * 0.2);
                ctx.lineTo(size * 0.3, size);
                ctx.lineTo(-size * 0.2, size * 0.2);
                ctx.lineTo(size * 0.1, size * 0.2);
                ctx.closePath();
                ctx.fill();
                break;

            case POWERUP_TYPES.SUPER_BULLET:
                // Star icon
                const spikes = 5;
                const outerRadius = size;
                const innerRadius = size * 0.5;
                ctx.beginPath();
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (i * Math.PI) / spikes - Math.PI / 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                break;

            case POWERUP_TYPES.HEALTH_PACK:
                // Plus/cross icon
                ctx.fillRect(-size * 0.3, -size, size * 0.6, size * 2);
                ctx.fillRect(-size, -size * 0.3, size * 2, size * 0.6);
                break;
        }
    }

    getColorForType(type) {
        switch (type) {
            case POWERUP_TYPES.RAPID_FIRE: return '#ff6b35';
            case POWERUP_TYPES.SHIELD: return '#4ecdc4';
            case POWERUP_TYPES.SPEED_BOOST: return '#ffe66d';
            case POWERUP_TYPES.SUPER_BULLET: return '#a8dadc';
            case POWERUP_TYPES.HEALTH_PACK: return '#06ffa5';
            default: return '#ffffff';
        }
    }

    getDarkColorForType(type) {
        switch (type) {
            case POWERUP_TYPES.RAPID_FIRE: return '#cc3300';
            case POWERUP_TYPES.SHIELD: return '#1d7874';
            case POWERUP_TYPES.SPEED_BOOST: return '#f4a261';
            case POWERUP_TYPES.SUPER_BULLET: return '#457b9d';
            case POWERUP_TYPES.HEALTH_PACK: return '#06cc84';
            default: return '#cccccc';
        }
    }
}
