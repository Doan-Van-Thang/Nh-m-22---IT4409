/**
 * Refactored App Component
 * Uses Context providers and custom hooks for better state management
 */

import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu.jsx';
import GameView from './components/GameView.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import RegisterScreen from './components/RegisterScreen.jsx';
import LobbyScreen from './components/LobbyScreen.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastContainer } from './components/Toast.jsx';
import { AuthProvider, useAuthContext } from './contexts/AuthContext.jsx';
import { SocketProvider, useSocketContext } from './contexts/SocketContext.jsx';
import { useToast } from './hooks/useToast.js';
import { SCREENS } from './config/constants.js';
import MESSAGE_TYPES from './config/messageTypes.js';
import { logger } from './utils/logger.js';

/**
 * Main application component with authentication and socket logic
 */
function AppContent() {
    const { auth, login, logout, isAuthenticated } = useAuthContext();
    const { socket, send, addMessageListener, isConnected } = useSocketContext();
    const { toasts, removeToast, toast } = useToast();

    const [screen, setScreen] = useState(SCREENS.LOGIN);
    const [roomList, setRoomList] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [initialPlayerSetup, setInitialPlayerSetup] = useState(null);
    const [initialMapData, setInitialMapData] = useState(null);

    // Handle socket messages
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (data) => {
            logger.debug('Received message:', data.type);

            switch (data.type) {
                case MESSAGE_TYPES.LOGIN_SUCCESS:
                    handleLoginSuccess(data);
                    break;

                case MESSAGE_TYPES.AUTH_SUCCESS:
                    handleAuthSuccess(data);
                    break;

                case MESSAGE_TYPES.REGISTER_SUCCESS:
                    setScreen(SCREENS.LOGIN);
                    toast.success('Registration successful! Please log in.');
                    break;

                case MESSAGE_TYPES.AUTH_ERROR:
                    handleAuthError(data);
                    break;

                case MESSAGE_TYPES.ROOM_LIST_DATA:
                    setRoomList(data.rooms);
                    break;

                case MESSAGE_TYPES.JOIN_ROOM_SUCCESS:
                case MESSAGE_TYPES.ROOM_UPDATE:
                    setCurrentRoom(data.room);
                    setScreen(SCREENS.LOBBY);
                    break;

                case MESSAGE_TYPES.LEAVE_ROOM_SUCCESS:
                    setCurrentRoom(null);
                    setScreen(SCREENS.MAIN_MENU);
                    break;

                case MESSAGE_TYPES.GAME_STARTED:
                    setInitialMapData(data.mapData);
                    setScreen(SCREENS.GAME);
                    break;

                case MESSAGE_TYPES.LEADERBOARD_DATA:
                    setLeaderboard(data.payload);
                    break;

                case MESSAGE_TYPES.POINTS_UPDATE:
                    // Update user's points in real-time
                    if (auth && auth.id === data.playerId) {
                        const updatedAuth = { ...auth, highScore: data.newPoints };
                        login(updatedAuth);
                    }
                    break;

                case MESSAGE_TYPES.INITIAL_SETUP:
                    setInitialPlayerSetup(data);
                    break;

                case 'gameOver':
                    // Handle game over - show winner info, then transition
                    if (data.winner) {
                        const winnerText = data.winner.type === 'team'
                            ? `Team ${data.winner.teamId === 1 ? 'RED' : 'BLUE'} wins!`
                            : `Player wins!`;
                        toast.success(`🏆 ${winnerText}`);
                    }

                    // Wait for victory screen, then return to lobby
                    setTimeout(() => {
                        if (data.room) {
                            setCurrentRoom(data.room);
                        }
                        setCurrentScreen(SCREENS.LOBBY);
                    }, 5000);
                    break;

                default:
                    // Game messages will be handled by Game.js
                    break;
            }
        };

        addMessageListener(handleMessage);
    }, [socket, addMessageListener]);

    // Check authentication on socket connect
    useEffect(() => {
        if (isConnected && auth?.token) {
            logger.info('Checking authentication');
            send({ type: MESSAGE_TYPES.CHECK_AUTH, token: auth.token });
        }
    }, [isConnected, auth?.token, send]);

    // Redirect to main menu if already authenticated
    useEffect(() => {
        if (isAuthenticated && screen === SCREENS.LOGIN) {
            setScreen(SCREENS.MAIN_MENU);
        }
    }, [isAuthenticated, screen]);

    const handleLoginSuccess = (data) => {
        const authData = {
            token: data.token,
            username: data.username,
            highScore: data.highScore,
            name: data.name,
            province: data.province,
            avatarUrl: data.avatarUrl,
            id: data.id,
        };
        login(authData);
        setScreen(SCREENS.MAIN_MENU);
        toast.success('Login successful!');
    };

    const handleAuthSuccess = (data) => {
        logger.info('Authentication token verified successfully');
        const authData = {
            token: data.token,
            username: data.username,
            highScore: data.highScore,
            id: data.id,
            name: data.name,
            avatarUrl: data.avatarUrl,
        };
        login(authData);
        setScreen(SCREENS.MAIN_MENU);
    };

    const handleAuthError = (data) => {
        toast.error(`Error: ${data.message}`);
        if (isAuthenticated) {
            handleLogout();
        }
    };

    const handleLogin = (username, password) => {
        send({ type: MESSAGE_TYPES.LOGIN, username, password });
    };

    const handleRegister = (username, password, name, province, avatarUrl) => {
        send({
            type: MESSAGE_TYPES.REGISTER,
            username,
            password,
            name,
            province,
            avatarUrl,
        });
    };

    const handleLogout = () => {
        logout();
        setScreen(SCREENS.LOGIN);
    };

    const handleCreateRoom = (roomConfig) => {
        // roomConfig contains: { name, gameMode, maxPlayers, bettingPoints }
        send({
            type: MESSAGE_TYPES.CREATE_ROOM,
            name: roomConfig.name,
            gameMode: roomConfig.gameMode,
            maxPlayers: roomConfig.maxPlayers,
            bettingPoints: roomConfig.bettingPoints
        });
    };

    const handleJoinRoom = (roomId) => {
        send({ type: MESSAGE_TYPES.JOIN_ROOM, roomId });
    };

    const navigateTo = (targetScreen) => setScreen(targetScreen);

    const renderScreen = () => {
        switch (screen) {
            case SCREENS.LOGIN:
                return (
                    <LoginScreen
                        onLogin={handleLogin}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                    />
                );

            case SCREENS.REGISTER:
                return (
                    <RegisterScreen
                        onRegister={handleRegister}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                        toast={toast}
                    />
                );

            case SCREENS.LOBBY:
                return (
                    <LobbyScreen
                        auth={auth}
                        room={currentRoom}
                        socket={socket}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                        toast={toast}
                    />
                );

            case SCREENS.MAIN_MENU:
                return (
                    <MainMenu
                        auth={auth}
                        onCreateRoom={handleCreateRoom}
                        onJoinRoom={handleJoinRoom}
                        roomList={roomList}
                        onLogout={handleLogout}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                        socket={socket}
                        leaderboard={leaderboard}
                    />
                );

            case SCREENS.GAME:
                return (
                    <GameView
                        socket={socket}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                        initialPlayerSetup={initialPlayerSetup}
                        initialMapData={initialMapData}
                        toast={toast}
                    />
                );

            default:
                return (
                    <LoginScreen
                        onLogin={handleLogin}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                    />
                );
        }
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            {renderScreen()}
        </div>
    );
}

/**
 * App wrapper with providers
 */
function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <SocketProvider>
                    <AppContent />
                </SocketProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
