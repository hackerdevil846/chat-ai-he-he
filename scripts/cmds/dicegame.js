const axios = require("axios");
const fs = require("fs");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "dicegame",
    aliases: ["multidice"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Multiplayer dice game with betting"
    },
    longDescription: {
      en: "Tai Xiu (Sic Bo) multiplayer dice game with various betting options"
    },
    category: "game",
    guide: {
      en: "{p}dicegame [create/leave/roll/info/end]\n{p}dicegame [big/small] [amount]"
    }
  },

  onStart: async function({ api, event, args, Users, Threads, Currencies }) {
    try {
      // Check for dependencies
      if (!axios) throw new Error("Missing axios dependency");
      if (!fs) throw new Error("Missing fs dependency");
      if (!moment) throw new Error("Missing moment dependency");
      
      // Initialize game data if not exists
      if (!global.client.taixiu_ca) global.client.taixiu_ca = {};

      const { senderID, messageID, threadID } = event;
      const { increaseMoney, decreaseMoney, getData } = Currencies;
      const moneyUser = (await getData(senderID)).money;
      
      // Helper functions
      const send = (msg) => api.sendMessage(msg, threadID, messageID);
      const formatNumber = (number) => number.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      // Dice images
      const dice_images = [
        "https://i.imgur.com/ruaSs1C.png",
        "https://i.imgur.com/AIhuSxL.png",
        "https://i.imgur.com/JB4vTVj.png",
        "https://i.imgur.com/PGgsDAO.png",
        "https://i.imgur.com/RiaMAHX.png",
        "https://i.imgur.com/ys9PwAV.png"
      ];

      // Show help if no arguments
      if (args.length === 0) {
        const helpMessage = `🎲 MULTIPLAYER DICE GAME 🎲\n────────────────\n${global.config.PREFIX}${this.config.name} create → Create a game room\n${global.config.PREFIX}${this.config.name} leave → Leave the game\n${global.config.PREFIX}${this.config.name} roll → Roll the dice (host only)\n${global.config.PREFIX}${this.config.name} info → Show game info\n${global.config.PREFIX}${this.config.name} end → End the game (host only)\n${global.config.PREFIX}${this.config.name} [big/small] [amount] → Place a bet`;
        
        return api.sendMessage({
          body: helpMessage,
          attachment: (await axios.get(`https://i.imgur.com/i2woeoT.jpeg`, {
            responseType: 'stream'
          })).data
        }, threadID, messageID);
      }

      // Handle different commands
      switch (args[0].toLowerCase()) {
        case "create": {
          if (threadID in global.client.taixiu_ca && global.client.taixiu_ca[threadID].play) {
            return send("❌ A game is already in progress in this group!");
          }
          
          global.client.taixiu_ca[threadID] = {
            players: 0,
            data: {},
            play: true,
            status: "pending",
            author: senderID,
          };
          
          send("✅ Game room created successfully! Players can now place bets using: big/small [amount]");
          startGameTimer(threadID, Users, Currencies);
          break;
        }

        case "leave": {
          if (!global.client.taixiu_ca[threadID]) {
            return send("❌ No game is currently running in this group!");
          }
          
          if (!global.client.taixiu_ca[threadID].data[senderID]) {
            return send("❌ You haven't joined this game!");
          }
          
          // Return bet money to player
          global.client.taixiu_ca[threadID].data[senderID].forEach(async (bet) => {
            await increaseMoney(senderID, bet.amount);
          });
          
          global.client.taixiu_ca[threadID].players--;
          delete global.client.taixiu_ca[threadID].data[senderID];
          
          send("✅ You have left the game and received your bet back!");
          break;
        }

        case "roll": {
          if (!global.client.taixiu_ca[threadID]) {
            return send("❌ No game is currently running in this group!");
          }
          
          if (global.client.taixiu_ca[threadID].author !== senderID) {
            return send("❌ Only the game host can roll the dice!");
          }
          
          if (global.client.taixiu_ca[threadID].players === 0) {
            return send("❌ No players have placed bets yet!");
          }

          // Roll the dice
          await api.sendMessage("🎲 Rolling dice...", threadID);
          
          setTimeout(async () => {
            const dice1 = Math.ceil(Math.random() * 6);
            const dice2 = Math.ceil(Math.random() * 6);
            const dice3 = Math.ceil(Math.random() * 6);
            const total = dice1 + dice2 + dice3;
            
            // Get dice images
            const diceImages = await Promise.all([
              axios.get(dice_images[dice1 - 1], { responseType: "stream" }),
              axios.get(dice_images[dice2 - 1], { responseType: "stream" }),
              axios.get(dice_images[dice3 - 1], { responseType: "stream" })
            ]);
            
            const attachments = diceImages.map(img => img.data);
            
            // Calculate results
            const isTriple = dice1 === dice2 && dice2 === dice3;
            const isBig = total >= 11 && total <= 18;
            
            let resultsMessage = `====== DICE GAME RESULTS ======\n`;
            resultsMessage += `🎲 Dice: ${dice1}, ${dice2}, ${dice3}\n`;
            resultsMessage += `🧮 Total: ${total}\n`;
            resultsMessage += `📊 Result: ${isTriple ? "TRIPLE" : (isBig ? "BIG" : "SMALL")}\n\n`;
            
            const bigWinners = [];
            const smallWinners = [];
            const bigLosers = [];
            const smallLosers = [];
            
            // Process each player's bets
            for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
              const playerName = await Users.getNameUser(playerId) || "Player";
              
              for (const bet of bets) {
                let result, amount;
                
                if (isTriple) {
                  // Everyone loses on triple
                  result = "LOSE";
                  amount = -bet.amount;
                  if (bet.type === "big") bigLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                  else smallLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                } else {
                  const won = (bet.type === "big" && isBig) || (bet.type === "small" && !isBig);
                  
                  if (won) {
                    result = "WIN";
                    amount = bet.amount * 1.95; // 1.95x payout
                    await increaseMoney(playerId, amount);
                    
                    if (bet.type === "big") bigWinners.push(`${playerName}: +${formatNumber(amount)}$`);
                    else smallWinners.push(`${playerName}: +${formatNumber(amount)}$`);
                  } else {
                    result = "LOSE";
                    amount = -bet.amount;
                    
                    if (bet.type === "big") bigLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                    else smallLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                  }
                }
              }
            }
            
            // Build results message
            if (bigWinners.length > 0) {
              resultsMessage += `🎉 BIG BET WINNERS:\n${bigWinners.join("\n")}\n\n`;
            }
            
            if (smallWinners.length > 0) {
              resultsMessage += `🎉 SMALL BET WINNERS:\n${smallWinners.join("\n")}\n\n`;
            }
            
            if (bigLosers.length > 0) {
              resultsMessage += `💔 BIG BET LOSERS:\n${bigLosers.join("\n")}\n\n`;
            }
            
            if (smallLosers.length > 0) {
              resultsMessage += `💔 SMALL BET LOSERS:\n${smallLosers.join("\n")}\n\n`;
            }
            
            resultsMessage += `====== GAME ENDED ======`;
            
            // Send results
            api.sendMessage({
              body: resultsMessage,
              attachment: attachments
            }, threadID, () => {
              // Clean up game data
              delete global.client.taixiu_ca[threadID];
            });
            
          }, 2000);
          break;
        }

        case "info": {
          if (!global.client.taixiu_ca[threadID]) {
            return send("❌ No game is currently running in this group!");
          }
          
          const hostName = await Users.getNameUser(global.client.taixiu_ca[threadID].author) || "Host";
          let infoMessage = `🎲 GAME INFORMATION 🎲\n\n`;
          infoMessage += `👑 Host: ${hostName}\n`;
          infoMessage += `👥 Players: ${global.client.taixiu_ca[threadID].players}\n\n`;
          
          if (global.client.taixiu_ca[threadID].players > 0) {
            infoMessage += `🎯 Current Bets:\n`;
            
            for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
              const playerName = await Users.getNameUser(playerId) || "Player";
              const betSummary = bets.map(bet => `${bet.type} (${formatNumber(bet.amount)}$)`).join(", ");
              infoMessage += `👤 ${playerName}: ${betSummary}\n`;
            }
          } else {
            infoMessage += `No players have placed bets yet.\nUse "${global.config.PREFIX}dicegame [big/small] [amount]" to place a bet!`;
          }
          
          send(infoMessage);
          break;
        }

        case "end": {
          if (!global.client.taixiu_ca[threadID]) {
            return send("❌ No game is currently running in this group!");
          }
          
          if (global.client.taixiu_ca[threadID].author !== senderID) {
            return send("❌ Only the game host can end the game!");
          }
          
          // Return all bets
          for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
            for (const bet of bets) {
              await increaseMoney(playerId, bet.amount);
            }
          }
          
          delete global.client.taixiu_ca[threadID];
          send("✅ Game ended successfully. All bets have been returned!");
          break;
        }

        default: {
          // Handle bet placement (big/small)
          if (["big", "small"].includes(args[0].toLowerCase())) {
            if (!global.client.taixiu_ca[threadID]) {
              return send("❌ No game is currently running in this group! Use 'create' to start one.");
            }
            
            const betType = args[0].toLowerCase();
            const betAmount = args[1] === "all" ? moneyUser : parseInt(args[1]);
            
            if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
              return send("❌ Please enter a valid bet amount!");
            }
            
            if (betAmount > moneyUser) {
              return send("❌ You don't have enough money to place this bet!");
            }
            
            if (betAmount < 50) {
              return send("❌ Minimum bet is 50$!");
            }
            
            // Place the bet
            await decreaseMoney(senderID, betAmount);
            
            if (!global.client.taixiu_ca[threadID].data[senderID]) {
              global.client.taixiu_ca[threadID].data[senderID] = [];
              global.client.taixiu_ca[threadID].players++;
            }
            
            global.client.taixiu_ca[threadID].data[senderID].push({
              type: betType,
              amount: betAmount
            });
            
            send(`✅ Bet placed successfully! ${formatNumber(betAmount)}$ on ${betType.toUpperCase()}`);
          } else {
            send(`❌ Invalid command. Use "${global.config.PREFIX}dicegame create" to start a game or "${global.config.PREFIX}dicegame [big/small] [amount]" to place a bet.`);
          }
        }
      }
    } catch (error) {
      console.error("Dice game error:", error);
      api.sendMessage("❌ An error occurred while processing the game", event.threadID, event.messageID);
    }
  }
};

// Helper function to start game timer
function startGameTimer(threadID, Users, Currencies) {
  setTimeout(async () => {
    if (global.client.taixiu_ca[threadID] && global.client.taixiu_ca[threadID].play) {
      let message = "⏰ Game timeout! Returning all bets...\n\n";
      
      if (global.client.taixiu_ca[threadID].players > 0) {
        for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
          const playerName = await Users.getNameUser(playerId) || "Player";
          let totalReturned = 0;
          
          for (const bet of bets) {
            await Currencies.increaseMoney(playerId, bet.amount);
            totalReturned += bet.amount;
          }
          
          message += `👤 ${playerName}: ${totalReturned.toLocaleString()}$ returned\n`;
        }
      } else {
        message += "No players placed bets.\n";
      }
      
      message += "\nGame has been cancelled.";
      api.sendMessage(message, threadID);
      delete global.client.taixiu_ca[threadID];
    }
  }, 120000); // 2 minute timeout
}
