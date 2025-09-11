const { createCanvas, loadImage } = require('canvas');
const moment = require('moment-timezone');

const rows = [
	{ col: 4, row: 10, rewardPoint: 1 },
	{ col: 5, row: 12, rewardPoint: 2 },
	{ col: 6, row: 15, rewardPoint: 3 }
];

module.exports.config = {
    name: "guessnumber",
    aliases: ["gnumber", "guessthecode", "numbergame"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐺𝑢𝑒𝑠𝑠 𝑛𝑢𝑚𝑏𝑒𝑟 𝑔𝑎𝑚𝑒 🎮"
    },
    longDescription: {
        en: "𝐺𝑢𝑒𝑠𝑠 𝑡ℎ𝑒 ℎ𝑖𝑑𝑑𝑒𝑛 𝑛𝑢𝑚𝑏𝑒𝑟 𝑐𝑜𝑑𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ ℎ𝑖𝑛𝑡𝑠 𝑎𝑛𝑑 𝑟𝑎𝑛𝑘𝑖𝑛𝑔 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    category: "𝑔𝑎𝑚𝑒",
    guide: {
        en: "{p}guessnumber [4|5|6] [single|multi]\n{p}guessnumber rank [page]\n{p}guessnumber info [@user|userID]\n{p}guessnumber reset (𝑎𝑑𝑚𝑖𝑛 𝑜𝑛𝑙𝑦)"
    },
    dependencies: { 
        "canvas": "",
        "moment-timezone": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.langs = {
    "en": {
        "charts": "🏆 | 𝑅𝑎𝑛𝑘𝑖𝑛𝑔 𝐿𝑒𝑎𝑑𝑒𝑟𝑏𝑜𝑎𝑟𝑑:\n%1",
        "pageInfo": "📄 𝑃𝑎𝑔𝑒 %1/%2",
        "noScore": "⭕ | 𝑁𝑜 𝑜𝑛𝑒 ℎ𝑎𝑠 𝑠𝑐𝑜𝑟𝑒𝑑 𝑦𝑒𝑡.",
        "noPermissionReset": "⚠️ | 𝑌𝑜𝑢 𝑑𝑜 𝑛𝑜𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑟𝑒𝑠𝑒𝑡 𝑡ℎ𝑒 𝑟𝑎𝑛𝑘𝑖𝑛𝑔.",
        "notFoundUser": "⚠️ | 𝑈𝑠𝑒𝑟 %1 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑟𝑎𝑛𝑘𝑖𝑛𝑔.",
        "userRankInfo": "🏆 | 𝑈𝑠𝑒𝑟 𝑅𝑎𝑛𝑘 𝐼𝑛𝑓𝑜:\n👤 𝑁𝑎𝑚𝑒: %1\n⭐ 𝑆𝑐𝑜𝑟𝑒: %2\n🎮 𝑇𝑜𝑡𝑎𝑙 𝐺𝑎𝑚𝑒𝑠: %3\n✅ 𝑊𝑖𝑛𝑠: %4\n%5\n❌ 𝐿𝑜𝑠𝑠𝑒𝑠: %6\n📊 𝑊𝑖𝑛 𝑅𝑎𝑡𝑒: %7%\n⏰ 𝑇𝑜𝑡𝑎𝑙 𝑇𝑖𝑚𝑒: %8",
        "digits": "%1 𝑑𝑖𝑔𝑖𝑡𝑠: %2",
        "resetRankSuccess": "✅ | 𝑅𝑎𝑛𝑘𝑖𝑛𝑔 𝑟𝑒𝑠𝑒𝑡 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦.",
        "invalidCol": "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 4, 5 𝑜𝑟 6 𝑑𝑖𝑔𝑖𝑡𝑠.",
        "invalidMode": "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 '𝑠𝑖𝑛𝑔𝑙𝑒' 𝑜𝑟 '𝑚𝑢𝑙𝑡𝑖' 𝑚𝑜𝑑𝑒.",
        "created": "✅ | 𝐺𝑎𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
        "gameName": "🔢 𝐺𝑈𝐸𝑆𝑆 𝑇𝐻𝐸 𝑁𝑈𝑀𝐵𝐸𝑅",
        "gameGuide": "⏳ | 𝐻𝑜𝑤 𝑡𝑜 𝑝𝑙𝑎𝑦:\n• 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 %1 𝑔𝑢𝑒𝑠𝑠𝑒𝑠\n• 𝐴𝑓𝑡𝑒𝑟 𝑒𝑎𝑐ℎ 𝑔𝑢𝑒𝑠𝑠, 𝑦𝑜𝑢 𝑔𝑒𝑡 ℎ𝑖𝑛𝑡𝑠:\n  ← 𝐶𝑜𝑟𝑟𝑒𝑐𝑡 𝑑𝑖𝑔𝑖𝑡𝑠\n  → 𝐶𝑜𝑟𝑟𝑒𝑐𝑡 𝑝𝑜𝑠𝑖𝑡𝑖𝑜𝑛𝑠",
        "gameNote": "📄 | 𝑁𝑜𝑡𝑒𝑠:\n• 𝐷𝑖𝑔𝑖𝑡𝑠 𝑓𝑟𝑜𝑚 0-9, 𝑛𝑜 𝑟𝑒𝑝𝑒𝑎𝑡𝑠\n• 𝐶𝑎𝑛 𝑠𝑡𝑎𝑟𝑡 𝑤𝑖𝑡ℎ 0\n• 𝑈𝑛𝑖𝑞𝑢𝑒 𝑑𝑖𝑔𝑖𝑡𝑠 𝑜𝑛𝑙𝑦",
        "replyToPlayGame": "🎮 | 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ %1 𝑑𝑖𝑔𝑖𝑡𝑠 𝑡𝑜 𝑝𝑙𝑎𝑦!",
        "invalidNumbers": "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑒𝑥𝑎𝑐𝑡𝑙𝑦 %1 𝑑𝑖𝑔𝑖𝑡𝑠.",
        "win": "🎉 | 𝑪𝑶𝑵𝑮𝑹𝑨𝑻𝑼𝑳𝑨𝑻𝑰𝑶𝑵𝑺!\n𝑌𝑜𝑢 𝑔𝑢𝑒𝑠𝑠𝑒𝑑 '%1' 𝑖𝑛 %2 𝑡𝑟𝑖𝑒𝑠!\n🏆 +%3 𝑝𝑜𝑖𝑛𝑡𝑠 𝑒𝑎𝑟𝑛𝑒𝑑!",
        "loss": "🤦‍♂️ | 𝑮𝑨𝑴𝑬 𝑶𝑽𝑬𝑹!\n𝑇ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑛𝑢𝑚𝑏𝑒𝑟 𝑤𝑎𝑠: %1\n𝐵𝑒𝑡𝑡𝑒𝑟 𝑙𝑢𝑐𝑘 𝑛𝑒𝑥𝑡 𝑡𝑖𝑚𝑒!",
        "alreadyPlaying": "⚠️ | 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑎 𝑔𝑎𝑚𝑒!",
        "gameExpired": "⏰ | 𝐺𝑎𝑚𝑒 𝑠𝑒𝑠𝑠𝑖𝑜𝑛 𝑒𝑥𝑝𝑖𝑟𝑒𝑑. 𝑆𝑡𝑎𝑟𝑡 𝑎 𝑛𝑒𝑤 𝑜𝑛𝑒."
    }
};

if (!global.guessNumberGames) global.guessNumberGames = new Map();
if (!global.guessNumberRankings) global.guessNumberRankings = [];

function formatString(base = "", ...args) {
    let out = base + "";
    for (let i = 0; i < args.length; i++) {
        out = out.replace(new RegExp(`%${i + 1}`, "g"), args[i]);
    }
    return out;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const lines = text.split('\n');
    let currentY = y;
    
    for (const line of lines) {
        const words = line.split(' ');
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                ctx.fillText(currentLine, x, currentY);
                currentLine = word;
                currentY += lineHeight;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            ctx.fillText(currentLine, x, currentY);
            currentY += lineHeight;
        }
    }
    
    return currentY;
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    
    if (stroke) {
        ctx.strokeStyle = stroke.color || '#000';
        ctx.lineWidth = stroke.width || 1;
        ctx.stroke();
    }
}

function createGameBoard(options) {
    const { col, row, answer, gameName, gameGuide, gameNote } = options;
    
    const cellSize = 80;
    const cellSpacing = 15;
    const padding = 50;
    const headerHeight = 120;
    const footerHeight = 150;
    
    const width = col * (cellSize + cellSpacing) + padding * 2;
    const height = headerHeight + row * (cellSize + cellSpacing) + footerHeight + padding * 2;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, width, height);
    
    // Header
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, width, headerHeight);
    
    // Game title
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.textAlign = 'center';
    ctx.fillText(gameName, width / 2, 40);
    
    // Game grid background
    ctx.fillStyle = '#34495e';
    ctx.fillRect(padding, headerHeight, width - padding * 2, row * (cellSize + cellSpacing));
    
    // Draw grid cells
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < col; c++) {
            const x = padding + c * (cellSize + cellSpacing);
            const y = headerHeight + r * (cellSize + cellSpacing);
            
            drawRoundedRect(ctx, x, y, cellSize, cellSize, 10, '#ecf0f1', {
                color: '#bdc3c7',
                width: 2
            });
        }
    }
    
    // Footer with instructions
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, height - footerHeight, width, footerHeight);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.textAlign = 'left';
    
    let textY = height - footerHeight + 30;
    const instructions = [
        `🎯 𝐺𝑢𝑒𝑠𝑠 𝑡ℎ𝑒 ${col}-𝑑𝑖𝑔𝑖𝑡 𝑐𝑜𝑑𝑒`,
        `📊 𝐻𝑖𝑛𝑡𝑠: ← 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑑𝑖𝑔𝑖𝑡𝑠 → 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑝𝑜𝑠𝑖𝑡𝑖𝑜𝑛𝑠`,
        `⏰ ${row} 𝑎𝑡𝑡𝑒𝑚𝑝𝑡𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒`,
        `💡 𝐷𝑖𝑔𝑖𝑡𝑠 0-9, 𝑛𝑜 𝑟𝑒𝑝𝑒𝑎𝑡𝑠`
    ];
    
    for (const line of instructions) {
        ctx.fillText(line, padding, textY);
        textY += 25;
    }
    
    const imageStream = canvas.createPNGStream();
    return { canvas, ctx, imageStream };
}

