/**
 * Server Entry Point (Refactored)
 * Initializes the game server with proper error handling and logging
 */

import http from 'http';
import mongoose from 'mongoose';
import NetworkManager from './src/NetworkManager.js';
import AuthManager from './src/managers/AuthManager.js';
import RoomManager from './src/managers/RoomManager.js';
import GameManager from './src/managers/GameManager.js';
import { PORT, MONGODB_URI } from './src/config/constants.js';
import logger from './src/utils/logger.js';

/**
 * Create HTTP server
 */
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Tank Game Server is running.\n');
});

/**
 * Initialize and start the server
 */
async function startServer() {
    try {
        // 1. Connect to MongoDB
        logger.info('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        logger.info('MongoDB connected successfully');

        // 2. Initialize managers
        const authManager = new AuthManager();
        const networkManager = new NetworkManager(server, authManager);
        const gameManager = new GameManager(networkManager);
        const roomManager = new RoomManager(gameManager, authManager);

        // 3. Set up manager dependencies
        networkManager.setManagers(roomManager, gameManager);
        roomManager.setNetworkManager(networkManager);

        // 4. Start network manager
        networkManager.start();

        // 5. Start HTTP server on all network interfaces (0.0.0.0)
        server.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server started successfully on http://0.0.0.0:${PORT}`);
            logger.info(`WebSocket server ready - clients will auto-connect based on their URL`);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

/**
 * Graceful shutdown handler
 */
function handleShutdown() {
    logger.info('Shutting down gracefully...');

    server.close(() => {
        logger.info('HTTP server closed');

        mongoose.connection.close().then(() => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        }).catch((err) => {
            logger.error('Error closing MongoDB connection:', err);
            process.exit(1);
        });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}

// Handle process termination signals
process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
startServer();
