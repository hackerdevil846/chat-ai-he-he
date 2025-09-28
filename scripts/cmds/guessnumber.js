const moment = require('moment-timezone');

const rows = [
    { col: 4, row: 10, rewardPoint: 1 },
    { col: 5, row: 12, rewardPoint: 2 },
    { col: 6, row: 15, rewardPoint: 3 }
];

module.exports = {
    config: {
        name: "guessnumber",
        aliases: ["gnumber", "guessthecode", "numbergame"],
        version: "1.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "Guess number game"
        },
        longDescription: {
            en: "Guess the hidden number code game with hints and ranking system"
        },
        guide: {
            en: "{p}guessnumber [4|5|6] [single|multi]\n{p}guessnumber rank [page]\n{p}guessnumber info [@user|userID]\n{p}guessnumber reset (admin only)"
        }
    },

    onStart: async function({ message, event, args, usersData, role }) {
        try {
            // Initialize global variables if not exists
            if (!global.guessNumberGames) global.guessNumberGames = new Map();
            if (!global.guessNumberRankings) global.guessNumberRankings = [];

            const userId = event.senderID;
            
            // Clean up expired games (1 hour)
            const now = Date.now();
            if (global.guessNumberGames) {
                for (const [key, game] of global.guessNumberGames.entries()) {
                    if (now - game.createdAt > 3600000) {
                        global.guessNumberGames.delete(key);
                    }
                }
            }

            // Handle subcommands
            if (args[0] === 'rank') {
                if (global.guessNumberRankings.length === 0) {
                    return message.reply("⭕ No one has scored yet.");
                }
                
                const page = parseInt(args[1]) || 1;
                const itemsPerPage = 10;
                const totalPages = Math.ceil(global.guessNumberRankings.length / itemsPerPage);
                
                if (page < 1 || page > totalPages) {
                    return message.reply(`❌ Invalid page. Available pages: 1-${totalPages}`);
                }
                
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                
                const rankedUsers = global.guessNumberRankings
                    .sort((a, b) => b.points - a.points)
                    .slice(startIndex, endIndex);
                
                let leaderboard = '🏆 GUESS NUMBER LEADERBOARD 🏆\n';
                leaderboard += '═'.repeat(35) + '\n\n';
                
                const medals = ['🥇', '🥈', '🥉'];
                
                for (let i = 0; i < rankedUsers.length; i++) {
                    const user = rankedUsers[i];
                    let userName = `User ${user.id}`;
                    
                    try {
                        if (usersData) {
                            userName = await usersData.getName(user.id) || userName;
                        }
                    } catch (e) {
                        // Use default name if failed to get name
                    }
                    
                    const medal = medals[i] || `#${startIndex + i + 1}`;
                    const winRate = user.gamesPlayed > 0 
                        ? ((user.wins / user.gamesPlayed) * 100).toFixed(1)
                        : '0.0';
                    
                    leaderboard += `${medal} ${userName}\n`;
                    leaderboard += `   ⭐ ${user.points} pts | ✅ ${user.wins}/${user.gamesPlayed} wins (${winRate}%)\n\n`;
                }
                
                leaderboard += `📄 Page ${page}/${totalPages}`;
                return message.reply(leaderboard);
                
            } else if (args[0] === 'info') {
                let targetId = event.senderID;
                
                if (event.mentions && Object.keys(event.mentions).length > 0) {
                    targetId = Object.keys(event.mentions)[0];
                } else if (args[1] && !isNaN(args[1])) {
                    targetId = args[1];
                }
                
                const userStats = global.guessNumberRankings.find(u => u.id === targetId);
                if (!userStats) {
                    return message.reply("⚠️ User not found in ranking database.");
                }
                
                let userName = `User ${targetId}`;
                try {
                    if (usersData) {
                        userName = await usersData.getName(targetId) || userName;
                    }
                } catch (e) {
                    // Use default name if failed to get name
                }
                
                const winRate = userStats.gamesPlayed > 0 
                    ? ((userStats.wins / userStats.gamesPlayed) * 100).toFixed(1)
                    : '0.0';
                    
                let digitStats = '';
                if (userStats.digitStats) {
                    digitStats = '🎯 DIGIT STATS:\n';
                    for (const [digits, wins] of Object.entries(userStats.digitStats)) {
                        digitStats += `• ${digits} digits: ${wins} wins\n`;
                    }
                    digitStats += '\n';
                }
                    
                const totalTime = moment.duration(userStats.totalPlayTime || 0).humanize();
                
                const userInfo = `👤 PLAYER INFO: ${userName}

⭐ TOTAL SCORE: ${userStats.points}
🎮 GAMES PLAYED: ${userStats.gamesPlayed}
✅ GAMES WON: ${userStats.wins}
❌ GAMES LOST: ${userStats.gamesPlayed - userStats.wins}
📊 WIN RATE: ${winRate}%
⏰ TOTAL TIME: ${totalTime}

${digitStats}💡 Keep playing to improve your rank!`;

                return message.reply(userInfo);
                
            } else if (args[0] === 'reset') {
                if (role < 2) {
                    return message.reply("❌ You need admin role to reset rankings!");
                }
                
                global.guessNumberRankings = [];
                return message.reply("✅ Leaderboard reset successfully!");
            }
            
            // Check if user already has an active game
            if (global.guessNumberGames.has(userId)) {
                const existingGame = global.guessNumberGames.get(userId);
                const gameBoard = createTextGameBoard(existingGame);
                return message.reply(`⚠️ You have an ongoing game!\n\n${gameBoard}`);
            }
            
            // Parse difficulty and mode
            const col = parseInt(args[0]) || 4;
            if (![4, 5, 6].includes(col)) {
                return message.reply("❌ Please choose 4, 5 or 6 digits.\n\n💡 Usage: guessnumber 4");
            }
            
            const mode = args[1]?.toLowerCase() || 'single';
            if (!['single', 'multi'].includes(mode)) {
                return message.reply("❌ Please choose 'single' or 'multi' mode.\n\n💡 Usage: guessnumber 4 single");
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
                userId
            };
            
            // Store game
            global.guessNumberGames.set(userId, gameData);
            
            // Send game instructions
            const gameBoard = createTextGameBoard(gameData);
            await message.reply(gameBoard);

        } catch (error) {
            console.error('Guess Number Game Error:', error);
            message.reply('❌ Game error: ' + (error.message || 'Unknown error occurred'));
        }
    },

    onReply: async function({ event, message, usersData }) {
        try {
            const userId = event.senderID;
            const guess = event.body.trim();
            
            // Get game data
            const gameData = global.guessNumberGames.get(userId);
            if (!gameData) {
                return message.reply("❌ Game session expired or not found. Start a new game with: guessnumber 4");
            }
            
            // Validate guess format
            if (!/^\d+$/.test(guess)) {
                return message.reply(`❌ Please enter only numbers!`);
            }
            
            if (guess.length !== gameData.col) {
                return message.reply(`❌ Please enter exactly ${gameData.col} digits!`);
            }
            
            // Check for duplicate digits
            const uniqueDigits = new Set(guess.split(''));
            if (uniqueDigits.size !== guess.length) {
                return message.reply('❌ Digits must be unique! No repeated digits allowed.');
            }
            
            // Calculate hints
            let correctDigits = 0;
            let correctPositions = 0;
            const answerDigits = gameData.answer.split('');
            const guessDigits = guess.split('');
            
            for (let i = 0; i < gameData.col; i++) {
                if (answerDigits[i] === guessDigits[i]) {
                    correctPositions++;
                }
                if (answerDigits.includes(guessDigits[i])) {
                    correctDigits++;
                }
            }
            
            // Add attempt
            gameData.attempts.push({
                guess,
                correctDigits,
                correctPositions
            });
            gameData.currentAttempt++;
            
            const isWin = correctPositions === gameData.col;
            const isGameOver = gameData.currentAttempt === gameData.row;
            
            // Check game outcome
            if (isWin || isGameOver) {
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
                
                if (isWin) {
                    const pointsEarned = rows.find(r => r.col === gameData.col)?.rewardPoint || 1;
                    userStats.points += pointsEarned;
                    userStats.wins++;
                    
                    // Update digit-specific stats
                    if (!userStats.digitStats[gameData.col]) {
                        userStats.digitStats[gameData.col] = 0;
                    }
                    userStats.digitStats[gameData.col]++;
                    
                    const gameResult = createTextGameBoard(gameData, true);
                    await message.reply(`🎉 CONGRATULATIONS! YOU WON! 🎉\n\nYou guessed the code "${gameData.answer}" in ${gameData.currentAttempt} attempts!\n\n🏆 +${pointsEarned} points earned!\n\n${gameResult}`);
                } else {
                    const gameResult = createTextGameBoard(gameData, true);
                    await message.reply(`💀 GAME OVER! 💀\n\nThe correct number was: ${gameData.answer}\nBetter luck next time!\n\n${gameResult}`);
                }
                
            } else {
                // Game continues
                const updatedBoard = createTextGameBoard(gameData);
                await message.reply(updatedBoard);
            }
            
        } catch (error) {
            console.error('Guess Number Reply Error:', error);
            message.reply('❌ Game error: ' + (error.message || 'Unknown error occurred'));
        }
    }
};

