// server/src/managers/PowerUpManager.js
import PowerUp, { POWERUP_TYPES } from '../model/PowerUp.js';
import { createId, collides } from '../model/utils.js';

export default class PowerUpManager {
    constructor(world) {
        this.world = world;
        this.powerUps = new Map();
        this.spawnInterval = 8000; // Spawn every 8 seconds
        this.lastSpawnTime = Date.now();
        this.maxPowerUps = 5; // Maximum power-ups on map at once
    }

    update(playerManager) {
        const now = Date.now();

        // Remove expired power-ups
        this.powerUps.forEach((powerUp, id) => {
            if (powerUp.isExpired()) {
                this.powerUps.delete(id);
            }
        });

        // Spawn new power-ups
        if (now - this.lastSpawnTime > this.spawnInterval && this.powerUps.size < this.maxPowerUps) {
            this.spawnRandomPowerUp();
            this.lastSpawnTime = now;
        }

        // Check for collisions with players
        if (playerManager && playerManager.players) {
            this.checkCollisions(playerManager);
        }
    }

    spawnRandomPowerUp() {
        // Random position on map (avoid edges)
        const margin = 100;
        const x = margin + Math.random() * (this.world.mapWidth - 2 * margin);
        const y = margin + Math.random() * (this.world.mapHeight - 2 * margin);

        // Random type
        const types = Object.values(POWERUP_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];

        // Check if position is valid (not on obstacles)
        const testPowerUp = { x, y, radius: 15 };
        for (const obs of this.world.obstacles) {
            if (collides(testPowerUp, obs)) {
                // Try again next time
                return;
            }
        }

        const powerUp = new PowerUp(createId(), x, y, type);
        this.powerUps.set(powerUp.id, powerUp);
        console.log(`[PowerUpManager] Spawned ${type} at (${Math.round(x)}, ${Math.round(y)})`);
    }

    checkCollisions(playerManager) {
        this.powerUps.forEach((powerUp, id) => {
            playerManager.players.forEach(player => {
                if (!player.active) return;

                // Check collision
                if (collides(player, powerUp)) {
                    this.applyPowerUp(player, powerUp);
                    this.powerUps.delete(id);
                    console.log(`[PowerUpManager] Player ${player.id} picked up ${powerUp.type}`);
                }
            });
        });
    }

    applyPowerUp(player, powerUp) {
        const props = powerUp.getEffectProperties();

        switch (powerUp.type) {
            case POWERUP_TYPES.RAPID_FIRE:
                player.activateEffect('rapidFire', props.duration, props.fireRateMultiplier);
                break;
            case POWERUP_TYPES.SHIELD:
                player.activateEffect('shield', props.duration, props.damageReduction);
                break;
            case POWERUP_TYPES.SPEED_BOOST:
                player.activateEffect('speedBoost', props.duration, props.speedMultiplier);
                break;
            case POWERUP_TYPES.SUPER_BULLET:
                player.activateEffect('superBullet', props.duration, props.damageMultiplier);
                break;
            case POWERUP_TYPES.HEALTH_PACK:
                player.heal(props.instantHeal);
                break;
        }
    }

    getState() {
        return Array.from(this.powerUps.values()).map(p => ({
            id: p.id,
            x: p.x,
            y: p.y,
            type: p.type
        }));
    }

    reset() {
        this.powerUps.clear();
        this.lastSpawnTime = Date.now();
    }
}
