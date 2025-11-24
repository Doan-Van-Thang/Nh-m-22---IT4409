# Power-Up System - Quick Testing Guide

## Starting the Game

### Server
```powershell
cd server
npm start
```

### Client
```powershell
cd client
npm run dev
```

## What to Look For

### 1. Power-Up Spawning (First 30 seconds)
✅ Power-ups appear randomly on the map every 8 seconds
✅ Maximum 5 power-ups visible at once
✅ Each has unique color and icon:
   - 🔴 Orange (Rapid Fire) - three bullets
   - 🛡️ Cyan (Shield) - shield shape
   - ⚡ Yellow (Speed Boost) - lightning bolt
   - ⭐ Light Blue (Super Bullet) - star
   - ➕ Green (Health Pack) - cross/plus

### 2. Collecting Power-Ups
✅ Drive tank over a power-up to collect it
✅ Power-up disappears immediately
✅ Small icon badges appear above your tank
✅ Visual effects activate on your tank

### 3. Shield Effect
**When active:**
- Cyan hexagonal barrier pulses around tank
- Two rings rotate slowly
- Tank takes 50% less damage
- Cyan ◈ badge appears above tank
- Lasts 8 seconds

**Test:** Get hit by enemy bullets - should survive longer

### 4. Speed Boost Effect
**When active:**
- Yellow trail particles behind tank
- Movement speed increases by 80%
- Yellow ⚡ badge appears above tank
- Lasts 12 seconds

**Test:** Move around - tank should be noticeably faster

### 5. Rapid Fire Effect
**When active:**
- Can shoot twice as fast (every 125ms instead of 250ms)
- Orange » badge appears above tank
- Hold fire button for continuous stream
- Lasts 10 seconds

**Test:** Hold down left mouse button - bullets fire rapidly

### 6. Super Bullet Effect
**When active:**
- Bullets glow CYAN instead of yellow
- Bullets deal triple damage (30 vs 10)
- Blue ★ badge appears above tank
- Cyan trails behind bullets
- Lasts 15 seconds

**Test:** Shoot enemy tank or base - damage increased significantly

### 7. Health Pack Effect
**When collected:**
- Instantly heals 50 HP
- No duration (instant effect)
- No badge indicator

**Test:** Take damage first, then collect - health bar refills

### 8. Multiple Effects
✅ Can have multiple power-ups active simultaneously
✅ All badges show above tank in a row
✅ Shield + Speed = defensive mobility
✅ Rapid Fire + Super Bullet = devastating firepower

**Test:** Collect multiple power-ups quickly

## Visual Checklist

### Power-Ups on Map
- [ ] Pulsing animation
- [ ] Glowing outer ring
- [ ] Clear icon in center
- [ ] Proper colors for each type
- [ ] Spawns avoid walls and bases

### Active Shield
- [ ] Hexagonal rotating pattern
- [ ] Two cyan rings pulsing
- [ ] Cyan ◈ badge
- [ ] Damage reduction working

### Active Speed Boost
- [ ] Yellow trail particles
- [ ] Yellow ⚡ badge
- [ ] Faster movement
- [ ] Trails follow tank direction

### Active Rapid Fire
- [ ] Orange » badge
- [ ] Faster shooting rate
- [ ] Cooldown reduction working

### Active Super Bullet
- [ ] Cyan bullet color (not yellow)
- [ ] Blue ★ badge
- [ ] Cyan glow and trail
- [ ] Triple damage applied

### Effect Badges
- [ ] Small circles above tank
- [ ] White icons on colored backgrounds
- [ ] Glow effects matching power-up color
- [ ] Properly centered above health bar

## Common Issues & Solutions

### Power-ups not appearing
- Check console for "[PowerUpManager] Spawned..." messages
- Wait 8 seconds for first spawn
- Check if map has clear areas (not all covered by obstacles)

### Effects not activating
- Verify collision detection (drive directly over power-up)
- Check console for pickup messages
- Ensure server GameEngine includes PowerUpManager

### Visual effects missing
- Verify client imported PowerUp.js in Game.js
- Check browser console for rendering errors
- Ensure Canvas 2D context is working

### Damage not changing
- Super bullets require pickup and 15 second duration
- Check bullet color (should be cyan)
- Verify server BulletManager applies damage multiplier
- Check shield effect reduces damage (not prevents it)

## Performance Testing

### Frame Rate
- Should maintain 60 FPS with 5 power-ups
- Multiple active effects should not cause lag
- Animation phases update smoothly

### Network Traffic
- Power-up state sent with every update (60/sec)
- Small payload (~50 bytes per power-up)
- Effect states boolean flags (minimal overhead)

## Debug Commands (Browser Console)

```javascript
// Check active power-ups
console.log(game.powerUps);

// Check player effects
console.log(game.tanks.get(game.myPlayerId).state.activeEffects);

// Check bullet damage
game.bullets.forEach(b => console.log(`Bullet ${b.state.id}: ${b.state.damage} damage`));
```

## Expected Game Balance

### Power Levels (1-5 scale)
- Rapid Fire: ⭐⭐⭐⭐ (Offensive)
- Shield: ⭐⭐⭐⭐ (Defensive)
- Speed Boost: ⭐⭐⭐ (Mobility)
- Super Bullet: ⭐⭐⭐⭐⭐ (High Impact)
- Health Pack: ⭐⭐⭐ (Recovery)

### Spawn Frequency
- 8 second intervals = ~7-8 power-ups per minute
- 5 max on map = good availability without clutter
- 30 second expiry = forces players to act

## Next Steps After Testing

1. **Balance adjustments** - modify durations/multipliers if needed
2. **Sound effects** - add pickup and activation sounds
3. **Particle effects** - enhance visual feedback
4. **Statistics tracking** - record power-up usage
5. **Team variations** - team-specific power-ups
6. **Map indicators** - minimap power-up markers