function generateNumber(length) {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = '';
    
    // Shuffle array and take first 'length' digits
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    
    for (let i = 0; i < length; i++) {
        result += digits[i];
    }
    
    return result;
}

function createTextGameBoard(gameData, showAnswer = false) {
    const { col, row, answer, attempts, currentAttempt } = gameData;
    
    let board = `🔢 GUESS THE NUMBER - ${col} DIGITS\n`;
    board += '═'.repeat(35) + '\n\n';
    
    // Show attempts
    if (attempts.length > 0) {
        board += '📋 YOUR ATTEMPTS:\n';
        board += '─'.repeat(35) + '\n';
        
        for (let i = 0; i < attempts.length; i++) {
            const attempt = attempts[i];
            const status = attempt.correctPositions === col ? '🎯 SOLVED!' : `🔸 Correct: ${attempt.correctDigits} | 🎯 Position: ${attempt.correctPositions}`;
            board += `#${i + 1}: ${attempt.guess} - ${status}\n`;
        }
        board += '\n';
    }
    
    // Show game info
    board += `📊 GAME STATUS:\n`;
    board += `• Attempts: ${currentAttempt}/${row}\n`;
    board += `• Digits: ${col}\n`;
    board += `• Mode: ${gameData.mode}\n\n`;
    
    // Show answer if game is over
    if (showAnswer) {
        board += `🎯 CORRECT ANSWER: ${answer}\n\n`;
    }
    
    // Show instructions
    if (!showAnswer) {
        board += `💡 HOW TO PLAY:\n`;
        board += `• Guess ${col} unique digits (0-9)\n`;
        board += `• 🔸 = Correct digits in wrong position\n`;
        board += `• 🎯 = Correct digits in correct position\n`;
        board += `• No repeated digits allowed\n\n`;
        board += `🎮 Reply with ${col} unique digits to continue!`;
    }
    
    return board;
}
