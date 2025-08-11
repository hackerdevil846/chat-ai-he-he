const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: "tictactoe",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Asif Developer",
    description: "Play Tic Tac Toe against an unbeatable AI",
    category: "games",
    usages: "[x|o|delete|continue]",
    cooldowns: 5,
    dependencies: {
      "canvas": "",
      "fs": ""
    }
  },

  // Add required onStart function
  onStart: function() {
    // Initialization logic can go here if needed
    // (Not required for this game but needed by the system)
  },

  gameData: new Map(),

  startBoard: function({ isX, threadID }) {
    const boardData = {
      board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      isX: isX,
      gameOn: true,
      gameOver: false,
      player: ""
    };
    this.gameData.set(threadID, boardData);
    return boardData;
  },

  displayBoard: async function(data) {
    const path = `${__dirname}/cache/tictactoe_${Date.now()}.png`;
    const canvas = createCanvas(1200, 1200);
    const ctx = canvas.getContext('2d');
    
    const background = await loadImage('https://i.postimg.cc/nhDWmj1h/background.png');
    ctx.drawImage(background, 0, 0, 1200, 1200);
    
    const imgO = await loadImage('https://i.postimg.cc/rFP6xLXQ/O.png');
    const imgX = await loadImage('https://i.postimg.cc/HLbFqcJh/X.png');
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellValue = data.board[i][j];
        const x = 54 + 366 * j;
        const y = 54 + 366 * i;
        
        if (cellValue === 1) {
          ctx.drawImage(data.isX ? imgO : imgX, x, y, 360, 360);
        } 
        else if (cellValue === 2) {
          ctx.drawImage(data.isX ? imgX : imgO, x, y, 360, 360);
        }
      }
    }
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path, buffer);
    return fs.createReadStream(path);
  },

  checkAIWon: function(data) {
    const b = data.board;
    
    if ((b[0][0] === 1 && b[1][1] === 1 && b[2][2] === 1) ||
        (b[0][2] === 1 && b[1][1] === 1 && b[2][0] === 1)) {
      return true;
    }
    
    for (let i = 0; i < 3; i++) {
      if ((b[i][0] === 1 && b[i][1] === 1 && b[i][2] === 1) ||
          (b[0][i] === 1 && b[1][i] === 1 && b[2][i] === 1)) {
        return true;
      }
    }
    
    return false;
  },

  checkPlayerWon: function(data) {
    const b = data.board;
    
    if ((b[0][0] === 2 && b[1][1] === 2 && b[2][2] === 2) ||
        (b[0][2] === 2 && b[1][1] === 2 && b[2][0] === 2)) {
      return true;
    }
    
    for (let i = 0; i < 3; i++) {
      if ((b[i][0] === 2 && b[i][1] === 2 && b[i][2] === 2) ||
          (b[0][i] === 2 && b[1][i] === 2 && b[2][i] === 2)) {
        return true;
      }
    }
    
    return false;
  },

  solveAIMove: function({ depth, turn, data }) {
    if (this.checkAIWon(data)) return 1;
    if (this.checkPlayerWon(data)) return -1;
    
    const availablePoints = this.getAvailable(data);
    if (availablePoints.length === 0) return 0;
    
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    let bestMove = null;
    
    for (const point of availablePoints) {
      this.placeMove({ point, player: turn, data });
      const currentScore = this.solveAIMove({
        depth: depth + 1,
        turn: turn === 1 ? 2 : 1,
        data
      });
      this.placeMove({ point, player: 0, data });
      
      if (turn === 1) {
        if (currentScore > max) {
          max = currentScore;
          if (depth === 0) bestMove = point;
        }
      } else {
        if (currentScore < min) {
          min = currentScore;
        }
      }
    }
    
    if (depth === 0) {
      return bestMove || availablePoints[0];
    }
    
    return turn === 1 ? max : min;
  },

  placeMove: function({ point, player, data }) {
    data.board[point[0]][point[1]] = player;
  },

  getAvailable: function(data) {
    const availableMoves = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (data.board[i][j] === 0) {
          availableMoves.push([i, j]);
        }
      }
    }
    return availableMoves;
  },

  move: function(x, y, data) {
    const availablePoints = this.getAvailable(data);
    
    if (!availablePoints.some(pt => pt[0] === x && pt[1] === y)) {
      return false;
    }
    
    this.placeMove({ point: [x, y], player: 2, data });
    
    if (this.getAvailable(data).length > 0 && !this.checkGameOver(data)) {
      const aiMove = this.solveAIMove({ depth: 0, turn: 1, data });
      if (aiMove) {
        this.placeMove({ point: aiMove, player: 1, data });
      }
    }
    
    return true;
  },

  checkGameOver: function(data) {
    return (
      this.getAvailable(data).length === 0 ||
      this.checkAIWon(data) ||
      this.checkPlayerWon(data)
    );
  },

  onReply: async function({ event, api, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    const data = this.gameData.get(threadID);
    
    if (!data || !data.gameOn) return;
    if (data.player !== senderID) {
      return api.sendMessage("❌ This isn't your game!", threadID, messageID);
    }
    
    const number = parseInt(body);
    if (isNaN(number) || number < 1 || number > 9) {
      return api.sendMessage("🔢 Please enter a number between 1-9", threadID, messageID);
    }
    
    const row = Math.floor((number - 1) / 3);
    const col = (number - 1) % 3;
    
    if (!this.move(row, col, data)) {
      return api.sendMessage("❌ That cell is already taken!", threadID, messageID);
    }
    
    let resultMessage = "Your turn! Reply with cell number (1-9)";
    const taunts = [
      "Better luck next time! 🐔",
      "AI wins! 👒",
      "Outplayed! 🎂",
      "Too easy for me! 👶",
      "GG! 🍗",
      "I'm unbeatable! 😎"
    ];
    
    if (this.checkGameOver(data)) {
      if (this.checkAIWon(data)) {
        resultMessage = `You lose! ${taunts[Math.floor(Math.random() * taunts.length)]}`;
      } 
      else if (this.checkPlayerWon(data)) {
        resultMessage = "🎉 You win! Amazing! 😎";
      } 
      else {
        resultMessage = "🤝 It's a tie! Good game!";
      }
      data.gameOn = false;
      this.gameData.delete(threadID);
    }
    
    try {
      const attachment = await this.displayBoard(data);
      api.sendMessage({
        body: resultMessage,
        attachment: attachment
      }, threadID, () => {
        try {
          fs.unlinkSync(attachment.path);
        } catch (e) {}
      }, messageID);
    } catch (error) {
      console.error("Board error:", error);
      api.sendMessage("❌ Error updating board. Game restarted.", threadID, messageID);
      this.gameData.delete(threadID);
    }
  },

  run: async function({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const command = args[0]?.toLowerCase();

    if (command === "delete") {
      this.gameData.delete(threadID);
      return api.sendMessage("✅ Game board deleted!", threadID, messageID);
    }
    
    if (command === "continue") {
      const data = this.gameData.get(threadID);
      if (!data || !data.gameOn) {
        return api.sendMessage("ℹ️ No active game found! Start new with 'x' or 'o'", threadID, messageID);
      }
      
      try {
        const attachment = await this.displayBoard(data);
        return api.sendMessage({
          body: "▶️ Game resumed! Reply with cell number (1-9)",
          attachment: attachment
        }, threadID, () => {
          try { fs.unlinkSync(attachment.path); } catch (e) {}
        }, messageID);
      } catch (error) {
        this.gameData.delete(threadID);
        return api.sendMessage("❌ Error resuming game. Start new one.", threadID, messageID);
      }
    }
    
    if (!command || !["x", "o"].includes(command)) {
      return api.sendMessage(
        `🎮 Tic Tac Toe Commands 🎮\n\n` +
        `Start: tictactoe [x|o]\n` +
        `• x - Play as X (first move)\n` +
        `• o - Play as O (AI first)\n\n` +
        `Manage: tictactoe [delete|continue]\n` +
        `Board Layout:\n` +
        `1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣\n\n` +
        `Reply with numbers 1-9 to play!`,
        threadID, messageID
      );
    }
    
    try {
      const newData = this.startBoard({
        isX: command === "x",
        threadID: threadID
      });
      newData.player = senderID;
      
      let message = "⏩ You go first! Reply with cell number (1-9)";
      if (command === "o") {
        const aiMove = [
          Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 3)
        ];
        this.placeMove({ point: aiMove, player: 1, data: newData });
        message = "🤖 AI goes first! Reply with cell number (1-9)";
      }
      
      const attachment = await this.displayBoard(newData);
      api.sendMessage({
        body: message,
        attachment: attachment
      }, threadID, () => {
        try { fs.unlinkSync(attachment.path); } catch (e) {}
      }, messageID);
    } catch (error) {
      console.error("Start error:", error);
      api.sendMessage("❌ Failed to start game. Try again later.", threadID, messageID);
    }
  }
};
