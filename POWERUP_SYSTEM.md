# Power-Up System Documentation

## Overview
The power-up system adds collectible items to the game map that provide temporary advantages to players. Power-ups spawn randomly across the map and disappear after 30 seconds if not collected.

## Power-Up Types

### 🔴 Rapid Fire (Orange)
- **Effect**: Doubles fire rate for 10 seconds
- **Visual**: Orange glowing icon with three bullets
- **Tank Indicator**: Orange » icon above tank
- **Usage**: Hold down fire button to unleash rapid bullets

### 🛡️ Shield (Cyan)
- **Effect**: Reduces incoming damage by 50% for 8 seconds
- **Visual**: Cyan shield icon with hexagonal pattern
- **Tank Indicator**: Animated hexagonal shield aura around tank
- **Usage**: Tank takes half damage from all sources

### ⚡ Speed Boost (Yellow)
- **Effect**: Increases movement speed by 80% for 12 seconds
- **Visual**: Yellow lightning bolt icon
- **Tank Indicator**: Yellow speed trail particles behind tank
- **Usage**: Move faster to dodge bullets and reach objectives

### ⭐ Super Bullet (Light Blue)
- **Effect**: Triple bullet damage for 15 seconds
- **Visual**: Light blue star icon
- **Tank Indicator**: Blue ★ icon above tank
- **Bullet Appearance**: Cyan glowing bullets instead of yellow
- **Usage**: Deal massive damage to enemies and bases

### ➕ Health Pack (Green)
- **Effect**: Instantly restores 50 HP
- **Visual**: Green cross/plus icon
- **Tank Indicator**: None (instant effect)
- **Usage**: Collect to heal when low on health

## Visual Features

### Power-Up Rendering
- **Pulsing Animation**: Power-ups pulse and glow to attract attention
- **Color-Coded**: Each type has unique colors for easy identification
- **Icon System**: Clear symbols indicate the power-up type
- **Glow Effects**: Radial gradient shadows for visibility

### Active Effect Indicators
Players with active power-ups display:
1. **Small icon badges** above their tank showing active effects
2. **Visual auras** (shield shows hexagonal barrier, speed shows trails)
3. **Color-coded bullets** (super bullets are cyan instead of yellow)
4. **Animated effects** that pulse and rotate for visual clarity

## Gameplay Mechanics

### Spawning
- Power-ups spawn every **8 seconds** on random map locations
- Maximum of **5 power-ups** on map simultaneously
- Spawn positions avoid obstacles and bases
- Power-ups expire after **30 seconds** if not collected

### Collection
- Automatic pickup on collision with tank
- Effects apply immediately (except health pack)
- Multiple effects can be active simultaneously
- Effect timers are independent

### Duration & Cooldowns
- **Rapid Fire**: 10 seconds, cooldown calculated per shot (125ms per bullet)
- **Shield**: 8 seconds, reduces damage continuously
- **Speed Boost**: 12 seconds, modifies base movement speed
- **Super Bullet**: 15 seconds, applies to each bullet fired
- **Health Pack**: Instant, no duration

### Combat Interactions
- Super bullets deal **30 damage** to tanks (vs 10 normal)
- Super bullets deal **30 damage** to bases (vs 10 normal)
- Shield reduces all damage by 50% (5 damage from normal bullets)
- Shield + health pack = powerful defensive combo
- Rapid fire + super bullet = devastating offensive combo

## Technical Implementation

### Server-Side
**Files Modified/Created:**
- `server/src/model/PowerUp.js` - PowerUp entity model
- `server/src/managers/PowerUpManager.js` - Spawning and collision logic
- `server/src/model/User.js` - Player effect tracking and activation
- `server/src/managers/BulletManager.js` - Super bullet damage system
- `server/src/GameEngine.js` - PowerUpManager integration

**Key Systems:**
- Effect tracking with timestamps for expiration
- Collision detection using existing `collides()` utility
- State synchronization in game update loop
- Damage multiplier system for super bullets

### Client-Side
**Files Modified/Created:**
- `client/src/game/model/ingame/PowerUp.js` - PowerUp rendering
- `client/src/game/Game.js` - PowerUp synchronization
- `client/src/game/model/ingame/Tank.js` - Effect indicators and auras
- `client/src/game/model/ingame/Bullet.js` - Super bullet visuals

**Rendering Features:**
- Canvas 2D with radial gradients
- Pulsing animations using sine waves
- Icon drawing system for each power-up type
- Effect aura rendering (shield hexagon, speed trails)
- Badge indicators with unicode symbols

## Network Protocol

### Game State Updates
Power-ups added to existing `update` message:
```javascript
{
    type: 'update',
    players: [...],
    bullets: [...],
    bases: [...],
    powerUps: [
        { id, x, y, type }
    ]
}
```

### Player State Extensions
Player objects now include active effects:
```javascript
{
    id, teamId, x, y, rotation, health, level, radius,
    activeEffects: {
        rapidFire: boolean,
        shield: boolean,
        speedBoost: boolean,
        superBullet: boolean
    }
}
```

### Bullet State Extensions
Bullets now include damage values:
```javascript
{
    id, x, y, rotation, playerId,
    damage: number  // 10 normal, 30 super
}
```

## Strategy Tips

### Offensive Strategies
- **Aggressive Push**: Speed Boost + Rapid Fire to overwhelm enemies
- **Sniper Setup**: Super Bullet for maximum damage per shot
- **Base Rush**: Super Bullet to quickly destroy enemy base

### Defensive Strategies
- **Tank Build**: Health Pack + Shield for maximum survivability
- **Area Denial**: Rapid Fire to control chokepoints
- **Escape Artist**: Speed Boost to retreat when outnumbered

### Team Coordination
- **Support Role**: Collect shields and stay near base
- **Assault Role**: Prioritize rapid fire and super bullets
- **Scout Role**: Use speed boosts to gather power-ups for team

## Performance Considerations
- Power-up spawning limited to prevent map clutter
- Effect timers automatically clean up expired effects
- Efficient collision detection reuses existing systems
- Canvas rendering optimized with save/restore states
- No memory leaks - expired power-ups removed from maps

## Future Enhancement Ideas
- Team-colored power-ups (only collectible by specific team)
- Rare legendary power-ups with stronger effects
- Power-up drop zones that spawn multiple items
- Pickup sound effects and visual explosions
- Kill streak power-ups as rewards
- Power-up statistics tracking
