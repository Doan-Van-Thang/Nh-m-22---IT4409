# Tank Game - Refactoring Documentation

## Overview

This document describes the refactoring improvements made to the Tank Game project to enhance code quality, maintainability, and scalability.

## Key Improvements

### 1. Configuration Management

#### Client-Side
- **Location**: `client/src/config/`
- **Files**:
  - `constants.js` - Application constants (screens, storage keys, URLs, game config)
  - `messageTypes.js` - WebSocket message type constants

#### Server-Side
- **Location**: `server/src/config/`
- **Files**:
  - `constants.js` - Server configuration (port, MongoDB URI, JWT settings)
  - `messageTypes.js` - WebSocket message type constants (synced with client)

#### Benefits:
- Centralized configuration
- Easy to modify settings
- Type-safe message handling
- Environment-based configuration via `.env` files

### 2. React Custom Hooks

#### Location: `client/src/hooks/`

#### `useAuth.js`
- Manages authentication state
- Handles login/logout operations
- Syncs with localStorage
- Provides authentication status

**Usage:**
```jsx
const { auth, login, logout, isAuthenticated } = useAuth();
```

#### `useSocket.js`
- Manages WebSocket connection lifecycle
- Provides connection status
- Handles message sending
- Auto-cleanup on unmount

**Usage:**
```jsx
const { socket, isConnected, send, addMessageListener } = useSocket(SOCKET_URL);
```

### 3. React Context Providers

#### Location: `client/src/contexts/`

#### `AuthContext.jsx`
- Provides authentication state globally
- Eliminates prop drilling
- Centralized auth logic

**Usage:**
```jsx
const { auth, login, logout } = useAuthContext();
```

#### `SocketContext.jsx`
- Provides socket instance globally
- Manages WebSocket lifecycle
- Eliminates prop drilling

**Usage:**
```jsx
const { socket, send, isConnected } = useSocketContext();
```

### 4. Logging Utility

#### Client: `client/src/utils/logger.js`
#### Server: `server/src/utils/logger.js`

Features:
- Configurable log levels (ERROR, WARN, INFO, DEBUG)
- Environment-based toggling
- Consistent logging format
- Easy to filter in production

**Usage:**
```javascript
import logger from './utils/logger.js';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### 5. Storage Utilities

#### Location: `client/src/utils/storage.js`

Features:
- Safe localStorage operations
- JSON parsing/serialization
- Error handling
- Typed API

**Functions:**
- `getStorageItem(key, defaultValue)`
- `setStorageItem(key, value)`
- `removeStorageItem(key)`
- `clearStorage()`

### 6. Error Boundary

#### Location: `client/src/components/ErrorBoundary.jsx`

Features:
- Catches React component errors
- Prevents app crashes
- User-friendly error display
- Automatic error logging

### 7. Refactored App Component

#### Location: `client/src/App.refactored.jsx`

Improvements:
- Uses Context providers for state management
- Separated concerns with custom hooks
- Better message handling with constants
- Cleaner component structure
- Wrapped in ErrorBoundary

### 8. Refactored Server Entry Point

#### Location: `server/index.refactored.js`

Improvements:
- Proper error handling
- Graceful shutdown handling
- Better logging
- Uses configuration constants
- Handles unhandled rejections

## Migration Guide

### Step 1: Environment Setup

1. Copy environment templates:
```bash
# Client
cp client/.env.example client/.env

# Server
cp server/.env.example server/.env
```

2. Update `.env` files with your configuration

### Step 2: Replace Old Files

#### Client:
```bash
# Backup current App.jsx
mv client/src/App.jsx client/src/App.old.jsx

# Use refactored version
mv client/src/App.refactored.jsx client/src/App.jsx
```

#### Server:
```bash
# Backup current index.js
mv server/index.js server/index.old.js

# Use refactored version
mv server/index.refactored.js server/index.js
```

### Step 3: Update Imports

Update all files that use:
- Console.log → logger
- Hardcoded strings → MESSAGE_TYPES constants
- Direct localStorage → storage utilities

### Step 4: Test

1. Start the server:
```bash
cd server
npm start
```

2. Start the client:
```bash
cd client
npm run dev
```

3. Test all features:
   - Login/Register
   - Room creation/joining
   - Game play
   - Leaderboard

## File Structure

```
Main/
├── client/
│   ├── .env.example
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js
│   │   │   └── messageTypes.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useSocket.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── storage.js
│   │   └── components/
│   │       └── ErrorBoundary.jsx
│   └── ...
└── server/
    ├── .env.example
    ├── src/
    │   ├── config/
    │   │   ├── constants.js
    │   │   └── messageTypes.js
    │   └── utils/
    │       └── logger.js
    └── ...
```

## Best Practices

### 1. Use Constants
```javascript
// ❌ Bad
socket.send({ type: 'login', ... });

// ✅ Good
import MESSAGE_TYPES from './config/messageTypes.js';
socket.send({ type: MESSAGE_TYPES.LOGIN, ... });
```

### 2. Use Logger
```javascript
// ❌ Bad
console.log('User logged in');

// ✅ Good
import logger from './utils/logger.js';
logger.info('User logged in');
```

### 3. Use Storage Utilities
```javascript
// ❌ Bad
localStorage.setItem('auth', JSON.stringify(data));

// ✅ Good
import { setStorageItem } from './utils/storage.js';
import { STORAGE_KEYS } from './config/constants.js';
setStorageItem(STORAGE_KEYS.AUTH_DATA, data);
```

### 4. Use Context
```javascript
// ❌ Bad - Prop drilling
<Component socket={socket} auth={auth} />

// ✅ Good - Context
const { socket } = useSocketContext();
const { auth } = useAuthContext();
```

## Benefits Summary

1. **Better Maintainability**: Centralized configuration and utilities
2. **Type Safety**: Constants prevent typos in message types
3. **Easier Testing**: Modular hooks and utilities
4. **Better Error Handling**: Error boundaries and logging
5. **Cleaner Code**: Separation of concerns
6. **Scalability**: Easy to extend and modify
7. **Developer Experience**: Better debugging with proper logging

## Next Steps

1. Replace Vietnamese comments with English JSDoc
2. Add unit tests for utilities and hooks
3. Add PropTypes or TypeScript for type checking
4. Implement authentication middleware
5. Add request rate limiting
6. Implement proper session management

## Questions?

For questions or issues, please refer to the main README.md or contact the development team.
