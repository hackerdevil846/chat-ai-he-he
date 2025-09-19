const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "darkjoke",
        aliases: ["dark", "meme", "djoke"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝑑𝑎𝑟𝑘 𝑗𝑜𝑘𝑒𝑠 𝑎𝑛𝑑 𝑚𝑒𝑚𝑒𝑠"
        },
        longDescription: {
            en: "𝐹𝑒𝑡𝑐ℎ 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝑑𝑎𝑟𝑘 𝑗𝑜𝑘𝑒𝑠 𝑓𝑟𝑜𝑚 𝑗𝑠𝑜𝑛 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒"
        },
        guide: {
            en: "{p}darkjoke"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            // Load dark jokes from JSON file
            const jsonPath = path.join(__dirname, 'data', 'drakjokes.json');
            
            if (!fs.existsSync(jsonPath)) {
                return message.reply("❌ 𝐷𝑎𝑟𝑘 𝑗𝑜𝑘𝑒𝑠 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒 𝑝𝑎𝑡ℎ.");
            }

            // Read and parse JSON file
            const jsonData = fs.readFileSync(jsonPath, 'utf-8');
            const darkJokesData = JSON.parse(jsonData);

            if (!Array.isArray(darkJokesData) || darkJokesData.length === 0) {
                return message.reply("❌ 𝑁𝑜 𝑑𝑎𝑟𝑘 𝑗𝑜𝑘𝑒𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑖𝑛 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒.");
            }

            // Extract URLs from JSON data
            const darkJokeUrls = darkJokesData.map(item => item.result);

            // Select random joke
            const randomJokeUrl = darkJokeUrls[Math.floor(Math.random() * darkJokeUrls.length)];
            
            if (!randomJokeUrl) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑗𝑜𝑘𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
            }

            // Get image stream
            const imageStream = await global.utils.getStreamFromURL(randomJokeUrl);

            await message.reply({
                body: "😈 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑑𝑎𝑟𝑘 𝑗𝑜𝑘𝑒/𝑚𝑒𝑚𝑒! ⚡\n\n𝐷𝑖𝑠𝑐𝑙𝑎𝑖𝑚𝑒𝑟: 𝑇ℎ𝑒𝑠𝑒 𝑎𝑟𝑒 𝑗𝑢𝑠𝑡 𝑗𝑜𝑘𝑒𝑠, 𝑑𝑜𝑛'𝑡 𝑡𝑎𝑘𝑒 𝑡ℎ𝑒𝑚 𝑠𝑒𝑟𝑖𝑜𝑢𝑠𝑙𝑦!",
                attachment: imageStream
            });

        } catch (error) {
            console.error("𝐷𝑎𝑟𝑘𝑗𝑜𝑘𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑑𝑎𝑟𝑘 𝑗𝑜𝑘𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
