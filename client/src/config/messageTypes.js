/**
 * WebSocket message types for client-server communication
 * Ensures type safety and consistency across the application
 */

export const MESSAGE_TYPES = {
    // Authentication
    LOGIN: 'login',
    REGISTER: 'register',
    CHECK_AUTH: 'checkAuth',
    LOGIN_SUCCESS: 'loginSuccess',
    REGISTER_SUCCESS: 'registerSuccess',
    AUTH_SUCCESS: 'authSuccess',
    AUTH_ERROR: 'authError',
    LOGOUT: 'logout',

    // Room management
    CREATE_ROOM: 'createRoom',
    JOIN_ROOM: 'joinRoom',
    LEAVE_ROOM: 'leaveRoom',
    ROOM_LIST_DATA: 'roomListData',
    JOIN_ROOM_SUCCESS: 'joinRoomSuccess',
    LEAVE_ROOM_SUCCESS: 'leaveRoomSuccess',
    ROOM_UPDATE: 'roomUpdate',
    SWITCH_TEAM: 'switchTeam',
    GET_ROOM_LIST: 'getRoomList',

    // Game
    START_GAME: 'startGame',
    GAME_STARTED: 'gameStarted',
    GAME_UPDATE: 'update',
    GAME_END: 'gameEnd',
    PLAYER_INPUT: 'update',
    PLAYER_FIRE: 'fire',
    INITIAL_SETUP: 'initialSetup',

    // Leaderboard
    GET_LEADERBOARD: 'getLeaderboard',
    LEADERBOARD_DATA: 'leaderboardData',

    // Points
    POINTS_UPDATE: 'pointsUpdate',

    // Errors
    ERROR: 'error',
    LOBBY_ERROR: 'lobbyError',
};

export default MESSAGE_TYPES;
