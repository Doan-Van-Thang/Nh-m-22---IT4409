// File: client/src/components/Leaderboard.jsx
import React from 'react';

function Leaderboard() {
    // Dữ liệu giả lập cho bảng xếp hạng
    const rankings = [
        { id: 1, name: 'PlayerOne', score: 5000 },
        { id: 2, name: 'TankDestroyer', score: 4500 },
        { id: 3, name: 'Speedy', score: 4200 },
        { id: 4, name: 'TheWall', score: 3000 },
        { id: 5, name: 'Rookie', score: 1500 },
    ];

    return (
        <div className="leaderboard-container">
            <h3>Bảng xếp hạng</h3>
            <ol>
                {rankings.map(player => (
                    <li key={player.id}>
                        <span>{player.name}</span>
                        <span>{player.score}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default Leaderboard;