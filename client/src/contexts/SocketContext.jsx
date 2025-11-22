/**
 * Socket Context Provider
 */

import React, { createContext, useContext } from 'react';
import useSocket from '../hooks/useSocket.js';
import { SOCKET_URL } from '../config/constants.js';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socket = useSocket(SOCKET_URL);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within SocketProvider');
    }
    return context;
};

export default SocketContext;
