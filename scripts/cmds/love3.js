const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports.config = {
    name: "love3",
    aliases: ["romantic", "couple"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠 💖"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠' 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠 💖"
    },
    guide: {
        en: "{p}love3 @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
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
        const baseImagePath = path.join(cacheDir, "lpwft.png");

        // 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟 𝑐𝑟𝑒𝑎𝑡𝑒
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑓 𝑚𝑖𝑠𝑠𝑖𝑛𝑔
        if (!fs.existsSync(baseImagePath)) {
            const response = await axios({
                method: "get",
                url: "https://drive.google.com/uc?export=download&id=1DYZWSDbcl8fD601uZxLglSuyPsxJzAZf",
                responseType: "arraybuffer",
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });
            fs.writeFileSync(baseImagePath, response.data);
            console.log("✅ 𝐵𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
        }
    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑢𝑟𝑖𝑛𝑔 𝑜𝑛𝐿𝑜𝑎𝑑:", error);
    }
};

module.exports.onStart = async function ({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;

    // 𝑖𝑓 𝑛𝑜 𝑚𝑒𝑛𝑡𝑖𝑜𝑛
    if (Object.keys(mentions).length === 0) {
        return api.sendMessage("📍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒!", threadID, messageID);
    }

    const [mentionId] = Object.keys(mentions);
    const mentionName = mentions[mentionId].replace(/@/g, "");

    try {
        api.sendMessage("💖 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒...", threadID, messageID);

        const imagePath = await makeImage(senderID, mentionId);

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

        api.sendMessage(message, threadID, () => {
            try {
                fs.unlinkSync(imagePath);
                console.log("🧹 𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑖𝑚𝑎𝑔𝑒 𝑐𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝");
            } catch (e) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e);
            }
        }, messageID);

    } catch (error) {
        console.error("❌ 𝐿𝑜𝑣𝑒3 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return api.sendMessage("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
    }
};

// ================= 𝐼𝑀𝐴𝐺𝐸 𝑀𝐴𝐾𝐸𝑅 ================= //
async function makeImage(user1Id, user2Id) {
    const cacheDir = path.join(__dirname, "cache");
    const baseImagePath = path.join(cacheDir, "lpwft.png");

    // 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑙𝑜𝑎𝑑
    const baseImage = await Jimp.read(baseImagePath);
    baseImage.resize(1278, 720);

    // 𝑜𝑢𝑡𝑝𝑢𝑡 𝑝𝑎𝑡ℎ 𝑐𝑟𝑒𝑎𝑡𝑒
    const outputPath = path.join(cacheDir, `love3_${user1Id}_${user2Id}_${Date.now()}.png`);

    // 𝑎𝑣𝑎𝑡𝑎𝑟𝑠 𝑝𝑟𝑜𝑐𝑒𝑠𝑠
    const avatar1 = await processAvatar(user1Id);
    const avatar2 = await processAvatar(user2Id);

    // 𝑟𝑒𝑠𝑖𝑧𝑒 𝑎𝑣𝑎𝑡𝑎𝑟𝑠
    avatar1.resize(250, 250);
    avatar2.resize(250, 250);

    // 𝑐𝑜𝑚𝑝𝑜𝑠𝑖𝑡𝑒
    baseImage
        .composite(avatar1, 159, 220)
        .composite(avatar2, 849, 220);

    // 𝑠𝑎𝑣𝑒
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
                headers: { "User-Agent": "Mozilla/5.0" }
            });
            if (response.data) {
                avatarBuffer = Buffer.from(response.data);
                break;
            }
        } catch (error) {
            console.log(`⚠️ 𝑇𝑟𝑦𝑖𝑛𝑔 𝑛𝑒𝑥𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑠𝑜𝑢𝑟𝑐𝑒 𝑓𝑜𝑟 ${userId}...`);
            continue;
        }
    }

    if (!avatarBuffer) {
        throw new Error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 ${userId}`);
    }

    // 𝑐𝑖𝑟𝑐𝑙𝑒 𝑐𝑟𝑜𝑝
    const avatar = await Jimp.read(avatarBuffer);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

    return avatar.crop(0, 0, size, size).circle();
}
