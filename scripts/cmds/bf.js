const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

// Function to convert text to Math Bold Italic
function toMathBoldItalic(text) {
    const map = {
        A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴',
        N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',
        a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎',
        n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.config = {
    name: "bf",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: toMathBoldItalic("Get couple from mention"),
    category: toMathBoldItalic("image"),
    usages: toMathBoldItalic("[mention]"),
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const dirMaterial = path.resolve(__dirname, "cache/canvas");
    const arrPath = path.resolve(dirMaterial, "arr2.png");
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(arrPath)) {
        await global.utils.downloadFile(
            "https://i.imgur.com/iaOiAXe.jpeg",
            arrPath
        );
    }
};

// Create circular avatar
async function circle(imagePath) {
    let image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

// Generate couple image
async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache/canvas");
    let baseImage = await jimp.read(path.join(__root, "arr2.png"));

    const avatarOnePath = path.join(__root, `avt_${one}.png`);
    const avatarTwoPath = path.join(__root, `avt_${two}.png`);
    const finalPath = path.join(__root, `batman${one}_${two}.png`);

    // Download avatars
    const avatarOneBuffer = (await axios.get(
        `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneBuffer, "utf-8"));

    const avatarTwoBuffer = (await axios.get(
        `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoBuffer, "utf-8"));

    // Apply circle effect
    let circleOne = await jimp.read(await circle(avatarOnePath));
    let circleTwo = await jimp.read(await circle(avatarTwoPath));

    // Composite images
    baseImage.composite(circleOne.resize(200, 200), 70, 110)
             .composite(circleTwo.resize(200, 200), 465, 110);

    const buffer = await baseImage.getBufferAsync("image/png");
    fs.writeFileSync(finalPath, buffer);

    // Cleanup avatars
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return finalPath;
}

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    if (!mention[0]) {
        return api.sendMessage(
            toMathBoldItalic("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝟏 𝐩𝐞𝐫𝐬𝐨𝐧"),
            threadID,
            messageID
        );
    }

    const one = senderID;
    const two = mention[0];

    const imagePath = await makeImage({ one, two });

    const bodyMsg = toMathBoldItalic(
        "💞 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐂𝐨𝐮𝐩𝐥𝐞 💞\n\n" +
        "✨ 𝐈 𝐆𝐨𝐭 𝐘𝐨𝐮 ❤\n" +
        "👑 𝐘𝐨𝐮𝐫 𝐁𝐨𝐲𝐟𝐫𝐢𝐞𝐧𝐝 🩷\n\n" +
        "💖 𝐓𝐨𝐠𝐞𝐭𝐡𝐞𝐫 𝐅𝐨𝐫𝐞𝐯𝐞𝐫 💖"
    );

    api.sendMessage(
        { body: bodyMsg, attachment: fs.createReadStream(imagePath) },
        threadID,
        () => fs.unlinkSync(imagePath),
        messageID
    );
};
