// File: server/src/managers/AuthManager.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Account from '../model/Account.js';

export default class AuthManager {

    // Đăng ký
    async register(username, password) {
        if (password.length < 6) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
        }

        const existingUser = await Account.findOne({ username });
        if (existingUser) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const account = new Account({
            username,
            passwordHash,
        });

        const savedAccount = await account.save();
        return savedAccount.toJSON();
    }

    // Đăng nhập
    async login(username, password) {
        const account = await Account.findOne({ username });

        const passwordCorrect = account === null
            ? false
            : await bcrypt.compare(password, account.passwordHash);

        if (!(account && passwordCorrect)) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
        }

        const userForToken = {
            username: account.username,
            id: account._id,
        };

        // Tạo token, dùng khóa bí mật từ file .env
        const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token có hạn 1 giờ
        });

        return { token, username: account.username, id: account._id };
    }
}