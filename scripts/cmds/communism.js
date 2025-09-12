const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "communism",
    aliases: ["comrade", "soviet"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
        en: "𝐴𝑝𝑝𝑙𝑦 𝑐𝑜𝑚𝑚𝑢𝑛𝑖𝑠𝑚 𝑒𝑓𝑓𝑒𝑐𝑡 𝑡𝑜 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝ℎ𝑜𝑡𝑜"
    },
    longDescription: {
        en: "𝐴𝑑𝑑𝑠 𝑎 𝑐𝑜𝑚𝑚𝑢𝑛𝑖𝑠𝑡-𝑠𝑡𝑦𝑙𝑒 𝑟𝑒𝑑 𝑓𝑖𝑙𝑡𝑒𝑟 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑜𝑟 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑒𝑙𝑠𝑒'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}communism [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦]\n\n𝐷𝑒𝑓𝑎𝑢𝑙𝑡: 𝑌𝑜𝑢𝑟 𝑜𝑤𝑛 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    dependencies: {
        "axios": "",
        "fs": "",
        "path": ""
    }
};

module.exports.onStart = async function({ api, event, message }) {
    try {
        const { senderID, mentions, type, messageReply } = event;

        let uid;
        if (Object.keys(mentions).length > 0) {
            uid = Object.keys(mentions)[0];
        } else if (type === "message_reply") {
            uid = messageReply.senderID;
        } else {
            uid = senderID;
        }

        const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

        const res = await axios.get(`https://api.popcat.xyz/v2/communism?image=${encodeURIComponent(avatarURL)}`, {
            responseType: "arraybuffer"
        });

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const filePath = path.join(cacheDir, `communism_${uid}_${Date.now()}.jpg`);
        fs.writeFileSync(filePath, res.data);

        await message.reply({
            body: "☭ | 𝑇ℎ𝑒 𝑟𝑒𝑣𝑜𝑙𝑢𝑡𝑖𝑜𝑛 ℎ𝑎𝑠 𝑏𝑒𝑔𝑢𝑛!",
            attachment: fs.createReadStream(filePath)
        });

        fs.unlinkSync(filePath);

    } catch (err) {
        console.error("𝐶𝑜𝑚𝑚𝑢𝑛𝑖𝑠𝑚 𝐸𝑟𝑟𝑜𝑟:", err);
        await message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐶𝑜𝑚𝑚𝑢𝑛𝑖𝑠𝑡 𝑚𝑒𝑚𝑒.");
    }
};
