const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports.config = {
    name: "cry",
    aliases: ["crying", "sad"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 0,
    category: "meme",
    shortDescription: {
        en: "𝐶𝑟𝑦 𝑚𝑒𝑚𝑒 𝑒𝑓𝑓𝑒𝑐𝑡 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑/𝑟𝑒𝑝𝑙𝑖𝑒𝑑 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟 😭"
    },
    longDescription: {
        en: "𝐴𝑝𝑝𝑙𝑦 𝑐𝑟𝑦𝑖𝑛𝑔 𝑚𝑒𝑚𝑒 𝑒𝑓𝑓𝑒𝑐𝑡 𝑜𝑛 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
        en: "{p}cry [𝑡𝑎𝑔/𝑟𝑒𝑝𝑙𝑦]"
    },
    dependencies: {
        "discord-image-generation": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "noTag": "⚠️ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑡𝑎𝑔 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑐𝑟𝑦 𝑤𝑖𝑡ℎ!",
        "selfCry": "😂 𝐿𝑜𝑙, 𝑦𝑜𝑢 𝑚𝑎𝑑𝑒 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓 𝑐𝑟𝑦!\n👉 𝑅𝑒𝑚𝑒𝑚𝑏𝑒𝑟 𝑡𝑜 𝑟𝑒𝑝𝑙𝑦 𝑜𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒.",
        "success": "😭 𝑇ℎ𝑖𝑠 𝑝𝑒𝑟𝑠𝑜𝑛 𝑎𝑙𝑤𝑎𝑦𝑠 𝑚𝑎𝑘𝑒𝑠 𝑚𝑒 𝑐𝑟𝑦..."
    }
};

module.exports.onStart = async function({ api, event, args, message, Users, getText }) {
    try {
        // Check dependencies
        if (!DIG || !fs.existsSync) {
            return message.reply("❌ 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑚𝑜𝑑𝑢𝑙𝑒𝑠 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠.");
        }

        let mention = Object.keys(event.mentions);
        let uid;

        if (event.type === "message_reply") {
            uid = event.messageReply.senderID;
        }
        else if (mention[0]) {
            uid = mention[0];
        }
        else {
            uid = event.senderID;
        }

        const userInfo = await api.getUserInfo(uid);
        const avatarUrl = userInfo[uid].thumbSrc;
        
        const img = await new DIG.Mikkelsen().getImage(avatarUrl);
        const pathSave = `${__dirname}/tmp/cry.png`;
        
        // Ensure tmp directory exists
        if (!fs.existsSync(`${__dirname}/tmp`)) {
            fs.mkdirSync(`${__dirname}/tmp`, { recursive: true });
        }
        
        fs.writeFileSync(pathSave, Buffer.from(img));

        let body;
        if (!mention[0] && event.type !== "message_reply") {
            body = getText("selfCry");
        } else {
            body = getText("success");
        }

        await message.reply({
            body: body,
            attachment: fs.createReadStream(pathSave)
        });

        // Clean up
        fs.unlinkSync(pathSave);

    } catch (err) {
        console.error("𝐶𝑟𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑟𝑦 𝑖𝑚𝑎𝑔𝑒.");
    }
};
