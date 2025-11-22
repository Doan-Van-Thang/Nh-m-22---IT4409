# Architecture Overview

## Client Architecture (Refactored)

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Application                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Error Boundary                         │  │
│  │  (Catches and handles runtime errors)                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Context Providers                        │  │
│  │  ┌──────────────────┐  ┌──────────────────┐              │  │
│  │  │  AuthContext     │  │  SocketContext   │              │  │
│  │  │  (Auth State)    │  │  (WS Connection) │              │  │
│  │  └──────────────────┘  └──────────────────┘              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     App Component                          │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │            Screen Router                             │ │  │
│  │  │  • LoginScreen                                       │ │  │
│  │  │  • RegisterScreen                                    │ │  │
│  │  │  • MainMenu                                          │ │  │
│  │  │  • LobbyScreen                                       │ │  │
│  │  │  • GameView                                          │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Custom Hooks Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────┐  ┌────────────┐  ┌──────────┐                   │
│  │ useAuth   │  │ useSocket  │  │ useRoom  │                   │
│  │ • login   │  │ • connect  │  │ • create │                   │
│  │ • logout  │  │ • send     │  │ • join   │                   │
│  │ • state   │  │ • listen   │  │ • leave  │                   │
│  └───────────┘  └────────────┘  └──────────┘                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Services Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    API Service                             │  │
│  │  • login()              • getRoomList()                    │  │
│  │  • register()           • getLeaderboard()                 │  │
│  │  • createRoom()         • sendPlayerUpdate()               │  │
│  │  • joinRoom()           • sendFireAction()                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Utilities Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐      │
│  │ Logger  │  │ Storage  │  │ Validation │  │ Helpers  │      │
│  │ • debug │  │ • get    │  │ • username │  │ • delay  │      │
│  │ • info  │  │ • set    │  │ • password │  │ • clone  │      │
│  │ • warn  │  │ • remove │  │ • roomName │  │ • clamp  │      │
│  │ • error │  │ • clear  │  │ • validate │  │ • format │      │
│  └─────────┘  └──────────┘  └────────────┘  └──────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Configuration Layer                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌─────────────────────┐           │
│  │   Constants      │         │   Message Types     │           │
│  │ • SCREENS        │         │ • LOGIN             │           │
│  │ • SOCKET_URL     │         │ • REGISTER          │           │
│  │ • STORAGE_KEYS   │         │ • CREATE_ROOM       │           │
│  │ • GAME_CONFIG    │         │ • JOIN_ROOM         │           │
│  └──────────────────┘         └─────────────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Server Architecture (Refactored)

```
┌─────────────────────────────────────────────────────────────────┐
│                       HTTP/WebSocket Server                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    index.js (Main Entry)                   │  │
│  │  • MongoDB connection                                      │  │
│  │  • Manager initialization                                  │  │
│  │  • Graceful shutdown                                       │  │
│  │  • Error handling                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Managers Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐   │
│  │ NetworkManager  │  │  RoomManager    │  │ GameManager   │   │
│  │ • WebSocket     │  │  • Create room  │  │ • Start game  │   │
│  │ • Auth check    │  │  • Join room    │  │ • End game    │   │
│  │ • Messages      │  │  • Leave room   │  │ • Update      │   │
│  │ • Broadcast     │  │  • Room list    │  │ • Broadcast   │   │
│  └─────────────────┘  └─────────────────┘  └───────────────┘   │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐   │
│  │  AuthManager    │  │ PlayerManager   │  │BulletManager  │   │
│  │  • Login        │  │  • Add player   │  │ • Fire bullet │   │
│  │  • Register     │  │  • Move player  │  │ • Collision   │   │
│  │  • Validate     │  │  • Collision    │  │ • Update      │   │
│  │  • JWT          │  │  • Update       │  │ • Remove      │   │
│  └─────────────────┘  └─────────────────┘  └───────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Game Engine Layer                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    GameEngine                              │  │
│  │  • Game loop (60 FPS)                                      │  │
│  │  • Update world state                                      │  │
│  │  • Check win conditions                                    │  │
│  │  • Broadcast updates                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────┐  ┌──────────┐  ┌────────┐  ┌────────┐          │
│  │  World    │  │  Room    │  │ Tank   │  │ Bullet │          │
│  │  • Map    │  │  • Host  │  │ • Move │  │ • Move │          │
│  │  • Walls  │  │  • Teams │  │ • Fire │  │ • Hit  │          │
│  │  • Bases  │  │  • State │  │ • Hit  │  │ • Kill │          │
│  └───────────┘  └──────────┘  └────────┘  └────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Utilities Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────┐  ┌────────────┐  ┌──────────┐                     │
│  │ Logger  │  │ Validation │  │ Helpers  │                     │
│  │ • debug │  │ • username │  │ • genId  │                     │
│  │ • info  │  │ • password │  │ • distance│                     │
│  │ • warn  │  │ • roomName │  │ • bounds │                     │
│  │ • error │  │ • sanitize │  │ • format │                     │
│  └─────────┘  └────────────┘  └──────────┘                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Configuration Layer                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌─────────────────────┐           │
│  │   Constants      │         │   Message Types     │           │
│  │ • PORT           │         │ • LOGIN             │           │
│  │ • MONGODB_URI    │         │ • REGISTER          │           │
│  │ • JWT_SECRET     │         │ • CREATE_ROOM       │           │
│  │ • GAME_CONFIG    │         │ • GAME_UPDATE       │           │
│  └──────────────────┘         └─────────────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Database Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      MongoDB                               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │  │
│  │  │ Accounts │  │  Users   │  │  Scores  │                │  │
│  │  └──────────┘  └──────────┘  └──────────┘                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
1. User enters credentials
   └─> Client: LoginScreen
       └─> Hook: useAuth.login()
           └─> Service: apiService.login()
               └─> Socket: MESSAGE_TYPES.LOGIN
                   └─> Server: NetworkManager.handleMessage()
                       └─> Manager: AuthManager.login()
                           └─> Database: Account.findOne()
                               └─> JWT: Generate token
                                   └─> Response: MESSAGE_TYPES.LOGIN_SUCCESS
                                       └─> Client: Update auth state
                                           └─> Storage: Save to localStorage
                                               └─> Navigate: Main Menu
```

