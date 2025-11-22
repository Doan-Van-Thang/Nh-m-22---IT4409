/**
 * Server-side constants and configuration
 */

import dotenv from 'dotenv';
dotenv.config();

// Server configuration
export const PORT = process.env.PORT || 5174;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// MongoDB configuration
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tank-game';

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Game configuration
export const GAME_CONFIG = {
    TICK_RATE: parseInt(process.env.GAME_TICK_RATE || '60', 10),
    MAX_PLAYERS_PER_ROOM: parseInt(process.env.MAX_PLAYERS_PER_ROOM || '10', 10),
};

// Logging configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
