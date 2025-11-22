/**
 * Application constants and configuration
 */

// Screen navigation constants
export const SCREENS = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    MAIN_MENU: 'MAIN_MENU',
    LOBBY: 'LOBBY',
    GAME: 'GAME',
};

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_DATA: 'authData',
    USER_PREFERENCES: 'userPreferences',
};

// WebSocket URL configuration
const WS_HOST = import.meta.env.VITE_WS_HOST || window.location.hostname;
const WS_PORT = import.meta.env.VITE_WS_PORT || '5174';
export const SOCKET_URL = `ws://${WS_HOST}:${WS_PORT}`;

// Debug mode
export const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

// Game configuration
export const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    FPS: 60,
};

// Avatar configuration
export const DEFAULT_AVATAR = '/avatar.png';
