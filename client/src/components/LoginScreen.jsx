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
        // [ENHANCED] Animated gradient background
        <div className="min-h-screen flex items-center justify-center bg-gradient-animated p-4 relative overflow-hidden">
            {/* Floating decorative elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>

            {/* [ENHANCED] Beautiful card with glassmorphism */}
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in relative z-10 border border-white/20">
                {/* Tank icon/logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                        <span className="text-4xl">🎮</span>
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Tank Battle
                </h1>
                <p className="text-center text-gray-600 mb-6 font-medium">Đăng nhập để chiến đấu</p>

                {/* [ENHANCED] Form with better styling */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                    </div>

                    {/* [ENHANCED] Gradient button with effects */}
                    <button
                        type="submit"
                        className="mt-2 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                        Đăng nhập
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 font-medium">hoặc</span>
                    </div>
                </div>

                {/* [ENHANCED] Secondary button */}
                <button
                    className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    onClick={() => navigateTo(SCREENS.REGISTER)}
                >
                    Tạo tài khoản mới
                </button>
            </div>
        </div>
    );
}

export default LoginScreen;