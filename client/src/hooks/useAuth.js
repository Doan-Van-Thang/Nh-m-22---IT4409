/**
 * Custom hook for managing authentication state
 */

import { useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../config/constants.js';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage.js';
import { logger } from '../utils/logger.js';

export const useAuth = () => {
    const [auth, setAuth] = useState(() => {
        return getStorageItem(STORAGE_KEYS.AUTH_DATA, null);
    });

    const login = useCallback((authData) => {
        setAuth(authData);
        setStorageItem(STORAGE_KEYS.AUTH_DATA, authData);
        logger.info('User logged in:', authData.username);
    }, []);

    const logout = useCallback(() => {
        setAuth(null);
        removeStorageItem(STORAGE_KEYS.AUTH_DATA);
        logger.info('User logged out');
    }, []);

    const updateAuth = useCallback((updates) => {
        setAuth(prev => {
            const updated = { ...prev, ...updates };
            setStorageItem(STORAGE_KEYS.AUTH_DATA, updated);
            return updated;
        });
    }, []);

    const isAuthenticated = !!auth && !!auth.token;

    return {
        auth,
        login,
        logout,
        updateAuth,
        isAuthenticated,
    };
};

export default useAuth;
