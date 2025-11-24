// server/src/model/PowerUp.js

export const POWERUP_TYPES = {
    RAPID_FIRE: 'rapidFire',
    SHIELD: 'shield',
    SPEED_BOOST: 'speedBoost',
    SUPER_BULLET: 'superBullet',
    HEALTH_PACK: 'healthPack'
};

export default class PowerUp {
    constructor(id, x, y, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 15; // Collision radius
        this.createdAt = Date.now();
        this.duration = 30000; // Power-up lasts 30 seconds on map
    }

    isExpired() {
        return Date.now() - this.createdAt > this.duration;
    }

    // Get effect properties based on type
    getEffectProperties() {
        switch (this.type) {
            case POWERUP_TYPES.RAPID_FIRE:
                return { duration: 10000, fireRateMultiplier: 2 };
            case POWERUP_TYPES.SHIELD:
                return { duration: 8000, damageReduction: 0.5 };
            case POWERUP_TYPES.SPEED_BOOST:
                return { duration: 12000, speedMultiplier: 1.8 };
            case POWERUP_TYPES.SUPER_BULLET:
                return { duration: 15000, damageMultiplier: 3 };
            case POWERUP_TYPES.HEALTH_PACK:
                return { instantHeal: 50 };
            default:
                return {};
        }
    }
}
