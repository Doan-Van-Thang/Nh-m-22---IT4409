// Xóa hết import cũ
import World from './managers/World.js';
import PlayerManager from './managers/PlayerManager.js';
import BulletManager from './managers/BulletManager.js';
import PowerUpManager from './managers/PowerUpManager.js';
import { getGameModeConfig, GAME_MODES, GAME_MODE_CONFIG } from './config/gameModes.js';
import { getMapForMode, isInSafeZone } from './config/maps.js';

export default class GameEngine {
    constructor(gameMode = GAME_MODES.CLASSIC) {
        // 1. Store game mode and configuration
        this.gameMode = gameMode;
        this.modeConfig = getGameModeConfig(gameMode);
        this.mapConfig = getMapForMode(gameMode);

        // 2. Initialize managers with mode-specific map
        this.gameState = "running";
        this.roomId = null;
        this.world = new World(this.mapConfig, this.gameMode);
        this.bulletManager = new BulletManager(this.world);
        this.playerManager = new PlayerManager(this.world, this.bulletManager);
        this.powerUpManager = new PowerUpManager(this.world);

        this.networkManager = null;

        // 3. Mode-specific state
        this.gameStartTime = Date.now();
        this.teamScores = { 1: 0, 2: 0 }; // For team-based modes
        this.playerScores = new Map(); // For FFA modes

        // Battle Royale specific
        this.safeZoneRadius = this.mapConfig.safeZone?.initialRadius || 0;
        this.lastShrinkTime = Date.now();

        // King of the Hill specific
        this.controllingTeam = null;
        this.hillControlTime = { 1: 0, 2: 0 };

        // Capture the Flag specific
        this.flags = [];
        if (this.gameMode === GAME_MODES.CAPTURE_FLAG && this.mapConfig.flags) {
            this.initFlags();
        }
        this.captures = { 1: 0, 2: 0 };

        console.log(`[GameEngine] Initialized with mode: ${gameMode}`);
    }
    initFlags() {
        this.flags = this.mapConfig.flags.map(f => ({
            id: `flag_${f.team}`,
            teamId: f.team === 'red' ? 1 : 2, // Đội sở hữu cờ
            x: f.x,
            y: f.y,
            homeX: f.x,
            homeY: f.y,
            state: 'AT_BASE',
            carrierId: null,
            radius: 80 // Bán kính va chạm
        }));
        console.log("[GameEngine] Flags initialized:", this.flags);
    }
    setNetworkManager(manager, roomId) {
        this.networkManager = manager;
        this.roomId = roomId;
    }

    start() {
        this.loopInterval = setInterval(() => {
            this.loop();
        }, 1000 / 60);
        console.log("[GameEngine] Vòng lặp game đã bắt đầu.");
    }

    stop() {
        if (this.loopInterval) {
            clearInterval(this.loopInterval);
            this.loopInterval = null;
            console.log(`[GameEngine] Đã dừng vòng lặp game ${this.roomId}.`);
        }
    }

    loop() {
        if (this.gameState === "game_over") return;

        // Update managers
        this.playerManager.update();
        this.bulletManager.update(this.playerManager);
        this.powerUpManager.update(this.playerManager);

        // Mode-specific updates
        this.updateModeLogic();

        // Check win conditions
        this.checkWinConditions();

        // Broadcast state
        if (this.networkManager) {
            this.networkManager.broadcastGameState(this.roomId, this.getGameState());
        }
    }

    updateModeLogic() {
        const now = Date.now();
        const gameTime = (now - this.gameStartTime) / 1000; // seconds

        switch (this.gameMode) {
            case GAME_MODES.BATTLE_ROYALE:
                this.updateBattleRoyale(gameTime);
                break;
            case GAME_MODES.KING_OF_HILL:
                this.updateKingOfHill();
                break;
            case GAME_MODES.CAPTURE_FLAG:
                this.updateCaptureTheFlag();
                break;
        }
    }

    updateBattleRoyale(gameTime) {
        if (!this.mapConfig.safeZone) return;

        // Start shrinking after configured time
        if (gameTime >= this.modeConfig.shrinkStartTime) {
            const timeSinceLastShrink = Date.now() - this.lastShrinkTime;

            if (timeSinceLastShrink >= this.modeConfig.shrinkInterval * 1000) {
                // Shrink the safe zone
                const shrinkAmount = (this.mapConfig.safeZone.initialRadius - this.mapConfig.safeZone.minRadius) / 10;
                this.safeZoneRadius = Math.max(
                    this.mapConfig.safeZone.minRadius,
                    this.safeZoneRadius - shrinkAmount
                );
                this.lastShrinkTime = Date.now();
                console.log(`[BattleRoyale] Safe zone shrunk to ${this.safeZoneRadius}`);
            }

            // Damage players outside safe zone
            const players = this.playerManager.getAllPlayers();
            for (const player of players) {
                if (!isInSafeZone(player.x, player.y, this.mapConfig.safeZone, this.safeZoneRadius)) {
                    player.takeDamage(this.modeConfig.damagePerSecond / 60); // Per frame damage
                }
            }
        }
    }

