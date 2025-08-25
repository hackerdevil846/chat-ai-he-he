const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "marriedv3",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑺𝒂𝒅𝒉𝒖𝒃𝒂𝒔𝒉𝒂 𝒊𝒎𝒂𝒈𝒆 𝒄𝒓𝒆𝒂𝒕𝒆 𝒌𝒐𝒓𝒖𝒏",
    category: "image",
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
    const dirMaterial = path.join(__dirname, "cache", "canvas");
    const filePath = path.join(dirMaterial, "marriedv3.png");

    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
        const { data } = await axios.get(
            "https://i.ibb.co/5TwSHpP/Guardian-Place-full-1484178.jpg",
            { responseType: "arraybuffer" }
        );
        fs.writeFileSync(filePath, Buffer.from(data, "utf-8"));
    }
};

async function makeImage({ one, two }) {
    const __root = path.join(__dirname, "cache", "canvas");

    let background = await jimp.read(path.join(__root, "marriedv3.png"));
    let outputPath = path.join(__root, `marriedv3_${one}_${two}.png`);
    let avatarOne = path.join(__root, `avt_${one}.png`);
    let avatarTwo = path.join(__root, `avt_${two}.png`);

    // Download Avatars
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

    // Process Circle Avatars
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));

    background
        .composite(circleOne.resize(90, 90), 250, 1)
        .composite(circleTwo.resize(90, 90), 350, 70);

    let raw = await background.getBufferAsync("image/png");
    fs.writeFileSync(outputPath, raw);

    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return outputPath;
}

async function circle(image) {
    let img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

module.exports.onStart = async function ({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    if (!mention[0]) {
        return api.sendMessage("⚠️ Ekjon ke tag korun 😊", threadID, messageID);
    } else {
        const one = senderID;
        const two = mention[0];

        return makeImage({ one, two }).then((pathImg) =>
            api.sendMessage(
                {
                    body: "💍 Sadhubasha er image ta ready hoye gese! 💖",
                    attachment: fs.createReadStream(pathImg),
                },
                threadID,
                () => fs.unlinkSync(pathImg),
                messageID
            )
        );
    }
};
