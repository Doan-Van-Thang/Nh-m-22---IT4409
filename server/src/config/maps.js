/**
 * Map Configurations for Different Game Modes
 * Each game mode has its own unique map layout with fixed positions
 */

export const MAPS = {
    classic: {
        name: 'Classic Arena',
        width: 2000,
        height: 2000,
        bases: [
            { team: 'red', x: 200, y: 200, width: 100, height: 100 },
            { team: 'blue', x: 1700, y: 1700, width: 100, height: 100 },
        ],
        spawnPoints: {
            red: [
                { x: 250, y: 250 },
                { x: 300, y: 200 },
                { x: 200, y: 300 },
                { x: 350, y: 250 },
            ],
            blue: [
                { x: 1750, y: 1750 },
                { x: 1700, y: 1800 },
                { x: 1800, y: 1700 },
                { x: 1650, y: 1750 },
            ],
        },
        obstacles: [
            // Center fortress
            { x: 900, y: 900, width: 200, height: 200 },
            { x: 950, y: 850, width: 100, height: 50 },
            { x: 950, y: 1100, width: 100, height: 50 },

            // Corner bunkers
            { x: 500, y: 500, width: 150, height: 150 },
            { x: 1350, y: 1350, width: 150, height: 150 },
            { x: 500, y: 1350, width: 150, height: 150 },
            { x: 1350, y: 500, width: 150, height: 150 },

            // Side walls
            { x: 200, y: 950, width: 100, height: 100 },
            { x: 1700, y: 950, width: 100, height: 100 },
            { x: 950, y: 200, width: 100, height: 100 },
            { x: 950, y: 1700, width: 100, height: 100 },
        ],
    },

    deathmatch: {
        name: 'Chaos Arena',
        width: 1800,
        height: 1800,
        bases: [],
        spawnPoints: [
            { x: 300, y: 300 },
            { x: 1500, y: 300 },
            { x: 300, y: 1500 },
            { x: 1500, y: 1500 },
            { x: 900, y: 300 },
            { x: 900, y: 1500 },
            { x: 300, y: 900 },
            { x: 1500, y: 900 },
        ],
        obstacles: [
            // Central maze
            { x: 800, y: 800, width: 200, height: 50 },
            { x: 800, y: 950, width: 200, height: 50 },
            { x: 750, y: 850, width: 50, height: 200 },
            { x: 1000, y: 850, width: 50, height: 200 },

            // Scattered cover
            { x: 400, y: 400, width: 100, height: 100 },
            { x: 1300, y: 400, width: 100, height: 100 },
            { x: 400, y: 1300, width: 100, height: 100 },
            { x: 1300, y: 1300, width: 100, height: 100 },

            // Cross pattern
            { x: 600, y: 850, width: 150, height: 50 },
            { x: 1050, y: 850, width: 150, height: 50 },
            { x: 850, y: 600, width: 50, height: 150 },
            { x: 850, y: 1050, width: 50, height: 150 },
        ],
    },

    captureFlag: {
        name: 'Flag Arena',
        width: 2400,
        height: 1600,
        bases: [
            { team: 'red', x: 100, y: 700, width: 150, height: 150 },
            { team: 'blue', x: 2150, y: 700, width: 150, height: 150 },
        ],
        flags: [
            { team: 'red', x: 175, y: 775, homeX: 175, homeY: 775 },
            { team: 'blue', x: 2225, y: 775, homeX: 2225, homeY: 775 },
        ],
        spawnPoints: {
            red: [
                { x: 175, y: 600 },
                { x: 175, y: 950 },
                { x: 300, y: 775 },
                { x: 250, y: 650 },
            ],
            blue: [
                { x: 2225, y: 600 },
                { x: 2225, y: 950 },
                { x: 2100, y: 775 },
                { x: 2150, y: 650 },
            ],
        },
        obstacles: [
            // Center barrier
            { x: 1150, y: 600, width: 100, height: 400 },

            // Left side maze
            { x: 600, y: 300, width: 200, height: 100 },
            { x: 600, y: 1200, width: 200, height: 100 },
            { x: 400, y: 700, width: 100, height: 200 },

            // Right side maze
            { x: 1600, y: 300, width: 200, height: 100 },
            { x: 1600, y: 1200, width: 200, height: 100 },
            { x: 1900, y: 700, width: 100, height: 200 },

            // Top and bottom barriers
            { x: 1000, y: 100, width: 400, height: 80 },
            { x: 1000, y: 1420, width: 400, height: 80 },
        ],
    },

    kingOfHill: {
        name: 'Hill Arena',
        width: 1600,
        height: 1600,
        bases: [],
        controlZone: {
            x: 700,
            y: 700,
            width: 200,
            height: 200,
            captureRadius: 250,
        },
        spawnPoints: {
            red: [
                { x: 200, y: 200 },
                { x: 200, y: 1400 },
                { x: 100, y: 800 },
                { x: 300, y: 800 },
            ],
            blue: [
                { x: 1400, y: 200 },
                { x: 1400, y: 1400 },
                { x: 1500, y: 800 },
                { x: 1300, y: 800 },
            ],
        },
        obstacles: [
            // Hill walls (around control zone)
            { x: 650, y: 650, width: 50, height: 50 },
            { x: 900, y: 650, width: 50, height: 50 },
            { x: 650, y: 900, width: 50, height: 50 },
            { x: 900, y: 900, width: 50, height: 50 },

            // Entrance gaps
            { x: 750, y: 600, width: 100, height: 50 }, // Top entrance
            { x: 750, y: 950, width: 100, height: 50 }, // Bottom entrance

            // Side cover
            { x: 400, y: 700, width: 100, height: 200 },
            { x: 1100, y: 700, width: 100, height: 200 },

            // Corner obstacles
            { x: 300, y: 300, width: 80, height: 80 },
            { x: 1220, y: 300, width: 80, height: 80 },
            { x: 300, y: 1220, width: 80, height: 80 },
            { x: 1220, y: 1220, width: 80, height: 80 },
        ],
    },

    battleRoyale: {
        name: 'Battleground',
        width: 2500,
        height: 2500,
        bases: [],
        safeZone: {
            initialRadius: 1200,
            minRadius: 300,
            centerX: 1250,
            centerY: 1250,
        },
        spawnPoints: [
            { x: 300, y: 300 },
            { x: 2200, y: 300 },
            { x: 300, y: 2200 },
            { x: 2200, y: 2200 },
            { x: 1250, y: 300 },
            { x: 1250, y: 2200 },
            { x: 300, y: 1250 },
            { x: 2200, y: 1250 },
            { x: 800, y: 800 },
            { x: 1700, y: 800 },
        ],
        obstacles: [
            // Scattered buildings
            { x: 400, y: 400, width: 150, height: 150 },
            { x: 1950, y: 400, width: 150, height: 150 },
            { x: 400, y: 1950, width: 150, height: 150 },
            { x: 1950, y: 1950, width: 150, height: 150 },

            // Center compound
            { x: 1100, y: 1100, width: 300, height: 50 },
            { x: 1100, y: 1350, width: 300, height: 50 },
            { x: 1100, y: 1100, width: 50, height: 300 },
            { x: 1350, y: 1100, width: 50, height: 300 },

            // Random cover
            { x: 800, y: 600, width: 100, height: 100 },
            { x: 1600, y: 600, width: 100, height: 100 },
            { x: 800, y: 1800, width: 100, height: 100 },
            { x: 1600, y: 1800, width: 100, height: 100 },
            { x: 600, y: 1200, width: 100, height: 100 },
            { x: 1800, y: 1200, width: 100, height: 100 },
        ],
    },
};

/**
 * Get map configuration for a specific game mode
 */
export function getMapForMode(gameMode) {
    return MAPS[gameMode] || MAPS.classic;
}

/**
 * Get spawn point for a player
 */
export function getSpawnPoint(map, team = null, playerIndex = 0) {
    if (map.spawnPoints.red && map.spawnPoints.blue) {
        // Team-based spawning
        const teamSpawns = map.spawnPoints[team] || map.spawnPoints.red;
        return teamSpawns[playerIndex % teamSpawns.length];
    } else {
        // FFA spawning
        const spawns = map.spawnPoints;
        return spawns[playerIndex % spawns.length];
    }
}

/**
 * Check if position is inside safe zone (for Battle Royale)
 */
export function isInSafeZone(x, y, safeZone, currentRadius) {
    if (!safeZone) return true;

    const dx = x - safeZone.centerX;
    const dy = y - safeZone.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= currentRadius;
}