    updateKingOfHill() {
        if (!this.mapConfig.controlZone) return;

        const zone = this.mapConfig.controlZone;
        const playersInZone = { 1: 0, 2: 0 };

        // Count players in control zone
        const players = this.playerManager.getAllPlayers();
        for (const player of players) {
            const dx = player.x - (zone.x + zone.width / 2);
            const dy = player.y - (zone.y + zone.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= zone.captureRadius && player.teamId) {
                playersInZone[player.teamId]++;
            }
        }

        // Determine controlling team
        if (playersInZone[1] > playersInZone[2]) {
            this.controllingTeam = 1;
            this.teamScores[1] += this.modeConfig.controlPointsPerSecond / 60;
        } else if (playersInZone[2] > playersInZone[1]) {
            this.controllingTeam = 2;
            this.teamScores[2] += this.modeConfig.controlPointsPerSecond / 60;
        } else {
            this.controllingTeam = null; // Contested
        }
    }

    updateCaptureTheFlag() {
        if (this.flags.length === 0) return;
        const players = this.playerManager.getAllPlayers();
        this.flags.forEach(flag => {
            if (flag.state === 'CARRIED') {
                const carrier = this.playerManager.players.get(flag.carrierId);
                if (!carrier || !carrier.active || carrier.health <= 0) {
                    flag.state = 'DROPPED';
                    flag.carrierId = null;
                    console.log(`[CTF] Flag ${flag.teamId} dropped!`);
                    return;
                }
                flag.x = carrier.x; // Vị trí cờ cập nhật theo người cầm
                flag.y = carrier.y;

                //Kiểm tra logic ghi điểm
                if (flag.teamId !== carrier.teamId) {
                    const myBase = this.world.bases.find(b => b.teamId === carrier.teamId);
                    if (myBase) {
                        const dx = carrier.x - (myBase.x + myBase.width / 2);
                        const dy = carrier.y - (myBase.y + myBase.height / 2);
                        const distToBase = Math.sqrt(dx * dx + dy * dy);
                        if (distToBase <= 100) {
                            this.handleFlagCapture(carrier, flag);
                        }

                    }
                }
            }
            else {
                for (const player of players) {
                    if(!player.active) continue;
                    const dx = player.x - flag.x;
                    const dy = player.y - flag.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if(distance < (player.radius + flag.radius)) {
                        // Chạm cờ địch -> nhặt cờ
                        if (flag.teamId !== player.teamId) {
                            flag.state = 'CARRIED';
                            flag.carrierId = player.id;
                            console.log(`[CTF] Player ${player.id} picked up flag ${flag.teamId}`);
                        }
                        //chạm vào cờ đội mình nhưng bị rơi -> về lại base
                        else if (player.teamId === flag.teamId && flag.state === 'DROPPED') {
                            this.returnFlagHome(flag);
                            // Cộng điểm phục hồi cho người chơi
                            player.score += this.modeConfig.scoreRules.flagReturn;
                            console.log(`[CTF] Player ${player.name} returned flag home!`);

                        }
                    }
                }
            }
        });
    }
    handleFlagCapture(player, flag) {
        this.captures[player.teamId]++;
        player.score += this.modeConfig.scoreRules.flagCapture;
        console.log(`[CTF] Player ${player.teamId} SCORED! Total: ${this.captures[player.teamId]}`);
        this.returnFlagHome(flag);
    }

    returnFlagHome(flag) {
        flag.state = 'AT_BASE';
        flag.x = flag.homeX;
        flag.y = flag.homeY;
        flag.carrierId = null;
    }

    checkWinConditions() {
        const conditions = this.modeConfig.winConditions;

        for (const condition of conditions) {
            switch (condition) {
                case 'baseDestroyed':
                    if (this.modeConfig.bases) {
                        const bases = this.world.getBases();
                        for (const base of bases) {
                            if (base.health <= 0) {
                                const winningTeam = base.teamId === 1 ? 2 : 1;
                                this.endGame(winningTeam, 'baseDestroyed');
                                return;
                            }
                        }
                    }
                    break;

                case 'killLimit':
                    if (this.modeConfig.teams) {
                        // Team kill limit
                        if (this.teamScores[1] >= this.modeConfig.killLimit * 100) {
                            this.endGame(1, 'killLimit');
                            return;
                        }
                        if (this.teamScores[2] >= this.modeConfig.killLimit * 100) {
                            this.endGame(2, 'killLimit');
                            return;
                        }
                    } else {
                        // FFA kill limit
                        const players = this.playerManager.getAllPlayers();
                        for (const player of players) {
                            if (player.kills >= this.modeConfig.killLimit) {
                                this.endGame(player.id, 'killLimit');
                                return;
                            }
                        }
                    }
                    break;

                case 'pointLimit':
                    if (this.teamScores[1] >= this.modeConfig.pointLimit) {
                        this.endGame(1, 'pointLimit');
                        return;
                    }
                    if (this.teamScores[2] >= this.modeConfig.pointLimit) {
                        this.endGame(2, 'pointLimit');
                        return;
                    }
                    break;

                case 'captureLimit':
                    if (this.captures[1] >= this.modeConfig.captureLimit) {
                        this.endGame(1, 'captureLimit');
                        return;
                    }
                    if (this.captures[2] >= this.modeConfig.captureLimit) {
                        this.endGame(2, 'captureLimit');
                        return;
                    }
                    break;

                case 'lastStanding':
                    const alivePlayers = this.playerManager.getAllPlayers().filter(p => p.health > 0);
                    if (alivePlayers.length === 1) {
                        this.endGame(alivePlayers[0].id, 'lastStanding');
                        return;
                    }
                    break;

                case 'timeLimit':
                    const gameTime = (Date.now() - this.gameStartTime) / 1000;
                    if (gameTime >= this.modeConfig.timeLimit) {
                        this.endGame(null, 'timeLimit');
                        return;
                    }
                    break;
            }
        }
    }

