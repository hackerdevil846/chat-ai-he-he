const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "cony",
    aliases: ["lovepredict", "lovemeter"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝑃𝑟𝑒𝑑𝑖𝑐𝑡 𝑙𝑜𝑣𝑒 𝑝𝑟𝑜𝑏𝑎𝑏𝑖𝑙𝑖𝑡𝑦"
    },
    longDescription: {
        en: "𝑃𝑟𝑒𝑑𝑖𝑐𝑡𝑠 𝑦𝑜𝑢𝑟 𝑐ℎ𝑎𝑛𝑐𝑒 𝑜𝑓 ℎ𝑎𝑣𝑖𝑛𝑔 𝑎 𝑏𝑜𝑦𝑓𝑟𝑖𝑒𝑛𝑑/𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑 𝑡ℎ𝑖𝑠 𝑦𝑒𝑎𝑟"
    },
    guide: {
        en: "{p}cony"
    },
    dependencies: {
        "fs": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message, event, usersData }) {
    try {
        const probabilities = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%", "1%", "10%", "99.9%"];
        const randomProbability = probabilities[Math.floor(Math.random() * probabilities.length)];
        
        // Get user data
        const userData = await usersData.get(event.senderID);
        const name = userData.name;

        // Path to the GIF file
        const imagePath = path.join(__dirname, "cache", "chucmung.gif");
        
        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            return message.reply("❌ 𝐼𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑐𝑎𝑐ℎ𝑒 𝑓𝑜𝑙𝑑𝑒𝑟! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑎 '𝑐ℎ𝑢𝑐𝑚𝑢𝑛𝑔.𝑔𝑖𝑓' 𝑓𝑖𝑙𝑒 𝑡𝑜 𝑡ℎ𝑒 𝑐𝑎𝑐ℎ𝑒 𝑓𝑜𝑙𝑑𝑒𝑟.");
        }

        // Send message with attachment
        await message.reply({
            body: `🌸 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 ${name}!\n𝑌𝑜𝑢𝑟 𝑙𝑜𝑣𝑒 𝑝𝑟𝑜𝑏𝑎𝑏𝑖𝑙𝑖𝑡𝑦 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑦𝑒𝑎𝑟 𝑖𝑠: ${randomProbability} ❤️`,
            attachment: fs.createReadStream(imagePath)
        });

    } catch (error) {
        console.error("𝐶𝑜𝑛𝑦 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
};
