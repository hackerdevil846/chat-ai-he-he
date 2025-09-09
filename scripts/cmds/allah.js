const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "allah",
    aliases: ["islam", "muslim"],
    version: "1.0.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "islamic",
    shortDescription: {
        en: "𝑆𝑒𝑛𝑑 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑡𝑒𝑥𝑡 𝐺𝐼𝐹𝑠 𝑤𝑖𝑡ℎ 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝑆ℎ𝑎𝑟𝑒𝑠 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐺𝐼𝐹𝑠 𝑤𝑖𝑡ℎ 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑛𝑑 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟𝑠"
    },
    guide: {
        en: "{p}allah"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        // Check dependencies
        if (!fs.existsSync || !axios) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        // Create cache directory if needed
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const cachePath = path.join(cacheDir, `allah_${Date.now()}.gif`);
        
        // GIF URLs collection
        const gifUrls = [
            "https://i.imgur.com/oV4VMvm.gif",
            "https://i.imgur.com/LvUF38x.gif",
            "https://i.imgur.com/r0ZE7lx.gif",
            "https://i.imgur.com/98PjVxg.gif",
            "https://i.imgur.com/7zLmJch.gif",
            "https://i.imgur.com/C2a3Cj3.gif",
            "https://i.imgur.com/DHoZ9A1.gif",
            "https://i.imgur.com/2eewmJm.gif",
            "https://i.imgur.com/ScGCmKE.gif",
            "https://i.imgur.com/U07Yd3U.gif"
        ];

        // Select random GIF
        const randomUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
        
        // Download GIF
        const response = await axios.get(randomUrl, {
            responseType: "arraybuffer",
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        // Save to cache
        fs.writeFileSync(cachePath, Buffer.from(response.data, "binary"));
        
        // Send message with GIF
        await message.reply({
            body: "🕌 𝑎𝑙𝑙𝑎ℎ 𝑎𝑘𝑏𝑎𝑟 - 𝐴𝑙𝑙𝑎ℎ𝑢 𝐴𝑘𝑏𝑎𝑟 🕌\n" +
                  "𝐺𝑜𝑑 𝑖𝑠 𝑡ℎ𝑒 𝐺𝑟𝑒𝑎𝑡𝑒𝑠𝑡\n\n" +
                  "𝑀𝑎𝑦 𝑡ℎ𝑖𝑠 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟 𝑠𝑡𝑟𝑒𝑛𝑔𝑡ℎ𝑒𝑛 𝑦𝑜𝑢𝑟 𝑓𝑎𝑖𝑡ℎ 𝑎𝑛𝑑 𝑏𝑟𝑖𝑛𝑔 𝑦𝑜𝑢 𝑝𝑒𝑎𝑐𝑒. ✨",
            attachment: fs.createReadStream(cachePath)
        });

        // Clean up after sending
        if (fs.existsSync(cachePath)) {
            fs.unlinkSync(cachePath);
        }
        
    } catch (error) {
        console.error("𝐴𝑙𝑙𝑎ℎ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        
        // Fallback message if GIF fails
        await message.reply({
            body: "🕌 𝑎𝑙𝑙𝑎ℎ 𝑎𝑘𝑏𝑎𝑟 - 𝐴𝑙𝑙𝑎ℎ𝑢 𝐴𝑘𝑏𝑎𝑟 🕌\n" +
                  "𝐺𝑜𝑑 𝑖𝑠 𝑡ℎ𝑒 𝐺𝑟𝑒𝑎𝑡𝑒𝑠𝑡\n\n" +
                  "𝑀𝑎𝑦 𝑡ℎ𝑖𝑠 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟 𝑠𝑡𝑟𝑒𝑛𝑔𝑡ℎ𝑒𝑛 𝑦𝑜𝑢𝑟 𝑓𝑎𝑖𝑡ℎ.\n\n" +
                  "❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑙𝑜𝑎𝑑 𝐺𝐼𝐹, 𝑏𝑢𝑡 𝑡ℎ𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑟𝑒𝑚𝑎𝑖𝑛𝑠. 📿"
        });
    }
};
