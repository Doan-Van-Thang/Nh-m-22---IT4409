// File: client/src/components/GameView.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Game } from '../game/Game.js';
import MiniMap from './MiniMap.jsx';
import { getGameModeInfo } from '../config/gameModes.js';

const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

//  Nhận `socket` từ App.jsx
function GameView({ socket, navigateTo, SCREENS, initialMapData, initialPlayerSetup, initialGameState, toast }) {
    const canvasRef = useRef(null);
    const gameInstanceRef = useRef(null);
    const [countdown, setCountdown] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [gameStats, setGameStats] = useState({
        kills: 0,
        deaths: 0,
        score: 0,
        health: 100,
        ammo: 10,
        teamScore: { team1: 0, team2: 0 },
        timeRemaining: 0,
        isTeamMode: true
    });

    // Countdown timer before match starts
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !gameStarted) {
            setGameStarted(true);
            toast.success('Fight! 🎮');
        }
    }, [countdown, gameStarted, toast]);

    // Listen for game over event
    useEffect(() => {
        if (!socket) return;

        const handleGameOver = (data) => {
            if (data.type === 'gameOver') {
                setGameOver(true);
                setWinner(data.winner);

                // Navigate back to lobby after 5 seconds
                setTimeout(() => {
                    navigateTo(SCREENS.LOBBY);
                }, 5000);
            }
        };

        socket.addMessageListener(handleGameOver);
    }, [socket, navigateTo, SCREENS]);

    // Update stats from game instance (throttled to 200ms for performance)
    useEffect(() => {
        const statsInterval = setInterval(() => {
            if (gameInstanceRef.current) {
                const game = gameInstanceRef.current;
                const myTank = game.tanks.get(game.myPlayerId);
                const modeState = game.modeState;

                const currentModeInfo = getGameModeInfo(game.gameMode);
                const isTeamMode = currentModeInfo ? currentModeInfo.teams : true;
                const isCaptureFlag = game.gameMode === 'captureFlag';


                if (myTank && myTank.state) {
                    // Calculate team scores
                    let team1Kills = 0;
                    let team2Kills = 0;
                    if(isCaptureFlag){
                        team1Kills = modeState.captures ? modeState.captures[1] : 0;
                        team2Kills = modeState.captures ? modeState.captures[2] : 0;
                    }

                    else if (isTeamMode) {
                        game.tanks.forEach(tank => {
                            if (tank.state.teamId === 1) team1Kills += tank.state.kills || 0;
                            else if (tank.state.teamId === 2) team2Kills += tank.state.kills || 0;
                        });
                    }

                    setGameStats({
                        kills: myTank.state.kills || 0,
                        deaths: myTank.state.deaths || 0,
                        score: myTank.state.score || 0,
                        health: Math.max(0,myTank.state.health) || 100,
                        ammo: 10,
                        teamScore: { team1: team1Kills, team2: team2Kills },
                        timeRemaining: modeState.remainingTime,
                        isTeamMode: isTeamMode,
                        gameMode: game.gameMode

                    });
                }
            }
        }, 200);

        return () => clearInterval(statsInterval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !socket) return; // [SỬA] Chờ cả socket

        const ctx = canvas.getContext('2d', { alpha: false });

        // Optimize canvas rendering
        ctx.imageSmoothingEnabled = false;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.imageSmoothingEnabled = false;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        console.log("GameView: Khởi tạo Game...");
        // [SỬA] Truyền socket đã có vào Game
        gameInstanceRef.current = new Game(canvas, ctx, navigateTo, SCREENS, socket, initialMapData, initialPlayerSetup, initialGameState, toast);
        // [SỬA] Game.js bây giờ sẽ tự start
        gameInstanceRef.current.start();
        console.log("GameView: Game đã bắt đầu.");

        return () => {
            console.log("GameView: Hủy component, dừng game...");
            window.removeEventListener('resize', handleResize);
            if (gameInstanceRef.current) {
                gameInstanceRef.current.stop();
            }
        };
    }, [socket, navigateTo, SCREENS, initialMapData, initialPlayerSetup, initialGameState, toast]); // [SỬA] Thêm socket vào dependency

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black">
            <canvas id="gameCanvas" ref={canvasRef} className="absolute inset-0" />

            {/* Countdown Overlay */}
            {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
                    <div className="text-center animate-scale-in">
                        <div className="text-8xl font-black text-white mb-4 animate-bounce" style={{ textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(59,130,246,0.6)' }}>
                            {countdown}
                        </div>
                        <div className="text-3xl font-bold text-blue-400 animate-pulse">
                            Get Ready!
                        </div>
                    </div>
                </div>
            )}

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 animate-fade-in">
                    <div className="text-center p-8 bg-gradient-to-br from-gray-900 to-black rounded-3xl border-4 border-yellow-500 shadow-2xl animate-scale-in">
                        <div className="text-6xl mb-4">🏆</div>
                        <div className="text-5xl font-black text-yellow-400 mb-4" style={{ textShadow: '0 0 20px rgba(251,191,36,0.8)' }}>
                            VICTORY!
                        </div>
                        {winner && (
                            <div className="text-2xl text-white mb-6">
                                {winner.type === 'team' ? (
                                    <span className={winner.teamId === 1 ? 'text-red-400' : 'text-blue-400'}>
                                        Team {winner.teamId === 1 ? 'RED' : 'BLUE'} Wins!
                                    </span>
                                ) : (
                                    <span className="text-green-400">Player {winner.playerId} Wins!</span>
                                )}
                            </div>
                        )}
                        <div className="text-gray-400 text-sm animate-pulse">
                            Returning to lobby in 5 seconds...
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                <div className={`px-5 py-2 rounded-xl border-2 font-mono font-bold text-3xl backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-3 transition-all duration-300
                    ${gameStats.timeRemaining < 30
                        ? 'bg-red-900/60 border-red-500 text-red-100 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                        : 'bg-gray-900/60 border-blue-500/50 text-white'
                    }`}>
                    <span className="text-2xl">⏱️</span>
                    <span>{formatTime(gameStats.timeRemaining)}</span>
                </div>
            </div>

            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top HUD */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start animate-fade-in-down">
                    {/* Team Scores */}
                    {gameStats.isTeamMode ? (
                        <div className="glass-dark px-6 py-3 rounded-xl flex items-center gap-4">
            {/* ĐỘI ĐỎ */}
            <div className="text-center">
                <div className="text-red-400 font-bold text-2xl flex items-center justify-center gap-2">
                    {/* Nếu là Cướp Cờ thì hiện icon Cờ */}
                    {gameStats.gameMode === 'captureFlag' && <span className="text-xl">🚩</span>}
                    {gameStats.teamScore.team1}
                </div>
                <div className="text-xs text-gray-400 font-bold tracking-wider">
                    {/* Đổi chữ RED TEAM thành CAPTURES nếu là chế độ cờ */}
                    {gameStats.gameMode === 'captureFlag' ? 'CAPTURES' : 'RED TEAM'}
                </div>
            </div>

            {/* VS */}
            <div className="text-white text-xl opacity-50 font-bold mx-2">VS</div>

            {/* ĐỘI XANH */}
            <div className="text-center">
                <div className="text-blue-400 font-bold text-2xl flex items-center justify-center gap-2">
                    {gameStats.teamScore.team2}
                    {gameStats.gameMode === 'captureFlag' && <span className="text-xl">🚩</span>}
                </div>
                <div className="text-xs text-gray-400 font-bold tracking-wider">
                    {gameStats.gameMode === 'captureFlag' ? 'CAPTURES' : 'BLUE TEAM'}
                </div>
            </div>
        </div>
                    ) : (<div></div>)}
                    {/* Player Stats */}
                    <div className="glass-dark px-6 py-3 rounded-xl">
                        <div className="flex gap-6 text-white">
                            <div className="text-center">
                                <div className="text-green-400 font-bold text-xl">{gameStats.kills}</div>
                                <div className="text-xs text-gray-400">KILLS</div>
                            </div>
                            <div className="text-center">
                                <div className="text-red-400 font-bold text-xl">{gameStats.deaths}</div>
                                <div className="text-xs text-gray-400">DEATHS</div>
                            </div>
                            <div className="text-center">
                                <div className="text-yellow-400 font-bold text-xl">{gameStats.score}</div>
                                <div className="text-xs text-gray-400">SCORE</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom HUD */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end animate-fade-in-up">
                    {/* Health Bar */}
                    <div className="glass-dark px-6 py-3 rounded-xl min-w-[250px]">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">❤️</span>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm text-white mb-1">
                                    <span className="font-bold">HEALTH</span>
                                    <span className="font-bold">{Math.max(0, gameStats.health)}%</span>
                                </div>
                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${gameStats.health > 60 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                            gameStats.health > 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                                'bg-gradient-to-r from-red-500 to-red-700 animate-pulse'
                                            }`}
                                        style={{ width: `${Math.max(0, gameStats.health)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Ammo */}
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🔫</span>
                            <div className="text-white">
                                <span className="font-bold text-xl">{gameStats.ammo}</span>
                                <span className="text-gray-400 text-sm ml-1">/ 10</span>
                            </div>
                        </div>
                    </div>

                    {/* Mini-map with game instance */}
                    <MiniMap game={gameInstanceRef.current} size={160} />
                </div>

                {/* Center Crosshair */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 relative">
                        <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white/70 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-white/70 -translate-y-1/2"></div>
                        <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-white/70 -translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-white/70 -translate-x-1/2"></div>
                    </div>
                </div>

                {/* Kill Feed (Top Right) */}
                <div className="absolute top-20 right-4 space-y-2 w-64 animate-fade-in">
                    {/* Kill notifications will appear here */}
                </div>
            </div>
        </div>
    );
}

export default GameView;