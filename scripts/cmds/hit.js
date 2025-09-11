const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "hit",
    aliases: ["punch", "fight"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝑃𝑢𝑛𝑐ℎ 𝑠𝑜𝑚𝑒𝑜𝑛𝑒"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑝𝑢𝑛𝑐ℎ 𝐺𝐼𝐹 𝑡𝑜 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
        en: "{p}hit @𝑡𝑎𝑔"
    },
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function ({ message, event }) {
    try {
        const { mentions } = event;
        const mention = Object.keys(mentions);
        
        if (!mention[0]) {
            return message.reply("𝑇𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒! 👊");
        }

        const tag = mentions[mention[0]].replace("@", "");
        const userId = mention[0];
        
        const gifLinks = [
            "https://i.postimg.cc/SNX8pD8Z/13126.gif",
            "https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
            "https://i.postimg.cc/fyV3DR33/anime-punch.gif",
            "https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif",
        ];
        
        const randomGif = gifLinks[Math.floor(Math.random() * gifLinks.length)];
        
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const gifPath = path.join(cacheDir, "hit.gif");
        
        const response = await axios.get(randomGif, {
            responseType: 'arraybuffer'
        });
        
        await fs.writeFileSync(gifPath, Buffer.from(response.data, 'binary'));
        
        await message.reply({
            body: `${tag} 𝑇𝑎𝑘𝑒 𝑡ℎ𝑎𝑡! 👊`,
            mentions: [{
                tag: tag,
                id: userId
            }],
            attachment: fs.createReadStream(gifPath)
        });
        
        setTimeout(() => {
            if (fs.existsSync(gifPath)) {
                fs.unlinkSync(gifPath);
            }
        }, 5000);
        
    } catch (error) {
        console.error("𝐻𝑖𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑝𝑢𝑛𝑐ℎ!");
    }
};
