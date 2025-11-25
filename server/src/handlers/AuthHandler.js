
import jwt from 'jsonwebtoken';
import Account from '../model/account.js'; 

export default class AuthHandler {
    constructor(authManager, networkManager) {
        this.authManager = authManager;
        this.networkManager = networkManager;
    }

    async handle(ws, data) {
        try {
            switch (data.type) {
                case 'register':
                    await this.authManager.register(data.username, data.password, data.name, data.province, data.avatarUrl);
                    ws.send(JSON.stringify({ type: 'registerSuccess' }));
                    break;

                case 'login': {
                    const loginData = await this.authManager.login(data.username, data.password);
                    // Báo cho NetworkManager biết user này đã đăng nhập thành công để lưu session
                    this.networkManager.onClientAuthenticated(ws, loginData);
                    ws.send(JSON.stringify({ type: 'loginSuccess', ...loginData }));
                    break;
                }

                case 'checkAuth': {
                    // Logic xác thực token
                    try {
                        const decodedToken = jwt.verify(data.token, process.env.JWT_SECRET);
                        const account = await Account.findById(decodedToken.id);
                        if (!account) throw new Error('Tài khoản không tồn tại');

                        const userData = {
                            id: account._id.toString(),
                            name: account.name,
                            avatarUrl: account.avatarUrl,
                            highScore: account.highScore,
                            username: account.username
                        };

                        // Báo cho NetworkManager lưu session
                        this.networkManager.onClientAuthenticated(ws, userData);

                        ws.send(JSON.stringify({
                            type: 'authSuccess',
                            token: data.token,
                            ...userData
                        }));
                    } catch (error) {
                        throw new Error('Token không hợp lệ hoặc hết hạn');
                    }
                    break;
                }

                case 'getLeaderboard': {
                    try {
                        const leaderboard = await Account.find({})
                            .sort({ highScore: -1 })
                            .limit(10)
                            .select('name province highScore avatarUrl');
                        
                        ws.send(JSON.stringify({
                            type: 'leaderboardData',
                            payload: leaderboard
                        }));
                    } catch (err) {
                        console.error("Leaderboard error:", err);
                    }
                    break;
                }
            }
        } catch (error) {
            ws.send(JSON.stringify({ type: 'authError', message: error.message }));
        }
    }
}