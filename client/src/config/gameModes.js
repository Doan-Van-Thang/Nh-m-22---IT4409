/**
 * Client-side Game Mode Definitions
 * Matches server-side game modes
 */

export const GAME_MODES = {
    CLASSIC: 'classic',
    DEATHMATCH: 'deathmatch',
    CAPTURE_FLAG: 'captureFlag',
    KING_OF_HILL: 'kingOfHill',
    BATTLE_ROYALE: 'battleRoyale',
};

export const GAME_MODE_INFO = {
    classic: {
        name: 'Classic Team Battle',
        description: 'Team deathmatch with bases',
        icon: '🏰',
        players: '2-8',
        teams: true,
    },
    deathmatch: {
        name: 'Free For All',
        description: 'Every player for themselves',
        icon: '⚔️',
        players: '2-8',
        teams: false,
    },
    captureFlag: {
        name: 'Capture The Flag',
        description: 'Capture enemy flag',
        icon: '🚩',
        players: '4-8',
        teams: true,
    },
    kingOfHill: {
        name: 'King of the Hill',
        description: 'Control the central zone',
        icon: '👑',
        players: '4-8',
        teams: true,
    },
    battleRoyale: {
        name: 'Battle Royale',
        description: 'Last tank standing',
        icon: '💥',
        players: '4-10',
        teams: false,
    },
};

export function getGameModeInfo(mode) {
    return GAME_MODE_INFO[mode] || GAME_MODE_INFO.classic;
}
