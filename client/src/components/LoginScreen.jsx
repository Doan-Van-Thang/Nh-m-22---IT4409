// File: client/src/components/LoginScreen.jsx
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
        // [MỚI] Layout toàn màn hình, căn giữa
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {/* [MỚI] Thẻ (card) đăng nhập */}
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h1>

                {/* [MỚI] Form với các lớp Tailwind */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        // [MỚI] Style cho input
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        // [MỚI] Style cho input
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* [MỚI] Style cho nút chính (giống MainMenu) */}
                    <button
                        type="submit"
                        className="py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                        Đăng nhập
                    </button>
                </form>

                {/* [MỚI] Style cho nút phụ */}
                <button
                    className="w-full mt-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    onClick={() => navigateTo(SCREENS.REGISTER)} // Nút chuyển sang màn hình Đăng ký
                >
                    Chưa có tài khoản?
                </button>
            </div>
        </div>
    );
}

export default LoginScreen;