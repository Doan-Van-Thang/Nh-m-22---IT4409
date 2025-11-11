// File: client/src/components/RegisterScreen.jsx

import React, { useState } from 'react';

// Nhận onRegister (từ App.jsx) và navigateTo (để quay lại Login)
function RegisterScreen({ onRegister, navigateTo, SCREENS }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp! Vui lòng nhập lại.");
            return;
        }

        // 2. (Tùy chọn) Kiểm tra độ dài mật khẩu phía client
        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        // 3. Nếu mọi thứ OK, gọi hàm onRegister (truyền từ App.jsx)
        onRegister(username, password);
    };

    return (
        <div className="menu-container">
            <h1>Tạo tài khoản</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '18px' }}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu (ít nhất 6 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '18px' }}
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '18px' }}
                />
                <button type="submit" className="menu-button">
                    Đăng ký
                </button>
            </form>
            <button
                className="menu-button"
                style={{ backgroundColor: '#555', marginTop: '10px' }}
                onClick={() => navigateTo(SCREENS.LOGIN)} // Nút quay về màn hình Đăng nhập
            >
                Quay lại Đăng nhập
            </button>
        </div>
    );
}

export default RegisterScreen;