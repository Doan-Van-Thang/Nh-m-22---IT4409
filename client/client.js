// Sửa đường dẫn import cho đúng
import { Game } from './src/Game.js';
// Thêm User để khởi tạo người chơi
import { User } from './src/model/User.js';

// Lấy các thành phần DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Thiết lập Canvas (Nên làm ở đây) ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // TODO: Báo cho game biết là canvas đã resize (nếu cần)
    // gameScreen.onCanvasResize(); 
});

// --- Quản lý màn hình (Screen Manager) ---
// Khởi tạo và bắt đầu màn hình Game.
const gameScreen = new Game(canvas, ctx);

// --- Thêm người chơi (Player) ---
// Tạo một user giả để test
const localPlayer = new User();
localPlayer.id = "local";
localPlayer.name = "Player 1";
// Thêm user này vào game, Game.js sẽ tự tạo tank cho user
gameScreen.addUser(localPlayer);

// Bắt đầu game
gameScreen.start();

console.log("Client.js đã tải. Khởi động GameScreen...");
// XÓA DẤU } THỪA Ở ĐÂY