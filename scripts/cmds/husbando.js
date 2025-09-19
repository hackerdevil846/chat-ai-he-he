const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "husbando",
        aliases: ["husbu", "animeboy"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑎𝑛𝑖𝑚𝑒",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 ℎ𝑢𝑠𝑏𝑎𝑛𝑑𝑜 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 ℎ𝑢𝑠𝑏𝑎𝑛𝑑𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑛𝑎𝑚𝑒𝑠"
        },
        guide: {
            en: "{p}husbando"
        },
        countDown: 5,
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            // Load husbando data from JSON file
            const husbandoPath = path.join(__dirname, 'data', 'anime', 'husbu.json');
            
            if (!fs.existsSync(husbandoPath)) {
                return message.reply("❌ 𝐻𝑢𝑠𝑏𝑎𝑛𝑑𝑜 𝑑𝑎𝑡𝑎 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑝𝑎𝑡ℎ: data/anime/husbu.json");
            }

            const husbandoData = fs.readJsonSync(husbandoPath);
            
            if (!husbandoData || !Array.isArray(husbandoData) || husbandoData.length === 0) {
                return message.reply("❌ 𝑁𝑜 ℎ𝑢𝑠𝑏𝑎𝑛𝑑𝑜 𝑑𝑎𝑡𝑎 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑖𝑛 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒.");
            }

            // Get random husbando
            const randomHusbando = husbandoData[Math.floor(Math.random() * husbandoData.length)];
            
            if (!randomHusbando.url) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 ℎ𝑢𝑠𝑏𝑎𝑛𝑑𝑜 𝑑𝑎𝑡𝑎: 𝑚𝑖𝑠𝑠𝑖𝑛𝑔 𝑢𝑟𝑙");
            }

            const stream = await global.utils.getStreamFromURL(randomHusbando.url);
            
            let messageBody = `🌸 𝑅𝑎𝑛𝑑𝑜𝑚 𝐴𝑛𝑖𝑚𝑒 𝐻𝑢𝑠𝑏𝑎𝑛𝑑𝑜 🌸\n\n`;
            
            if (randomHusbando.name) {
                messageBody += `📛 𝑁𝑎𝑚𝑒: ${randomHusbando.name}\n`;
            }
            
            if (randomHusbando.anime) {
                messageBody += `🎬 𝐴𝑛𝑖𝑚𝑒: ${randomHusbando.anime}\n`;
            }
            
            messageBody += `\n© 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;

            await message.reply({
                body: messageBody,
                attachment: stream
            });

        } catch (error) {
            console.error("𝐻𝑢𝑠𝑏𝑎𝑛𝑑𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 ℎ𝑢𝑠𝑏𝑎𝑛𝑑𝑜 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
