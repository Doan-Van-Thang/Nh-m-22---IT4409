import React, { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '../contexts/SocketContext';
import { useAuthContext } from '../contexts/AuthContext';
import { MESSAGE_TYPES } from '../config/messageTypes';

const ChatBox = ({ scope = 'GLOBAL', className = '' }) => {
    const { socket, send, addMessageListener } = useSocketContext();
    const { auth } = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Lắng nghe tin nhắn từ Server
    useEffect(() => {
        if (!socket) return;

        const handleChat = (data) => {
            if (data.type === MESSAGE_TYPES.CHAT_BROADCAST) {
                // Chỉ nhận tin nhắn đúng Scope (Global hoặc Room)
                if (data.scope === scope) {
                    setMessages(prev => [...prev, data]);
                }
            }
        };

        // Đăng ký listener
        const unsubscribe = addMessageListener(handleChat);
        return () => {
            unsubscribe();
        };
    }, [socket, addMessageListener, scope]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        send({
            type: MESSAGE_TYPES.CHAT_MESSAGE,
            content: inputValue,
            scope: scope
        });

        setInputValue('');
    };

    // Chặn sự kiện phím để không ảnh hưởng game
    const handleKeyDown = (e) => {
        e.stopPropagation();
    };

    return (
        <div className={`flex flex-col overflow-hidden ${className || 'bg-white/90 border border-gray-300 shadow-xl rounded-xl'}`}>
            {/* Header - Đổi màu chữ thành xám đậm cho dễ đọc trên nền sáng */}
            <div className="bg-gray-100 p-2 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                {scope === 'GLOBAL' ? '🌍 Kênh Thế Giới' : '💬 Kênh Phòng'}
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar" style={{ minHeight: '150px' }}>
                {messages.length === 0 && (
                    <div className="text-gray-400 text-xs italic text-center mt-4">Chưa có tin nhắn nào...</div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className="text-sm break-words animate-fade-in">
                        {/* Tên người gửi đậm hơn */}
                        <span className={`font-bold ${msg.senderId === auth?.id ? 'text-yellow-600' : 'text-blue-600'}`}>
                            {msg.senderName}:
                        </span>
                        {/* Nội dung tin nhắn màu đen/xám đậm */}
                        <span className="text-gray-800 ml-2">{msg.content}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-2 bg-gray-50 border-t border-gray-200 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    maxLength={100}
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                    Gửi
                </button>
            </form>
        </div>
    );
};

export default ChatBox;