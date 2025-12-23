/**
 * Custom hook for managing WebSocket connection
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { SocketClient } from '../game/SocketClient.js';
import { logger } from '../utils/logger.js';

export const useSocket = (url) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (socketRef.current) {
            return; // Already connected
        }

        const socket = new SocketClient(url);

        socket.onOpen(() => {
            logger.info('WebSocket connected');
            setIsConnected(true);
            setError(null);
        });

        socket.connect();
        socketRef.current = socket;

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                logger.info('WebSocket disconnecting');
                socketRef.current.close();
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, [url]);

    const send = useCallback((data) => {
        if (socketRef.current && isConnected) {
            socketRef.current.send(data);
        } else {
            logger.warn('Cannot send message: Socket not connected');
        }
    }, [isConnected]);

    const addMessageListener = useCallback((callback) => {
        if (socketRef.current) {
            const removeListener = socketRef.current.addMessageListener(callback);
            return removeListener;
        }
        return () => {};
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        error,
        send,
        addMessageListener,
    };
};

export default useSocket;