    //Xử lí game khi game kết thúc
    endGame(winner, reason) {
        this.gameState = "game_over";

        let winnerInfo;
        if (typeof winner === 'number' && winner <= 2) {
            // Team win
            winnerInfo = { type: 'team', teamId: winner };
            console.log(`GAME OVER! Team ${winner} wins by ${reason}`);
        } else if (typeof winner === 'string') {
            // Player win (FFA)
            const playerObj = this.playerManager.players.get(winner);
            const playerName = playerObj ? playerObj.name : 'winner';
            winnerInfo = { type: 'player', playerId: winner, playerName: playerName };
            console.log(`GAME OVER! Player ${winner} wins by ${reason}`);
        } else {
            // Time limit or draw
            if (this.modeConfig.teams) {
                const winningTeam = this.teamScores[1] > this.teamScores[2] ? 1 : 2;
                winnerInfo = { type: 'team', teamId: winningTeam };
                console.log(`GAME OVER! Team ${winningTeam} wins by score`);
            } else {
                // Find player with highest score
                let highestScore = 0;
                let winnerId = null;
                for (const [playerId, score] of this.playerScores.entries()) {
                    if (score > highestScore) {
                        highestScore = score;
                        winnerId = playerId;
                    }
                }
                const playerObj = this.playerManager.players.get(winnerId);
                const playerName = playerObj ? playerObj.name : (winnerId || "Unknown");
                winnerInfo = { type: 'player', playerId: winnerId, playerName: playerName };
                console.log(`GAME OVER! Player ${winnerId} wins by score`);
            }
        }

        if (this.networkManager) {
            // Send game over with winner info and delay
            this.networkManager.broadcastToRoom(this.roomId, {
                type: 'gameOver',
                winner: winnerInfo,
                reason: reason
            });
        }

        // Clean up after 5 seconds
        setTimeout(() => {
            if (this.networkManager && this.networkManager.gameManager) {
                this.networkManager.gameManager.endGame(this.roomId);
            }
        }, 5000);
    }

    resetGame() {
        console.log("[GameEngine] Đang reset game về trạng thái ban đầu");

        // Re-initialize with same game mode
        this.mapConfig = getMapForMode(this.gameMode);
        this.world = new World(this.mapConfig, this.gameMode);
        this.bulletManager = new BulletManager(this.world);
        this.playerManager = new PlayerManager(this.world, this.bulletManager);
        this.powerUpManager = new PowerUpManager(this.world);

        // Reset state
        this.gameState = "running";
        this.gameStartTime = Date.now();
        this.teamScores = { 1: 0, 2: 0 };
        this.playerScores.clear();

        // Reset mode-specific state
        this.safeZoneRadius = this.mapConfig.safeZone?.initialRadius || 0;
        this.lastShrinkTime = Date.now();
        this.controllingTeam = null;
        this.hillControlTime = { 1: 0, 2: 0 };
        this.flags.clear();
        this.captures = { 1: 0, 2: 0 };

        if (this.gameMode === GAME_MODES.CAPTURE_FLAG && this.mapConfig.flags) {
            this.initFlags();
        }


        // Reset network manager
        if (this.networkManager) {
            this.networkManager.reset();
        }

        console.log("[GameEngine] Game đã reset")
    }


    // --- Cung cấp state cho NetworkManager ---
    getGameState() {
        const now = Date.now();
        const elapsedTime = Math.floor((now - this.gameStartTime) / 1000);
        const timeLimit = this.modeConfig.timeLimit;
        const remainingTime = Math.max(0, timeLimit - elapsedTime);

        return {
            players: this.playerManager.getState(),
            bullets: this.bulletManager.getState(),
            bases: this.world.getBaseHealths(),
            powerUps: this.powerUpManager.getState(),
            gameMode: this.gameMode,
            flags: this.flags,
            modeState: {
                teamScores: this.teamScores,
                safeZoneRadius: this.safeZoneRadius,
                controllingTeam: this.controllingTeam,
                captures: this.captures,
                gameTime: elapsedTime,
                remainingTime: remainingTime,
            }
        };
    }

    getMapData() {
        return this.world.getMapData();
    }
}