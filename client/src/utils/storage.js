/**
 * Local storage utility functions
 * Provides safe access to localStorage with error handling
 */

import { logger } from './logger.js';

/**
 * Safely get an item from localStorage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {*} The parsed value or default value
 */
export const getStorageItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        logger.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
};

/**
 * Safely set an item in localStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {boolean} Success status
 */
export const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        logger.error(`Error writing to localStorage key "${key}":`, error);
        return false;
    }
};

/**
 * Remove an item from localStorage
 * @param {string} key - The storage key
 * @returns {boolean} Success status
 */
export const removeStorageItem = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        logger.error(`Error removing from localStorage key "${key}":`, error);
        return false;
    }
};

/**
 * Clear all items from localStorage
 * @returns {boolean} Success status
 */
export const clearStorage = () => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        logger.error('Error clearing localStorage:', error);
        return false;
    }
};
