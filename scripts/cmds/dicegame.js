const axios = require("axios");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "dicegame",
    aliases: ["multidice", "taixiu"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑀𝑢𝑙𝑡𝑖𝑝𝑙𝑎𝑦𝑒𝑟 𝑑𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑒𝑡𝑡𝑖𝑛𝑔"
    },
    longDescription: {
        en: "𝑇𝑎𝑖 𝑋𝑖𝑢 (𝑆𝑖𝑐 𝐵𝑜) 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑎𝑦𝑒𝑟 𝑑𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑏𝑒𝑡𝑡𝑖𝑛𝑔 𝑜𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    category: "𝑔𝑎𝑚𝑒",
    guide: {
        en: "{p}dicegame [𝑐𝑟𝑒𝑎𝑡𝑒/𝑙𝑒𝑎𝑣𝑒/𝑟𝑜𝑙𝑙/𝑖𝑛𝑓𝑜/𝑒𝑛𝑑]\n{p}dicegame [𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙] [𝑎𝑚𝑜𝑢𝑛𝑡]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "moment-timezone": ""
    }
};

module.exports.onStart = async function({ api, event, args, Users, Currencies }) {
    try {
        // Check for dependencies
        if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑎𝑥𝑖𝑜𝑠 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦");
        if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑓𝑠 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦");
        if (!moment) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑚𝑜𝑚𝑒𝑛𝑡 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦");
        
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
            const helpMessage = `🎲 𝑀𝑈𝐿𝑇𝐼𝑃𝐿𝐴𝑌𝐸𝑅 𝐷𝐼𝐶𝐸 𝐺𝐴𝑀𝐸 🎲\n────────────────\n${global.config.PREFIX}${this.config.name} 𝑐𝑟𝑒𝑎𝑡𝑒 → 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑔𝑎𝑚𝑒 𝑟𝑜𝑜𝑚\n${global.config.PREFIX}${this.config.name} 𝑙𝑒𝑎𝑣𝑒 → 𝐿𝑒𝑎𝑣𝑒 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒\n${global.config.PREFIX}${this.config.name} 𝑟𝑜𝑙𝑙 → 𝑅𝑜𝑙𝑙 𝑡ℎ𝑒 𝑑𝑖𝑐𝑒 (ℎ𝑜𝑠𝑡 𝑜𝑛𝑙𝑦)\n${global.config.PREFIX}${this.config.name} 𝑖𝑛𝑓𝑜 → 𝑆ℎ𝑜𝑤 𝑔𝑎𝑚𝑒 𝑖𝑛𝑓𝑜\n${global.config.PREFIX}${this.config.name} 𝑒𝑛𝑑 → 𝐸𝑛𝑑 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒 (ℎ𝑜𝑠𝑡 𝑜𝑛𝑙𝑦)\n${global.config.PREFIX}${this.config.name} [𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙] [𝑎𝑚𝑜𝑢𝑛𝑡] → 𝑃𝑙𝑎𝑐𝑒 𝑎 𝑏𝑒𝑡`;
            
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
                    return send("❌ 𝐴 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑝𝑟𝑜𝑔𝑟𝑒𝑠𝑠 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
                }
                
                global.client.taixiu_ca[threadID] = {
                    players: 0,
                    data: {},
                    play: true,
                    status: "pending",
                    author: senderID,
                };
                
                send("✅ 𝐺𝑎𝑚𝑒 𝑟𝑜𝑜𝑚 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! 𝑃𝑙𝑎𝑦𝑒𝑟𝑠 𝑐𝑎𝑛 𝑛𝑜𝑤 𝑝𝑙𝑎𝑐𝑒 𝑏𝑒𝑡𝑠 𝑢𝑠𝑖𝑛𝑔: 𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙 [𝑎𝑚𝑜𝑢𝑛𝑡]");
                startGameTimer(threadID, Users, Currencies, api);
                break;
            }

            case "leave": {
                if (!global.client.taixiu_ca[threadID]) {
                    return send("❌ 𝑁𝑜 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
                }
                
                if (!global.client.taixiu_ca[threadID].data[senderID]) {
                    return send("❌ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒𝑛'𝑡 𝑗𝑜𝑖𝑛𝑒𝑑 𝑡ℎ𝑖𝑠 𝑔𝑎𝑚𝑒!");
                }
                
                // Return bet money to player
                global.client.taixiu_ca[threadID].data[senderID].forEach(async (bet) => {
                    await increaseMoney(senderID, bet.amount);
                });
                
                global.client.taixiu_ca[threadID].players--;
                delete global.client.taixiu_ca[threadID].data[senderID];
                
                send("✅ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑙𝑒𝑓𝑡 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒 𝑎𝑛𝑑 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑦𝑜𝑢𝑟 𝑏𝑒𝑡 𝑏𝑎𝑐𝑘!");
                break;
            }

            case "roll": {
                if (!global.client.taixiu_ca[threadID]) {
                    return send("❌ 𝑁𝑜 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
                }
                
                if (global.client.taixiu_ca[threadID].author !== senderID) {
                    return send("❌ 𝑂𝑛𝑙𝑦 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒 ℎ𝑜𝑠𝑡 𝑐𝑎𝑛 𝑟𝑜𝑙𝑙 𝑡ℎ𝑒 𝑑𝑖𝑐𝑒!");
                }
                
                if (global.client.taixiu_ca[threadID].players === 0) {
                    return send("❌ 𝑁𝑜 𝑝𝑙𝑎𝑦𝑒𝑟𝑠 ℎ𝑎𝑣𝑒 𝑝𝑙𝑎𝑐𝑒𝑑 𝑏𝑒𝑡𝑠 𝑦𝑒𝑡!");
                }

                // Roll the dice
                await api.sendMessage("🎲 𝑅𝑜𝑙𝑙𝑖𝑛𝑔 𝑑𝑖𝑐𝑒...", threadID);
                
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
                    
                    let resultsMessage = `====== 𝐷𝐼𝐶𝐸 𝐺𝐴𝑀𝐸 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 ======\n`;
                    resultsMessage += `🎲 𝐷𝑖𝑐𝑒: ${dice1}, ${dice2}, ${dice3}\n`;
                    resultsMessage += `🧮 𝑇𝑜𝑡𝑎𝑙: ${total}\n`;
                    resultsMessage += `📊 𝑅𝑒𝑠𝑢𝑙𝑡: ${isTriple ? "𝑇𝑅𝐼𝑃𝐿𝐸" : (isBig ? "𝐵𝐼𝐺" : "𝑆𝑀𝐴𝐿𝐿")}\n\n`;
                    
                    const bigWinners = [];
                    const smallWinners = [];
                    const bigLosers = [];
                    const smallLosers = [];
                    
                    // Process each player's bets
                    for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
                        const playerName = await Users.getNameUser(playerId) || "𝑃𝑙𝑎𝑦𝑒𝑟";
                        
                        for (const bet of bets) {
                            let result, amount;
                            
                            if (isTriple) {
                                // Everyone loses on triple
                                result = "𝐿𝑂𝑆𝐸";
                                amount = -bet.amount;
                                if (bet.type === "big") bigLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                                else smallLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                            } else {
                                const won = (bet.type === "big" && isBig) || (bet.type === "small" && !isBig);
                                
                                if (won) {
                                    result = "𝑊𝐼𝑁";
                                    amount = bet.amount * 1.95; // 1.95x payout
                                    await increaseMoney(playerId, amount);
                                    
                                    if (bet.type === "big") bigWinners.push(`${playerName}: +${formatNumber(amount)}$`);
                                    else smallWinners.push(`${playerName}: +${formatNumber(amount)}$`);
                                } else {
                                    result = "𝐿𝑂𝑆𝐸";
                                    amount = -bet.amount;
                                    
                                    if (bet.type === "big") bigLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                                    else smallLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                                }
                            }
                        }
                    }
                    
                    // Build results message
                    if (bigWinners.length > 0) {
                        resultsMessage += `🎉 𝐵𝐼𝐺 𝐵𝐸𝑇 𝑊𝐼𝑁𝑁𝐸𝑅𝑆:\n${bigWinners.join("\n")}\n\n`;
                    }
                    
                    if (smallWinners.length > 0) {
                        resultsMessage += `🎉 𝑆𝑀𝐴𝐿𝐿 𝐵𝐸𝑇 𝑊𝐼𝑁𝑁𝐸𝑅𝑆:\n${smallWinners.join("\n")}\n\n`;
                    }
                    
                    if (bigLosers.length > 0) {
                        resultsMessage += `💔 𝐵𝐼𝐺 𝐵𝐸𝑇 𝐿𝑂𝑆𝐸𝑅𝑆:\n${bigLosers.join("\n")}\n\n`;
                    }
                    
                    if (smallLosers.length > 0) {
                        resultsMessage += `💔 𝑆𝑀𝐴𝐿𝐿 𝐵𝐸𝑇 𝐿𝑂𝑆𝐸𝑅𝑆:\n${smallLosers.join("\n")}\n\n`;
                    }
                    
                    resultsMessage += `====== 𝐺𝐴𝑀𝐸 𝐸𝑁𝐷𝐸𝐷 ======`;
                    
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
                    return send("❌ 𝑁𝑜 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
                }
                
                const hostName = await Users.getNameUser(global.client.taixiu_ca[threadID].author) || "𝐻𝑜𝑠𝑡";
                let infoMessage = `🎲 𝐺𝐴𝑀𝐸 𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝑇𝐼𝑂𝑁 🎲\n\n`;
                infoMessage += `👑 𝐻𝑜𝑠𝑡: ${hostName}\n`;
                infoMessage += `👥 𝑃𝑙𝑎𝑦𝑒𝑟𝑠: ${global.client.taixiu_ca[threadID].players}\n\n`;
                
                if (global.client.taixiu_ca[threadID].players > 0) {
                    infoMessage += `🎯 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐵𝑒𝑡𝑠:\n`;
                    
                    for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
                        const playerName = await Users.getNameUser(playerId) || "𝑃𝑙𝑎𝑦𝑒𝑟";
                        const betSummary = bets.map(bet => `${bet.type} (${formatNumber(bet.amount)}$)`).join(", ");
                        infoMessage += `👤 ${playerName}: ${betSummary}\n`;
                    }
                } else {
                    infoMessage += `𝑁𝑜 𝑝𝑙𝑎𝑦𝑒𝑟𝑠 ℎ𝑎𝑣𝑒 𝑝𝑙𝑎𝑐𝑒𝑑 𝑏𝑒𝑡𝑠 𝑦𝑒𝑡.\n𝑈𝑠𝑒 "${global.config.PREFIX}dicegame [𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙] [𝑎𝑚𝑜𝑢𝑛𝑡]" 𝑡𝑜 𝑝𝑙𝑎𝑐𝑒 𝑎 𝑏𝑒𝑡!`;
                }
                
                send(infoMessage);
                break;
            }

            case "end": {
                if (!global.client.taixiu_ca[threadID]) {
                    return send("❌ 𝑁𝑜 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
                }
                
                if (global.client.taixiu_ca[threadID].author !== senderID) {
                    return send("❌ 𝑂𝑛𝑙𝑦 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒 ℎ𝑜𝑠𝑡 𝑐𝑎𝑛 𝑒𝑛𝑑 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒!");
                }
                
                // Return all bets
                for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
                    for (const bet of bets) {
                        await increaseMoney(playerId, bet.amount);
                    }
                }
                
                delete global.client.taixiu_ca[threadID];
                send("✅ 𝐺𝑎𝑚𝑒 𝑒𝑛𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦. 𝐴𝑙𝑙 𝑏𝑒𝑡𝑠 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑟𝑒𝑡𝑢𝑟𝑛𝑒𝑑!");
                break;
            }

            default: {
                // Handle bet placement (big/small)
                if (["big", "small"].includes(args[0].toLowerCase())) {
                    if (!global.client.taixiu_ca[threadID]) {
                        return send("❌ 𝑁𝑜 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝! 𝑈𝑠𝑒 '𝑐𝑟𝑒𝑎𝑡𝑒' 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑜𝑛𝑒.");
                    }
                    
                    const betType = args[0].toLowerCase();
                    const betAmount = args[1] === "all" ? moneyUser : parseInt(args[1]);
                    
                    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
                        return send("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡!");
                    }
                    
                    if (betAmount > moneyUser) {
                        return send("❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑝𝑙𝑎𝑐𝑒 𝑡ℎ𝑖𝑠 𝑏𝑒𝑡!");
                    }
                    
                    if (betAmount < 50) {
                        return send("❌ 𝑀𝑖𝑛𝑖𝑚𝑢𝑚 𝑏𝑒𝑡 𝑖𝑠 50$!");
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
                    
                    send(`✅ 𝐵𝑒𝑡 𝑝𝑙𝑎𝑐𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! ${formatNumber(betAmount)}$ 𝑜𝑛 ${betType.toUpperCase()}`);
                } else {
                    send(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑈𝑠𝑒 "${global.config.PREFIX}dicegame 𝑐𝑟𝑒𝑎𝑡𝑒" 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑎 𝑔𝑎𝑚𝑒 𝑜𝑟 "${global.config.PREFIX}dicegame [𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙] [𝑎𝑚𝑜𝑢𝑛𝑡]" 𝑡𝑜 𝑝𝑙𝑎𝑐𝑒 𝑎 𝑏𝑒𝑡.`);
                }
            }
        }
    } catch (error) {
        console.error("𝐷𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒", event.threadID, event.messageID);
    }
};

// Helper function to start game timer
function startGameTimer(threadID, Users, Currencies, api) {
    setTimeout(async () => {
        if (global.client.taixiu_ca[threadID] && global.client.taixiu_ca[threadID].play) {
            let message = "⏰ 𝐺𝑎𝑚𝑒 𝑡𝑖𝑚𝑒𝑜𝑢𝑡! 𝑅𝑒𝑡𝑢𝑟𝑛𝑖𝑛𝑔 𝑎𝑙𝑙 𝑏𝑒𝑡𝑠...\n\n";
            
            if (global.client.taixiu_ca[threadID].players > 0) {
                for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
                    const playerName = await Users.getNameUser(playerId) || "𝑃𝑙𝑎𝑦𝑒𝑟";
                    let totalReturned = 0;
                    
                    for (const bet of bets) {
                        await Currencies.increaseMoney(playerId, bet.amount);
                        totalReturned += bet.amount;
                    }
                    
                    message += `👤 ${playerName}: ${totalReturned.toLocaleString()}$ 𝑟𝑒𝑡𝑢𝑟𝑛𝑒𝑑\n`;
                }
            } else {
                message += "𝑁𝑜 𝑝𝑙𝑎𝑦𝑒𝑟𝑠 𝑝𝑙𝑎𝑐𝑒𝑑 𝑏𝑒𝑡𝑠.\n";
            }
            
            message += "\n𝐺𝑎𝑚𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑐𝑎𝑛𝑐𝑒𝑙𝑙𝑒𝑑.";
            api.sendMessage(message, threadID);
            delete global.client.taixiu_ca[threadID];
        }
    }, 120000); // 2 minute timeout
}
