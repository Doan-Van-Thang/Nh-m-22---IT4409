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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold">Tạo Phòng Mới</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-3xl font-bold leading-none"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-blue-100 mt-2">Điểm của bạn: <span className="font-bold text-yellow-300">{userPoints || 0}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Room Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Tên Phòng *
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Nhập tên phòng..."
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    {/* Game Mode Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Chế Độ Chơi *
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
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${selectedMode.id === mode.id
                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                            : 'border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="font-bold text-lg">{mode.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">{mode.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Max Players */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Số Người Chơi Tối Đa *
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {PLAYER_OPTIONS.filter(opt => opt.value <= selectedMode.maxPlayers).map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setMaxPlayers(option.value)}
                                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${maxPlayers === option.value
                                            ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                                            : 'border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Betting Points */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Điểm Cược (Winner takes all)
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
                                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${bettingPoints === option.value
                                                ? `${option.color} text-white shadow-md border-2 border-transparent`
                                                : canAfford
                                                    ? 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                        {bettingPoints > 0 && (
                            <p className="text-sm text-orange-600 mt-2 font-semibold">
                                ⚠️ Tất cả người chơi phải đặt cược {bettingPoints} điểm để tham gia
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!roomName.trim() || bettingPoints > userPoints}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            Tạo Phòng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRoomModal;