function updateGameBoard(gameData, guess, attempt) {
    const { canvas, ctx, col, row, answer } = gameData;
    const cellSize = 80;
    const cellSpacing = 15;
    const padding = 50;
    const headerHeight = 120;
    
    // Draw guess in the grid
    const yPos = headerHeight + attempt * (cellSize + cellSpacing);
    
    for (let c = 0; c < col; c++) {
        const x = padding + c * (cellSize + cellSpacing);
        const y = yPos;
        
        // Clear cell
        drawRoundedRect(ctx, x, y, cellSize, cellSize, 10, '#ecf0f1', {
            color: '#bdc3c7',
            width: 2
        });
        
        // Determine cell color based on correctness
        let cellColor = '#e74c3c'; // Default red (wrong)
        if (guess[c] === answer[c]) {
            cellColor = '#27ae60'; // Green (correct position)
        } else if (answer.includes(guess[c])) {
            cellColor = '#f39c12'; // Orange (correct digit, wrong position)
        }
        
        // Fill cell with color
        drawRoundedRect(ctx, x, y, cellSize, cellSize, 10, cellColor);
        
        // Draw digit
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(guess[c], x + cellSize / 2, y + cellSize / 2);
    }
    
    // Calculate hints
    let correctDigits = 0;
    let correctPositions = 0;
    const answerDigits = answer.split('');
    const guessDigits = guess.split('');
    
    for (let i = 0; i < col; i++) {
        if (answerDigits[i] === guessDigits[i]) {
            correctPositions++;
        }
        if (answerDigits.includes(guessDigits[i])) {
            correctDigits++;
        }
    }
    
    // Draw hints
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.textAlign = 'center';
    
    const hintX = padding + col * (cellSize + cellSpacing) + 30;
    const hintY = yPos + cellSize / 2;
    
    ctx.fillText(`← ${correctDigits}`, hintX, hintY - 15);
    ctx.fillText(`→ ${correctPositions}`, hintX, hintY + 15);
    
    const imageStream = canvas.createPNGStream();
    return { 
        imageStream, 
        isWin: correctPositions === col,
        isGameOver: attempt === row - 1,
        correctDigits,
        correctPositions 
    };
}

