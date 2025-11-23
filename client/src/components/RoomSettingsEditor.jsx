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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">⚙️ Cài Đặt Phòng</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-3xl font-bold leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Game Mode Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Chế Độ Chơi
                        </label>
                        <div className="grid grid-cols-2 gap-2">
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
                                    className={`p-3 rounded-lg border-2 text-sm transition-all ${gameMode === mode.id
                                            ? 'border-blue-500 bg-blue-50 font-bold'
                                            : 'border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    {mode.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Max Players */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Số Người Tối Đa
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
                                        className={`py-2 px-3 rounded-lg border-2 font-semibold transition-all ${maxPlayers === option
                                                ? 'border-blue-500 bg-blue-500 text-white'
                                                : canSelect
                                                    ? 'border-gray-300 hover:border-blue-300'
                                                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                        {maxPlayers < room.players.length && (
                            <p className="text-xs text-red-600 mt-1">
                                ⚠️ Không thể giảm xuống dưới số người hiện tại ({room.players.length})
                            </p>
                        )}
                    </div>

                    {/* Betting Points */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Điểm Cược
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
                                        className={`py-2 px-3 rounded-lg font-semibold transition-all ${bettingPoints === option
                                                ? 'bg-yellow-500 text-white shadow-md border-2 border-yellow-600'
                                                : canAfford
                                                    ? 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                                            }`}
                                    >
                                        {option === 0 ? 'Không' : `${option}`}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            Điểm của bạn: <span className="font-bold text-yellow-600">{userPoints}</span>
                        </p>
                    </div>

                    {/* Warning for betting changes */}
                    {bettingPoints !== room.bettingPoints && bettingPoints > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-sm text-orange-700">
                                <strong>⚠️ Lưu ý:</strong> Tất cả người chơi phải có ít nhất {bettingPoints} điểm để tham gia!
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={bettingPoints > userPoints}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            Cập Nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RoomSettingsEditor;
