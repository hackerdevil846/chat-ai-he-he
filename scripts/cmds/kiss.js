module.exports.config = {
    name: "kiss",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💖 Ishqer moment! Kiss someone by tagging them 💌",
    category: "Love",
    usages: "kiss [tag]",
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
    const dirMaterial = __dirname + `/cache/`;
    const pathFile = path.resolve(__dirname, 'cache', 'hon0.jpeg');

    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(pathFile)) {
        console.warn("💡 Please put 'hon0.jpeg' in the cache folder!");
    }
};

async function circle(imagePath) {
    const jimp = require("jimp");
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const fs = require("fs-extra");
    const path = require("path");
    const axios = require("axios");
    const jimp = require("jimp");
    const __root = path.resolve(__dirname, "cache");

    const hon_img = await jimp.read(__root + "/hon0.jpeg");
    const pathImg = __root + `/hon0_${one}_${two}.jpeg`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;

    // Download avatars
    const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
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

    // Cleanup
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

module.exports.onStart = async function({ api, event, args, Currencies }) {
    const fs = require("fs-extra");
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    const one = senderID;
    const two = mention[0];

    const hc = Math.floor(Math.random() * 101);
    const rd = Math.floor(Math.random() * 100000) + 100000;

    // Increase user's in-bot currency
    await Currencies.increaseMoney(senderID, parseInt(hc * rd));

    if (!two) {
        return api.sendMessage("💌 Daya kore 1 jon ke tag korun!", threadID, messageID);
    } else {
        const imagePath = await makeImage({ one, two });
        return api.sendMessage({
            body: `💖 Ishqer poriman: ${hc}%\n💸 Apnader jonno blessing: ${hc * rd} $ 💰\n🍀 Apnader jonno shubeccha rokhun!`,
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => fs.unlinkSync(imagePath), messageID);
    }
};
