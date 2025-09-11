const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "gray",
    aliases: ["greyscale", "bw"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
        en: "𝐶𝑜𝑛𝑣𝑒𝑟𝑡 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑡𝑜 𝑔𝑟𝑎𝑦𝑠𝑐𝑎𝑙𝑒"
    },
    longDescription: {
        en: "𝑇𝑢𝑟𝑛𝑠 𝑦𝑜𝑢𝑟 𝑜𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑖𝑛𝑡𝑜 𝑎 𝑔𝑟𝑎𝑦𝑠𝑐𝑎𝑙𝑒 𝑖𝑚𝑎𝑔𝑒"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}gray [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦]\n𝐼𝑓 𝑛𝑜 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦, 𝑢𝑠𝑒𝑠 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒."
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, api }) {
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

        const res = await axios.get(`https://api.popcat.xyz/v2/greyscale?image=${encodeURIComponent(avatarURL)}`, {
            responseType: "arraybuffer"
        });

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const filePath = path.join(cacheDir, `greyscale_${uid}_${Date.now()}.png`);
        fs.writeFileSync(filePath, res.data);

        await message.reply({
            body: "⚫ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑔𝑟𝑎𝑦𝑠𝑐𝑎𝑙𝑒 𝑖𝑚𝑎𝑔𝑒!",
            attachment: fs.createReadStream(filePath)
        });

        fs.unlinkSync(filePath);

    } catch (err) {
        console.error("𝐺𝑟𝑎𝑦𝑠𝑐𝑎𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", err);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑔𝑟𝑎𝑦𝑠𝑐𝑎𝑙𝑒 𝑖𝑚𝑎𝑔𝑒.");
    }
};
