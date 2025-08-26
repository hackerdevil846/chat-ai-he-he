module.exports.config = {
    name: "batslap",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🦇 Batslap meme creator",
    category: "general",
    usages: "[tag]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    },
    envConfig: {}
};

module.exports.onLoad = async function () {
    const path = require("path");
    const fs = require("fs-extra");
    const dirMaterial = __dirname + `/cache/canvas/`;
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
};

async function circle(imagePath) {
    const jimp = require("jimp");
    let image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const fs = require("fs-extra");
    const path = require("path");
    const axios = require("axios");
    const jimp = require("jimp");
    const __root = path.resolve(__dirname, "cache", "canvas");

    const templatePath = __root + "/batmanslap.jpg";
    let tromcho_img = await jimp.read(templatePath);
    let pathImg = __root + `/tromcho_${one}_${two}.png`;

    let avatarOnePath = __root + `/avt_${one}.png`;
    let avatarTwoPath = __root + `/avt_${two}.png`;

    // Download avatars
    let avatarOneBuffer = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneBuffer, 'utf-8'));

    let avatarTwoBuffer = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoBuffer, 'utf-8'));

    // Make circular avatars
    let circleOne = await jimp.read(await circle(avatarOnePath));
    let circleTwo = await jimp.read(await circle(avatarTwoPath));

    // Composite avatars onto template
    tromcho_img
        .composite(circleOne.resize(160, 180), 370, 70)
        .composite(circleTwo.resize(230, 250), 140, 150);

    // Save final image
    let raw = await tromcho_img.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);

    // Clean up avatars
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return pathImg;
}

module.exports.onStart = async function ({ api, event, args }) {
    const fs = require("fs-extra");
    const { threadID, messageID, senderID, mentions } = event;

    if (!mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage("❌ দয়া করে ১ জনকে ট্যাগ করো!", threadID, messageID);
    }

    const mentionID = Object.keys(mentions)[0];
    const tagName = mentions[mentionID].replace("@", "");
    const one = senderID;
    const two = mentionID;

    return makeImage({ one, two }).then(path => {
        api.sendMessage({
            body: `🦇 চুপ রে, বাল! @${tagName}`,
            mentions: [{
                tag: tagName,
                id: mentionID
            }],
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);
    });
};
