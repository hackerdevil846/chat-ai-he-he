const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports.config = {
    name: "love5",
    aliases: ["romantic", "couple"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "💖 𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝐹𝐵 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑢𝑠𝑖𝑛𝑔 𝑡𝑤𝑜 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    guide: {
        en: "{p}love5 [@𝑡𝑎𝑔]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function () {
    try {
        const cacheDir = path.join(__dirname, "cache");
        const baseImagePath = path.join(cacheDir, "love_template.png");

        // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 (𝑖𝑓 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡𝑠)
        if (!fs.existsSync(baseImagePath)) {
            const response = await axios({
                method: "get",
                url: "https://drive.google.com/uc?export=download&id=1BCgJhPm4EITz0vqjYtYJkhfP7UCTSmXv",
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

module.exports.onStart = async function ({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;

    // 𝐶ℎ𝑒𝑐𝑘 𝑚𝑒𝑛𝑡𝑖𝑜𝑛
    if (Object.keys(mentions).length === 0) {
        return api.sendMessage("📍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒!", threadID, messageID);
    }

    const [mentionId] = Object.keys(mentions);
    const mentionName = mentions[mentionId].replace(/@/g, "");

    try {
        api.sendMessage("💖 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒...", threadID, messageID);

        // 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒
        const imagePath = await generateLoveImage(senderID, mentionId);

        // 𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑝𝑟𝑒𝑝𝑎𝑟𝑒
        const message = {
            body: `💌 ${mentionName}, 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ! 🥰`,
            mentions: [
                {
                    tag: mentionName,
                    id: mentionId
                }
            ],
            attachment: fs.createReadStream(imagePath)
        };

        // 𝑆𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 & 𝑐𝑙𝑒𝑎𝑛 𝑢𝑝
        api.sendMessage(message, threadID, () => {
            try {
                fs.unlinkSync(imagePath);
            } catch (e) {
                console.error("⚠️ 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e);
            }
        }, messageID);
    } catch (error) {
        console.error("❌ 𝐿𝑜𝑣𝑒5 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
    }
};

// ========================= 𝐻𝑒𝑙𝑝𝑒𝑟 𝐹𝑢𝑛𝑐𝑡𝑖𝑜𝑛𝑠 ========================= //

async function generateLoveImage(user1ID, user2ID) {
    const cacheDir = path.join(__dirname, "cache");
    const baseImagePath = path.join(cacheDir, "love_template.png");

    // 𝐵𝑎𝑠𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑙𝑜𝑎𝑑
    const baseImage = await jimp.read(baseImagePath);

    // 𝐴𝑣𝑎𝑡𝑎𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠
    const avatar1 = await processAvatar(user1ID);
    const avatar2 = await processAvatar(user2ID);

    // 𝑂𝑢𝑡𝑝𝑢𝑡 𝑝𝑎𝑡ℎ
    const outputPath = path.join(cacheDir, `love5_${user1ID}_${user2ID}_${Date.now()}.png`);

    // 𝑅𝑒𝑠𝑖𝑧𝑒 & 𝑐𝑜𝑚𝑝𝑜𝑠𝑖𝑡𝑒
    avatar1.resize(200, 200);
    avatar2.resize(200, 200);

    baseImage
        .resize(1024, 800)
        .composite(avatar1, 300, 250) // 1𝑠𝑡 𝑎𝑣𝑎𝑡𝑎𝑟
        .composite(avatar2, 650, 250); // 2𝑛𝑑 𝑎𝑣𝑎𝑡𝑎𝑟

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
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });
            if (response.data) {
                avatarBuffer = Buffer.from(response.data);
                break;
            }
        } catch (e) {
            continue;
        }
    }

    if (!avatarBuffer) {
        throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 ${userId}`);
    }

    // 𝐶𝑖𝑟𝑐𝑙𝑒 𝑐𝑟𝑜𝑝
    const avatar = await jimp.read(avatarBuffer);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);
    return avatar.crop(0, 0, size, size).circle();
}
