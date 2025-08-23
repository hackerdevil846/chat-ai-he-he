const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "marriedv2",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💍 Married image create korun",
    category: "Image",
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
    const { resolve } = path;
    const { existsSync, mkdirSync } = fs;
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const filePath = resolve(__dirname, "cache/canvas", "marriedv02.png");

    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(filePath)) {
        await downloadFile("https://i.ibb.co/mc9KNm1/1619885987-21-pibig-info-p-anime-romantika-svadba-anime-krasivo-24.jpg", filePath);
    }
};

// Circular crop function
async function circle(image) {
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

// Make married image
async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");

    let married_img = await jimp.read(__root + "/marriedv02.png");
    let pathImg = __root + `/married_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    // Get Avatars
    let getAvatarOne = (await axios.get(
        `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, "utf-8"));

    let getAvatarTwo = (await axios.get(
        `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, "utf-8"));

    // Make circular & composite
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    married_img
        .composite(circleOne.resize(100, 100), 55, 48)
        .composite(circleTwo.resize(100, 100), 190, 40);

    let raw = await married_img.getBufferAsync("image/png");

    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

module.exports.run = async function ({ event, api }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    if (!mention[0]) {
        return api.sendMessage(
            "💍 | 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒂𝒏𝒐𝒕𝒉𝒆𝒓 𝒖𝒔𝒆𝒓 𝒕𝒐 𝒎𝒂𝒓𝒓𝒚!",
            threadID,
            messageID
        );
    } else {
        const one = senderID,
            two = mention[0];
        return makeImage({ one, two }).then(pathImg => {
            api.sendMessage(
                {
                    body: "💕 | 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔! 𝑴𝒂𝒓𝒓𝒊𝒂𝒈𝒆 𝒄𝒆𝒓𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒆 𝒄𝒓𝒆𝒂𝒕𝒆𝒅!\n━━━━━━━━━━━━━━\n𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
                    attachment: fs.createReadStream(pathImg)
                },
                threadID,
                () => fs.unlinkSync(pathImg),
                messageID
            );
        });
    }
};