### Room Creation Flow
```
1. User creates room
   └─> Client: MainMenu
       └─> Hook: useRoom.createRoom()
           └─> Service: apiService.createRoom()
               └─> Socket: MESSAGE_TYPES.CREATE_ROOM
                   └─> Server: NetworkManager.handleMessage()
                       └─> Manager: RoomManager.handleCreateRoom()
                           └─> Model: new Room()
                               └─> Response: MESSAGE_TYPES.JOIN_ROOM_SUCCESS
                                   └─> Client: Update room state
                                       └─> Navigate: Lobby Screen
```

### Game Start Flow
```
1. Host starts game
   └─> Client: LobbyScreen
       └─> Hook: useRoom.startGame()
           └─> Service: apiService.startGame()
               └─> Socket: MESSAGE_TYPES.START_GAME
                   └─> Server: NetworkManager.handleMessage()
                       └─> Manager: RoomManager.handleStartGame()
                           └─> Manager: GameManager.createGame()
                               └─> Engine: new GameEngine()
                                   └─> Engine: Start game loop (60 FPS)
                                       └─> Broadcast: MESSAGE_TYPES.GAME_STARTED
                                           └─> Client: Initialize game
                                               └─> Navigate: Game View
```

### Game Update Flow (60 FPS)
```
Server Loop:
1. GameEngine.loop() [60 times/sec]
   └─> PlayerManager.update()
   └─> BulletManager.update()
   └─> Check collisions
   └─> Check win conditions
   └─> Broadcast: MESSAGE_TYPES.GAME_UPDATE
       └─> All clients receive update

Client Loop:
1. Game.js gameLoop() [60 FPS]
   └─> Receive: MESSAGE_TYPES.GAME_UPDATE
   └─> Update local state (tanks, bullets)
   └─> Render frame
   └─> Send input: MESSAGE_TYPES.PLAYER_INPUT
```

## Benefits of New Architecture

### Separation of Concerns
- **Presentation**: React components
- **Business Logic**: Hooks and services
- **State Management**: Context providers
- **Utilities**: Reusable functions
- **Configuration**: Centralized constants

### Testability
- Hooks can be tested in isolation
- Services can be mocked
- Utilities have no side effects
- Clear interfaces between layers

### Maintainability
- Easy to find where code lives
- Clear dependencies
- Single responsibility principle
- DRY (Don't Repeat Yourself)

### Scalability
- Easy to add new features
- Modular architecture
- Can replace components independently
- Clear extension points

### Developer Experience
- Auto-complete with constants
- Type checking with JSDoc
- Clear error messages
- Easy debugging with logger
