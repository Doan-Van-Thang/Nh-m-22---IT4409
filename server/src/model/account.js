// File: server/src/model/Account.js
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3 },
    passwordHash: { type: String, required: true },
    // Bạn có thể thêm email, ngày tạo,
    // điểm số cao nhất, v.

    highScore: { type: Number, default: 3600 }, // Điểm số cao nhất của người chơi
});

// Không lưu passwordHash khi gửi về client
accountSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.passwordHash;
    }
});

const Account = mongoose.model('Account', accountSchema);
export default Account;