function generateNumber(length) {
    const digits = '0123456789'.split('');
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        result += digits[randomIndex];
        digits.splice(randomIndex, 1);
    }
    
    return result;
}

module.exports.onStart = async function({ message, event, args, getLang, usersData, role }) {
    try {
        const userId = event.senderID;
        
        // Clean up expired games
        const now = Date.now();
        for (const [key, game] of global.guessNumberGames.entries()) {
            if (now - game.createdAt > 3600000) { // 1 hour expiration
                global.guessNumberGames.delete(key);
            }
        }
        
        // Handle subcommands
        if (args[0] === 'rank') {
            if (global.guessNumberRankings.length === 0) {
                return message.reply(getLang("noScore"));
            }
            
            const page = parseInt(args[1]) || 1;
            const itemsPerPage = 10;
            const totalPages = Math.ceil(global.guessNumberRankings.length / itemsPerPage);
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            const rankedUsers = global.guessNumberRankings
                .sort((a, b) => b.points - a.points)
                .slice(startIndex, endIndex);
            
            let leaderboard = '';
            const medals = ['🥇', '🥈', '🥉'];
            
            for (let i = 0; i < rankedUsers.length; i++) {
                const user = rankedUsers[i];
                const userName = usersData ? await usersData.getName(user.id) : `User ${user.id}`;
                const medal = medals[i] || `#${startIndex + i + 1}`;
                
                leaderboard += `${medal} ${userName} - ${user.points} pts (${user.wins} wins)\n`;
            }
            
            return message.reply(
                getLang("charts", leaderboard) + 
                '\n' + 
                getLang("pageInfo", page, totalPages)
            );
            
        } else if (args[0] === 'info') {
            let targetId = event.senderID;
            
            if (event.mentions && Object.keys(event.mentions).length > 0) {
                targetId = Object.keys(event.mentions)[0];
            } else if (args[1] && !isNaN(args[1])) {
                targetId = args[1];
            }
            
            const userStats = global.guessNumberRankings.find(u => u.id === targetId);
            if (!userStats) {
                return message.reply(getLang("notFoundUser", targetId));
            }
            
            const userName = usersData ? await usersData.getName(targetId) : `User ${targetId}`;
            const winRate = userStats.gamesPlayed > 0 
                ? ((userStats.wins / userStats.gamesPlayed) * 100).toFixed(1)
                : '0.0';
                
            const digitStats = Object.entries(userStats.digitStats || {})
                .map(([digits, wins]) => getLang("digits", digits, wins))
                .join('\n');
                
            const totalTime = moment.duration(userStats.totalPlayTime || 0).humanize();
            
            return message.reply(getLang("userRankInfo", 
                userName, 
                userStats.points, 
                userStats.gamesPlayed, 
                userStats.wins,
                digitStats,
                userStats.gamesPlayed - userStats.wins,
                winRate,
                totalTime
            ));
            
        } else if (args[0] === 'reset') {
            if (role < 2) {
                return message.reply(getLang("noPermissionReset"));
            }
            
            global.guessNumberRankings = [];
            return message.reply(getLang("resetRankSuccess"));
        }
        
        // Check if user already has an active game
        if (global.guessNumberGames.has(userId)) {
            return message.reply(getLang("alreadyPlaying"));
        }
        
        // Parse difficulty and mode
        const col = parseInt(args[0]) || 4;
        if (![4, 5, 6].includes(col)) {
            return message.reply(getLang("invalidCol"));
        }
        
        const mode = args[1]?.toLowerCase() || 'single';
        if (!['single', 'multi'].includes(mode)) {
            return message.reply(getLang("invalidMode"));
        }
        
        const difficulty = rows.find(r => r.col === col);
        const answer = generateNumber(col);
        
        // Create game data
        const gameData = {
            col,
            row: difficulty.row,
            answer,
            attempts: [],
            currentAttempt: 0,
            mode,
            createdAt: Date.now(),
            userId,
            gameName: getLang("gameName"),
            gameGuide: getLang("gameGuide", difficulty.row),
            gameNote: getLang("gameNote")
        };
        
        // Create initial game board
        const board = createGameBoard(gameData);
        Object.assign(gameData, board);
        
        // Store game
        global.guessNumberGames.set(userId, gameData);
        
        // Send game instructions
        const instructions = `${getLang("created")}\n\n${getLang("gameGuide", difficulty.row)}\n\n${getLang("replyToPlayGame", col)}`;
        await message.reply(instructions);
        
        // Send game board
        const reply = await message.reply({
            attachment: gameData.imageStream
        });
        
        // Store reply message ID for handling
        gameData.messageId = reply.messageID;
        
    } catch (error) {
        console.error('𝐺𝑎𝑚𝑒 𝐸𝑟𝑟𝑜𝑟:', error);
        message.reply('❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ' + error.message);
    }
};

