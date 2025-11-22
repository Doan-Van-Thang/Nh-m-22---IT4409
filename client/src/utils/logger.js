/**
 * Logging utility with configurable levels
 * Can be toggled via environment variables
 */

import { DEBUG_MODE } from '../config/constants.js';

const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
};

class Logger {
    constructor() {
        this.level = DEBUG_MODE ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
    }

    error(...args) {
        if (this.level >= LOG_LEVELS.ERROR) {
            console.error('[ERROR]', ...args);
        }
    }

    warn(...args) {
        if (this.level >= LOG_LEVELS.WARN) {
            console.warn('[WARN]', ...args);
        }
    }

    info(...args) {
        if (this.level >= LOG_LEVELS.INFO) {
            console.info('[INFO]', ...args);
        }
    }

    debug(...args) {
        if (this.level >= LOG_LEVELS.DEBUG) {
            console.log('[DEBUG]', ...args);
        }
    }

    setLevel(level) {
        this.level = level;
    }
}

export const logger = new Logger();
export default logger;
