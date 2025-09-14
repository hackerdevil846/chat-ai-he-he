const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "marriedv3",
    aliases: ["marriage", "sadhu"],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
        en: "𝑆𝑎𝑑ℎ𝑢𝑏𝑎𝑠ℎ𝑎 𝑖𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑒"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑎𝑛𝑛𝑜𝑢𝑛𝑐𝑒𝑚𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    guide: {
        en: "{p}marriedv3 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    try {
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
    } catch (error) {
        console.error("𝑀𝑎𝑟𝑟𝑖𝑒𝑑𝑣3 𝑜𝑛𝐿𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
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

module.exports.onStart = async function ({ message, event, args }) {
    try {
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);

        if (!mention[0]) {
            return message.reply("⚠️ 𝐸𝑘𝑗𝑜𝑛 𝑘𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑢𝑛 😊", threadID, messageID);
        } else {
            const one = senderID;
            const two = mention[0];

            const pathImg = await makeImage({ one, two });
            
            await message.reply({
                body: "💍 𝑆𝑎𝑑ℎ𝑢𝑏𝑎𝑠ℎ𝑎 𝑒𝑟 𝑖𝑚𝑎𝑔𝑒 𝑡𝑎 𝑟𝑒𝑎𝑑𝑦 ℎ𝑜𝑦𝑒 𝑔𝑒𝑠𝑒! 💖",
                attachment: fs.createReadStream(pathImg)
            }, threadID);
            
            fs.unlinkSync(pathImg);
        }
    } catch (error) {
        console.error("𝑀𝑎𝑟𝑟𝑖𝑒𝑑𝑣3 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒.", event.threadID, event.messageID);
    }
};
