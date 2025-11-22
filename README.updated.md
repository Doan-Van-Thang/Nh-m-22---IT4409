# Tank Game 2D - Multiplayer Real-time Game

A real-time multiplayer tank battle game built with React, Node.js, and WebSocket.

## 🎮 About

This is a 2D tank battle game where players can create rooms, join teams, and compete against each other in real-time. The game features collision detection, team-based gameplay, and a leaderboard system.

**Course**: IT4409 - Web Programming  
**Team**: Nhom 22  
**Year**: 2025

## ✨ New: Refactored Architecture

This project has been recently refactored to improve code quality, maintainability, and developer experience. The refactored version includes:

- ✅ **Modern React patterns** (Hooks, Context, Error Boundaries)
- ✅ **Centralized configuration** (Environment variables, Constants)
- ✅ **Proper logging system** (Configurable log levels)
- ✅ **Utility libraries** (Storage, Validation, Helpers)
- ✅ **Service layer** (API abstraction)
- ✅ **Comprehensive documentation**

### 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick setup guide
- **[REFACTORING.md](./REFACTORING.md)** - Detailed refactoring documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture overview with diagrams
- **[SUMMARY.md](./SUMMARY.md)** - Executive summary of changes
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Step-by-step migration guide

## 🚀 Technology Stack

### Client
- **React** (with Vite) - UI framework
- **HTML5 Canvas** - Game rendering
- **Tailwind CSS** - Styling
- **WebSocket** - Real-time communication

### Server
- **Node.js** - Runtime environment
- **WebSocket (ws)** - Real-time communication
- **MongoDB** (Mongoose) - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📂 Project Structure

```
Main/
├── QUICKSTART.md              # Quick start guide
├── REFACTORING.md             # Refactoring documentation
├── ARCHITECTURE.md            # Architecture overview
├── SUMMARY.md                 # Changes summary
├── MIGRATION_CHECKLIST.md     # Migration checklist
│
├── client/                    # Frontend application
│   ├── .env.example           # Environment template
│   ├── src/
│   │   ├── App.jsx            # Main application (use refactored version)
│   │   ├── config/            # Configuration files
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Service layer
│   │   ├── utils/             # Utility functions
│   │   ├── components/        # React components
│   │   └── game/              # Game logic
│   └── ...
│
└── server/                    # Backend application
    ├── .env.example           # Environment template
    ├── index.js               # Server entry (use refactored version)
    ├── src/
    │   ├── config/            # Configuration files
    │   ├── managers/          # Game managers
    │   ├── model/             # Database models
    │   └── utils/             # Utility functions
    └── ...
```

## 🛠️ Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Main
   ```

2. **Setup environment variables**
   ```bash
   # Client
   cd client
   cp .env.example .env
   # Edit .env with your settings

   # Server
   cd ../server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Install dependencies**
   ```bash
   # Client
   cd client
   npm install

   # Server
   cd ../server
   npm install
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Start server
   cd server
   npm start

   # Terminal 2 - Start client
   cd client
   npm run dev
   ```

5. **Open browser**
   - Navigate to `http://localhost:5173` (or the port shown by Vite)

For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md)

## 🎯 Features

- **User Authentication**: Register and login with JWT
- **Room System**: Create and join game rooms
- **Team-based Gameplay**: Two teams compete against each other
- **Real-time Multiplayer**: WebSocket-based real-time communication
- **Leaderboard**: Track top players
- **Responsive UI**: Modern and clean interface with Tailwind CSS

## 🏗️ Architecture Highlights

### Client Architecture
- **Context Providers**: Global state management for auth and socket
- **Custom Hooks**: Reusable logic (useAuth, useSocket, useRoom)
- **Service Layer**: Centralized API communication
- **Error Boundaries**: Graceful error handling
- **Utilities**: Logger, storage, validation, helpers

### Server Architecture
- **Manager Pattern**: Separate managers for different concerns
  - NetworkManager: WebSocket communication
  - RoomManager: Room lifecycle
  - GameManager: Game instances
  - AuthManager: Authentication
  - PlayerManager: Player state
  - BulletManager: Projectile logic
- **Game Engine**: 60 FPS game loop with collision detection
- **Utilities**: Logger, validation, helpers

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed diagrams and flow charts.

## 🔧 Configuration

### Client (.env)
```env
VITE_WS_HOST=localhost
VITE_WS_PORT=5174
VITE_DEBUG_MODE=true
```

### Server (.env)
```env
PORT=5174
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tank-game
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
GAME_TICK_RATE=60
LOG_LEVEL=debug
```

## 📖 Usage Examples

### Using New Hooks
```javascript
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';

function MyComponent() {
    const { auth, login, logout } = useAuth();
    const { socket, send, isConnected } = useSocket(SOCKET_URL);
    
    // Your component logic
}
```

### Using API Service
```javascript
import apiService from './services/apiService';

// Login
apiService.login(username, password);

// Create room
apiService.createRoom(roomName);

// Get leaderboard
apiService.getLeaderboard();
```

### Using Logger
```javascript
import logger from './utils/logger';

logger.debug('Detailed debug info');
logger.info('General information');
logger.warn('Warning message');
logger.error('Error occurred', error);
```

## 🧪 Testing

### Manual Testing
1. Register a new account
2. Login with credentials
3. Create a room
4. Join a room from another tab/browser
5. Start the game
6. Play and test game mechanics
7. Check leaderboard
8. Logout

For a complete testing checklist, see [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)

## 🐛 Troubleshooting

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
mongod
```

### Port Already in Use
Change the PORT in `.env` or kill the process:
```bash
# Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

### Module Not Found
Make sure you've created all configuration files from `.example` templates.

For more troubleshooting tips, see [QUICKSTART.md](./QUICKSTART.md#troubleshooting)

## 📦 Build for Production

### Client
```bash
cd client
npm run build
```
Output will be in `client/dist/`

### Server
Make sure to set production environment variables:
```env
NODE_ENV=production
LOG_LEVEL=info
JWT_SECRET=<strong-production-secret>
```

## 🤝 Contributing

1. Follow the new architecture patterns
2. Use TypeScript constants instead of string literals
3. Use the logger instead of console.log
4. Add JSDoc comments to functions
5. Write English comments
6. Test your changes thoroughly

## 📝 Version History

### v2.0 (November 2025) - Refactored
- Modern React patterns (Hooks, Context)
- Centralized configuration
- Proper logging system
- Comprehensive documentation
- Better error handling

### v1.0 - Original
- Basic game functionality
- Authentication system
- Room management
- Real-time gameplay

## 👥 Team

**Nhom 22 - IT4409**

## 📄 License

This project is for educational purposes as part of the IT4409 course.

## 🙏 Acknowledgments

- Course instructors and TAs
- React and Node.js communities
- Open source contributors

---

**For detailed documentation, please refer to:**
- [Quick Start Guide](./QUICKSTART.md)
- [Refactoring Documentation](./REFACTORING.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Migration Checklist](./MIGRATION_CHECKLIST.md)
