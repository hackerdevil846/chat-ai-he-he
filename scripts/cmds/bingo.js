module.exports = {
    config: {
        name: "bingo",
        version: "1.0.4",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "game",
        shortDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑏𝑖𝑛𝑔𝑜 𝑔𝑎𝑚𝑒"
        },
        longDescription: {
            en: "𝑀𝑢𝑙𝑡𝑖𝑝𝑙𝑎𝑦𝑒𝑟 𝑏𝑖𝑛𝑔𝑜 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑒𝑡𝑡𝑖𝑛𝑔"
        },
        guide: {
            en: "{𝑝}𝑏𝑖𝑛𝑔𝑜 𝑐𝑟𝑒𝑎𝑡𝑒/𝑗𝑜𝑖𝑛/𝑠𝑡𝑎𝑟𝑡"
        },
        envConfig: {
            maxPlayers: 10,
            getDelay: 8
        }
    },

    onLoad: async function () {
        const fs = require("fs-extra");
        const axios = require("axios");
        
        // Create bingo directory
        const path = __dirname + '/bingo/';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        
        if (!global.client.bingo) global.client.bingo = {};
    },

    onStart: async function ({ event, message, usersData, args, global }) {
        try {
            const fs = require("fs-extra");
            const axios = require("axios");
            
            const { threadID, senderID } = event;
            const { getDelay, maxPlayers } = global.configModule.bingo.envConfig;
            
            if (!global.client.bingo) global.client.bingo = {};
            
            const bingoCards = {
                "card1": [[15,30,49,60,74],[7,26,33,52,69],[22,41,55,71,88],[11,37,64,76,90],[18,38,50,78,84],[3,29,43,59,61],[10,48,63,75,81],[1,21,35,62,77],[9,16,40,54,70]],
                "card2": [[25,52,60,77,83],[1,30,44,51,70],[11,21,47,56,62],[2,33,59,68,73],[23,39,42,75,80],[14,26,66,79,88],[19,20,37,55,81],[8,13,57,61,87],[28,34,58,76,82]],
                "card3": [[11,33,69,78,85],[2,14,21,35,76],[8,19,41,50,84],[9,15,37,44,87],[6,26,65,77,82],[1,18,30,59,66],[10,38,47,51,80],[5,13,29,52,79],[3,20,54,70,88]]
            };

            const userMoney = await usersData.get(senderID, "money");
            
            switch (args[0]) {
                case 'create': {
                    const moneyBet = parseInt(args[1]);
                    if (isNaN(moneyBet) || moneyBet <= 0) {
                        return message.reply("𝐵𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑒 𝑒𝑚𝑝𝑡𝑦 𝑜𝑟 𝑛𝑒𝑔𝑎𝑡𝑖𝑣𝑒");
                    }
                    if (moneyBet < 50) {
                        return message.reply("𝑀𝑖𝑛𝑖𝑚𝑢𝑚 𝑏𝑒𝑡 𝑖𝑠 50$!");
                    }
                    if (moneyBet > userMoney) {
                        return message.reply(`𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 ${moneyBet}$ 𝑡𝑜 𝑝𝑙𝑎𝑦!`);
                    }
                    if (global.client.bingo[threadID]) {
                        return message.reply("𝐺𝑎𝑚𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑝𝑟𝑜𝑔𝑟𝑒𝑠𝑠!");
                    }
                    
                    global.client.bingo[threadID] = {
                        author: senderID,
                        players: { [senderID]: [] },
                        status: "pending",
                        betAmount: moneyBet
                    };
                    
                    await usersData.set(senderID, { money: userMoney - moneyBet });
                    
                    return message.reply(`𝐺𝑎𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑! (1/${maxPlayers})\n𝐽𝑜𝑖𝑛 𝑤𝑖𝑡ℎ: 𝑏𝑖𝑛𝑔𝑜 𝑗𝑜𝑖𝑛`);
                }

                case 'join': {
                    if (!global.client.bingo[threadID]) {
                        return message.reply("𝑁𝑜 𝑔𝑎𝑚𝑒 𝑖𝑛 𝑝𝑟𝑜𝑔𝑟𝑒𝑠𝑠!");
                    }
                    if (global.client.bingo[threadID].players[senderID]) {
                        return message.reply("𝑌𝑜𝑢'𝑟𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒!");
                    }
                    if (Object.keys(global.client.bingo[threadID].players).length >= maxPlayers) {
                        return message.reply("𝑅𝑜𝑜𝑚 𝑖𝑠 𝑓𝑢𝑙𝑙!");
                    }
                    if (global.client.bingo[threadID].status === "started") {
                        return message.reply("𝐺𝑎𝑚𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑠𝑡𝑎𝑟𝑡𝑒𝑑!");
                    }
                    if (global.client.bingo[threadID].betAmount > userMoney) {
                        return message.reply(`𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 ${global.client.bingo[threadID].betAmount}$ 𝑡𝑜 𝑗𝑜𝑖𝑛!`);
                    }
                    
                    global.client.bingo[threadID].players[senderID] = [];
                    await usersData.set(senderID, { money: userMoney - global.client.bingo[threadID].betAmount });
                    
                    return message.reply(`𝐽𝑜𝑖𝑛𝑒𝑑! (${Object.keys(global.client.bingo[threadID].players).length}/${maxPlayers})`);
                }

                case 'start': {
                    if (!global.client.bingo[threadID]) {
                        return message.reply("𝑁𝑜 𝑔𝑎𝑚𝑒 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡!");
                    }
                    if (!global.client.bingo[threadID].players[senderID]) {
                        return message.reply("𝑌𝑜𝑢 𝑎𝑟𝑒𝑛'𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒!");
                    }
                    if (global.client.bingo[threadID].author !== senderID) {
                        return message.reply("𝑂𝑛𝑙𝑦 𝑔𝑎𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑜𝑟 𝑐𝑎𝑛 𝑠𝑡𝑎𝑟𝑡!");
                    }
                    if (global.client.bingo[threadID].status === "started") {
                        return message.reply("𝐺𝑎𝑚𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑠𝑡𝑎𝑟𝑡𝑒𝑑!");
                    }
                    if (Object.keys(global.client.bingo[threadID].players).length < 2) {
                        return message.reply("𝑁𝑒𝑒𝑑 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 2 𝑝𝑙𝑎𝑦𝑒𝑟𝑠!");
                    }
                    
                    global.client.bingo[threadID].status = "started";
                    
                    // Simplified bingo game logic
                    const cardKeys = Object.keys(bingoCards);
                    const calledNumbers = [];
                    const allNumbers = Array.from({length: 90}, (_, i) => i + 1);
                    
                    // Start the game
                    await message.reply(`𝐺𝑎𝑚𝑒 𝑠𝑡𝑎𝑟𝑡𝑒𝑑! 𝑁𝑢𝑚𝑏𝑒𝑟𝑠 𝑐𝑎𝑙𝑙𝑒𝑑 𝑒𝑣𝑒𝑟𝑦 ${getDelay}𝑠`);
                    
                    // Game loop
                    const gameInterval = setInterval(async () => {
                        if (calledNumbers.length >= 90 || !global.client.bingo[threadID]) {
                            clearInterval(gameInterval);
                            return;
                        }
                        
                        const randomNum = allNumbers.splice(Math.floor(Math.random() * allNumbers.length), 1)[0];
                        calledNumbers.push(randomNum);
                        
                        await message.reply(`𝑁𝑢𝑚𝑏𝑒𝑟: ${randomNum}`);
                        
                        // Check for winners (simplified)
                        for (const playerId in global.client.bingo[threadID].players) {
                            // Simplified win condition
                            if (calledNumbers.length >= 5) {
                                const reward = global.client.bingo[threadID].betAmount * 
                                             (Object.keys(global.client.bingo[threadID].players).length - 1);
                                
                                await usersData.set(playerId, { 
                                    money: (await usersData.get(playerId, "money")) + reward + global.client.bingo[threadID].betAmount 
                                });
                                
                                await message.reply(`𝐵𝐼𝑁𝐺𝑂! 𝑃𝑙𝑎𝑦𝑒𝑟 𝑤𝑜𝑛 ${reward}$!`);
                                delete global.client.bingo[threadID];
                                clearInterval(gameInterval);
                                break;
                            }
                        }
                    }, getDelay * 1000);
                    
                    break;
                }

                default: {
                    return message.reply(`𝐵𝐼𝑁𝐺𝑂 𝐺𝐴𝑀𝐸\n\n𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:\n• 𝑏𝑖𝑛𝑔𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 [𝑎𝑚𝑜𝑢𝑛𝑡] - 𝐶𝑟𝑒𝑎𝑡𝑒 𝑔𝑎𝑚𝑒 (𝑚𝑖𝑛 50$)\n• 𝑏𝑖𝑛𝑔𝑜 𝑗𝑜𝑖𝑛 - 𝐽𝑜𝑖𝑛 𝑔𝑎𝑚𝑒\n• 𝑏𝑖𝑛𝑔𝑜 𝑠𝑡𝑎𝑟𝑡 - 𝑆𝑡𝑎𝑟𝑡 𝑔𝑎𝑚𝑒\n\n𝑀𝑎𝑥 𝑝𝑙𝑎𝑦𝑒𝑟𝑠: ${maxPlayers}`);
                }
            }
            
        } catch (error) {
            console.error("𝐵𝑖𝑛𝑔𝑜 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐺𝑎𝑚𝑒 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑!");
        }
    }
};
