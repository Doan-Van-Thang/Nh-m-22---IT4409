import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import RoomSettingsEditor from './RoomSettingsEditor';
import { getGameModeInfo } from '../config/gameModes';
import ChatBox from './ChatBox'; 

const TeamColumn = ({
    teamName,
    teamColor,
    players,
    currentUserId,
    onJoin,
    hostId,
    isTeamMode
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
        },
        purple: {
            bg: 'bg-purple-100', border: 'border-purple-400', title: 'text-purple-700',
            btn: 'hidden', myTeamBg: 'bg-purple-200', myTeamText: 'text-purple-700'
        }
    }[teamColor];

    return (
        <div className={`${colors.bg} rounded-xl p-4 border-4 ${colors.border} flex flex-col shadow-xl relative transition-all duration-300 h-full`}>
            <h2 className={`text-2xl font-bold ${colors.title} text-center mb-4 uppercase tracking-wider`}>
                {teamName} ({players.length})
            </h2>

            <div className="flex-1 space-y-2 min-h-[200px] overflow-y-auto custom-scrollbar pr-1">
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
            {isTeamMode && (
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
            )}
        </div>
    );
};

function LobbyScreen({ auth, room, socket, navigateTo, SCREENS, toast }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    //Logic Effect & Check Auth
    useEffect(() => {
        if (!room || !auth) {
            navigateTo(SCREENS.MAIN_MENU);
        }
    }, [room, auth, navigateTo, SCREENS]);

    if (!room || !auth) return null;

    //Logic tính toán biến số
    const modeInfo = getGameModeInfo(room.gameMode);
    const isTeamMode = modeInfo.teams;
    const isHost = auth.id === room.hostId;
    const team1Players = room.players.filter(p => p.teamId === 1);
    const team2Players = room.players.filter(p => p.teamId === 2);

    //Các hàm xử lý
    const handleStartGame = () => {
        if (isTeamMode) {
            if (team1Players.length === 0 || team2Players.length === 0) {
                toast.warning("Cần ít nhất 1 người mỗi đội để bắt đầu!");
                return;
            }
        } else {
            if (room.players.length < 2) {
                toast.warning("Cần ít nhất 2 người chơi để bắt đầu!");
                return;
            }
        }
        socket.send({ type: 'startGame' });
    };

    const handleLeaveRoom = () => {
        socket.send({ type: 'leaveRoom' });
    };

    const handleSwitchTeam = (teamId) => {
        if (!isTeamMode) return;
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
        //Background Gradient & Animated Elements
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

            <RoomSettingsEditor
                room={room}
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onUpdateSettings={handleUpdateSettings}
                userPoints={auth?.highScore || 0}
            />

            {/*Header Phòng */}
            <div className="bg-gradient-to-br from-white to-gray-50 w-full max-w-7xl p-6 rounded-2xl shadow-2xl mb-6 animate-fade-in-down border-2 border-white/20 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                            🏠 {room.name}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">ID Phòng: <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{room.id}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-black bg-gradient-to-r from-gray-100 to-gray-200 px-5 py-3 rounded-xl shadow-lg border-2 border-gray-300">
                            {isTeamMode ? (
                                <>
                                    <span className="text-red-600 animate-pulse">{team1Players.length}</span>
                                    <span className="mx-3 text-gray-400">VS</span>
                                    <span className="text-blue-600 animate-pulse">{team2Players.length}</span>
                                </>
                            ) : (
                                <span className="text-purple-600 animate-pulse flex items-center gap-2">
                                    <span>👥</span> {room.players.length}
                                </span>
                            )}
                        </div>
                        {isHost && (
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 transform hover:scale-105 active:scale-95"
                                title="Cài đặt phòng"
                            >
                                ⚙️ Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>

                {/*Room Settings Info */}
                <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-gray-200">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-2 rounded-xl border-2 border-blue-200 shadow-sm">
                        <span className="text-xs text-blue-600 font-bold block">Chế độ</span>
                        <p className="text-sm font-bold text-blue-900 mt-1 flex items-center gap-1">
                            {getGameModeInfo(room.gameMode).icon} {getGameModeInfo(room.gameMode).name}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-2 rounded-xl border-2 border-purple-200 shadow-sm">
                        <span className="text-xs text-purple-600 font-bold block">Người chơi</span>
                        <p className="text-sm font-bold text-purple-900 mt-1">{room.players.length}/{room.maxPlayers}</p>
                    </div>
                    {room.bettingPoints > 0 && (
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 px-4 py-2 rounded-xl border-2 border-yellow-300 shadow-sm animate-pulse-glow">
                            <span className="text-xs text-yellow-700 font-bold block">Điểm cược</span>
                            <p className="text-sm font-bold text-yellow-900 flex items-center gap-1 mt-1">
                                🪙 {room.bettingPoints}
                            </p>
                        </div>
                    )}
                    {isHost && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 px-4 py-2 rounded-xl border-2 border-green-200 shadow-sm">
                            <span className="text-xs text-green-700 font-bold">👑 Bạn là chủ phòng</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl relative z-10 min-h-0 mb-4">
                <div className="lg:col-span-8 flex flex-col h-full min-h-[400px]">
                    <div className={`flex-1 ${isTeamMode ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex justify-center'}`}>
                        {isTeamMode ? (
                            <>
                                <TeamColumn
                                    teamName="Đội Đỏ"
                                    teamColor="red"
                                    players={team1Players}
                                    currentUserId={auth.id}
                                    hostId={room.hostId}
                                    onJoin={() => handleSwitchTeam(1)}
                                    isTeamMode={true}
                                />
                                <TeamColumn
                                    teamName="Đội Xanh"
                                    teamColor="blue"
                                    players={team2Players}
                                    currentUserId={auth.id}
                                    hostId={room.hostId}
                                    onJoin={() => handleSwitchTeam(2)}
                                    isTeamMode={true}
                                />
                            </>
                        ) : (
                            <div className="w-full">
                                <TeamColumn
                                    teamName="Danh Sách Chiến Binh"
                                    teamColor="purple"
                                    players={room.players}
                                    currentUserId={auth.id}
                                    hostId={room.hostId}
                                    onJoin={() => { }}
                                    isTeamMode={false}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                    <div className="flex-1 bg-white/95 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 flex flex-col min-h-[300px]">
                        <ChatBox scope="ROOM" className="flex-1 h-full border-none shadow-none bg-transparent text-gray-800" />
                    </div>

                    <div className="flex flex-col gap-3">
                        {isHost ? (
                            <button
                                onClick={handleStartGame}
                                disabled={isTeamMode
                                    ? (team1Players.length === 0 || team2Players.length === 0)
                                    : room.players.length < 2
                                }
                                className={`w-full py-4 text-white text-xl font-bold rounded-xl shadow-2xl transition-all transform 
                                    ${(isTeamMode
                                        ? (team1Players.length > 0 && team2Players.length > 0)
                                        : room.players.length >= 2)
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 animate-pulse-glow'
                                        : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-60'
                                    }`}
                            >
                                🚀 BẮT ĐẦU TRẬN ĐẤU
                            </button>
                        ) : (
                            <div className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 text-lg font-bold rounded-xl shadow-2xl text-center flex items-center justify-center gap-2 border-2 border-gray-600">
                                <span className="animate-pulse">⏳</span> Đợi chủ phòng...
                            </div>
                        )}

                        <button
                            onClick={handleLeaveRoom}
                            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                        >
                            🚪 Rời Phòng
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default LobbyScreen;