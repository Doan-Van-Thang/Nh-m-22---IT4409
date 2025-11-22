/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} { valid: boolean, message: string }
 */
export const validateUsername = (username) => {
    if (!username || username.trim().length === 0) {
        return { valid: false, message: 'Username is required' };
    }
    if (username.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters' };
    }
    if (username.length > 20) {
        return { valid: false, message: 'Username must be less than 20 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    return { valid: true, message: '' };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, message: string }
 */
export const validatePassword = (password) => {
    if (!password || password.length === 0) {
        return { valid: false, message: 'Password is required' };
    }
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    if (password.length > 50) {
        return { valid: false, message: 'Password must be less than 50 characters' };
    }
    return { valid: true, message: '' };
};

/**
 * Validate room name
 * @param {string} roomName - Room name to validate
 * @returns {object} { valid: boolean, message: string }
 */
export const validateRoomName = (roomName) => {
    if (!roomName || roomName.trim().length === 0) {
        return { valid: false, message: 'Room name is required' };
    }
    if (roomName.length < 3) {
        return { valid: false, message: 'Room name must be at least 3 characters' };
    }
    if (roomName.length > 30) {
        return { valid: false, message: 'Room name must be less than 30 characters' };
    }
    return { valid: true, message: '' };
};

/**
 * Validate player name
 * @param {string} name - Name to validate
 * @returns {object} { valid: boolean, message: string }
 */
export const validatePlayerName = (name) => {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Name is required' };
    }
    if (name.length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' };
    }
    if (name.length > 50) {
        return { valid: false, message: 'Name must be less than 50 characters' };
    }
    return { valid: true, message: '' };
};
