import http from "http";
import express from "express";
import { Server } from "socket.io";
import Game from "./Game.js";
import { createId } from "./src/model/utils.js";

// 1. Khởi tạo Game Logic
const game = new Game();

// 2. Khởi tạo HTTP + Express + Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Cho phép client khác domain kết nối
});

// 3. Xử lý kết nối Socket.IO
io.on("connection", (socket) => {
  const playerId = createId();
  console.log(`Player ${playerId} connected.`);

  // Thêm người chơi vào game
  const initData = game.addPlayer(playerId);

  // Gửi dữ liệu khởi tạo riêng cho player này
  socket.emit("init", { playerId, ...initData });

  // Xử lý các sự kiện do client gửi
  socket.on("input", (data) => {
    // Ủy thác cho Game xử lý
    game.handleMessage(playerId, data);
  });

  socket.on("disconnect", () => {
    console.log(`Player ${playerId} disconnected.`);
    game.removePlayer(playerId);
  });
});

// 4. Cấu hình broadcast callback (dùng io.emit thay vì ws.send)
const broadcastCallback = (statePayload) => {
  // Gửi đến tất cả client (Socket.IO tự mã hóa JSON)
  io.emit("state", JSON.parse(statePayload));
};

// 5. Bắt đầu game loop
game.startLoop(broadcastCallback);

// 6. Chạy server
const port = process.env.PORT || 5173;
server.listen(port, () => {
  console.log(`Socket.IO Game Server running on port ${port}`);
});
