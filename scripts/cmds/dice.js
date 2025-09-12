const axios = require('axios');
const moment = require("moment-timezone");

module.exports.config = {
    name: "dice",
    aliases: ["sicbo"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐷𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑏𝑒𝑡𝑡𝑖𝑛𝑔 𝑜𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    longDescription: {
        en: "𝑆𝑖𝑐 𝐵𝑜 (𝑇𝑎𝑖 𝑋𝑖𝑢) 𝑑𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑏𝑒𝑡𝑡𝑖𝑛𝑔 𝑡𝑦𝑝𝑒𝑠"
    },
    category: "𝑔𝑎𝑚𝑒",
    guide: {
        en: "{p}dice [𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙/𝑡𝑟𝑖𝑝𝑙𝑒/𝑝𝑎𝑖𝑟/𝑡𝑜𝑡𝑎𝑙/𝑛𝑢𝑚𝑏𝑒𝑟] [𝑎𝑚𝑜𝑢𝑛𝑡] [𝑜𝑝𝑡𝑖𝑜𝑛𝑎𝑙: 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑛𝑢𝑚𝑏𝑒𝑟/𝑡𝑜𝑡𝑎𝑙]"
    },
    dependencies: {
        "axios": "",
        "moment-timezone": ""
    }
};

module.exports.onStart = async function ({ event, api, Currencies, Users, args }) {
    try {
        // Check for dependencies
        if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑎𝑥𝑖𝑜𝑠 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦");
        if (!moment) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑚𝑜𝑚𝑒𝑛𝑡 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦");
        
        const format_day = moment.tz("𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎").format("𝐻𝐻:𝑚𝑚:𝑠𝑠 - 𝐷𝐷/𝑀𝑀/𝑌𝑌𝑌𝑌");
        const { increaseMoney, decreaseMoney, getData } = Currencies;
        const { threadID, messageID, senderID } = event;
        const name = await Users.getNameUser(senderID);
        const money = (await getData(senderID)).money;
        
        // Game configuration
        const winMultiplier = 1;
        const tripleMultiplier = 10;
        const pairMultiplier = 5;
        const rollDelay = 2;
        const pairMatchMultiplier = 2;
        const tripleMatchMultiplier = 3;
        const singleMatchMultiplier = 1;
        
        // Gambling quotes
        const quotes = [
            "𝐺𝑎𝑚𝑏𝑙𝑖𝑛𝑔 𝑖𝑠 𝑡ℎ𝑒 𝑓𝑎𝑡ℎ𝑒𝑟 𝑜𝑓 𝑝𝑜𝑣𝑒𝑟𝑡𝑦",
            "𝑌𝑜𝑢 𝑝𝑙𝑎𝑦, 𝑦𝑜𝑢 𝑤𝑖𝑛, 𝑦𝑜𝑢 𝑝𝑙𝑎𝑦, 𝑦𝑜𝑢 𝑙𝑜𝑠𝑒. 𝑌𝑜𝑢 𝑘𝑒𝑒𝑝 𝑝𝑙𝑎𝑦𝑖𝑛𝑔.",
            "𝑇ℎ𝑜𝑠𝑒 𝑤ℎ𝑜 𝑑𝑜𝑛'𝑡 𝑝𝑙𝑎𝑦 𝑛𝑒𝑣𝑒𝑟 𝑤𝑖𝑛",
            "𝑌𝑜𝑢 𝑛𝑒𝑣𝑒𝑟 𝑘𝑛𝑜𝑤 𝑤ℎ𝑎𝑡'𝑠 𝑤𝑜𝑟𝑠𝑒 𝑡ℎ𝑎𝑛 𝑡ℎ𝑒 𝑏𝑎𝑑 𝑙𝑢𝑐𝑘 𝑦𝑜𝑢 ℎ𝑎𝑣𝑒.",
            "𝑇ℎ𝑒 𝑠𝑎𝑓𝑒𝑠𝑡 𝑤𝑎𝑦 𝑡𝑜 𝑑𝑜𝑢𝑏𝑙𝑒 𝑦𝑜𝑢𝑟 𝑚𝑜𝑛𝑒𝑦 𝑖𝑠 𝑡𝑜 𝑓𝑜𝑙𝑑 𝑖𝑡 𝑜𝑛𝑐𝑒 𝑎𝑛𝑑 𝑝𝑢𝑡 𝑖𝑡 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑝𝑜𝑐𝑘𝑒𝑡.",
            "𝐺𝑎𝑚𝑏𝑙𝑖𝑛𝑔 𝑖𝑠 𝑎𝑛 𝑖𝑛ℎ𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑖𝑛𝑐𝑖𝑝𝑙𝑒 𝑜𝑓 ℎ𝑢𝑚𝑎𝑛 𝑛𝑎𝑡𝑢𝑟𝑒.",
            "𝑇ℎ𝑒 𝑏𝑒𝑠𝑡 𝑤𝑎𝑦 𝑡𝑜 𝑡ℎ𝑟𝑜𝑤 𝑑𝑖𝑐𝑒 𝑖𝑠 𝑡𝑜 𝑡ℎ𝑟𝑜𝑤 𝑡ℎ𝑒𝑚 𝑎𝑤𝑎𝑦 𝑎𝑛𝑑 𝑠𝑡𝑜𝑝 𝑝𝑙𝑎𝑦𝑖𝑛𝑔.",
            "𝐸𝑎𝑡 𝑦𝑜𝑢𝑟 𝑏𝑒𝑡𝑡𝑖𝑛𝑔 𝑚𝑜𝑛𝑒𝑦 𝑏𝑢𝑡 𝑑𝑜𝑛'𝑡 𝑏𝑒𝑡 𝑦𝑜𝑢𝑟 𝑒𝑎𝑡𝑖𝑛𝑔 𝑚𝑜𝑛𝑒𝑦",
            "𝐵𝑒𝑡 𝑠𝑚𝑎𝑙𝑙, 𝑤ℎ𝑒𝑛 𝑦𝑜𝑢 𝑤𝑖𝑛 𝑦𝑜𝑢 𝑙𝑜𝑠𝑒 𝑚𝑜𝑟𝑒",
            "𝐺𝑎𝑚𝑏𝑙𝑖𝑛𝑔 𝑐𝑜𝑠𝑡𝑠 𝑢𝑠 𝑡ℎ𝑒 𝑡𝑤𝑜 𝑚𝑜𝑠𝑡 𝑝𝑟𝑒𝑐𝑖𝑜𝑢𝑠 𝑡ℎ𝑖𝑛𝑔𝑠 𝑖𝑛 𝑙𝑖𝑓𝑒: 𝑡𝑖𝑚𝑒 𝑎𝑛𝑑 𝑚𝑜𝑛𝑒𝑦",
            "𝐺𝑎𝑚𝑏𝑙𝑖𝑛𝑔 ℎ𝑎𝑠 𝑤𝑖𝑛𝑛𝑒𝑟𝑠 𝑎𝑛𝑑 𝑙𝑜𝑠𝑒𝑟𝑠, 𝑓𝑒𝑤 𝑤𝑖𝑛 𝑏𝑢𝑡 𝑚𝑎𝑛𝑦 𝑙𝑜𝑠𝑒."
        ];
        
        // Helper functions
        function formatNumber(int) {
            const str = int.toString();
            return str.replace(/(.)(?=(\d{3})+$)/g, '$1,');
        }
        
        function getDiceImage(number) {
            const images = {
                1: "https://i.imgur.com/ruaSs1C.png",
                2: "https://i.imgur.com/AIhuSxL.png",
                3: "https://i.imgur.com/JB4vTVj.png",
                4: "https://i.imgur.com/PGgsDAO.png",
                5: "https://i.imgur.com/RiaMAHX.png",
                6: "https://i.imgur.com/ys9PwAV.png"
            };
            return images[number];
        }
        
        function getTotalMultiplier(total) {
            const multipliers = {
                4: 40, 5: 35, 6: 33.33, 7: 25, 8: 20, 9: 16.66,
                10: 14.28, 11: 12.5, 12: 11.11, 13: 10, 14: 9.09,
                15: 8.33, 16: 7.69, 17: 7.14
            };
            return multipliers[total] || 1;
        }
        
        // Validate input
        if (!args[0]) {
            return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑦𝑜𝑢𝑟 𝑏𝑒𝑡: 𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙/𝑡𝑟𝑖𝑝𝑙𝑒/𝑝𝑎𝑖𝑟/𝑡𝑜𝑡𝑎𝑙/𝑛𝑢𝑚𝑏𝑒𝑟", threadID, messageID);
        }
        
        const bet = parseInt((args[1] === "allin" ? money : args[1]));
        const input = args[0].toLowerCase();
        const specificValue = parseInt(args[2]);
        
        if (!bet || isNaN(bet)) return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡", threadID, messageID);
        if (bet < 20) return api.sendMessage("❌ 𝑀𝑖𝑛𝑖𝑚𝑢𝑚 𝑏𝑒𝑡 𝑖𝑠 20$", threadID, messageID);
        if (bet > money) return api.sendMessage("❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑝𝑙𝑎𝑐𝑒 𝑡ℎ𝑖𝑠 𝑏𝑒𝑡", threadID, messageID);
        
        // Determine choice
        let choice;
        if (input === "big" || input === "large") choice = 'big';
        else if (input === "small" || input === "little") choice = 'small';
        else if (input === 'triple' || input === 'three') choice = 'triple';
        else if (input === 'pair' || input === 'double') choice = 'pair';
        else if (input === 'total' || input === 'sum') choice = 'total';
        else if (input === 'number' || input === 'num') choice = 'number';
        else return api.sendMessage('❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒: 𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙/𝑡𝑟𝑖𝑝𝑙𝑒/𝑝𝑎𝑖𝑟/𝑡𝑜𝑡𝑎𝑙/𝑛𝑢𝑚𝑏𝑒𝑟', threadID, messageID);
        
        if (choice === 'total' && (specificValue < 4 || specificValue > 17)) {
            return api.sendMessage("❌ 𝑇𝑜𝑡𝑎𝑙 𝑏𝑒𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 4 𝑎𝑛𝑑 17", threadID, messageID);
        }
        
        if (choice === 'number' && (specificValue < 1 || specificValue > 6)) {
            return api.sendMessage("❌ 𝑁𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 6", threadID, messageID);
        }
        
        if ((choice === 'total' || choice === 'number') && !specificValue) {
            return api.sendMessage(`❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 ${choice === 'total' ? '𝑡𝑜𝑡𝑎𝑙 𝑣𝑎𝑙𝑢𝑒' : '𝑛𝑢𝑚𝑏𝑒𝑟'} 𝑡𝑜 𝑏𝑒𝑡 𝑜𝑛`, threadID, messageID);
        }
        
        // Roll dice
        const dice = [];
        const diceImages = [];
        
        for (let i = 1; i < 4; i++) {
            const roll = Math.floor(Math.random() * 6 + 1);
            dice.push(roll);
            const diceImage = (await axios.get(getDiceImage(roll), { responseType: 'stream' })).data;
            diceImages.push(diceImage);
            api.sendMessage(`🎲 𝑅𝑜𝑙𝑙 ${i}: ${roll}`, threadID, messageID);
            await new Promise(resolve => setTimeout(resolve, rollDelay * 1000));
        }
        
        const total = dice[0] + dice[1] + dice[2];
        let resultText, outcome, winAmount, newBalance;
        
        // Determine result based on choice
        if (choice === 'number') {
            const matchCount = dice.filter(d => d === specificValue).length;
            if (matchCount === 1) {
                resultText = `${specificValue}`;
                outcome = 'win';
                winAmount = bet * singleMatchMultiplier;
            } else if (matchCount === 2) {
                resultText = `${specificValue}`;
                outcome = 'win';
                winAmount = bet * pairMatchMultiplier;
            } else if (matchCount === 3) {
                resultText = `${specificValue}`;
                outcome = 'win';
                winAmount = bet * tripleMatchMultiplier;
            } else {
                resultText = `${specificValue}`;
                outcome = 'lose';
                winAmount = bet;
            }
            newBalance = outcome === 'win' ? money + winAmount : money - winAmount;
        } 
        else if (choice === 'total') {
            if (total === specificValue) {
                resultText = "𝑒𝑥𝑎𝑐𝑡 𝑡𝑜𝑡𝑎𝑙";
                outcome = 'win';
                winAmount = bet * parseInt(getTotalMultiplier(specificValue));
                newBalance = money + winAmount;
            } else {
                resultText = `${total}`;
                outcome = 'lose';
                winAmount = bet;
                newBalance = money - winAmount;
            }
        }
        else if (choice === 'triple') {
            if (dice[0] === dice[1] && dice[1] === dice[2]) {
                resultText = "𝑡𝑟𝑖𝑝𝑙𝑒 𝑚𝑎𝑡𝑐ℎ";
                outcome = 'win';
                winAmount = bet * tripleMultiplier;
                newBalance = money + winAmount;
            } else {
                resultText = (total >= 11 && total <= 18 ? "𝑏𝑖𝑔" : "𝑠𝑚𝑎𝑙𝑙");
                outcome = 'lose';
                winAmount = bet;
                newBalance = money - winAmount;
            }
        }
        else if (choice === 'pair') {
            if (dice[0] === dice[1] || dice[1] === dice[2] || dice[0] === dice[2]) {
                resultText = "𝑝𝑎𝑖𝑟 𝑚𝑎𝑡𝑐ℎ";
                outcome = 'win';
                winAmount = bet * pairMultiplier;
                newBalance = money + winAmount;
            } else {
                resultText = (total >= 11 && total <= 18 ? "𝑏𝑖𝑔" : "𝑠𝑚𝑎𝑙𝑙");
                outcome = 'lose';
                winAmount = bet;
                newBalance = money - winAmount;
            }
        }
        else if (choice === 'big' || choice === 'small') {
            if (dice[0] === dice[1] && dice[1] === dice[2]) {
                resultText = "𝑡𝑟𝑖𝑝𝑙𝑒 𝑚𝑎𝑡𝑐ℎ";
                outcome = 'lose';
                winAmount = bet;
                newBalance = money - winAmount;
            } else {
                resultText = (total >= 11 && total <= 18 ? "𝑏𝑖𝑔" : "𝑠𝑚𝑎𝑙𝑙");
                if (resultText === choice) {
                    outcome = 'win';
                    winAmount = bet * winMultiplier;
                    newBalance = winAmount + money;
                } else {
                    outcome = 'lose';
                    winAmount = bet;
                    newBalance = money - winAmount;
                }
            }
        }
        
        // Update currency
        if (outcome === 'lose') {
            decreaseMoney(senderID, winAmount);
        } else if (outcome === 'win') {
            increaseMoney(senderID, winAmount);
        }
        
        // Build result message
        const message = `====== 𝐷𝐼𝐶𝐸 𝐺𝐴𝑀𝐸 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 ======` +
            `\n⏰ 𝑇𝑖𝑚𝑒: ${format_day}` +
            `\n👤 𝑃𝑙𝑎𝑦𝑒𝑟: ${name}` +
            `\n🎯 𝐵𝑒𝑡: ${choice}${specificValue ? ` (${specificValue})` : ''}` +
            `\n✅ 𝑅𝑒𝑠𝑢𝑙𝑡: ${resultText}` +
            `\n🎲 𝐷𝑖𝑐𝑒 1: ${dice[0]}` +
            `\n🎲 𝐷𝑖𝑐𝑒 2: ${dice[1]}` +
            `\n🎲 𝐷𝑖𝑐𝑒 3: ${dice[2]}` +
            `\n🧮 𝑇𝑜𝑡𝑎𝑙: ${total}` +
            `\n📊 𝑂𝑢𝑡𝑐𝑜𝑚𝑒: ${(outcome === 'win' ? '𝑊𝐼𝑁' : '𝐿𝑂𝑆𝐸')}` +
            `\n💰 𝐵𝑒𝑡 𝐴𝑚𝑜𝑢𝑛𝑡: ${formatNumber(bet)}$` +
            `\n💵 ${(outcome === 'win' ? '𝑊𝑜𝑛' : '𝐿𝑜𝑠𝑡')}: ${formatNumber(Math.floor(winAmount))}$` +
            `\n📈 𝑆𝑡𝑎𝑡𝑢𝑠: ${(outcome === 'win' ? '𝑅𝑒𝑤𝑎𝑟𝑑 𝑃𝑎𝑖𝑑' : '𝐴𝑚𝑜𝑢𝑛𝑡 𝐷𝑒𝑑𝑢𝑐𝑡𝑒𝑑')}` +
            `\n💼 𝑁𝑒𝑤 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: ${formatNumber(newBalance)}$` +
            `\n──────────────────` +
            `\n💡 𝐴𝑑𝑣𝑖𝑐𝑒: ${quotes[Math.floor(Math.random() * quotes.length)]}` +
            `\n====== 𝐺𝐴𝑀𝐸 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸𝐷 ======`;
        
        // Send result
        api.sendMessage({
            body: message,
            attachment: diceImages
        }, threadID, messageID);
        
    } catch (error) {
        console.error("𝐷𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒", event.threadID, event.messageID);
    }
};
