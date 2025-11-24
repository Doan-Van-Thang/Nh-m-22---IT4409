// File: client/src/components/RegisterScreen.jsx

import React, { useState } from 'react';

const AVAILABLE_AVATARS = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
    '/avatars/avatar4.png',
    '/avatars/avatar5.png',
    '/avatars/avatar6.png',
];

const VIETNAM_PROVINCES = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Điện Biên",
    "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Tĩnh", "Hưng Yên", "Khánh Hoà",
    "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình",
    "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh",
    "Thái Nguyên", "Thanh Hóa", "TP. Cần Thơ", "TP. Đà Nẵng", "TP. Hà Nội",
    "TP. Hải Phòng", "TP. Hồ Chí Minh", "TP. Huế", "Tuyên Quang", "Vĩnh Long"
];

// Nhận onRegister (từ App.jsx) và navigateTo (để quay lại Login)
function RegisterScreen({ onRegister, navigateTo, SCREENS, toast }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [province, setProvince] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(AVAILABLE_AVATARS[0]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            toast.error("Mật khẩu không khớp! Vui lòng nhập lại.");
            return;
        }

        // 2. (Tùy chọn) Kiểm tra độ dài mật khẩu phía client
        if (password.length < 6) {
            toast.warning("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        // 3. Nếu mọi thứ OK, gọi hàm onRegister (truyền từ App.jsx)
        onRegister(username, password, name, province, avatarUrl);
    };

    return (
        // [ENHANCED] Animated gradient background
        <div className="min-h-screen flex items-center justify-center bg-gradient-animated p-4 relative overflow-hidden">
            {/* Floating decorative elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>

            {/* [ENHANCED] Beautiful card with glassmorphism */}
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in relative z-10 border border-white/20 max-h-[95vh] overflow-y-auto">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-3xl">✨</span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Tạo tài khoản
                </h1>
                <p className="text-center text-gray-600 mb-6 font-medium">Tham gia chiến trường ngay</p>

                {/* [ENHANCED] Form with better styling */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Mật khẩu (ít nhất 6 ký tự)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔐</span>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tên hiển thị"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">✏️</span>
                    </div>

                    <div className='relative'>
                        <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            required
                            className='w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 appearance-none bg-white'
                        >
                            <option value="" disabled>--Chọn Tỉnh/Thành phố --</option>
                            {VIETNAM_PROVINCES.map((prov) => (
                                <option key={prov} value={prov}>
                                    {prov}
                                </option>
                            ))}
                        </select>
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📍</span>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 text-center">
                            ✨ Chọn ảnh đại diện
                        </label>
                        <div className="flex flex-wrap gap-3 justify-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                            {AVAILABLE_AVATARS.map((path) => (
                                <img
                                    key={path}
                                    src={path}
                                    alt="Avatar"
                                    onClick={() => setAvatarUrl(path)}
                                    className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-300 ${avatarUrl === path
                                            ? 'ring-4 ring-purple-500 scale-110 shadow-lg'
                                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* [ENHANCED] Gradient button */}
                    <button
                        type="submit"
                        className="mt-2 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                        Đăng ký
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
                    onClick={() => navigateTo(SCREENS.LOGIN)}
                >
                    Quay lại Đăng nhập
                </button>
            </div>
        </div>
    );
}

export default RegisterScreen;