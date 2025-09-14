const fs = require("fs-extra");

module.exports.config = {
    name: "lixi",
    aliases: ["lixì", "lucky"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝐿𝑖 𝑥ì 𝑎𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 '𝑙ì 𝑥ì' 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑎𝑢𝑑𝑖𝑜"
    },
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑙ì 𝑥ì' 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑤𝑖𝑙𝑙 𝑟𝑒𝑠𝑝𝑜𝑛𝑑 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function() {
    // Empty onStart function as this is an auto-response command
};

module.exports.onChat = async function({ event, message }) {
    try {
        // Check if message contains "lì xì" (case insensitive)
        if (event.body && event.body.toLowerCase().includes("lì xì")) {
            const audioPath = __dirname + "/noprefix/lixicailol.mp3";
            
            // Check if file exists
            if (fs.existsSync(audioPath)) {
                await message.reply({
                    body: "𝑐𝑐 🙂",
                    attachment: fs.createReadStream(audioPath)
                });
            } else {
                console.error("𝐴𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡:", audioPath);
                await message.reply("❌ 𝐴𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒 𝑝𝑎𝑡ℎ.");
            }
        }
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑎𝑢𝑑𝑖𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
    }
};
