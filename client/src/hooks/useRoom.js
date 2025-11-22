/**
 * Custom hook for managing room state
 */

import { useState, useCallback } from 'react';
import { logger } from '../utils/logger.js';
import apiService from '../services/apiService.js';

export const useRoom = () => {
    const [currentRoom, setCurrentRoom] = useState(null);
    const [roomList, setRoomList] = useState([]);

    const createRoom = useCallback((roomName) => {
        logger.info('Creating room:', roomName);
        apiService.createRoom(roomName);
    }, []);

    const joinRoom = useCallback((roomId) => {
        logger.info('Joining room:', roomId);
        apiService.joinRoom(roomId);
    }, []);

    const leaveRoom = useCallback(() => {
        logger.info('Leaving room');
        apiService.leaveRoom();
        setCurrentRoom(null);
    }, []);

    const switchTeam = useCallback((teamId) => {
        logger.info('Switching to team:', teamId);
        apiService.switchTeam(teamId);
    }, []);

    const startGame = useCallback(() => {
        if (!currentRoom) {
            logger.warn('Cannot start game: No current room');
            return;
        }
        logger.info('Starting game');
        apiService.startGame();
    }, [currentRoom]);

    const updateRoomList = useCallback((rooms) => {
        setRoomList(rooms);
    }, []);

    const updateCurrentRoom = useCallback((room) => {
        setCurrentRoom(room);
    }, []);

    const isInRoom = !!currentRoom;
    const isHost = currentRoom && currentRoom.hostId === currentRoom.playerId;

    return {
        currentRoom,
        roomList,
        createRoom,
        joinRoom,
        leaveRoom,
        switchTeam,
        startGame,
        updateRoomList,
        updateCurrentRoom,
        isInRoom,
        isHost,
    };
};

export default useRoom;
