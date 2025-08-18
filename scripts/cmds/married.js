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
    commandCategory: "edit-img",
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
    const { downloadFile } = global.utils;

    const dirMaterial = __dirname + `/cache/canvas/`;
    const pathImg = resolve(__dirname, "cache/canvas", "married.png");

    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(pathImg)) {
        await downloadFile("https://i.imgur.com/txnRTKf.png", pathImg);
    }
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

    let bg = await jimp.read(__root + "/married.png");
    let pathImg = __root + `/married_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    // Get Avatars
    let getAvatarOne = (
        await axios.get(
            `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
            { responseType: "arraybuffer" }
        )
    ).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, "utf-8"));

    let getAvatarTwo = (
        await axios.get(
            `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
            { responseType: "arraybuffer" }
        )
    ).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, "utf-8"));

    // Circle Crop
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));

    // Composite on background
    bg.composite(circleOne.resize(170, 170), 1520, 210).composite(circleTwo.resize(170, 170), 980, 300);

    let raw = await bg.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);

    // Cleanup temp avatars
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    if (!mention[0]) {
        return api.sendMessage(
            "💍 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒕𝒐 𝒎𝒂𝒓𝒓𝒚!",
            threadID,
            messageID
        );
    } else {
        const one = senderID,
            two = mention[0];

        return makeImage({ one, two }).then((pathImg) => {
            api.sendMessage(
                {
                    body: `💖 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔 𝒇𝒐𝒓 𝒚𝒐𝒖𝒓 𝒎𝒂𝒓𝒓𝒊𝒂𝒈𝒆! 💑\n━━━━━━━━━━━━━━━━\n💐 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
                    attachment: fs.createReadStream(pathImg),
                },
                threadID,
                () => fs.unlinkSync(pathImg),
                messageID
            );
        });
    }
};
