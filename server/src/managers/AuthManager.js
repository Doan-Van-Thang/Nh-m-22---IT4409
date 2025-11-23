// File: server/src/managers/AuthManager.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Account from '../model/account.js';

export default class AuthManager {

    // Đăng ký
    async register(username, password, name, province, avatarUrl) {
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
            name,
            province,
            avatarUrl
        })
            ;

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

        return { token, username: account.username, id: account._id, highScore: account.highScore, name: account.name, province: account.province, avatarUrl: account.avatarUrl };
    }

    // Deduct points from a player
    async deductPoints(playerId, points) {
        const account = await Account.findById(playerId);
        if (!account) {
            throw new Error('Người chơi không tồn tại');
        }

        if (account.highScore < points) {
            throw new Error(`Không đủ điểm. Cần ${points} điểm nhưng chỉ có ${account.highScore} điểm.`);
        }

        account.highScore -= points;
        await account.save();
        return account.highScore;
    }

    // Add points to a player
    async addPoints(playerId, points) {
        const account = await Account.findById(playerId);
        if (!account) {
            throw new Error('Người chơi không tồn tại');
        }

        account.highScore += points;
        await account.save();
        return account.highScore;
    }

    // Update player's high score (existing functionality)
    async updateHighScore(playerId, newScore) {
        const account = await Account.findById(playerId);
        if (!account) {
            throw new Error('Người chơi không tồn tại');
        }

        if (newScore > account.highScore) {
            account.highScore = newScore;
            await account.save();
        }
        return account.highScore;
    }
}