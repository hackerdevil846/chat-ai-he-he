const fs = require('fs-extra');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: "funmeme",
    aliases: ["meme", "funnymeme"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
        en: "😂 𝐶𝑟𝑒𝑎𝑡𝑒 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑓𝑢𝑛𝑛𝑦 𝑚𝑒𝑚𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝑢𝑠𝑒𝑟𝑠' 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
        en: "{p}funmeme [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "canvas": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "processing": "⏳ 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑚𝑒𝑚𝑒...",
        "success": "🎉 𝑀𝑒𝑚𝑒 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! 😂",
        "fail": "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
    }
};

module.exports.onLoad = function () {
    console.log("[✅] 𝐹𝑢𝑛 𝑀𝑒𝑚𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
};

module.exports.onStart = async function ({ message, event, args, getText }) {
    try {
        // Check dependencies
        if (!axios || !createCanvas || !loadImage || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        const { threadID, messageID, senderID } = event;
        const mentions = Object.keys(event.mentions);
        const targetID = mentions[0] || senderID;

        // Send processing message
        await message.reply(getText("processing"));

        // Create canvas
        const canvas = createCanvas(700, 500);
        const ctx = canvas.getContext('2d');

        // Load template
        const template = await loadImage("https://i.imgur.com/jHrYZ5Y.jpg");
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

        // Get avatar
        const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;
        const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        const avatar = await loadImage(Buffer.from(avatarResponse.data));

        // Draw circular avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(350, 250, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 250, 150, 200, 200);
        ctx.restore();

        // Save image
        const path = __dirname + `/cache/meme_${Date.now()}.png`;
        const buffer = canvas.toBuffer("image/png");
        await fs.writeFileSync(path, buffer);

        // Send result
        await message.reply({
            body: getText("success"),
            attachment: fs.createReadStream(path)
        });

        // Cleanup
        await fs.unlinkSync(path);

    } catch (error) {
        console.error("𝑀𝑒𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply(getText("fail"));
    }
};
