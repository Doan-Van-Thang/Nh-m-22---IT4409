import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import RoomSettingsEditor from './RoomSettingsEditor';

// Component hiển thị cột cho từng đội 
const TeamColumn = ({
    teamName,
    teamColor, // 'red' hoặc 'blue'
    players,
    currentUserId,
    onJoin,
    hostId
}) => {
    const isMyTeam = players.find(p => p.id === currentUserId);

    // Cấu hình màu sắc dựa trên teamColor
    const colors = {
        red: {
            bg: 'bg-red-100', border: 'border-red-400', title: 'text-red-700',
            btn: 'bg-red-600 hover:bg-red-700', myTeamBg: 'bg-red-200', myTeamText: 'text-red-700'
        },
        blue: {
            bg: 'bg-blue-100', border: 'border-blue-400', title: 'text-blue-700',
            btn: 'bg-blue-600 hover:bg-blue-700', myTeamBg: 'bg-blue-200', myTeamText: 'text-blue-700'
        }
    }[teamColor];

    return (
        <div className={`${colors.bg} rounded-xl p-4 border-4 ${colors.border} flex flex-col shadow-xl relative transition-all duration-300`}>
            <h2 className={`text-2xl font-bold ${colors.title} text-center mb-4 uppercase tracking-wider`}>
                {teamName} ({players.length})
            </h2>

            <div className="flex-1 space-y-2 min-h-[200px]">
                {players.map(p => (
                    <PlayerCard
                        key={p.id}
                        player={p}
                        isHost={p.id === hostId}
                    />
                ))}
                {players.length === 0 && (
                    <div className={`text-center ${colors.title} opacity-50 italic mt-10`}>
                        Chưa có ai...
                    </div>
                )}
            </div>

            <div className="mt-4 text-center">
                {currentUserId && !isMyTeam && (
                    <button
                        onClick={onJoin}
                        className={`w-full py-3 ${colors.btn} text-white font-bold rounded-lg shadow transition transform active:scale-95`}
                    >
                        Gia nhập {teamName}
                    </button>
                )}
                {isMyTeam && (
                    <div className={`py-3 ${colors.myTeamText} font-bold ${colors.myTeamBg} rounded-lg border border-white/50`}>
                        ✓ Bạn đang ở đội này
                    </div>
                )}
            </div>
        </div>
    );
};

function LobbyScreen({ auth, room, socket, navigateTo, SCREENS, toast }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        if (!room) {
            navigateTo(SCREENS.MAIN_MENU);
        }
    }, [room, navigateTo, SCREENS]);

    if (!room) return null;

    const isHost = auth.id === room.hostId;
    const team1Players = room.players.filter(p => p.teamId === 1);
    const team2Players = room.players.filter(p => p.teamId === 2);

    const handleStartGame = () => {
        if (team1Players.length === 0 || team2Players.length === 0) {
            toast.warning("Cần ít nhất 1 người mỗi đội để bắt đầu!");
            return;
        }
        socket.send({ type: 'startGame' });
    };

    const handleLeaveRoom = () => {
        socket.send({ type: 'leaveRoom' });
    };

    const handleSwitchTeam = (teamId) => {
        socket.send({ type: 'switchTeam', teamId: teamId });
    };

    const handleUpdateSettings = (settings) => {
        socket.send({
            type: 'updateRoomSettings',
            ...settings
        });
        toast.success('Đã cập nhật cài đặt phòng!');
    };

    return (
        <div className="min-h-screen bg-gray-800 p-4 flex flex-col items-center">
            <RoomSettingsEditor
                room={room}
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onUpdateSettings={handleUpdateSettings}
                userPoints={auth?.highScore || 0}
            />

            {/* Header Phòng */}
            <div className="bg-white w-full max-w-4xl p-4 rounded-xl shadow-lg mb-6 animate-fade-in-down">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            🏠 {room.name}
                        </h1>
                        <p className="text-gray-500 text-sm">ID Phòng: <span className="font-mono font-bold">{room.id}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-black bg-gray-100 px-4 py-2 rounded-lg shadow-inner">
                            <span className="text-red-600">{team1Players.length}</span>
                            <span className="mx-3 text-gray-300">VS</span>
                            <span className="text-blue-600">{team2Players.length}</span>
                        </div>
                        {isHost && (
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2"
                                title="Cài đặt phòng"
                            >
                                ⚙️ Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>

                {/* Room Settings Info */}
                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                    <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                        <span className="text-xs text-blue-600 font-semibold">Chế độ</span>
                        <p className="text-sm font-bold text-blue-800">{room.gameMode || '2V2'}</p>
                    </div>
                    <div className="bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                        <span className="text-xs text-purple-600 font-semibold">Người chơi</span>
                        <p className="text-sm font-bold text-purple-800">{room.players.length}/{room.maxPlayers}</p>
                    </div>
                    {room.bettingPoints > 0 && (
                        <div className="bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-300">
                            <span className="text-xs text-yellow-700 font-semibold">Điểm cược</span>
                            <p className="text-sm font-bold text-yellow-900 flex items-center gap-1">
                                🪙 {room.bettingPoints}
                            </p>
                        </div>
                    )}
                    {isHost && (
                        <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                            <span className="text-xs text-green-700 font-semibold">👑 Bạn là chủ phòng</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Khu vực chia đội (Grid layout) */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 flex-1">{/* Room Settings Info */}

                <TeamColumn
                    teamName="Đội Đỏ"
                    teamColor="red"
                    players={team1Players}
                    currentUserId={auth.id}
                    hostId={room.hostId}
                    onJoin={() => handleSwitchTeam(1)}
                />

                <TeamColumn
                    teamName="Đội Xanh"
                    teamColor="blue"
                    players={team2Players}
                    currentUserId={auth.id}
                    hostId={room.hostId}
                    onJoin={() => handleSwitchTeam(2)}
                />

            </div>

            {/* Footer Actions */}
            <div className="w-full max-w-4xl flex gap-4 sticky bottom-4 z-10">
                <button
                    onClick={handleLeaveRoom}
                    className="flex-1 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg transition active:scale-95"
                >
                    🚪 Rời Phòng
                </button>

                {isHost ? (
                    <button
                        onClick={handleStartGame}
                        className={`flex-[2] py-4 text-white text-xl font-bold rounded-xl shadow-lg transition transform 
                            ${(team1Players.length > 0 && team2Players.length > 0)
                                ? 'bg-green-500 hover:bg-green-600 hover:-translate-y-1'
                                : 'bg-green-300 cursor-not-allowed'
                            }`}
                    >
                        🚀 BẮT ĐẦU TRẬN ĐẤU
                    </button>
                ) : (
                    <div className="flex-[2] py-4 bg-gray-700 text-gray-400 text-xl font-bold rounded-xl shadow-lg text-center flex items-center justify-center gap-2">
                        <span className="animate-pulse">⏳</span> Đợi chủ phòng...
                    </div>
                )}
            </div>
        </div>
    );
}

export default LobbyScreen;