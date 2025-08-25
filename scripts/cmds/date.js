const fs = require("fs");
const axios = require("axios");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "date",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ 𝑨𝒑𝒏𝒂𝒓 𝒑𝒂𝒓𝒕𝒏𝒆𝒓 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏",
    category: "🥰 𝑩𝒂𝒍𝒐𝒃𝒂𝒔𝒂",
    usages: "[@𝒎𝒆𝒏𝒕𝒊𝒐𝒏]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { resolve } = path;
    const { existsSync, mkdirSync } = fs;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const pathToImg = resolve(__dirname, 'cache/canvas', 'josh.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(pathToImg)) {
        const downloadFile = global.utils.downloadFile;
        await downloadFile("https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", pathToImg);
    }
};

async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const pathImg = __root + `/batman${one}_${two}.png`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;

    const [getAvatarOne, getAvatarTwo] = await Promise.all([
        axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
        axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })
    ]);

    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'utf-8'));
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'utf-8'));

    const batgiam_img = await jimp.read(__root + "/josh.png");
    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));

    batgiam_img.composite(circleOne.resize(85, 85), 355, 100)
               .composite(circleTwo.resize(75, 75), 250, 140);

    const raw = await batgiam_img.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);
    
    [avatarOne, avatarTwo].forEach(path => fs.existsSync(path) && fs.unlinkSync(path));
    return pathImg;
}

async function circle(imagePath) {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.onStart = async function ({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions)[0];
    
    if (!mention) return api.sendMessage("❌ 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒋𝒐𝒏 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏!", threadID, messageID);
    
    const one = senderID;
    const two = mention;
    const tag = event.mentions[mention].replace("@", "");
    
    return makeImage({ one, two }).then(path => {
        api.sendMessage({
            body: `💖 𝑺𝒉𝒊𝒑 𝒌𝒐𝒓𝒆 𝒂𝒓 𝒃𝒊𝒚𝒆 𝒌𝒐𝒓𝒐 >\\<\n\n✨ 𝑴𝒆𝒏𝒕𝒊𝒐𝒏𝒆𝒅: @${tag}`,
            mentions: [{
                tag: tag,
                id: mention
            }],
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.existsSync(path) && fs.unlinkSync(path), messageID);
    });
};
