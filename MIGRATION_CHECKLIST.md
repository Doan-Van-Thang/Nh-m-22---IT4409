# Migration Checklist

Use this checklist to track your progress when migrating to the refactored codebase.

## Phase 1: Setup ⚙️

- [ ] Copy `client/.env.example` to `client/.env`
- [ ] Copy `server/.env.example` to `server/.env`
- [ ] Update environment variables in both `.env` files
- [ ] Review `QUICKSTART.md` for setup instructions
- [ ] Review `REFACTORING.md` for detailed documentation
- [ ] Review `SUMMARY.md` for overview

## Phase 2: Test New Files 🧪

### Client Testing
- [ ] Test logger utility (`client/src/utils/logger.js`)
- [ ] Test storage utility (`client/src/utils/storage.js`)
- [ ] Test validation functions (`client/src/utils/validation.js`)
- [ ] Test helper functions (`client/src/utils/helpers.js`)
- [ ] Test useAuth hook (`client/src/hooks/useAuth.js`)
- [ ] Test useSocket hook (`client/src/hooks/useSocket.js`)
- [ ] Test useRoom hook (`client/src/hooks/useRoom.js`)
- [ ] Test API service (`client/src/services/apiService.js`)
- [ ] Test ErrorBoundary component (`client/src/components/ErrorBoundary.jsx`)

### Server Testing
- [ ] Test logger utility (`server/src/utils/logger.js`)
- [ ] Test validation functions (`server/src/utils/validation.js`)
- [ ] Test helper functions (`server/src/utils/helpers.js`)
- [ ] Test constants configuration (`server/src/config/constants.js`)
- [ ] Test message types (`server/src/config/messageTypes.js`)

## Phase 3: Gradual Migration 🔄

### Update Existing Code
- [ ] Replace `console.log` with logger in client files
- [ ] Replace `console.log` with logger in server files
- [ ] Replace hardcoded strings with MESSAGE_TYPES constants
- [ ] Replace direct localStorage with storage utilities
- [ ] Replace hardcoded configs with constants
- [ ] Add error handling to critical sections
- [ ] Add input validation to forms

### Component Updates (Optional - Do gradually)
- [ ] Update LoginScreen.jsx to use new patterns
- [ ] Update RegisterScreen.jsx to use validation
- [ ] Update MainMenu.jsx to use hooks
- [ ] Update LobbyScreen.jsx to use hooks
- [ ] Update GameView.jsx to use new patterns
- [ ] Update RoomList.jsx to use new patterns

### Server Updates (Optional - Do gradually)
- [ ] Update NetworkManager.js to use logger and constants
- [ ] Update GameEngine.js to use logger
- [ ] Update RoomManager.js to use validation
- [ ] Update AuthManager.js to use validation
- [ ] Update GameManager.js to use logger

## Phase 4: Full Migration 🚀

### Replace Core Files
- [ ] Backup current `client/src/App.jsx` as `App.old.jsx`
- [ ] Rename `client/src/App.refactored.jsx` to `App.jsx`
- [ ] Test client application thoroughly
- [ ] Fix any issues that arise

- [ ] Backup current `server/index.js` as `index.old.js`
- [ ] Rename `server/index.refactored.js` to `index.js`
- [ ] Test server application thoroughly
- [ ] Fix any issues that arise

### Integration Testing
- [ ] Test user registration flow
- [ ] Test user login flow
- [ ] Test authentication token validation
- [ ] Test room creation
- [ ] Test room joining
- [ ] Test room leaving
- [ ] Test team switching
- [ ] Test game start
- [ ] Test game play
- [ ] Test game end
- [ ] Test leaderboard
- [ ] Test logout
- [ ] Test error scenarios
- [ ] Test connection failures
- [ ] Test reconnection

## Phase 5: Cleanup 🧹

### Remove Old Files (Optional)
- [ ] Remove `client/src/App.old.jsx` (keep backup elsewhere)
- [ ] Remove `server/index.old.js` (keep backup elsewhere)
- [ ] Remove unused imports
- [ ] Remove commented-out code
- [ ] Remove debug console.logs (if any remain)

### Code Quality
- [ ] Replace Vietnamese comments with English
- [ ] Add JSDoc comments to all functions
- [ ] Ensure consistent formatting
- [ ] Run linter (if configured)
- [ ] Check for TypeScript errors (if using TS)

## Phase 6: Documentation 📚

- [ ] Update README.md with new structure
- [ ] Document new patterns and conventions
- [ ] Create troubleshooting guide for common issues
- [ ] Document API service usage
- [ ] Document custom hooks usage
- [ ] Document context providers usage

## Phase 7: Testing & Quality Assurance 🎯

### Unit Tests (Future)
- [ ] Write tests for logger
- [ ] Write tests for storage utils
- [ ] Write tests for validation functions
- [ ] Write tests for helper functions
- [ ] Write tests for custom hooks
- [ ] Write tests for API service

### Integration Tests (Future)
- [ ] Write tests for authentication flow
- [ ] Write tests for room management
- [ ] Write tests for game flow
- [ ] Write tests for error handling

### Performance Testing
- [ ] Test with multiple concurrent users
- [ ] Monitor memory usage
- [ ] Check for memory leaks
- [ ] Optimize if needed

## Phase 8: Deployment Preparation 🌐

### Security
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Change default JWT_SECRET in production
- [ ] Enable HTTPS in production
- [ ] Add rate limiting
- [ ] Add input sanitization
- [ ] Review security best practices

### Production Configuration
- [ ] Set NODE_ENV=production
- [ ] Set LOG_LEVEL=info or warn
- [ ] Set VITE_DEBUG_MODE=false
- [ ] Configure production MongoDB URI
- [ ] Set up environment variables on server
- [ ] Test production build

### Deployment
- [ ] Build client for production (`npm run build`)
- [ ] Deploy server
- [ ] Deploy client
- [ ] Test production deployment
- [ ] Monitor logs for errors
- [ ] Set up monitoring and alerting

## Progress Tracking

**Started**: _______________  
**Phase 1 Completed**: _______________  
**Phase 2 Completed**: _______________  
**Phase 3 Completed**: _______________  
**Phase 4 Completed**: _______________  
**Phase 5 Completed**: _______________  
**Phase 6 Completed**: _______________  
**Phase 7 Completed**: _______________  
**Phase 8 Completed**: _______________  

**Fully Migrated**: _______________

## Notes

Use this space to track issues, blockers, or important decisions:

```
[Date] - [Note]
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________
```

## Support

If you encounter issues during migration:
1. Check `REFACTORING.md` for detailed documentation
2. Check `QUICKSTART.md` for common issues
3. Review code comments and JSDoc
4. Test individual components in isolation
5. Roll back to previous version if needed

---

**Good luck with your migration! 🎉**
