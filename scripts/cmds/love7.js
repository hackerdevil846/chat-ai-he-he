const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports.config = {
    name: "love7",
    aliases: ["romantic", "lovers"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠' 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
        en: "{p}love7 [@𝑡𝑎𝑔]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "jimp": ""
    }
};

module.exports.languages = {
    "en": {
        "MISSING_TAG": "📍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒!",
        "CREATING": "💖 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒...",
        "ERROR": "❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
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
                method: 'get',
                url: 'https://drive.google.com/uc?export=download&id=1m6ymMdBr4U-PccDqEQknH9QUuPsGLk8x',
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            fs.writeFileSync(baseImagePath, response.data);
            console.log("[𝑙𝑜𝑣𝑒7] 𝐵𝑎𝑠𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑡𝑜 𝑐𝑎𝑐ℎ𝑒.");
        }
    } catch (error) {
        console.error("[𝑙𝑜𝑣𝑒7] 𝐸𝑟𝑟𝑜𝑟 𝑑𝑢𝑟𝑖𝑛𝑔 𝑜𝑛𝐿𝑜𝑎𝑑:", error);
    }
};

module.exports.onStart = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const mentions = event.mentions || {};

    try {
        if (Object.keys(mentions).length === 0) {
            return api.sendMessage(this.languages.en.MISSING_TAG, threadID, messageID);
        }

        let mentionId = null;
        for (const id of Object.keys(mentions)) {
            if (id !== senderID) {
                mentionId = id;
                break;
            }
        }
        if (!mentionId) mentionId = Object.keys(mentions)[0];

        const mentionNameRaw = mentions[mentionId] || "";
        const mentionName = mentionNameRaw.replace(/@/g, '');

        api.sendMessage(this.languages.en.CREATING, threadID, messageID);

        const imagePath = await this.generateLoveImage(senderID, mentionId);

        const msg = {
            body: `💌 @${mentionName} — 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ! 🥰`,
            mentions: [{
                tag: mentionName,
                id: mentionId
            }],
            attachment: fs.createReadStream(imagePath)
        };

        api.sendMessage(msg, threadID, async (err, info) => {
            try {
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            } catch (e) {
                console.error("[𝑙𝑜𝑣𝑒7] 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e);
            }
        }, messageID);

    } catch (error) {
        console.error("[𝑙𝑜𝑣𝑒7] 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage(this.languages.en.ERROR, threadID, messageID);
    }
};

module.exports.generateLoveImage = async function (user1ID, user2ID) {
    const cacheDir = path.join(__dirname, 'cache');
    const baseImagePath = path.join(cacheDir, 'love_template.png');

    if (!fs.existsSync(baseImagePath)) {
        throw new Error("𝐵𝑎𝑠𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔.");
    }

    const baseImage = await Jimp.read(baseImagePath);
    const avatar1 = await this.processAvatar(user1ID);
    const avatar2 = await this.processAvatar(user2ID);

    avatar1.resize(200, 200);
    avatar2.resize(200, 200);

    baseImage
        .composite(avatar1, 300, 300)
        .composite(avatar2, 600, 300);

    const outputPath = path.join(cacheDir, `love7_${user1ID}_${user2ID}_${Date.now()}.png`);
    await baseImage.writeAsync(outputPath);

    return outputPath;
};

module.exports.processAvatar = async function (userId) {
    const avatarOptions = [
        `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
        `https://graph.facebook.com/${userId}/picture?type=large`,
        `https://graph.facebook.com/${userId}/picture`,
        `https://graph.facebook.com/v12.0/${userId}/picture`
    ];

    let avatarBuffer = null;

    for (const url of avatarOptions) {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
            });

            if (response && response.data) {
                avatarBuffer = Buffer.from(response.data);
                break;
            }
        } catch (error) {
            continue;
        }
    }

    if (!avatarBuffer) {
        throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 ${userId}`);
    }

    const avatar = await Jimp.read(avatarBuffer);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);
    const cropped = avatar.crop(0, 0, size, size);

    const borderSize = 5;
    const bordered = new Jimp(size + borderSize * 2, size + borderSize * 2, 0xFFFFFFFF);
    bordered.composite(cropped, borderSize, borderSize);

    return bordered
        .crop(0, 0, size + borderSize * 2, size + borderSize * 2)
        .circle();
};
