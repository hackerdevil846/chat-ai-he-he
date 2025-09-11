const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "binz",
    aliases: ["bigcityboi"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝑃𝑙𝑎𝑦𝑠 𝐵𝐼𝐺𝐶𝐼𝑇𝑌𝐵𝑂𝐼 𝑎𝑢𝑑𝑖𝑜 𝑤ℎ𝑒𝑛 𝑢𝑠𝑒𝑟 𝑡𝑦𝑝𝑒𝑠 '𝑏𝑖𝑛𝑧'"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑝𝑙𝑎𝑦𝑠 𝐵𝐼𝐺𝐶𝐼𝑇𝑌𝐵𝑂𝐼 𝑎𝑢𝑑𝑖𝑜 𝑤ℎ𝑒𝑛 𝑡ℎ𝑒 𝑤𝑜𝑟𝑑 '𝑏𝑖𝑛𝑧' 𝑖𝑠 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑 𝑖𝑛 𝑐ℎ𝑎𝑡"
    },
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑏𝑖𝑛𝑧' 𝑖𝑛 𝑐ℎ𝑎𝑡 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑤𝑖𝑙𝑙 𝑟𝑒𝑠𝑝𝑜𝑛𝑑 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑎𝑢𝑑𝑖𝑜"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function ({ message }) {
    // Empty function for event-based commands
    // You can add a help message here if needed
};

module.exports.onChat = async function({ event, message, api }) {
    const { threadID, messageID, body } = event;
    
    // Check if message contains "binz" (case insensitive)
    if (body && body.toLowerCase().includes("binz")) {
        try {
            // Define path to audio file
            const audioPath = path.join(__dirname, 'noprefix', 'binz.mp3');
            
            // Check if audio file exists
            if (!fs.existsSync(audioPath)) {
                console.error("Audio file not found:", audioPath);
                return message.reply("❌ 𝐴𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛.");
            }

            // Send message with audio attachment
            const msg = {
                body: "𝐵𝐼𝐺𝐶𝐼𝑇𝑌𝐵𝑂𝐼 🎵",
                attachment: fs.createReadStream(audioPath)
            };
            
            return message.reply(msg);
            
        } catch (error) {
            console.error("Error in binz command:", error);
            message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑙𝑎𝑦𝑖𝑛𝑔 𝑎𝑢𝑑𝑖𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
