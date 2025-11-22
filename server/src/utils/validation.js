/**
 * Server-side validation utilities
 */

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @throws {Error} If validation fails
 */
export const validateUsername = (username) => {
    if (!username || typeof username !== 'string') {
        throw new Error('Username is required');
    }
    if (username.length < 3 || username.length > 20) {
        throw new Error('Username must be between 3 and 20 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
    }
};

/**
 * Validate password format
 * @param {string} password - Password to validate
 * @throws {Error} If validation fails
 */
export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        throw new Error('Password is required');
    }
    if (password.length < 6 || password.length > 50) {
        throw new Error('Password must be between 6 and 50 characters');
    }
};

/**
 * Validate room name
 * @param {string} roomName - Room name to validate
 * @throws {Error} If validation fails
 */
export const validateRoomName = (roomName) => {
    if (!roomName || typeof roomName !== 'string') {
        throw new Error('Room name is required');
    }
    if (roomName.length < 3 || roomName.length > 30) {
        throw new Error('Room name must be between 3 and 30 characters');
    }
};

/**
 * Sanitize user input to prevent injection attacks
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate player data object
 * @param {object} player - Player object to validate
 * @throws {Error} If validation fails
 */
export const validatePlayerData = (player) => {
    if (!player || typeof player !== 'object') {
        throw new Error('Invalid player data');
    }
    if (!player.id || typeof player.id !== 'string') {
        throw new Error('Player ID is required');
    }
    if (!player.name || typeof player.name !== 'string') {
        throw new Error('Player name is required');
    }
};
