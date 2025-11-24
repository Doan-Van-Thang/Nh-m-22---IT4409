/**
 * Game Mode Definitions
 * Each mode has unique mechanics, win conditions, and map requirements
 */

export const GAME_MODES = {
    CLASSIC: 'classic',
    DEATHMATCH: 'deathmatch',
    CAPTURE_FLAG: 'captureFlag',
    KING_OF_HILL: 'kingOfHill',
    BATTLE_ROYALE: 'battleRoyale',
};

export const GAME_MODE_CONFIG = {
    classic: {
        name: 'Classic Team Battle',
        description: 'Team deathmatch with bases. Destroy enemy base or reach kill limit.',
        teams: true,
        bases: true,
        respawn: true,
        killLimit: 50,
        timeLimit: 600, // 10 minutes
        scoreRules: {
            kill: 100,
            death: -50,
            baseDestroy: 1000,
        },
        winConditions: ['baseDestroyed', 'killLimit', 'timeLimit'],
    },
    deathmatch: {
        name: 'Free For All',
        description: 'Every player for themselves. First to reach kill limit wins.',
        teams: false,
        bases: false,
        respawn: true,
        killLimit: 20,
        timeLimit: 480, // 8 minutes
        scoreRules: {
            kill: 100,
            death: -50,
        },
        winConditions: ['killLimit', 'timeLimit'],
    },
    captureFlag: {
        name: 'Capture The Flag',
        description: 'Capture enemy flag and bring it to your base. First to 3 captures wins.',
        teams: true,
        bases: true,
        flags: true,
        respawn: true,
        captureLimit: 3,
        timeLimit: 720, // 12 minutes
        scoreRules: {
            kill: 50,
            death: -25,
            flagCapture: 500,
            flagReturn: 100,
        },
        winConditions: ['captureLimit', 'timeLimit'],
    },
    kingOfHill: {
        name: 'King of the Hill',
        description: 'Control the central zone. First team to 1000 points wins.',
        teams: true,
        bases: false,
        controlZone: true,
        respawn: true,
        pointLimit: 1000,
        timeLimit: 600, // 10 minutes
        controlPointsPerSecond: 10,
        scoreRules: {
            kill: 50,
            death: -25,
            controlTick: 10, // Points per second while controlling zone
        },
        winConditions: ['pointLimit', 'timeLimit'],
    },
    battleRoyale: {
        name: 'Battle Royale',
        description: 'Last tank standing wins. Safe zone shrinks over time.',
        teams: false,
        bases: false,
        respawn: false,
        shrinkingZone: true,
        timeLimit: 600, // 10 minutes
        shrinkStartTime: 60, // Start shrinking after 60 seconds
        shrinkInterval: 30, // Shrink every 30 seconds
        damagePerSecond: 10, // Damage outside safe zone
        scoreRules: {
            kill: 200,
            survival: 100, // Bonus for surviving
        },
        winConditions: ['lastStanding', 'timeLimit'],
    },
};

/**
 * Get game mode configuration
 */
export function getGameModeConfig(mode) {
    return GAME_MODE_CONFIG[mode] || GAME_MODE_CONFIG.classic;
}

/**
 * Validate game mode
 */
export function isValidGameMode(mode) {
    return Object.values(GAME_MODES).includes(mode);
}
