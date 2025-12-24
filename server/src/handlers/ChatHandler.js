import { MESSAGE_TYPES } from '../config/messageTypes.js';
import { sanitizeInput } from '../utils/validation.js';

const CHAT_COOLDOWN_MS = 500;
export default class ChatHandler {
    constructor(networkManager) {
        this.networkManager = networkManager;
        this.lastMessageTimes = new Map();
    }
    handle(ws, player, data) {
        if (!player) return;
        const now = Date.now();
        const lastTime = this.lastMessageTimes.get(player.id) || 0;
        if (now - lastTime < CHAT_COOLDOWN_MS) {
            ws.send(JSON.stringify({
                type: MESSAGE_TYPES.CHAT_MESSAGE, 
                senderName: "System",
                content: "Bạn đang chat quá nhanh! Hãy đợi một chút.",
                scope: "SYSTEM"
            }));
            return; 
        }
        let content = data.content;
        if (!content || typeof content !== 'string' || content.trim().length === 0) return;
        content = content.substring(0, 100);
        content = sanitizeInput(content);
        const messagePayload = {
            type: MESSAGE_TYPES.CHAT_BROADCAST,
            senderId: player.id,
            senderName: player.name,
            content: content,
            scope: data.scope,
            timestamp: Date.now()
        };
        if (data.scope === 'ROOM') {
            const roomId = this.networkManager.roomManager.playerToRoom.get(player.id);
            if (roomId) {
                this.networkManager.broadcastToRoom(roomId, messagePayload);
            }
        } else {
            this.networkManager.wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify(messagePayload));
                }
            });
        }
    }
    removePlayer(playerId) {
        this.lastMessageTimes.delete(playerId);
    }

}