/**
 * Server-side utility functions
 */

/**
 * Generate a unique room ID
 * @returns {string} Unique room ID
 */
export const generateRoomId = () => {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a unique player ID
 * @returns {string} Unique player ID
 */
export const generatePlayerId = () => {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate distance between two points
 * @param {object} point1 - First point {x, y}
 * @param {object} point2 - Second point {x, y}
 * @returns {number} Distance
 */
export const calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if a point is within bounds
 * @param {object} point - Point {x, y}
 * @param {object} bounds - Bounds {minX, maxX, minY, maxY}
 * @returns {boolean} True if within bounds
 */
export const isWithinBounds = (point, bounds) => {
    return (
        point.x >= bounds.minX &&
        point.x <= bounds.maxX &&
        point.y >= bounds.minY &&
        point.y <= bounds.maxY
    );
};

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Format error for client response
 * @param {Error} error - Error object
 * @returns {object} Formatted error
 */
export const formatError = (error) => {
    return {
        message: error.message || 'An error occurred',
        code: error.code || 'INTERNAL_ERROR',
    };
};

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
