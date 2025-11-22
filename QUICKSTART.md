# Quick Start Guide - Refactored Tank Game

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or remote)
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Main
```

### 2. Setup Environment Variables

#### Client Setup
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_WS_HOST=localhost
VITE_WS_PORT=5174
VITE_DEBUG_MODE=true
```

#### Server Setup
```bash
cd ../server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5174
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tank-game
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
GAME_TICK_RATE=60
LOG_LEVEL=debug
```

### 3. Install Dependencies

#### Install Client Dependencies
```bash
cd client
npm install
```

#### Install Server Dependencies
```bash
cd ../server
npm install
```

## Running the Application

### Start MongoDB
Make sure MongoDB is running:
```bash
# If installed locally
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Start the Server
```bash
cd server
npm start
```

You should see:
```
[INFO] Connecting to MongoDB...
[INFO] MongoDB connected successfully
[INFO] Server started successfully on http://localhost:5174
```

### Start the Client
In a new terminal:
```bash
cd client
npm run dev
```

The client will be available at: `http://localhost:5173` (or the port Vite assigns)

## Using the Refactored Code

### Option 1: Gradual Migration (Recommended)

The refactored files are created with `.refactored` extension. You can gradually migrate:

1. **Test the new utilities**:
   ```javascript
   // In any component
   import logger from './utils/logger.js';
   logger.info('Testing new logger');
   ```

2. **Use new hooks**:
   ```javascript
   import { useAuth } from './hooks/useAuth.js';
   const { auth, login, logout } = useAuth();
   ```

3. **When ready, replace App.jsx**:
   ```bash
   cd client/src
   mv App.jsx App.old.jsx
   mv App.refactored.jsx App.jsx
   ```

### Option 2: Full Migration

Replace the old files with refactored versions:

```bash
# Client
cd client/src
mv App.jsx App.old.jsx
mv App.refactored.jsx App.jsx

# Server
cd ../../server
mv index.js index.old.js
mv index.refactored.js index.js
```

Then restart both client and server.

## Features

### New Client Features

1. **Context Providers**: Global state management for auth and socket
2. **Custom Hooks**: Reusable logic for auth, socket, and rooms
3. **Error Boundary**: Catches and displays errors gracefully
4. **Logger**: Configurable logging with levels
5. **Storage Utils**: Safe localStorage operations
6. **Validation**: Client-side input validation
7. **API Service**: Centralized API communication

### New Server Features

1. **Logger**: Production-ready logging with timestamps
2. **Constants**: Centralized configuration
3. **Validation**: Server-side input validation
4. **Error Handling**: Graceful shutdown and error recovery
5. **Helpers**: Utility functions for common operations

## Development Workflow

### 1. Enable Debug Mode

In `client/.env`:
```env
VITE_DEBUG_MODE=true
```

In `server/.env`:
```env
LOG_LEVEL=debug
```

### 2. Using the Logger

```javascript
import logger from './utils/logger.js';

logger.debug('Detailed debug info');
logger.info('General information');
logger.warn('Warning message');
logger.error('Error occurred', error);
```

### 3. Using Constants

```javascript
import { SCREENS } from './config/constants.js';
import MESSAGE_TYPES from './config/messageTypes.js';

// Navigate to screen
navigateTo(SCREENS.MAIN_MENU);

// Send message
socket.send({ type: MESSAGE_TYPES.LOGIN, ...data });
```

### 4. Using Hooks

```javascript
import { useAuth } from './hooks/useAuth.js';
import { useSocket } from './hooks/useSocket.js';
import { useRoom } from './hooks/useRoom.js';

function MyComponent() {
    const { auth, login, logout } = useAuth();
    const { socket, send, isConnected } = useSocket(SOCKET_URL);
    const { currentRoom, joinRoom, leaveRoom } = useRoom();
    
    // Your component logic
}
```

### 5. Using API Service

```javascript
import apiService from './services/apiService.js';

// Initialize (usually in App.jsx)
apiService.initialize(socket);

// Use anywhere
apiService.login(username, password);
apiService.createRoom(roomName);
apiService.getLeaderboard();
```

## Testing

### Run Tests (if implemented)
```bash
# Client
cd client
npm test

# Server
cd server
npm test
```

### Manual Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] User can create room
- [ ] User can join room
- [ ] User can leave room
- [ ] User can switch teams
- [ ] Game starts correctly
- [ ] Game play works
- [ ] Leaderboard displays
- [ ] Logout works
- [ ] Errors are handled gracefully

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
mongod
```

### WebSocket Connection Error
```
WebSocket connection failed
```
**Solution**: Make sure the server is running and the port matches in client `.env`

### Module Not Found Errors
```
Cannot find module './config/constants.js'
```
**Solution**: Make sure you've created all the new files from the refactoring

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5174
```
**Solution**: Change the PORT in server `.env` or kill the process using that port
```bash
# Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5174 | xargs kill -9
```

## Project Structure

```
Main/
├── client/
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment template
│   ├── src/
│   │   ├── App.jsx                   # Main app (use refactored version)
│   │   ├── App.refactored.jsx        # Refactored version
│   │   ├── config/                   # Configuration files
│   │   │   ├── constants.js          # App constants
│   │   │   └── messageTypes.js       # Socket message types
│   │   ├── contexts/                 # React contexts
│   │   │   ├── AuthContext.jsx       # Auth state provider
│   │   │   └── SocketContext.jsx     # Socket provider
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.js            # Auth hook
│   │   │   ├── useSocket.js          # Socket hook
│   │   │   └── useRoom.js            # Room management hook
│   │   ├── services/                 # Service layer
│   │   │   └── apiService.js         # API communication
│   │   ├── utils/                    # Utility functions
│   │   │   ├── logger.js             # Logging utility
│   │   │   ├── storage.js            # LocalStorage utils
│   │   │   ├── validation.js         # Input validation
│   │   │   └── helpers.js            # Helper functions
│   │   └── components/               # React components
│   │       └── ErrorBoundary.jsx     # Error boundary
│   └── ...
└── server/
    ├── .env                          # Environment variables
    ├── .env.example                  # Environment template
    ├── index.js                      # Main entry (use refactored version)
    ├── index.refactored.js           # Refactored version
    └── src/
        ├── config/                   # Configuration
        │   ├── constants.js          # Server constants
        │   └── messageTypes.js       # Socket message types
        └── utils/                    # Utility functions
            ├── logger.js             # Logging utility
            ├── validation.js         # Input validation
            └── helpers.js            # Helper functions
```

## Next Steps

1. Review the `REFACTORING.md` document for detailed information
2. Test the refactored code thoroughly
3. Gradually migrate your existing code to use new patterns
4. Add unit tests for utilities and hooks
5. Consider adding TypeScript for type safety

## Support

For issues or questions:
1. Check `REFACTORING.md` for detailed documentation
2. Review the code comments and JSDoc
3. Check the troubleshooting section above

## Contributing

When contributing to the refactored codebase:
1. Use the new patterns (hooks, contexts, constants)
2. Use the logger instead of console.log
3. Add JSDoc comments to all functions
4. Use English for all comments and documentation
5. Validate inputs using validation utilities
6. Handle errors gracefully