module.exports.onReply = async function({ event, Reply, message, getLang, usersData }) {
    try {
        const userId = event.senderID;
        const guess = event.body.trim();
        
        // Get game data
        const gameData = global.guessNumberGames.get(userId);
        if (!gameData) {
            return message.reply(getLang("gameExpired"));
        }
        
        // Validate guess
        if (!/^\d+$/.test(guess) || guess.length !== gameData.col) {
            return message.reply(getLang("invalidNumbers", gameData.col));
        }
        
        // Check for duplicate digits
        const uniqueDigits = new Set(guess.split(''));
        if (uniqueDigits.size !== guess.length) {
            return message.reply('⚠️ | 𝐷𝑖𝑔𝑖𝑡𝑠 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑢𝑛𝑖𝑞𝑢𝑒! 𝑁𝑜 𝑟𝑒𝑝𝑒𝑎𝑡𝑠 𝑎𝑙𝑙𝑜𝑤𝑒𝑑.');
        }
        
        // Update game board
        const result = updateGameBoard(gameData, guess, gameData.currentAttempt);
        gameData.attempts.push({
            guess,
            correctDigits: result.correctDigits,
            correctPositions: result.correctPositions
        });
        gameData.currentAttempt++;
        
        // Check game outcome
        if (result.isWin || result.isGameOver) {
            // Remove game from active games
            global.guessNumberGames.delete(userId);
            
            // Update rankings
            let userStats = global.guessNumberRankings.find(u => u.id === userId);
            if (!userStats) {
                userStats = {
                    id: userId,
                    points: 0,
                    wins: 0,
                    gamesPlayed: 0,
                    totalPlayTime: 0,
                    digitStats: {}
                };
                global.guessNumberRankings.push(userStats);
            }
            
            userStats.gamesPlayed++;
            userStats.totalPlayTime += (Date.now() - gameData.createdAt);
            
            if (result.isWin) {
                const pointsEarned = rows.find(r => r.col === gameData.col)?.rewardPoint || 1;
                userStats.points += pointsEarned;
                userStats.wins++;
                
                // Update digit-specific stats
                if (!userStats.digitStats[gameData.col]) {
                    userStats.digitStats[gameData.col] = 0;
                }
                userStats.digitStats[gameData.col]++;
                
                await message.reply({
                    body: getLang("win", gameData.answer, gameData.currentAttempt, pointsEarned),
                    attachment: result.imageStream
                });
            } else {
                await message.reply({
                    body: getLang("loss", gameData.answer),
                    attachment: result.imageStream
                });
            }
            
        } else {
            // Game continues, update the message
            await message.reply({
                attachment: result.imageStream
            });
        }
        
    } catch (error) {
        console.error('𝑅𝑒𝑝𝑙𝑦 𝐸𝑟𝑟𝑜𝑟:', error);
        message.reply('❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ' + error.message);
    }
};

module.exports.onChat = async function({ event, message }) {
    // Optional: Add some interactive responses
    const text = event.body?.toLowerCase() || '';
    
    if (text.includes('guess number') || text.includes('number game')) {
        message.reply('🎮 𝑇𝑟𝑦: !guessnumber 4 - 𝑃𝑙𝑎𝑦 𝑤𝑖𝑡ℎ 4 𝑑𝑖𝑔𝑖𝑡𝑠!\n𝑈𝑠𝑒: !guessnumber rank - 𝑆𝑒𝑒 𝑙𝑒𝑎𝑑𝑒𝑟𝑏𝑜𝑎𝑟𝑑');
    }
};
