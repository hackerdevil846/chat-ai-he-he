const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs-extra");

module.exports.config = {
    name: "condom",
    aliases: ["condomfail", "cfail"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝑀𝑎𝑘𝑒 𝑓𝑢𝑛 𝑜𝑓 𝑦𝑜𝑢𝑟 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑢𝑠𝑖𝑛𝑔 𝑐𝑟𝑎𝑧𝑦 𝑐𝑜𝑛𝑑𝑜𝑚 𝑓𝑎𝑖𝑙𝑠 😆"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑐𝑜𝑛𝑑𝑜𝑚 𝑓𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    guide: {
        en: "{p}condom @𝑡𝑎𝑔"
    },
    dependencies: {
        "axios": "",
        "jimp": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "MISSING_TAG": "❗ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑡𝑎𝑔 𝑎 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.",
        "CREATING_IMAGE": "🔧 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑟𝑎𝑧𝑦 𝑐𝑜𝑛𝑑𝑜𝑚 𝑓𝑎𝑖𝑙... 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡!",
        "SEND_ERROR": "⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒.",
        "GEN_ERROR": "⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒."
    }
};

module.exports.onStart = async function({ message, event, args, getText }) {
    try {
        // Check dependencies
        if (!axios || !jimp || !fs) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        const mentions = Object.keys(event.mentions || {});
        if (!mentions.length) {
            return message.reply(getText("MISSING_TAG"));
        }
        
        const targetId = mentions[0];
        const targetName = event.mentions[targetId];
        
        await message.reply(getText("CREATING_IMAGE"));
        
        const imagePath = await generateImageFor(targetId);
        
        await message.reply({
            body: `𝑂𝑝𝑠 𝐶𝑟𝑎𝑧𝑦 𝐶𝑜𝑛𝑑𝑜𝑚 𝐹𝑎𝑖𝑙𝑠 😆\n𝑀𝑎𝑑𝑒 𝑓𝑜𝑟: ${targetName}\n\n𝐶𝑟𝑒𝑑𝑖𝑡𝑠: ${this.config.author}`,
            attachment: fs.createReadStream(imagePath)
        });

        // Clean up
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

    } catch (error) {
        console.error("𝐶𝑜𝑛𝑑𝑜𝑚 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply(getText("GEN_ERROR"));
    }
};

async function generateImageFor(userId) {
    const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const templateUrl = "https://i.imgur.com/cLEixM0.jpg";
    const outputPath = "condom.png";
    
    const avatar = await jimp.read(avatarUrl);
    const image = await jimp.read(templateUrl);
    
    image.resize(512, 512);
    avatar.resize(263, 263);
    
    image.composite(avatar, 256, 258);
    
    await image.writeAsync(outputPath);
    return outputPath;
}
