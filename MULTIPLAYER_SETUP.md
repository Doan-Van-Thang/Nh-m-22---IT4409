# How to Play with Friends on Local Network

## Problem Fixed ✅

Your friend couldn't connect because:
1. Server was only listening on `localhost` (not accessible from other computers)
2. Client was configured to connect to `localhost` instead of your IP address

## Changes Made

### 1. Server Configuration
- **File**: `server/index.js`
- **Change**: Server now listens on `0.0.0.0` (all network interfaces)
- **Result**: Your server is now accessible from other devices on your network

### 2. Client Configuration  
- **File**: `client/.env`
- **Change**: Updated `VITE_WS_HOST` from `localhost` to `192.168.0.103`
- **Result**: Client will now connect to your IP address instead of localhost

## Steps to Play with Friends

### Step 1: Restart Both Server and Client

**IMPORTANT**: You must restart for changes to take effect!

```powershell
# Stop current servers (Ctrl+C in both terminals)

# Then restart:
.\start.ps1
```

### Step 2: Configure Windows Firewall

You need to allow incoming connections on ports **5173** (client) and **5174** (server):

#### Option A: Using PowerShell (Run as Administrator)
```powershell
# Allow Vite dev server (port 5173)
New-NetFirewallRule -DisplayName "Tank Game Client" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow

# Allow game server (port 5174)
New-NetFirewallRule -DisplayName "Tank Game Server" -Direction Inbound -Protocol TCP -LocalPort 5174 -Action Allow
```

#### Option B: Using Windows Firewall GUI
1. Open **Windows Defender Firewall** → Advanced Settings
2. Click **Inbound Rules** → New Rule
3. Select **Port** → Next
4. Enter port **5173** → Next
5. Allow the connection → Next
6. Apply to all profiles → Next
7. Name it "Tank Game Client" → Finish
8. **Repeat for port 5174** (name it "Tank Game Server")

### Step 3: Share Your IP Address

Tell your friend to connect to:
- **Client URL**: `http://192.168.0.103:5173`

That's it! Your friend should now be able to:
1. Access the game UI at `http://192.168.0.103:5173`
2. Connect to the WebSocket server automatically
3. Login/register and play with you

## Troubleshooting

### If Friend Still Can't Connect

#### 1. Verify Your IP Address
Your IP might have changed. Check it with:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x)

If it changed, update `client/.env`:
```env
VITE_WS_HOST=YOUR_NEW_IP
```

#### 2. Check Firewall Rules
```powershell
# List firewall rules for port 5173
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Tank Game*"}
```

#### 3. Test Server Accessibility
From your friend's computer, open browser and go to:
- `http://192.168.0.103:5174` (should show "Tank Game Server is running.")

If this doesn't work, firewall is blocking it.

#### 4. Check Both Are on Same Network
- Both computers must be on the **same WiFi/network**
- Check if your network allows device-to-device communication (some public WiFi blocks this)

#### 5. Disable Antivirus Temporarily
Sometimes antivirus software blocks incoming connections. Try temporarily disabling it for testing.

#### 6. Check Server Console
Look for this message in server terminal:
```
Server started successfully on http://0.0.0.0:5174
Access from other devices using: http://192.168.0.103:5174
```

### If You Get WebSocket Errors

Check browser console (F12) on friend's computer. If you see:
```
WebSocket connection failed to ws://localhost:5174
```

This means the client wasn't rebuilt after changing `.env`. Restart with:
```powershell
.\start.ps1
```

## Playing on Your Own Computer

If you want to test locally (just you, no friends), change back to:

**client/.env**:
```env
VITE_WS_HOST=localhost
```

Then restart both servers.

## Network Requirements

✅ Both players on same WiFi/LAN  
✅ Firewall allows ports 5173 and 5174  
✅ Server listening on 0.0.0.0  
✅ Client configured with server's IP  
✅ MongoDB running on server computer  

## Advanced: Playing Over Internet (Port Forwarding)

If you want friends from outside your network to play:

1. **Router Port Forwarding**: Forward ports 5173 and 5174 to your computer's local IP
2. **Use Your Public IP**: Update `.env` with your public IP (check at whatismyip.com)
3. **Dynamic DNS**: Use services like No-IP if your public IP changes
4. **Security Warning**: Only do this temporarily, as it exposes your server to the internet

## Quick Reference

| Component | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Vite Client | 5173 | HTTP/WS | Game UI |
| Game Server | 5174 | HTTP/WS | Game logic & WebSocket |
| MongoDB | 27017 | TCP | Database (local only) |

## Current Configuration

- **Your IP**: `192.168.0.103`
- **Client URL**: `http://192.168.0.103:5173`
- **Server URL**: `http://192.168.0.103:5174`
- **WebSocket**: `ws://192.168.0.103:5174`

---

**Note**: If your IP address changes (after router restart, etc.), you'll need to update `client/.env` and restart the client.
