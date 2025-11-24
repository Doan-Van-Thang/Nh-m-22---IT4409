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
import { getStorageItem, setStorageItem, removeStorageItem } from './utils/storage.js';

/**
 * Main application component with authentication and socket logic
 */
function AppContent() {
    const { auth, login, logout, isAuthenticated } = useAuthContext();
    const { socket, send, addMessageListener, isConnected } = useSocketContext();
    const { toasts, removeToast, toast } = useToast();

    const [screen, setScreen] = useState(() => {
        // Try to restore previous screen state on reload
        const savedState = getStorageItem('gameState');
        if (savedState?.screen && savedState.screen !== SCREENS.LOGIN && savedState.screen !== SCREENS.REGISTER) {
            return savedState.screen;
        }
        return SCREENS.LOGIN;
    });
    const [isRestoringState, setIsRestoringState] = useState(() => {
        const savedState = getStorageItem('gameState');
        return !!(savedState?.screen && savedState.screen !== SCREENS.LOGIN);
    });
    const [authVerified, setAuthVerified] = useState(false);
    const [roomList, setRoomList] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(() => {
        const savedState = getStorageItem('gameState');
        return savedState?.currentRoom || null;
    });
    const [leaderboard, setLeaderboard] = useState([]);
    const [initialPlayerSetup, setInitialPlayerSetup] = useState(() => {
        const savedState = getStorageItem('gameState');
        // Don't restore player setup from localStorage - it will be refreshed from server
        // Only use it if we're NOT in restoring state (i.e., normal game start)
        if (savedState?.screen && (savedState.screen === SCREENS.GAME || savedState.screen === SCREENS.LOBBY)) {
            // We're restoring - don't use old player setup
            return null;
        }
        return savedState?.initialPlayerSetup || null;
    });
    const [initialMapData, setInitialMapData] = useState(() => {
        const savedState = getStorageItem('gameState');
        return savedState?.initialMapData || null;
    });
    const [initialGameState, setInitialGameState] = useState(null);

    // Save game state to localStorage for recovery on reload
    useEffect(() => {
        if (screen === SCREENS.GAME || screen === SCREENS.LOBBY) {
            setStorageItem('gameState', {
                screen,
                currentRoom,
                initialPlayerSetup,
                initialMapData
            });
        } else if (screen === SCREENS.MAIN_MENU || screen === SCREENS.LOGIN) {
            // Clear game state when returning to main menu or login
            removeStorageItem('gameState');
        }
    }, [screen, currentRoom, initialPlayerSetup, initialMapData]);

    // Request state sync when reconnecting with saved game state
    useEffect(() => {
        if (isConnected && authVerified && isRestoringState) {
            const savedState = getStorageItem('gameState');

            // If we were in a game or lobby, request state sync
            if (savedState?.currentRoom?.id) {
                logger.info('Requesting room state sync after reconnect');
                send({
                    type: 'syncRoomState',
                    roomId: savedState.currentRoom.id
                });
            } else {
                // No room to restore, stop restoring
                setIsRestoringState(false);
            }
        }
    }, [isConnected, authVerified, isRestoringState, send]);

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
                    removeStorageItem('gameState');
                    break;

                case 'roomStateSync':
                    // Handle room state sync after reconnect
                    console.log('[App.jsx] Received roomStateSync:', data);
                    setIsRestoringState(false); // Clear restoring flag
                    if (data.room) {
                        setCurrentRoom(data.room);
                        if (data.room.status === 'in-game' && data.mapData) {
                            setInitialMapData(data.mapData);
                            // Set player setup data for game restoration
                            if (data.playerSetup) {
                                console.log('[App.jsx] Setting player setup:', data.playerSetup);
                                setInitialPlayerSetup(data.playerSetup);
                            } else {
                                console.warn('[App.jsx] No playerSetup in response!');
                            }
                            // Store game state to pass to Game instance
                            if (data.gameState) {
                                console.log('[App.jsx] Setting game state with', data.gameState.players?.length, 'players');
                                setInitialGameState(data.gameState);
                            } else {
                                console.warn('[App.jsx] No gameState in response!');
                            }
                            setScreen(SCREENS.GAME);
                            toast.info('Reconnected to game');
                        } else {
                            setScreen(SCREENS.LOBBY);
                            toast.info('Reconnected to lobby');
                        }
                    } else {
                        // Room no longer exists
                        removeStorageItem('gameState');
                        setScreen(SCREENS.MAIN_MENU);
                        toast.warning('Room no longer exists');
                    }
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

    // Redirect to main menu if already authenticated (but not if restoring game state)
    useEffect(() => {
        if (isAuthenticated && screen === SCREENS.LOGIN && !isRestoringState) {
            const savedState = getStorageItem('gameState');
            // Only redirect to main menu if there's no saved game state
            if (!savedState?.screen) {
                setScreen(SCREENS.MAIN_MENU);
            }
        }
    }, [isAuthenticated, screen, isRestoringState]);

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
        setAuthVerified(true); // Mark authentication as complete
        // Only set screen to main menu if not restoring game state
        if (!isRestoringState) {
            setScreen(SCREENS.MAIN_MENU);
        }
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
                // Don't render game until we have player setup data
                // This ensures reconnected players have their ID before Game initializes
                if (!initialPlayerSetup) {
                    return (
                        <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-white text-xl">Loading game...</p>
                            </div>
                        </div>
                    );
                }
                return (
                    <GameView
                        socket={socket}
                        navigateTo={navigateTo}
                        SCREENS={SCREENS}
                        initialPlayerSetup={initialPlayerSetup}
                        initialMapData={initialMapData}
                        initialGameState={initialGameState}
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
