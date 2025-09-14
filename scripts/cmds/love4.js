const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports.config = {
    name: "love4",
    aliases: ["loveimage", "romantic"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠 💖"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠' 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
        en: "{p}love4 [@𝑡𝑎𝑔]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function () {
    try {
        const cacheDir = path.join(__dirname, "cache");
        const baseImagePath = path.join(cacheDir, "love_template.png");

        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        if (!fs.existsSync(baseImagePath)) {
            const response = await axios({
                method: "get",
                url: "https://drive.google.com/uc?export=download&id=1ZGGhBH6ed8v4dku83G4NbxuPtNmN2iW9",
                responseType: "arraybuffer",
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });
            fs.writeFileSync(baseImagePath, response.data);
        }
    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑢𝑟𝑖𝑛𝑔 𝑜𝑛𝐿𝑜𝑎𝑑:", error);
    }
};

module.exports.onStart = async function ({ message, event, api }) {
    const { threadID, messageID, senderID, mentions } = event;

    if (Object.keys(mentions).length === 0) {
        return message.reply("📍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒!", threadID, messageID);
    }

    const [mentionId] = Object.keys(mentions);
    const mentionName = mentions[mentionId].replace(/@/g, "");

    try {
        await message.reply("💖 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒...", threadID, messageID);

        const imagePath = await generateLoveImage(senderID, mentionId);

        const messageObj = {
            body: `💌 ${mentionName}, 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ! 🥰`,
            mentions: [{
                tag: mentionName,
                id: mentionId
            }],
            attachment: fs.createReadStream(imagePath)
        };

        await message.reply(messageObj, threadID, async () => {
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (e) {
                console.error("⚠️ 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e);
            }
        }, messageID);

    } catch (error) {
        console.error("❌ 𝐿𝑜𝑣𝑒4 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
    }
};

async function generateLoveImage(user1ID, user2ID) {
    const cacheDir = path.join(__dirname, "cache");
    const baseImagePath = path.join(cacheDir, "love_template.png");

    const baseImage = await Jimp.read(baseImagePath);
    const avatar1 = await processAvatar(user1ID);
    const avatar2 = await processAvatar(user2ID);

    const outputPath = path.join(cacheDir, `love4_${user1ID}_${user2ID}_${Date.now()}.png`);

    avatar1.resize(200, 200);
    avatar2.resize(200, 200);

    baseImage
        .resize(1024, 800)
        .composite(avatar1, 300, 250)
        .composite(avatar2, 650, 250);

    await baseImage.writeAsync(outputPath);
    return outputPath;
}

async function processAvatar(userId) {
    const avatarOptions = [
        `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
        `https://graph.facebook.com/${userId}/picture?type=large`,
        `https://graph.facebook.com/${userId}/picture`,
        `https://graph.facebook.com/v12.0/${userId}/picture`
    ];

    let avatarBuffer;
    for (const url of avatarOptions) {
        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer",
                headers: { "User-Agent": "Mozilla/5.0" },
                timeout: 10000
            });
            if (response.data) {
                avatarBuffer = Buffer.from(response.data);
                break;
            }
        } catch {
            continue;
        }
    }

    if (!avatarBuffer) {
        throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 ${userId}`);
    }

    const avatar = await Jimp.read(avatarBuffer);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

    return avatar
        .crop(0, 0, size, size)
        .circle();
}
