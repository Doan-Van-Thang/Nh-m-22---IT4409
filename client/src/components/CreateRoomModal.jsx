import React, { useState } from 'react';

const GAME_MODES = [
    { id: '1V1', name: '1 vs 1', description: 'Đối đầu 1-1', maxPlayers: 2 },
    { id: '2V2', name: '2 vs 2', description: 'Đội 2 người', maxPlayers: 4 },
    { id: 'DEATHMATCH', name: 'Sinh tử chiến', description: 'Người có nhiều kill nhất thắng', maxPlayers: 4 },
    { id: 'TEAM_DEATHMATCH', name: 'Đội sinh tử', description: 'Đội có nhiều kill nhất thắng', maxPlayers: 4 },
];

const PLAYER_OPTIONS = [
    { value: 2, label: '2 người' },
    { value: 4, label: '4 người' },
    { value: 6, label: '6 người' },
    { value: 8, label: '8 người' },
];

const BETTING_POINTS = [
    { value: 0, label: 'Không cược', color: 'bg-gray-500' },
    { value: 10, label: '10 điểm', color: 'bg-blue-500' },
    { value: 50, label: '50 điểm', color: 'bg-green-500' },
    { value: 100, label: '100 điểm', color: 'bg-yellow-500' },
    { value: 500, label: '500 điểm', color: 'bg-orange-500' },
    { value: 1000, label: '1000 điểm', color: 'bg-red-500' },
];

function CreateRoomModal({ isOpen, onClose, onCreateRoom, userPoints }) {
    const [roomName, setRoomName] = useState('');
    const [selectedMode, setSelectedMode] = useState(GAME_MODES[0]);
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [bettingPoints, setBettingPoints] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!roomName.trim()) {
            return;
        }

        if (bettingPoints > userPoints) {
            return;
        }

        onCreateRoom({
            name: roomName,
            gameMode: selectedMode.id,
            maxPlayers: maxPlayers,
            bettingPoints: bettingPoints
        });

        // Reset form
        setRoomName('');
        setSelectedMode(GAME_MODES[0]);
        setMaxPlayers(4);
        setBettingPoints(0);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in border-2 border-white/30">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-3xl relative overflow-hidden animate-gradient">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-2">
                                ✨ Tạo Phòng Mới
                            </h2>
                            <p className="text-blue-100 mt-2 flex items-center gap-2">
                                <span className="font-semibold">Điểm của bạn:</span>
                                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold shadow-lg">
                                    🪙 {userPoints || 0}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-red-300 text-4xl font-bold leading-none bg-white/20 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Room Name */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            🏷️ Tên Phòng *
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Nhập tên phòng..."
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all hover:border-gray-400"
                            required
                        />
                    </div>

                    {/* Game Mode Selection */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            🎮 Chế Độ Chơi *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {GAME_MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedMode(mode);
                                        if (maxPlayers > mode.maxPlayers) {
                                            setMaxPlayers(mode.maxPlayers);
                                        }
                                    }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${selectedMode.id === mode.id
                                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg ring-2 ring-blue-300'
                                            : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                                        }`}
                                >
                                    <div className="font-bold text-lg text-gray-800">{mode.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">{mode.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Max Players */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            👥 Số Người Chơi Tối Đa *
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {PLAYER_OPTIONS.filter(opt => opt.value <= selectedMode.maxPlayers).map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setMaxPlayers(option.value)}
                                    className={`py-3 px-4 rounded-xl border-2 font-bold transition-all transform hover:scale-110 ${maxPlayers === option.value
                                            ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                                            : 'border-gray-300 hover:border-blue-400 bg-white'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Betting Points */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            💰 Điểm Cược (Winner takes all)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {BETTING_POINTS.map((option) => {
                                const canAfford = option.value <= userPoints || option.value === 0;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => canAfford && setBettingPoints(option.value)}
                                        disabled={!canAfford}
                                        className={`py-3 px-4 rounded-xl font-bold transition-all transform ${bettingPoints === option.value
                                                ? `${option.color} text-white shadow-lg border-2 border-white scale-105`
                                                : canAfford
                                                    ? 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 hover:scale-105'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200 opacity-50'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                        {bettingPoints > 0 && (
                            <p className="text-sm bg-orange-50 border-2 border-orange-300 text-orange-700 p-3 rounded-xl mt-3 font-semibold flex items-center gap-2 animate-pulse">
                                ⚠️ Tất cả người chơi phải đặt cược {bettingPoints} điểm để tham gia
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-md"
                        >
                            ❌ Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!roomName.trim() || bettingPoints > userPoints}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-xl transform hover:scale-105 active:scale-95 text-lg"
                        >
                            ✨ Tạo Phòng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRoomModal;
