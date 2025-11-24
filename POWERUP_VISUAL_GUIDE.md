# Power-Up Visual Reference Guide

## Power-Up Icons on Map

```
     RAPID FIRE              SHIELD             SPEED BOOST
    ╔═══════════╗        ╔═══════════╗        ╔═══════════╗
    ║  ┌─────┐  ║        ║  ┌─────┐  ║        ║  ┌─────┐  ║
    ║ ╱       ╲ ║        ║ ╱       ╲ ║        ║ ╱       ╲ ║
    ║(  ● ● ●  )║        ║(    ◈    )║        ║(    ⚡    )║
    ║ ╲       ╱ ║        ║ ╲       ╱ ║        ║ ╲       ╱ ║
    ║  └─────┘  ║        ║  └─────┘  ║        ║  └─────┘  ║
    ╚═══════════╝        ╚═══════════╝        ╚═══════════╝
      🔴 ORANGE              🛡️ CYAN              ⚡ YELLOW
    Fire Rate x2        Damage -50%          Speed x1.8

   SUPER BULLET           HEALTH PACK
    ╔═══════════╗        ╔═══════════╗
    ║  ┌─────┐  ║        ║  ┌─────┐  ║
    ║ ╱       ╲ ║        ║ ╱       ╲ ║
    ║(    ★    )║        ║(    ➕    )║
    ║ ╲       ╱ ║        ║ ╲       ╱ ║
    ║  └─────┘  ║        ║  └─────┘  ║
    ╚═══════════╝        ╚═══════════╝
    ⭐ LIGHT BLUE           🏥 GREEN
    Damage x3            Heal +50 HP
```

## Tank with Active Effects

```
WITHOUT EFFECTS:
    ┌─────────────────────────┐
    │    ████████████████     │  <- Health Bar (Green)
    │                         │
    │         ╔═══╗           │
    │         ║ ▄ ║═══        │  <- Tank + Cannon
    │         ╚═══╝           │
    │                         │
    └─────────────────────────┘


WITH SHIELD EFFECT:
    ┌─────────────────────────┐
    │    ████████████████     │  <- Health Bar (Green)
    │     » ◈ ⚡ ★            │  <- Effect Badges
    │                         │
    │      ╔════════╗          │
    │     ╱          ╲         │  <- Shield Hexagon (Cyan)
    │    ╱   ╔═══╗   ╲        │
    │   │    ║ ▄ ║═══ │       │  <- Tank + Cannon
    │    ╲   ╚═══╝   ╱        │
    │     ╲          ╱         │
    │      ╚════════╝          │
    └─────────────────────────┘


WITH SPEED BOOST:
    ┌─────────────────────────┐
    │    ████████████████     │  <- Health Bar (Green)
    │          ⚡             │  <- Speed Badge
    │                         │
    │   ○ ○ ○   ╔═══╗        │  <- Speed Trail (Yellow)
    │           ║ ▄ ║═══     │  <- Tank + Cannon
    │           ╚═══╝        │
    └─────────────────────────┘


WITH ALL EFFECTS:
    ┌─────────────────────────┐
    │    ████████████████     │  <- Health Bar (Green)
    │     » ◈ ⚡ ★            │  <- All 4 Badges
    │                         │
    │      ╔════════╗          │
    │     ╱          ╲         │  <- Shield Hexagon
    │  ○ │   ╔═══╗   │        │  <- Speed Trail + Tank
    │    │   ║ ▄ ║═══│        │  <- Cannon
    │     ╲  ╚═══╝   ╱        │
    │      ╚════════╝          │
    └─────────────────────────┘
```

## Bullet Comparison

```
NORMAL BULLET:
    ╔══════╗
    ║  ●   ║══→  Yellow glow
    ╚══════╝     Regular damage (10)


SUPER BULLET:
    ╔══════╗
    ║  ★   ║══→  Cyan glow
    ╚══════╝     Triple damage (30)
                 Faster speed (1.5x)
```

## Effect Badge Symbols

```
┌─────────────────────────────────────────┐
│  BADGE   │  SYMBOL  │  COLOR   │ MEANING│
├─────────────────────────────────────────┤
│   (1)    │    »     │  Orange  │ Rapid  │
│          │          │          │  Fire  │
├─────────────────────────────────────────┤
│   (2)    │    ◈     │   Cyan   │ Shield │
├─────────────────────────────────────────┤
│   (3)    │    ⚡     │  Yellow  │ Speed  │
├─────────────────────────────────────────┤
│   (4)    │    ★     │   Blue   │ Super  │
│          │          │          │ Bullet │
└─────────────────────────────────────────┘
```

## Map Layout Example

```
╔═════════════════════════════════════════════════════════════╗
║                                                             ║
║  [BASE 1]          ⚡                      ★        [BASE 2]║
║  TEAM RED          (speed)              (super)    TEAM BLUE║
║                                                             ║
║        ██                                    ██             ║
║        ██                                    ██             ║
║                  ◈                                          ║
║                 (shield)                                    ║
║                                                             ║
║                           ➕                                ║
║     ██                  (health)              ██            ║
║     ██                                        ██            ║
║                                                             ║
║              »                                              ║
║            (rapid)                                          ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝

Legend:
  [BASE] = Team base (destroy to win)
  ██ = Walls (obstacles)
  Colored circles = Power-ups (see icons above)
```

## Game State Visualization

