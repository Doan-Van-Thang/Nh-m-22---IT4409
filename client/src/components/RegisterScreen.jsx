// File: client/src/components/RegisterScreen.jsx

import React, { useState } from 'react';

// Nhận onRegister (từ App.jsx) và navigateTo (để quay lại Login)
function RegisterScreen({ onRegister, navigateTo, SCREENS }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [province, setProvince] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

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
        // [MỚI] Layout toàn màn hình, căn giữa
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {/* [MỚI] Thẻ (card) đăng ký */}
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Tạo tài khoản</h1>

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
                        placeholder="Mật khẩu (ít nhất 6 ký tự)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        // [MỚI] Style cho input
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        // [MỚI] Style cho input
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Tên hiển thị"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        // [MỚI] Style cho input
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Tỉnh/Thành phố"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        required
                        // [MỚI] Style cho input
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="URL ảnh đại diện"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        // [MỚI] Style cho input
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* [MỚI] Style cho nút chính */}
                    <button
                        type="submit"
                        className="py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                        Đăng ký
                    </button>
                </form>

                {/* [MỚI] Style cho nút phụ */}
                <button
                    className="w-full mt-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    onClick={() => navigateTo(SCREENS.LOGIN)} // Nút quay về màn hình Đăng nhập
                >
                    Quay lại Đăng nhập
                </button>
            </div>
        </div>
    );
}

export default RegisterScreen;