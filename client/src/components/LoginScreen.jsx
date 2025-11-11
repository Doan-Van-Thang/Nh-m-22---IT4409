// Ví dụ file: client/src/components/LoginScreen.jsx
import React, { useState } from 'react';

// Nhận onLogin (từ App.jsx) và navigateTo (để chuyển sang Register)
function LoginScreen({ onLogin, navigateTo, SCREENS }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password); // Gọi hàm login (sẽ được truyền từ App.jsx)
    };

    return (
        <div className="menu-container">
            <h1>Đăng nhập</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: '10px', fontSize: '18px' }}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', fontSize: '18px' }}
                />
                <button type="submit" className="menu-button">Đăng nhập</button>
            </form>
            <button
                className="menu-button"
                style={{ backgroundColor: '#555' }}
                onClick={() => navigateTo(SCREENS.REGISTER)} // Nút chuyển sang màn hình Đăng ký
            >
                Chưa có tài khoản?
            </button>
        </div>
    );
}

export default LoginScreen;