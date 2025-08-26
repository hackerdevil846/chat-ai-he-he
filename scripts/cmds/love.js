const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports.config = {
    name: "love",
    version: "2.6.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑷𝒓𝒆𝒎 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒃𝒂𝒏𝒂𝒐",
    category: "𝑳𝒐𝒗𝒆",
    usages: "[𝒕𝒂𝒈]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    // ensure cache folder exists and love2.jpg is present
    const dirMaterial = path.resolve(__dirname, 'cache', 'canvas');
    const templatePath = path.resolve(dirMaterial, 'love2.jpg');

    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });

    if (!fs.existsSync(templatePath)) {
        // file missing — warn but do not attempt to download (user said love2.jpg is valid locally)
        console.warn("⚠️ Warning: cache/canvas/love2.jpg not found. Please add love2.jpg to cache/canvas/");
    }
};

/**
 * makeImage
 * @param {Object} param0
 * @param {string} param0.one - senderID
 * @param {string} param0.two - targetID (mentioned user)
 * @returns {string} - path to generated image
 */
async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const templatePath = path.join(__root, "love2.jpg");

    if (!fs.existsSync(templatePath)) throw new Error("Template love2.jpg not found in cache/canvas/");

    const outputPath = path.join(__root, `love2_${one}_${two}.png`);
    const avatarOnePath = path.join(__root, `avt_${one}.png`);
    const avatarTwoPath = path.join(__root, `avt_${two}.png`);

    // read template
    let template = await jimp.read(templatePath);

    // fetch avatars from Facebook graph
    const fbTokenPart = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"; // as original
    const urlOne = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbTokenPart}`;
    const urlTwo = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbTokenPart}`;

    // get avatar one
    let avatarOneBuffer = (await axios.get(urlOne, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneBuffer, 'binary'));

    // get avatar two
    let avatarTwoBuffer = (await axios.get(urlTwo, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoBuffer, 'binary'));

    // circle avatars
    const circleOneBuf = await circle(avatarOnePath);
    const circleTwoBuf = await circle(avatarTwoPath);

    const circleOne = await jimp.read(circleOneBuf);
    const circleTwo = await jimp.read(circleTwoBuf);

    // composite onto template (positions & sizes kept as original)
    template
        .composite(circleOne.resize(270, 270), 800, 100)
        .composite(circleTwo.resize(300, 300), 205, 300);

    const raw = await template.getBufferAsync("image/png");
    fs.writeFileSync(outputPath, raw);

    // cleanup temp avatars
    try { fs.unlinkSync(avatarOnePath); } catch (e) {}
    try { fs.unlinkSync(avatarTwoPath); } catch (e) {}

    return outputPath;
}

// helper to circle-crop image using jimp
async function circle(imagePath) {
    let image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.onStart = async function ({ event, api }) {
    const { threadID, messageID, senderID } = event;

    // check mentions exist
    if (!event.mentions || Object.keys(event.mentions).length === 0) {
        return api.sendMessage("⚠️ দয়া করে একজনকে tag করুন। 😊", threadID, messageID);
    }

    // get first mentioned user ID and display name
    const mentionedIDs = Object.keys(event.mentions);
    const targetID = mentionedIDs[0];
    const displayNameRaw = event.mentions[targetID] || ""; // often of form "@Name"
    const displayName = typeof displayNameRaw === "string" ? displayNameRaw.replace(/@/g, "") : displayNameRaw;

    const one = senderID;
    const two = targetID;

    // ensure template exists before proceeding
    const templatePath = path.resolve(__dirname, "cache", "canvas", "love2.jpg");
    if (!fs.existsSync(templatePath)) {
        return api.sendMessage("⚠️ Template love2.jpg পাওয়া যায়নি। অনুগ্রহ করে `cache/canvas/love2.jpg` আপলোড করুন।", threadID, messageID);
    }

    try {
        const imagePath = await makeImage({ one, two });
        return api.sendMessage({
            body: `💖 ${displayName} তুমি কে ভালোবাসে একটু বেশি 💕\n━━━━━━━━━━━━━━━━`,
            mentions: [{ tag: displayName, id: targetID }],
            attachment: fs.createReadStream(imagePath)
        }, threadID, (err, info) => {
            // cleanup generated image
            try { fs.unlinkSync(imagePath); } catch (e) {}
            if (err) console.error(err);
        }, messageID);
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ কিছু সমস্যা হয়েছে image তৈরির সময়। আবার চেষ্টা করো।", threadID, messageID);
    }
};
