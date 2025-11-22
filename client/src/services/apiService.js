/**
 * API Service Layer
 * Centralized communication with the server
 */

import MESSAGE_TYPES from '../config/messageTypes.js';
import { logger } from '../utils/logger.js';

class ApiService {
    constructor() {
        this.socket = null;
    }

    /**
     * Initialize the API service with a socket instance
     * @param {SocketClient} socket - Socket client instance
     */
    initialize(socket) {
        this.socket = socket;
        logger.info('API Service initialized');
    }

    /**
     * Send a message via socket
     * @param {object} message - Message to send
     * @private
     */
    _send(message) {
        if (!this.socket) {
            logger.error('API Service not initialized');
            throw new Error('API Service not initialized');
        }
        this.socket.send(message);
    }

    // Authentication APIs
    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     */
    login(username, password) {
        logger.debug('API: Login request', username);
        this._send({
            type: MESSAGE_TYPES.LOGIN,
            username,
            password,
        });
    }

    /**
     * Register new user
     * @param {object} userData - User registration data
     */
    register({ username, password, name, province, avatarUrl }) {
        logger.debug('API: Register request', username);
        this._send({
            type: MESSAGE_TYPES.REGISTER,
            username,
            password,
            name,
            province,
            avatarUrl,
        });
    }

    /**
     * Check authentication token
     * @param {string} token - Auth token
     */
    checkAuth(token) {
        logger.debug('API: Check auth');
        this._send({
            type: MESSAGE_TYPES.CHECK_AUTH,
            token,
        });
    }

    // Room APIs
    /**
     * Get list of rooms
     */
    getRoomList() {
        logger.debug('API: Get room list');
        this._send({
            type: MESSAGE_TYPES.GET_ROOM_LIST,
        });
    }

    /**
     * Create a new room
     * @param {string} roomName - Room name
     */
    createRoom(roomName) {
        logger.debug('API: Create room', roomName);
        this._send({
            type: MESSAGE_TYPES.CREATE_ROOM,
            name: roomName,
        });
    }

    /**
     * Join an existing room
     * @param {string} roomId - Room ID
     */
    joinRoom(roomId) {
        logger.debug('API: Join room', roomId);
        this._send({
            type: MESSAGE_TYPES.JOIN_ROOM,
            roomId,
        });
    }

    /**
     * Leave current room
     */
    leaveRoom() {
        logger.debug('API: Leave room');
        this._send({
            type: MESSAGE_TYPES.LEAVE_ROOM,
        });
    }

    /**
     * Switch team in room
     * @param {number} teamId - Team ID
     */
    switchTeam(teamId) {
        logger.debug('API: Switch team', teamId);
        this._send({
            type: MESSAGE_TYPES.SWITCH_TEAM,
            teamId,
        });
    }

    /**
     * Start game in room
     */
    startGame() {
        logger.debug('API: Start game');
        this._send({
            type: MESSAGE_TYPES.START_GAME,
        });
    }

    // Game APIs
    /**
     * Send player input update
     * @param {object} inputData - Input data
     */
    sendPlayerUpdate(inputData) {
        this._send({
            type: MESSAGE_TYPES.PLAYER_INPUT,
            ...inputData,
        });
    }

    /**
     * Send fire action
     * @param {object} fireData - Fire data
     */
    sendFireAction(fireData) {
        this._send({
            type: MESSAGE_TYPES.PLAYER_FIRE,
            ...fireData,
        });
    }

    // Leaderboard APIs
    /**
     * Get leaderboard data
     */
    getLeaderboard() {
        logger.debug('API: Get leaderboard');
        this._send({
            type: MESSAGE_TYPES.GET_LEADERBOARD,
        });
    }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
