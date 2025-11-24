
import React, { useState } from 'react';

const PlayerCard = ({ player, isHost }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="flex items-center p-4 bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm rounded-xl shadow-lg border-2 border-gray-200 mb-2 animate-fade-in-up hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-blue-300">
            {/* Avatar */}
            <div className="relative shrink-0">
                <img
                    src={!imgError && player.avatarUrl ? player.avatarUrl : '/avatar.png'}
                    alt={player.name}
                    onError={() => setImgError(true)}
                    className={`w-14 h-14 rounded-full object-cover border-3 shadow-md ${isHost ? 'border-yellow-400 ring-4 ring-yellow-200' : 'border-gray-300'
                        }`}
                />
                {isHost && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-xs">👑</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="ml-4 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-800 truncate text-base">
                        {player.name}
                    </div>
                    {/* Display player points */}
                    <div className="flex items-center ml-2 bg-gradient-to-r from-yellow-50 to-yellow-100 px-3 py-1 rounded-full border-2 border-yellow-300 shadow-sm">
                        <span className="text-yellow-700 font-bold text-sm">🪙 {player.highScore || 0}</span>
                    </div>
                </div>
                {isHost && (
                    <div className="flex items-center mt-2">
                        <span className="text-xs uppercase bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-bold border-2 border-yellow-300 shadow-sm">
                            Chủ phòng
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerCard;