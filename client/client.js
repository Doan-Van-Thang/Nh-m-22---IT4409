import { Game } from './Game.js';


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx);
game.startGame(); // Bắt đầu vòng lặp game