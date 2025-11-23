
import React, { useState } from 'react';

const PlayerCard = ({ player, isHost }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="flex items-center p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 mb-2 animate-fade-in hover:shadow-md transition-shadow duration-200">
            {/* Avatar */}
            <div className="relative shrink-0">
                <img
                    src={!imgError && player.avatarUrl ? player.avatarUrl : '/avatar.png'}
                    alt={player.name}
                    onError={() => setImgError(true)}
                    className={`w-12 h-12 rounded-full object-cover border-2 ${isHost ? 'border-yellow-400' : 'border-gray-200'
                        }`}
                />
            </div>

            {/* Info */}
            <div className="ml-3 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-800 truncate text-sm sm:text-base">
                        {player.name}
                    </div>
                    {/* Display player points */}
                    <div className="flex items-center ml-2 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                        <span className="text-yellow-600 font-bold text-xs">🪙 {player.highScore || 0}</span>
                    </div>
                </div>
                {isHost && (
                    <div className="flex items-center mt-1">
                        <span className="text-[10px] uppercase bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold border border-yellow-200">
                            👑 Chủ phòng
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerCard;