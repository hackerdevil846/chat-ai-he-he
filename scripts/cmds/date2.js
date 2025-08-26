module.exports.config = {
    name: "date2",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💝 Create couple ship images with your partner",
    category: "𝗜𝗠𝗔𝗚𝗘",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const path = require("path");
    const fs = require("fs-extra");
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const imagePath = path.resolve(__dirname, 'cache/canvas', 'joshua.png');
    
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(imagePath)) await downloadFile("https://i.imgur.com/ha8gxu5.jpg", imagePath);
};

module.exports.onStart = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    
    if (!args[0]) return api.sendMessage("💢 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐚 𝐮𝐬𝐞𝐫 𝐭𝐨 𝐬𝐡𝐢𝐩 𝐰𝐢𝐭𝐡!", threadID, messageID);
    
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐦𝐞𝐧𝐭𝐢𝐨𝐧!", threadID, messageID);
    
    const tag = event.mentions[mention].replace("@", "");
    const one = senderID, two = mention;

    try {
        const path = await makeImage({ one, two });
        return api.sendMessage({
            body: `💕 𝐒𝐡𝐢𝐩𝐩𝐞𝐝 𝐰𝐢𝐭𝐡 ${tag}!\n𝐋𝐨𝐯𝐞 𝐢𝐬 𝐢𝐧 𝐭𝐡𝐞 𝐚𝐢𝐫! 💞`,
            mentions: [{
                tag: tag,
                id: mention
            }],
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝐄𝐫𝐫𝐨𝐫 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞!", threadID, messageID);
    }
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    const batgiam_img = await jimp.read(__root + "/joshua.png");
    const pathImg = __root + `/ship_${one}_${two}.png`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;

    const getAvatar = async (id, path) => {
        const data = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(data, 'utf-8'));
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
    
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);
    
    return pathImg;
}

async function circle(image) {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}
