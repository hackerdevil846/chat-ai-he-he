const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "couple",
    aliases: ["lovepair", "compatibility"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑙𝑜𝑣𝑒",
    shortDescription: {
        en: "𝑆ℎ𝑜𝑤 𝑙𝑜𝑣𝑒 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦"
    },
    longDescription: {
        en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑙𝑜𝑣𝑒 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠"
    },
    guide: {
        en: "{p}couple [@𝑡𝑎𝑔]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function() {
    const dirMaterial = path.join(__dirname, 'cache', 'canvas');
    const filePath = path.join(dirMaterial, 'seophi.png');
    
    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
    }
    
    if (!fs.existsSync(filePath)) {
        try {
            const imageData = await axios.get("https://i.imgur.com/hmKmmam.jpg", { 
                responseType: 'arraybuffer' 
            });
            fs.writeFileSync(filePath, Buffer.from(imageData.data));
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑖𝑚𝑎𝑔𝑒:", error);
        }
    }
};

async function makeImage({ one, two }) {
    const __root = path.join(__dirname, "cache", "canvas");
    const pathImg = path.join(__root, `couple_${one}_${two}.png`);
    const avatarOne = path.join(__root, `avt_${one}.png`);
    const avatarTwo = path.join(__root, `avt_${two}.png`);
    
    try {
        // Download first avatar
        const getAvatarOne = await axios.get(
            `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
            { responseType: 'arraybuffer' }
        );
        fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data));
        
        // Download second avatar
        const getAvatarTwo = await axios.get(
            `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
            { responseType: 'arraybuffer' }
        );
        fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data));
        
        // Process images
        const background = await jimp.read(path.join(__root, "seophi.png"));
        const circleOne = await jimp.read(await circle(avatarOne));
        const circleTwo = await jimp.read(await circle(avatarTwo));
        
        background.resize(1024, 712)
                 .composite(circleOne.resize(200, 200), 527, 141)
                 .composite(circleTwo.resize(200, 200), 389, 407);
        
        const buffer = await background.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, buffer);
        
        // Cleanup temporary files
        fs.unlinkSync(avatarOne);
        fs.unlinkSync(avatarTwo);
        
        return pathImg;
        
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", error);
        throw error;
    }
}

async function circle(imagePath) {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.onStart = async function({ message, event, args }) {
    try {
        const { threadID, messageID, senderID } = event;
        
        if (!args[0]) {
            return message.reply("💝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑎 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑠𝑒𝑒 𝑙𝑜𝑣𝑒 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦!", threadID, messageID);
        }
        
        const mention = Object.keys(event.mentions)[0];
        if (!mention) {
            return message.reply("💝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑒𝑟!", threadID, messageID);
        }
        
        const tag = event.mentions[mention].replace("@", "");
        const one = senderID;
        const two = mention;
        
        const imagePath = await makeImage({ one, two });
        
        await message.reply({ 
            body: `💑 𝐿𝑜𝑣𝑒 𝐶𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝐵𝑒𝑡𝑤𝑒𝑒𝑛 𝑌𝑜𝑢 𝐴𝑛𝑑 ${tag}\n❣️ 𝑀𝑎𝑦 𝑦𝑜𝑢𝑟 𝑙𝑜𝑣𝑒 𝑠𝑡𝑜𝑟𝑦 𝑏𝑒 𝑓𝑜𝑟𝑒𝑣𝑒𝑟 ❣️`,
            mentions: [{
                tag: tag,
                id: mention
            }],
            attachment: fs.createReadStream(imagePath)
        }, threadID);
        
        fs.unlinkSync(imagePath);
        
    } catch (error) {
        console.error("𝐶𝑜𝑢𝑝𝑙𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑙𝑜𝑣𝑒 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
};
