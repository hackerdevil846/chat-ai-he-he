const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "anicouple",
    aliases: ["animecouple", "couplepic"],
    version: "1.0.6",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 𝑝ℎ𝑜𝑡𝑜𝑠"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑤𝑎𝑖𝑓𝑢.𝑖𝑚 𝐴𝑃𝐼"
    },
    category: "𝑚𝑒𝑑𝑖𝑎",
    guide: {
        en: "{p}anicouple"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        // Send initial processing message
        const processingMsg = await message.reply("⏳ 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 𝑓𝑜𝑟 𝑦𝑜𝑢...");

        // Get random anime couple image from API
        const response = await axios.get("https://api.waifu.im/random/?selected_tags=couple", {
            headers: {
                'User-Agent': '𝑀𝑜𝑧𝑖𝑙𝑙𝑎/5.0 (𝑊𝑖𝑛𝑑𝑜𝑤𝑠 𝑁𝑇 10.0; 𝑊𝑖𝑛64; 𝑥64) 𝐴𝑝𝑝𝑙𝑒𝑊𝑒𝑏𝐾𝑖𝑡/537.36 (𝐾𝐻𝑇𝑀𝐿, 𝑙𝑖𝑘𝑒 𝐺𝑒𝑐𝑘𝑜) 𝐶ℎ𝑟𝑜𝑚𝑒/91.0.4472.124 𝑆𝑎𝑓𝑎𝑟𝑖/537.36'
            }
        });
        
        const imgUrl = response.data.images[0].url;
        
        // Set up cache path
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const imgPath = path.join(cacheDir, 'anicouple.jpg');
        
        // Download the image using global utils
        const imageStream = await global.utils.getStreamFromURL(imgUrl);
        const writer = fs.createWriteStream(imgPath);
        imageStream.pipe(writer);
        
        // Wait for download to complete
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send the image
        await message.reply({
            body: "💑 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒!",
            attachment: fs.createReadStream(imgPath)
        });

        // Clean up processing message and image file
        message.unsend(processingMsg.messageID);
        fs.unlinkSync(imgPath);
        
    } catch (error) {
        console.error("𝐴𝑛𝑖𝑐𝑜𝑢𝑝𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
