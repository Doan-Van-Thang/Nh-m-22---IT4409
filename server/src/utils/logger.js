/**
 * Server-side logging utility
 */

import { LOG_LEVEL } from '../config/constants.js';

const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

class Logger {
    constructor() {
        this.level = LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.info;
    }

    error(...args) {
        if (this.level >= LOG_LEVELS.error) {
            console.error('[ERROR]', new Date().toISOString(), ...args);
        }
    }

    warn(...args) {
        if (this.level >= LOG_LEVELS.warn) {
            console.warn('[WARN]', new Date().toISOString(), ...args);
        }
    }

    info(...args) {
        if (this.level >= LOG_LEVELS.info) {
            console.info('[INFO]', new Date().toISOString(), ...args);
        }
    }

    debug(...args) {
        if (this.level >= LOG_LEVELS.debug) {
            console.log('[DEBUG]', new Date().toISOString(), ...args);
        }
    }

    setLevel(level) {
        this.level = LOG_LEVELS[level] || LOG_LEVELS.info;
    }
}

export const logger = new Logger();
export default logger;
