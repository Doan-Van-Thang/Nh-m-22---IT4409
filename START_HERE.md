# 🚀 Quick Start - Sau Full Migration

## Cách Chạy Nhanh Nhất

### Option 1: Sử dụng Script Tự Động ⚡

```powershell
cd d:\WEB\BTL\Main
.\start.ps1
```

Script sẽ tự động:
- ✅ Kiểm tra MongoDB
- ✅ Kiểm tra port 5174
- ✅ Khởi động Server
- ✅ Khởi động Client
- ✅ Mở 2 terminal riêng biệt

### Option 2: Khởi Động Thủ Công 🔧

**Terminal 1 - Server:**
```powershell
cd d:\WEB\BTL\Main\server
npm start
```

**Terminal 2 - Client:**
```powershell
cd d:\WEB\BTL\Main\client
npm run dev
```

**Browser:**
Mở http://localhost:5173

---

## ⚙️ Cấu Hình Nhanh

### Client (.env)
```env
VITE_WS_HOST=localhost
VITE_WS_PORT=5174
VITE_DEBUG_MODE=true
```

### Server (.env)
```env
PORT=5174
MONGODB_URI=mongodb://localhost:27017/tank-game
JWT_SECRET=your-secret-key
LOG_LEVEL=debug
```

---

## 🆕 Thay Đổi Chính

### Sử Dụng Constants
```javascript
// ❌ Cũ
socket.send({ type: 'login' });

// ✅ Mới
import MESSAGE_TYPES from './config/messageTypes';
socket.send({ type: MESSAGE_TYPES.LOGIN });
```

### Sử Dụng Logger
```javascript
// ❌ Cũ
console.log('Message');

// ✅ Mới
import logger from './utils/logger';
logger.info('Message');
```

### Sử Dụng Hooks
```javascript
// ✅ Mới
import { useAuthContext } from './contexts/AuthContext';
const { auth, login, logout } = useAuthContext();
```

---

## 📚 Tài Liệu Đầy Đủ

- **HUONG_DAN_FULL_MIGRATION.md** - Hướng dẫn chi tiết tiếng Việt
- **QUICKSTART.md** - Setup guide (English)
- **REFACTORING.md** - Technical details
- **ARCHITECTURE.md** - Architecture diagrams

---

## 🐛 Troubleshooting

### Port đang được sử dụng
```powershell
$process = Get-NetTCPConnection -LocalPort 5174 | Select -ExpandProperty OwningProcess -Unique
Stop-Process -Id $process -Force
```

### MongoDB không chạy
```powershell
mongod
```

### Rollback nếu cần
```powershell
# Client
cd d:\WEB\BTL\Main\client\src
Copy-Item App.old.jsx App.jsx -Force

# Server
cd d:\WEB\BTL\Main\server
Copy-Item index.old.js index.js -Force
```

---

## ✅ Migration Hoàn Thành!

**Những gì đã thay đổi:**
- ✨ App.jsx → Version refactored với Context & Hooks
- ✨ index.js → Version refactored với better logging
- ✨ Thêm 20+ files mới (utils, hooks, contexts)
- ✨ Environment configuration
- ✨ Professional logging
- ✨ Error handling

**Backup:**
- 💾 App.old.jsx
- 💾 index.old.js

---

**Happy Coding! 🎉**
