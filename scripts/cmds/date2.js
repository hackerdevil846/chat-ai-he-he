const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "date2",
    aliases: ["couple", "ship"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 𝑠ℎ𝑖𝑝 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑝𝑎𝑟𝑡𝑛𝑒𝑟"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑐𝑜𝑢𝑝𝑙𝑒 𝑠ℎ𝑖𝑝 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑝𝑎𝑟𝑡𝑛𝑒𝑟"
    },
    guide: {
        en: "{p}date2 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const dirMaterial = __dirname + `/cache/canvas/`;
    const imagePath = path.resolve(__dirname, 'cache/canvas', 'joshua.png');
    
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(imagePath)) {
        try {
            const imageData = await axios.get("https://i.imgur.com/ha8gxu5.jpg", { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, Buffer.from(imageData.data));
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒:", error);
        }
    }
};

module.exports.onStart = async function ({ event, message, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (!args[0]) {
        return message.reply("💢 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑎 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑠ℎ𝑖𝑝 𝑤𝑖𝑡ℎ!", threadID, messageID);
    }
    
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑚𝑒𝑛𝑡𝑖𝑜𝑛!", threadID, messageID);
    }
    
    const tag = event.mentions[mention].replace("@", "");
    const one = senderID, two = mention;

    try {
        const path = await makeImage({ one, two });
        return message.reply({
            body: `💕 𝑆ℎ𝑖𝑝𝑝𝑒𝑑 𝑤𝑖𝑡ℎ ${tag}!\n𝐿𝑜𝑣𝑒 𝑖𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑎𝑖𝑟! 💞`,
            mentions: [{
                tag: tag,
                id: mention
            }],
            attachment: fs.createReadStream(path)
        }, () => fs.unlinkSync(path));
    } catch (error) {
        console.error("𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒!", threadID, messageID);
    }
};

async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const batgiam_img = await jimp.read(__root + "/joshua.png");
    const pathImg = __root + `/ship_${one}_${two}.png`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;

    const getAvatar = async (id, path) => {
        try {
            const data = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                responseType: 'arraybuffer' 
            });
            fs.writeFileSync(path, Buffer.from(data.data, 'utf-8'));
        } catch (error) {
            console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 ${id}:`, error);
            throw error;
        }
    };

    await Promise.all([
        getAvatar(one, avatarOne),
        getAvatar(two, avatarTwo)
    ]);

    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));
    
    batgiam_img.composite(circleOne.resize(110, 110), 150, 76)
               .composite(circleTwo.resize(100, 100), 238, 305);

    const raw = await batgiam_img.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);
    
    // Clean up temporary files
    if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
    if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
    
    return pathImg;
}

async function circle(image) {
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}
