module.exports.config = {
    name: "baucuaca",
    aliases: ["slot", "slots"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑔𝑎𝑚𝑒",
    shortDescription: {
        en: "𝑆𝑙𝑜𝑡 𝑀𝑎𝑐ℎ𝑖𝑛𝑒 𝐺𝑎𝑚𝑒"
    },
    longDescription: {
        en: "𝑃𝑙𝑎𝑦 𝑠𝑙𝑜𝑡 𝑚𝑎𝑐ℎ𝑖𝑛𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑒𝑡𝑡𝑖𝑛𝑔"
    },
    guide: {
        en: "{p}baucuaca [𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡]"
    }
};

module.exports.onStart = async function({ message, event, args, Users }) {
    const { threadID, messageID, senderID } = event;
    const slotItems = ["🦀", "🐟", "🗳️"];
    
    const formatText = text => {
        const boldItalicMap = {
            a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉',
            i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑',
            q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙',
            y: '𝒚', z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭',
            G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
            O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽',
            W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁'
        };
        return text.split('').map(char => boldItalicMap[char] || char).join('');
    };

    try {
        const userData = await Users.getData(senderID);
        let money = userData.money || 0;
        
        if (!args[0]) {
            return message.reply(formatText("𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡!"), threadID, messageID);
        }
        
        let coin = parseInt(args[0]);
        
        if (isNaN(coin)) {
            return message.reply(formatText("𝑌𝑜𝑢𝑟 𝑏𝑒𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟!"), threadID, messageID);
        }
        
        if (coin > money) {
            return message.reply(formatText(`𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦! 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${money}$`), threadID, messageID);
        }
        
        if (coin < 50) {
            return message.reply(formatText("𝑀𝑖𝑛𝑖𝑚𝑢𝑚 𝑏𝑒𝑡 𝑖𝑠 50$!"), threadID, messageID);
        }

        let number = Array(3).fill().map(() => Math.floor(Math.random() * slotItems.length));
        
        let winnings = 0;
        let multiplier = 1;
        let resultText = "";

        if (number[0] === number[1] && number[1] === number[2]) {
            winnings = coin * 9;
            multiplier = 9;
            resultText = "✨ 𝐽𝐴𝐶𝐾𝑃𝑂𝑇! ✨";
        } else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
            winnings = coin * 2;
            multiplier = 2;
            resultText = "🎉 𝑊𝐼𝑁𝑁𝐸𝑅! 🎉";
        } else {
            winnings = -coin;
            resultText = "😢 𝐿𝑂𝑆𝑇...";
        }

        const slotResult = 
`╭──🎰───────╮
│ ${slotItems[number[0]]}  |  ${slotItems[number[1]]}  |  ${slotItems[number[2]]} │
╰────────────╯
${formatText(resultText)}`;

        await Users.setData(senderID, { money: money + winnings });
        const newBalance = money + winnings;
        
        const resultMessage = winnings > 0 ?
            `${slotResult}\n${formatText(`𝑌𝑜𝑢 𝑤𝑜𝑛 ${winnings}$!`)}\n${formatText(`𝑀𝑢𝑙𝑡𝑖𝑝𝑙𝑖𝑒𝑟: ${multiplier}𝑥`)}\n${formatText(`𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${newBalance}$`)}` :
            `${slotResult}\n${formatText(`𝑌𝑜𝑢 𝑙𝑜𝑠𝑡 ${coin}$`)}\n${formatText(`𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${newBalance}$`)}`;

        message.reply(resultMessage, threadID, messageID);

    } catch (error) {
        console.error("𝑆𝑙𝑜𝑡 𝑀𝑎𝑐ℎ𝑖𝑛𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply(formatText("𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑."), threadID, messageID);
    }
};
