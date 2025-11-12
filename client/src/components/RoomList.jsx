// File: client/src/components/RoomList.jsx
import React from 'react';

// Nhận hàm onPlay (sẽ được gọi khi nhấn "Chơi ngay" hoặc "Tạo phòng")
function RoomList({ onPlay }) {

    // Dữ liệu phòng giả lập
    const rooms = [
        { id: 'room1', name: 'Phòng 1v1 Căng thẳng', players: '1/2' },
        { id: 'room2', name: 'Đấu trường 2v2', players: '3/4' },
        { id: 'room3', name: 'Phòng chờ...', players: '0/4' },
    ];

    return (
        <div className="room-list-container">
            <h3>Sảnh chờ</h3>

            <div className="room-list-actions">
                {/* Hiện tại, cả 2 nút này đều gọi hàm 'onPlay' gốc 
                  để vào game ngay lập tức.
                  Trong tương lai, bạn sẽ cần logic phức tạp hơn
                  để xử lý việc tạo/tham gia phòng cụ thể.
                */}
                <button className="menu-button" onClick={onPlay}>
                    Chơi Nhanh
                </button>
                <button
                    className="menu-button"
                    style={{ backgroundColor: '#007bff' }}
                    onClick={() => alert('Chức năng đang phát triển!')}
                >
                    Tạo phòng mới
                </button>
            </div>

            <div className="rooms-table">
                <h4>Các phòng hiện có</h4>
                <ul>
                    {rooms.map(room => (
                        <li key={room.id}>
                            <span>{room.name}</span>
                            <span>{room.players}</span>
                            <button
                                className="join-button"
                                onClick={() => alert(`Tham gia ${room.name}`)}
                            >
                                Vào
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default RoomList;