```
┌──────────────────────────────────────────────────────────┐
│  GAME STATE: ACTIVE                                      │
├──────────────────────────────────────────────────────────┤
│  Active Power-Ups on Map: 5/5 (MAX)                     │
│  ├─ [1] Rapid Fire    @ (450, 300)  - 15s remaining     │
│  ├─ [2] Shield        @ (800, 450)  - 22s remaining     │
│  ├─ [3] Speed Boost   @ (1200, 600) - 8s remaining      │
│  ├─ [4] Super Bullet  @ (600, 750)  - 11s remaining     │
│  └─ [5] Health Pack   @ (1500, 900) - 27s remaining     │
├──────────────────────────────────────────────────────────┤
│  Player 1 (Team Red) Active Effects:                    │
│  ├─ Shield: 5.2s remaining        [████████░░] 52%      │
│  └─ Speed Boost: 9.8s remaining   [██████████] 82%      │
├──────────────────────────────────────────────────────────┤
│  Player 2 (Team Blue) Active Effects:                   │
│  ├─ Rapid Fire: 3.1s remaining    [███░░░░░░░] 31%      │
│  └─ Super Bullet: 12.4s remaining [████████░░] 83%      │
└──────────────────────────────────────────────────────────┘
```

## Animation Phases

```
POWER-UP PULSE (0.1 rad/frame):

Frame 1:     Frame 2:     Frame 3:     Frame 4:     Frame 5:
  ┌───┐       ┌────┐       ┌────┐       ┌────┐       ┌───┐
 ╱     ╲     ╱      ╲     ╱      ╲     ╱      ╲     ╱     ╲
│   ★   │   │   ★   │   │   ★   │   │   ★   │   │   ★   │
 ╲     ╱     ╲      ╱     ╲      ╱     ╲      ╱     ╲     ╱
  └───┘       └────┘       └────┘       └────┘       └───┘
 (1.0x)      (1.075x)     (1.15x)      (1.075x)     (1.0x)


SHIELD ROTATION (0.5 rad/frame):

  Frame 1        Frame 2        Frame 3        Frame 4
  ╱────╲        ╱────╲        ╱────╲        ╱────╲
 ╱      ╲      ╱      ╲      ╱      ╲      ╱      ╲
│   ╱╲   │    │  ──   │    │   ╲╱   │    │   │   │
│  ╱  ╲  │    │        │    │  ╱  ╲  │    │   │   │
 ╲      ╱      ╲      ╱      ╲      ╱      ╲      ╱
  ╲────╱        ╲────╱        ╲────╱        ╲────╱


SPEED TRAIL (3 particles fading):

    ○○○═══╗        ○ ○═══╗         ○═══╗          ═══╗
    trail ║ ▄ ║   trail ║ ▄ ║     trail║ ▄ ║       ║ ▄ ║
         ╚═══╝         ╚═══╝          ╚═══╝        ╚═══╝
    Moving →         Moving →        Moving →     Moving →
    (all visible)  (fading)        (far fade)   (no trail)
```

## Damage Visualization

```
NORMAL BULLET HIT:
  Tank HP: ████████░░ 80/100  →  ███████░░░ 70/100
           [Before]               [After -10 HP]


SUPER BULLET HIT:
  Tank HP: ████████░░ 80/100  →  █████░░░░░ 50/100
           [Before]               [After -30 HP]


SHIELDED TANK HIT (Normal Bullet):
  Shield: [Active]
  Tank HP: ████████░░ 80/100  →  ████████░░ 75/100
           [Before]               [After -5 HP (50% reduced)]


SHIELDED TANK HIT (Super Bullet):
  Shield: [Active]
  Tank HP: ████████░░ 80/100  →  ███████░░░ 65/100
           [Before]               [After -15 HP (50% reduced)]
```

## Color Palette Reference

```
╔════════════════════════════════════════════════╗
║  POWER-UP COLORS                               ║
╠════════════════════════════════════════════════╣
║  Rapid Fire:   #ff6b35 (Orange)                ║
║                #cc3300 (Dark Orange)            ║
║                                                 ║
║  Shield:       #4ecdc4 (Cyan)                  ║
║                #1d7874 (Dark Cyan)              ║
║                                                 ║
║  Speed Boost:  #ffe66d (Yellow)                ║
║                #f4a261 (Dark Yellow)            ║
║                                                 ║
║  Super Bullet: #a8dadc (Light Blue)            ║
║                #457b9d (Dark Blue)              ║
║                                                 ║
║  Health Pack:  #06ffa5 (Green)                 ║
║                #06cc84 (Dark Green)             ║
╚════════════════════════════════════════════════╝

╔════════════════════════════════════════════════╗
║  TEAM COLORS                                   ║
╠════════════════════════════════════════════════╣
║  Team 1 (Red):  #e74c3c (Body)                 ║
║                 #c0392b (Dark)                  ║
║                 #8b0000 (Track)                 ║
║                                                 ║
║  Team 2 (Blue): #3498db (Body)                 ║
║                 #2980b9 (Dark)                  ║
║                 #00008b (Track)                 ║
╚════════════════════════════════════════════════╝
```

## Quick Reference Card

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  POWER-UP QUICK REFERENCE                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  🔴 » = Rapid Fire    (Orange,  10s, x2 rate) ┃
┃  🛡️ ◈ = Shield        (Cyan,    8s, -50% dmg)┃
┃  ⚡ ⚡ = Speed Boost   (Yellow, 12s, +80% spd)┃
┃  ⭐ ★ = Super Bullet  (Blue,   15s, x3 dmg)  ┃
┃  🏥 ➕ = Health Pack   (Green, instant, +50hp)┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  SPAWN: Every 8 seconds | MAX: 5 on map       ┃
┃  EXPIRE: 30 seconds | STACK: Yes, all effects ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```
