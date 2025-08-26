"use strict";

let games = {};
let points = {}; // Point system

function checkWinner(board) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (const [a,b,c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

function displayBoard(board) {
  let out = "";
  for (let i = 0; i < 9; i++) {
    out += board[i] ?? "⬛";
    out += (i + 1) % 3 === 0 ? "\n" : " ";
  }
  return out;
}

function makeBotMove(board) {
  const bot = "⭕";
  const player = "❌";

  // Try winning
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = bot;
      if (checkWinner(board)) return;
      board[i] = null;
    }
  }
  // Block player
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = player;
      if (checkWinner(board)) {
        board[i] = bot;
        return;
      }
      board[i] = null;
    }
  }
  // Else random
  const empty = board.map((v, i) => v === null ? i : -1).filter(v => v !== -1);
  const rand = empty[Math.floor(Math.random() * empty.length)];
  if (rand !== undefined) board[rand] = bot;
}

function resetGame(playerID) {
  games[playerID] = {
    board: Array(9).fill(null)
  };
}

module.exports.config = {
  name: "ttt",
  version: "2.2",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Play TicTacToe with bot",
  category: "game",
  usages: "[stop|exit]",
  cooldowns: 2
};

module.exports.onStart = async function ({ event, api, args }) {
  const id = event.senderID;
  const threadID = event.threadID;
  const sub = args[0]?.toLowerCase();

  // Stop logic
  if (sub && ["stop", "exit", "off"].includes(sub)) {
    if (games[id]) {
      delete games[id];
      return api.sendMessage("🛑 Game stopped. আবার খেলতে টাইপ করুন: ttt", threadID);
    } else {
      return api.sendMessage("কোন active game নেই। খেলতে টাইপ করুন: ttt", threadID);
    }
  }

  // Start new game
  resetGame(id);
  if (!points[id]) points[id] = { win: 0, draw: 0, lose: 0 };

  const msg = `🎮 Let's play TicTacToe!
You are ❌, Bot is ⭕
Reply with number 1-9

📊 Current Score:
✅ Wins: ${points[id].win}
🤝 Draws: ${points[id].draw}
❌ Losses: ${points[id].lose}

To stop the game: type "ttt stop"`;

  await api.sendMessage(msg, threadID);
  return api.sendMessage(displayBoard(games[id].board), threadID);
};

module.exports.handleEvent = async function ({ event, api }) {
  const id = event.senderID;
  const threadID = event.threadID;
  const text = event.body?.trim();

  // শুধু 1-9 হলে কাজ করবে
  if (!/^[1-9]$/.test(text)) return;

  if (!games[id]) return;

  const pos = parseInt(text, 10);
  if (games[id].board[pos - 1]) {
    return api.sendMessage("❗ Invalid move. Try an empty cell (1-9).", threadID);
  }

  // User move
  games[id].board[pos - 1] = "❌";

  // Check user win
  let winner = checkWinner(games[id].board);
  if (winner) {
    points[id].win++;
    await api.sendMessage(displayBoard(games[id].board), threadID);
    delete games[id];
    return api.sendMessage("🎉 You win! 🎉", threadID);
  }

  // Check draw
  if (isBoardFull(games[id].board)) {
    points[id].draw++;
    await api.sendMessage(displayBoard(games[id].board), threadID);
    delete games[id];
    return api.sendMessage("🤝 It's a draw!", threadID);
  }

  // Bot move
  makeBotMove(games[id].board);

  winner = checkWinner(games[id].board);
  if (winner) {
    points[id].lose++;
    await api.sendMessage(displayBoard(games[id].board), threadID);
    delete games[id];
    return api.sendMessage("😢 You lost!", threadID);
  }

  if (isBoardFull(games[id].board)) {
    points[id].draw++;
    await api.sendMessage(displayBoard(games[id].board), threadID);
    delete games[id];
    return api.sendMessage("🤝 It's a draw!", threadID);
  }

  // Continue game
  return api.sendMessage(displayBoard(games[id].board), threadID);
};
