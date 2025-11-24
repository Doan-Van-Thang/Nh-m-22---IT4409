// File: client/src/components/GameView.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Game } from '../game/Game.js';


//  Nhận `socket` từ App.jsx
function GameView({ socket, navigateTo, SCREENS, initialMapData, initialPlayerSetup, toast }) {
    const canvasRef = useRef(null);
    const gameInstanceRef = useRef(null);
    const [gameStats, setGameStats] = useState({
        kills: 0,
        deaths: 0,
        score: 0,
        health: 100,
        ammo: 10,
        teamScore: { team1: 0, team2: 0 }
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !socket) return; // [SỬA] Chờ cả socket

        const ctx = canvas.getContext('2d');
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        console.log("GameView: Khởi tạo Game...");
        // [SỬA] Truyền socket đã có vào Game
        gameInstanceRef.current = new Game(canvas, ctx, navigateTo, SCREENS, socket, initialMapData, initialPlayerSetup, toast);
        // [SỬA] Game.js bây giờ sẽ tự start
        gameInstanceRef.current.start();
        console.log("GameView: Game đã bắt đầu.");

        // Update stats periodically (you can hook this to actual game events)
        const statsInterval = setInterval(() => {
            if (gameInstanceRef.current && gameInstanceRef.current.player) {
                const player = gameInstanceRef.current.player;
                setGameStats(prev => ({
                    ...prev,
                    health: player.health || 100,
                    ammo: player.ammo || 10,
                    // Add more real-time stats from game
                }));
            }
        }, 100);

        return () => {
            console.log("GameView: Hủy component, dừng game...");
            clearInterval(statsInterval);
            window.removeEventListener('resize', handleResize);
            if (gameInstanceRef.current) {
                gameInstanceRef.current.stop();
            }
        };
    }, [socket, navigateTo, SCREENS, initialMapData, initialPlayerSetup, toast]); // [SỬA] Thêm socket vào dependency

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black">
            <canvas id="gameCanvas" ref={canvasRef} className="absolute inset-0" />

            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top HUD */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start animate-fade-in-down">
                    {/* Team Scores */}
                    <div className="glass-dark px-6 py-3 rounded-xl flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-red-400 font-bold text-2xl">{gameStats.teamScore.team1}</div>
                            <div className="text-xs text-gray-400">RED</div>
                        </div>
                        <div className="text-white text-xl">VS</div>
                        <div className="text-center">
                            <div className="text-blue-400 font-bold text-2xl">{gameStats.teamScore.team2}</div>
                            <div className="text-xs text-gray-400">BLUE</div>
                        </div>
                    </div>

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
                                    <span className="font-bold">{gameStats.health}%</span>
                                </div>
                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${gameStats.health > 60 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                                gameStats.health > 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                                    'bg-gradient-to-r from-red-500 to-red-700 animate-pulse'
                                            }`}
                                        style={{ width: `${gameStats.health}%` }}
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

                    {/* Mini-map placeholder */}
                    <div className="glass-dark p-3 rounded-xl">
                        <div className="w-40 h-40 bg-gray-800/50 rounded-lg border-2 border-gray-600 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-bold">
                                MINI MAP
                            </div>
                            {/* Add mini-map rendering here */}
                        </div>
                    </div>
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