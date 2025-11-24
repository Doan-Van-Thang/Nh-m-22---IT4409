import React, { useState } from 'react';

const GAME_MODES = [
    { id: '1V1', name: '1 vs 1', maxPlayers: 2 },
    { id: '2V2', name: '2 vs 2', maxPlayers: 4 },
    { id: 'DEATHMATCH', name: 'Sinh tử chiến', maxPlayers: 4 },
    { id: 'TEAM_DEATHMATCH', name: 'Đội sinh tử', maxPlayers: 4 },
];

const PLAYER_OPTIONS = [2, 4, 6, 8];

const BETTING_OPTIONS = [0, 10, 50, 100, 500, 1000];

function RoomSettingsEditor({ room, isOpen, onClose, onUpdateSettings, userPoints }) {
    const [gameMode, setGameMode] = useState(room.gameMode || '2V2');
    const [maxPlayers, setMaxPlayers] = useState(room.maxPlayers || 4);
    const [bettingPoints, setBettingPoints] = useState(room.bettingPoints || 0);

    if (!isOpen) return null;

    const selectedMode = GAME_MODES.find(m => m.id === gameMode) || GAME_MODES[1];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (bettingPoints > userPoints) {
            return;
        }

        if (maxPlayers < room.players.length) {
            return;
        }

        onUpdateSettings({
            gameMode,
            maxPlayers,
            bettingPoints
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scale-in border-2 border-white/30">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl relative overflow-hidden animate-gradient">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            ⚙️ Cài Đặt Phòng
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-red-300 text-4xl font-bold leading-none bg-white/20 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Game Mode Selection */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            🎮 Chế Độ Chơi
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {GAME_MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => {
                                        setGameMode(mode.id);
                                        if (maxPlayers > mode.maxPlayers) {
                                            setMaxPlayers(mode.maxPlayers);
                                        }
                                    }}
                                    className={`p-4 rounded-xl border-2 text-sm font-bold transition-all transform hover:scale-105 ${gameMode === mode.id
                                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg ring-2 ring-blue-300'
                                            : 'border-gray-300 hover:border-blue-400 hover:shadow-md bg-white'
                                        }`}
                                >
                                    {mode.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Max Players */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            👥 Số Người Tối Đa
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {PLAYER_OPTIONS.filter(opt => opt <= selectedMode.maxPlayers).map((option) => {
                                const canSelect = option >= room.players.length;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => canSelect && setMaxPlayers(option)}
                                        disabled={!canSelect}
                                        className={`py-3 px-4 rounded-xl border-2 font-bold transition-all transform hover:scale-110 ${maxPlayers === option
                                                ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                                                : canSelect
                                                    ? 'border-gray-300 hover:border-blue-400 bg-white'
                                                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                        {maxPlayers < room.players.length && (
                            <p className="text-xs bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg mt-2 font-semibold">
                                ⚠️ Không thể giảm xuống dưới số người hiện tại ({room.players.length})
                            </p>
                        )}
                    </div>

                    {/* Betting Points */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            💰 Điểm Cược
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {BETTING_OPTIONS.map((option) => {
                                const canAfford = option <= userPoints || option === 0;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => canAfford && setBettingPoints(option)}
                                        disabled={!canAfford}
                                        className={`py-3 px-4 rounded-xl font-bold transition-all transform ${bettingPoints === option
                                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg border-2 border-white scale-105'
                                                : canAfford
                                                    ? 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 hover:scale-105'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200 opacity-50'
                                            }`}
                                    >
                                        {option === 0 ? 'Không' : `${option}`}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-between mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                            <span className="text-sm text-gray-700 font-semibold">Điểm của bạn:</span>
                            <span className="text-lg font-bold text-yellow-600">🪙 {userPoints}</span>
                        </div>
                    </div>

                    {/* Warning for betting changes */}
                    {bettingPoints !== room.bettingPoints && bettingPoints > 0 && (
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4 animate-pulse-glow">
                            <p className="text-sm text-orange-700 font-semibold flex items-center gap-2">
                                <span className="text-xl">⚠️</span>
                                <span><strong>Lưu ý:</strong> Tất cả người chơi phải có ít nhất {bettingPoints} điểm để tham gia!</span>
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-md"
                        >
                            ❌ Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={bettingPoints > userPoints}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-xl transform hover:scale-105 active:scale-95 text-lg"
                        >
                            ✨ Cập Nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RoomSettingsEditor;
