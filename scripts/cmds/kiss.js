const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "kiss",
    aliases: ["kisses", "chu"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "love",
    shortDescription: {
        en: "💖 𝐼𝑠ℎ𝑞𝑒𝑟 𝑚𝑜𝑚𝑒𝑛𝑡! 𝐾𝑖𝑠𝑠 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑏𝑦 𝑡𝑎𝑔𝑔𝑖𝑛𝑔 𝑡ℎ𝑒𝑚 💌"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑘𝑖𝑠𝑠 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑝𝑒𝑟𝑠𝑜𝑛"
    },
    guide: {
        en: "{p}kiss [𝑡𝑎𝑔]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const dirMaterial = __dirname + `/cache/`;
    const pathFile = path.resolve(__dirname, 'cache', 'hon0.jpeg');

    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
    }
    
    if (!fs.existsSync(pathFile)) {
        console.warn("💡 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑢𝑡 'ℎ𝑜𝑛0.𝑗𝑝𝑒𝑔' 𝑖𝑛 𝑡ℎ𝑒 𝑐𝑎𝑐ℎ𝑒 𝑓𝑜𝑙𝑑𝑒𝑟!");
    }
};

async function circle(imagePath) {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache");
    const hon_img = await jimp.read(__root + "/hon0.jpeg");
    const pathImg = __root + `/hon0_${one}_${two}.png`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;

    try {
        // Download avatars
        const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
            responseType: 'arraybuffer' 
        })).data;
        fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

        const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
            responseType: 'arraybuffer' 
        })).data;
        fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

        // Make circular avatars
        const circleOne = await jimp.read(await circle(avatarOne));
        const circleTwo = await jimp.read(await circle(avatarTwo));

        // Composite avatars on template
        hon_img.resize(700, 440)
            .composite(circleOne.resize(150, 150), 390, 23)
            .composite(circleTwo.resize(150, 150), 115, 130);

        const raw = await hon_img.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);

        return pathImg;
    } finally {
        // Cleanup temporary files
        if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
        if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
    }
}

module.exports.onStart = async function({ message, event, args, Currencies }) {
    try {
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);

        const one = senderID;
        const two = mention[0];

        const hc = Math.floor(Math.random() * 101);
        const rd = Math.floor(Math.random() * 100000) + 100000;

        // Increase user's in-bot currency
        await Currencies.increaseMoney(senderID, parseInt(hc * rd));

        if (!two) {
            return message.reply("💌 𝐷𝑎𝑦𝑎 𝑘𝑜𝑟𝑒 1 𝑗𝑜𝑛 𝑘𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑢𝑛!", threadID, messageID);
        } else {
            const imagePath = await makeImage({ one, two });
            
            await message.reply({
                body: `💖 𝐼𝑠ℎ𝑞𝑒𝑟 𝑝𝑜𝑟𝑖𝑚𝑎𝑛: ${hc}%\n💸 𝐴𝑝𝑛𝑎𝑑𝑒𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏𝑙𝑒𝑠𝑠𝑖𝑛𝑔: ${hc * rd} $ 💰\n🍀 𝐴𝑝𝑛𝑎𝑑𝑒𝑟 𝑗𝑜𝑛𝑛𝑜 𝑠ℎ𝑢𝑏𝑒𝑐𝑐ℎ𝑎 𝑟𝑜𝑘ℎ𝑢𝑛!`,
                attachment: fs.createReadStream(imagePath)
            }, threadID);
            
            // Cleanup the generated image
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
    } catch (error) {
        console.error("𝐾𝑖𝑠𝑠 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑘𝑖𝑠𝑠 𝑖𝑚𝑎𝑔𝑒.", event.threadID, event.messageID);
    }
};
