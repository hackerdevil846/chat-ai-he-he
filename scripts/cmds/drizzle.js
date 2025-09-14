const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "drizzle",
    aliases: ["drip"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
        en: "𝐴𝑑𝑑 𝑑𝑟𝑖𝑝 𝑒𝑓𝑓𝑒𝑐𝑡 𝑡𝑜 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    longDescription: {
        en: "𝐴𝑝𝑝𝑙𝑖𝑒𝑠 𝑎 𝑐𝑜𝑜𝑙 𝑑𝑟𝑖𝑝 𝑒𝑓𝑓𝑒𝑐𝑡 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑜𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    category: "𝑖𝑚𝑎𝑔𝑒",
    guide: {
        en: "{p}drizzle [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦]\n𝐼𝑓 𝑛𝑜 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦, 𝑢𝑠𝑒𝑠 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒."
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        const { senderID, mentions, type, messageReply } = event;

        // Determine user ID for avatar
        let uid;
        if (Object.keys(mentions).length > 0) {
            uid = Object.keys(mentions)[0];
        } else if (type === "message_reply") {
            uid = messageReply.senderID;
        } else {
            uid = senderID;
        }

        const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const res = await axios.get(`https://api.popcat.xyz/v2/drip?image=${encodeURIComponent(avatarURL)}`, {
            responseType: "arraybuffer"
        });

        const filePath = path.join(cacheDir, `drip_${uid}_${Date.now()}.png`);
        await fs.writeFile(filePath, res.data);

        await message.reply({
            body: "💧 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑑𝑟𝑖𝑝 𝑒𝑓𝑓𝑒𝑐𝑡 𝑖𝑚𝑎𝑔𝑒!",
            attachment: fs.createReadStream(filePath)
        });

        // Clean up after sending
        fs.unlinkSync(filePath);

    } catch (err) {
        console.error("𝐷𝑟𝑖𝑧𝑧𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", err);
        await message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑑𝑟𝑖𝑝 𝑖𝑚𝑎𝑔𝑒.");
    }
};
