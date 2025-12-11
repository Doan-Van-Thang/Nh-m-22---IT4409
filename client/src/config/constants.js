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
// 1. Tự động xác định giao thức: HTTPS thì dùng WSS, HTTP thì dùng WS
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

// 2. Lấy Host: Ưu tiên config, nếu không có thì lấy hostname hiện tại
const host = import.meta.env.VITE_WS_HOST || window.location.hostname;

// 3. Xử lý Port:
// - Nếu có cấu hình VITE_WS_PORT trong .env -> Dùng port đó
// - Nếu đang chạy HTTPS (Production) -> KHÔNG dùng port (để Nginx lo qua cổng 443)
// - Nếu đang chạy HTTP (Localhost) -> Mặc định dùng :5174
const portEnv = import.meta.env.VITE_WS_PORT;
let port = '';

if (portEnv) {
    port = `:${portEnv}`;
} else if (window.location.protocol !== 'https:') {
    port = ':5174';
}

export const SOCKET_URL = `${protocol}//${host}${port}`;

console.log(`[Config] WebSocket URL: ${SOCKET_URL}`);

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
