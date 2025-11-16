// client/src/components/LobbyScreen.jsx
import React from 'react';

// (Bạn có thể copy các Icon từ MainMenu.jsx nếu muốn)

function LobbyScreen({ auth, room, socket, navigateTo, SCREENS }) {

    if (!room) {
        // Nếu không có phòng, quay về sảnh
        navigateTo(SCREENS.MAIN_MENU);
        return null;
    }

    const isHost = auth.id === room.hostId;

    const handleStartGame = () => {
        socket.send({ type: 'startGame' });
    };

    const handleLeaveRoom = () => {
        socket.send({ type: 'leaveRoom' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{room.name}</h1>
                <p className="text-center text-gray-500 mb-6">ID phòng: {room.id}</p>

                <h2 className="text-xl font-semibold mb-4">Người chơi ({room.players.length} / 4):</h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {room.players.map((player, index) => (
                        <div key={player.id + '-' + index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <img
                                src={player.avatarUrl || '/avatar.png'}
                                alt={player.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <div className="font-medium">{player.name} {player.id === room.hostId ? '(Chủ phòng)' : ''}</div>
                                <span className={player.teamId === 1 ? 'text-blue-500' : 'text-red-500'}>
                                    Đội {player.teamId}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {isHost ? (
                        <button
                            onClick={handleStartGame}
                            className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                            Bắt đầu trận đấu
                        </button>
                    ) : (
                        <div className="flex-1 py-3 text-center bg-gray-200 text-gray-600 rounded-lg font-medium">
                            Đang chờ chủ phòng...
                        </div>
                    )}

                    <button
                        onClick={handleLeaveRoom}
                        className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        Rời phòng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LobbyScreen;