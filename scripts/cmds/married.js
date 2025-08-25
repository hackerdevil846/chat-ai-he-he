const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "married",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💍 Biye korar image banay",
    category: "edit-img",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function () {
    const { resolve } = path;
    const { existsSync, mkdirSync } = fs;

    const dirMaterial = __dirname + `/cache/canvas/`;
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
};

// Circle crop function
async function circle(image) {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

// Image generate function
async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const bgPath = path.join(__root, "married.png");

    // Check if background exists
    if (!fs.existsSync(bgPath)) {
        throw new Error("Background image not found. Please ensure married.png exists in cache/canvas");
    }

    let pathImg = path.join(__root, `married_${one}_${two}.png`);
    let avatarOne = path.join(__root, `avt_${one}.png`);
    let avatarTwo = path.join(__root, `avt_${two}.png`);

    // Get Avatars
    let [avatar1, avatar2] = await Promise.all([
        axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
        axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
    ]);

    fs.writeFileSync(avatarOne, Buffer.from(avatar1.data));
    fs.writeFileSync(avatarTwo, Buffer.from(avatar2.data));

    // Process images
    const [bg, circleOne, circleTwo] = await Promise.all([
        jimp.read(bgPath),
        jimp.read(await circle(avatarOne)),
        jimp.read(await circle(avatarTwo))
    ]);

    // Composite on background
    bg.composite(circleOne.resize(170, 170), 1520, 210)
      .composite(circleTwo.resize(170, 170), 980, 300);

    await bg.writeAsync(pathImg);

    // Cleanup temp avatars
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

module.exports.onStart = async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    if (!mention[0]) {
        return api.sendMessage(
            "💍 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒕𝒐 𝒎𝒂𝒓𝒓𝒚!",
            threadID,
            messageID
        );
    }

    try {
        const one = senderID;
        const two = mention[0];
        const pathImg = await makeImage({ one, two });
        
        api.sendMessage(
            {
                body: `💖 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔 𝒇𝒐𝒓 𝒚𝒐𝒖𝒓 𝒎𝒂𝒓𝒓𝒊𝒂𝒈𝒆! 💑\n━━━━━━━━━━━━━━━━\n💐 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
                attachment: fs.createReadStream(pathImg),
            },
            threadID,
            () => fs.unlinkSync(pathImg),
            messageID
        );
    } catch (error) {
        console.error(error);
        api.sendMessage(
            `❌ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆: ${error.message}`,
            threadID,
            messageID
        );
    }
};
