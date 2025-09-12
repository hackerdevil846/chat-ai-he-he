const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "chocolate",
    aliases: ["toffee", "sweet"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "🍫 𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑒𝑑 𝑐ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑐ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒 𝑎𝑛𝑑 𝑡𝑜𝑓𝑓𝑒𝑒 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑤𝑒𝑒𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    },
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑐ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒' 𝑜𝑟 '𝑡𝑜𝑓𝑓𝑒𝑒' 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    dependencies: {
        "fs": "",
        "path": ""
    }
};

module.exports.onLoad = function() {
    console.log('🍫 𝐶ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒 𝑚𝑜𝑑𝑢𝑙𝑒 𝑙𝑜𝑎𝑑𝑒𝑑');
};

module.exports.onStart = async function({ message }) {
    try {
        // 𝐸𝑚𝑝𝑡𝑦 𝑜𝑛𝑆𝑡𝑎𝑟𝑡 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛 𝑡𝑜 𝑝𝑟𝑒𝑣𝑒𝑛𝑡 𝑒𝑟𝑟𝑜𝑟𝑠
        // 𝑇ℎ𝑒 𝑎𝑐𝑡𝑢𝑎𝑙 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛𝑎𝑙𝑖𝑡𝑦 𝑖𝑠 𝑖𝑛 𝑜𝑛𝐶ℎ𝑎𝑡
    } catch (error) {
        console.error("𝐶ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒 𝑂𝑛𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onChat = async function({ event, message, api }) {
    try {
        const { threadID, messageID, body } = event;
        const triggers = ["chocolate", "toffee"];
        
        if (triggers.some(trigger => 
            body && body.toLowerCase().includes(trigger.toLowerCase())
        )) {
            const chocolatePath = path.join(__dirname, 'cache', 'chocolate.jpg');
            
            if (!fs.existsSync(chocolatePath)) {
                console.error("𝐶ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑:", chocolatePath);
                return message.reply("🍫 𝑌𝑒 𝑙𝑜 𝑐ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒 𝑑𝑎𝑟𝑙𝑖𝑛𝑔! 💝\n(𝐼𝑚𝑎𝑔𝑒 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒)");
            }

            await message.reply({
                body: "🍫 𝑌𝑒 𝑙𝑜 𝑐ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒 𝑑𝑎𝑟𝑙𝑖𝑛𝑔! 💝",
                attachment: fs.createReadStream(chocolatePath)
            });
            
            await api.setMessageReaction("🍫", messageID, (err) => {
                if (err) console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑡 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛:", err);
            }, true);
        }
    } catch (error) {
        console.error("𝐶ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒 𝑂𝑛𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};
