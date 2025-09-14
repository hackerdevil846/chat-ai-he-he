const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "jester",
    aliases: ["clown", "joker"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐴𝑑𝑑 𝑐𝑙𝑜𝑤𝑛 𝑓𝑎𝑐𝑒 𝑒𝑓𝑓𝑒𝑐𝑡 𝑡𝑜 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    longDescription: {
        en: "𝐴𝑝𝑝𝑙𝑖𝑒𝑠 𝑎 𝑐𝑙𝑜𝑤𝑛 𝑓𝑎𝑐𝑒 𝑒𝑓𝑓𝑒𝑐𝑡 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑜𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}jester [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦]\n𝐼𝑓 𝑛𝑜 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦, 𝑢𝑠𝑒𝑠 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒."
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, api }) {
    try {
        const { senderID, mentions, type, messageReply } = event;

        // Get user ID for avatar
        let uid;
        if (Object.keys(mentions).length > 0) {
            uid = Object.keys(mentions)[0];
        } else if (type === "message_reply") {
            uid = messageReply.senderID;
        } else {
            uid = senderID;
        }

        const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

        const res = await axios.get(`https://api.popcat.xyz/v2/clown?image=${encodeURIComponent(avatarURL)}`, {
            responseType: "arraybuffer"
        });

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const filePath = path.join(cacheDir, `jester_${uid}_${Date.now()}.png`);
        fs.writeFileSync(filePath, res.data);

        await message.reply({
            body: "🤡 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑗𝑒𝑠𝑡𝑒𝑟 𝑒𝑓𝑓𝑒𝑐𝑡 𝑖𝑚𝑎𝑔𝑒!",
            attachment: fs.createReadStream(filePath)
        });

        fs.unlinkSync(filePath);

    } catch (err) {
        console.error("𝐽𝑒𝑠𝑡𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", err);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑙𝑜𝑤𝑛 𝑖𝑚𝑎𝑔𝑒.");
    }
};
