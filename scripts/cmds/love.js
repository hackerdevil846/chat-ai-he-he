const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports.config = {
    name: "love",
    aliases: ["prem", "romance"],
    version: "2.6.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑙𝑜𝑣𝑒",
    shortDescription: {
        en: "𝑃𝑟𝑒𝑚 𝑒𝑟 𝑖𝑚𝑎𝑔𝑒 𝑏𝑎𝑛𝑎𝑜"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
        en: "{p}love [𝑡𝑎𝑔]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const dirMaterial = path.resolve(__dirname, 'cache', 'canvas');
    const templatePath = path.resolve(dirMaterial, 'love2.jpg');

    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
    }

    if (!fs.existsSync(templatePath)) {
        console.warn("⚠️ 𝑊𝑎𝑟𝑛𝑖𝑛𝑔: 𝑐𝑎𝑐ℎ𝑒/𝑐𝑎𝑛𝑣𝑎𝑠/𝑙𝑜𝑣𝑒2.𝑗𝑝𝑔 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑙𝑜𝑣𝑒2.𝑗𝑝𝑔 𝑡𝑜 𝑐𝑎𝑐ℎ𝑒/𝑐𝑎𝑛𝑣𝑎𝑠/");
    }
};

async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const templatePath = path.join(__root, "love2.jpg");

    if (!fs.existsSync(templatePath)) {
        throw new Error("𝑇𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑙𝑜𝑣𝑒2.𝑗𝑝𝑔 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑐𝑎𝑐ℎ𝑒/𝑐𝑎𝑛𝑣𝑎𝑠/");
    }

    const outputPath = path.join(__root, `love2_${one}_${two}.png`);
    const avatarOnePath = path.join(__root, `avt_${one}.png`);
    const avatarTwoPath = path.join(__root, `avt_${two}.png`);

    let template = await jimp.read(templatePath);

    const fbTokenPart = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
    const urlOne = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbTokenPart}`;
    const urlTwo = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbTokenPart}`;

    let avatarOneBuffer = (await axios.get(urlOne, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneBuffer, 'binary'));

    let avatarTwoBuffer = (await axios.get(urlTwo, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoBuffer, 'binary'));

    const circleOneBuf = await circle(avatarOnePath);
    const circleTwoBuf = await circle(avatarTwoPath);

    const circleOne = await jimp.read(circleOneBuf);
    const circleTwo = await jimp.read(circleTwoBuf);

    template
        .composite(circleOne.resize(270, 270), 800, 100)
        .composite(circleTwo.resize(300, 300), 205, 300);

    const raw = await template.getBufferAsync("image/png");
    fs.writeFileSync(outputPath, raw);

    try { fs.unlinkSync(avatarOnePath); } catch (e) {}
    try { fs.unlinkSync(avatarTwoPath); } catch (e) {}

    return outputPath;
}

async function circle(imagePath) {
    let image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.onStart = async function ({ event, api, message }) {
    const { threadID, messageID, senderID } = event;

    if (!event.mentions || Object.keys(event.mentions).length === 0) {
        return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒. 😊", threadID, messageID);
    }

    const mentionedIDs = Object.keys(event.mentions);
    const targetID = mentionedIDs[0];
    const displayNameRaw = event.mentions[targetID] || "";
    const displayName = typeof displayNameRaw === "string" ? displayNameRaw.replace(/@/g, "") : displayNameRaw;

    const one = senderID;
    const two = targetID;

    const templatePath = path.resolve(__dirname, "cache", "canvas", "love2.jpg");
    if (!fs.existsSync(templatePath)) {
        return message.reply("⚠️ 𝑇𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑙𝑜𝑣𝑒2.𝑗𝑝𝑔 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑝𝑙𝑜𝑎𝑑 𝑖𝑡 𝑡𝑜 𝑐𝑎𝑐ℎ𝑒/𝑐𝑎𝑛𝑣𝑎𝑠/", threadID, messageID);
    }

    try {
        const imagePath = await makeImage({ one, two });
        return message.reply({
            body: `💖 ${displayName} 𝑡𝑢𝑚𝑖 𝑘𝑒 𝑣𝑎𝑙𝑜𝑏𝑎𝑠𝑒 𝑒𝑘𝑡𝑢 𝑏𝑒𝑠ℎ𝑖 💕\n━━━━━━━━━━━━━━━━`,
            mentions: [{ tag: displayName, id: targetID }],
            attachment: fs.createReadStream(imagePath)
        }, threadID, (err, info) => {
            try { fs.unlinkSync(imagePath); } catch (e) {}
            if (err) console.error(err);
        }, messageID);
    } catch (err) {
        console.error(err);
        return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.", threadID, messageID);
    }
};
