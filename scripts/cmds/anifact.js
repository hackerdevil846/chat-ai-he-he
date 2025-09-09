const axios = require('axios');
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "anifact",
    aliases: ["animefact", "afact"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑓𝑎𝑐𝑡𝑠 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑓𝑎𝑐𝑡𝑠 𝑎𝑐𝑐𝑜𝑚𝑝𝑎𝑛𝑖𝑒𝑑 𝑏𝑦 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    category: "𝑎𝑛𝑖𝑚𝑒",
    guide: {
        en: "{p}anifact"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function ({ message, event }) {
    try {
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const response = await axios.get('https://nekos.best/api/v2/neko');
        const imageUrl = response.data.results[0].url;
        const artistName = response.data.results[0].artist_name;
        const artistHref = response.data.results[0].artist_href;

        const imagePath = path.join(cacheDir, `anime_fact_${event.senderID}.png`);
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        
        await fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
        
        await message.reply({
            body: `🦄 𝐴𝑛𝑖𝑚𝑒 𝐹𝑎𝑐𝑡 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒:\n🎨 𝐴𝑟𝑡𝑖𝑠𝑡: ${artistName}\n🔗 𝑆𝑜𝑢𝑟𝑐𝑒: ${artistHref}`,
            attachment: fs.createReadStream(imagePath)
        });

        // Clean up the image file after sending
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        
    } catch (error) {
        console.error("𝐴𝑛𝑖𝐹𝑎𝑐𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("🔴 𝐸𝑟𝑟𝑜𝑟: 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑎𝑛𝑖𝑚𝑒 𝑑𝑎𝑡𝑎 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒");
    }
};
