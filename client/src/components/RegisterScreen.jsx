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
                    <div className='relative'>
                        <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            required
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white'
                        >
                            <option value="" disabled>--Chọn Tỉnh/Thành phố --</option>
                            {VIETNAM_PROVINCES.map((prov) => (
                                <option key={prov} value={prov}>
                                    {prov}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn ảnh đại diện
                        </label>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {AVAILABLE_AVATARS.map((path) => (
                                <img
                                    key={path}
                                    src={path}
                                    alt="Avatar"
                                    onClick={() => setAvatarUrl(path)}
                                    // Thêm style để highlight ảnh được chọn
                                    className={`w-16 h-16 rounded-full cursor-pointer transition-all ${avatarUrl === path
                                        ? 'ring-4 ring-blue-500 scale-110'
                                        : 'opacity-70 hover:opacity-100'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

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