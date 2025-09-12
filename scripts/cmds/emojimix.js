const axios = require("axios");

module.exports.config = {
    name: "emojimix",
    aliases: ["emix", "mixemoji"],
    version: "1.4",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝑀𝑖𝑥 2 𝑒𝑚𝑜𝑗𝑖 𝑡𝑜𝑔𝑒𝑡ℎ𝑒𝑟 🎭"
    },
    longDescription: {
        en: "𝐶𝑜𝑚𝑏𝑖𝑛𝑒 𝑡𝑤𝑜 𝑒𝑚𝑜𝑗𝑖𝑠 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑢𝑛𝑖𝑞𝑢𝑒 𝑓𝑢𝑠𝑖𝑜𝑛 𝑖𝑚𝑎𝑔𝑒 🎨"
    },
    guide: {
        en: "{p}emojimix <𝑒𝑚𝑜𝑗𝑖1> <𝑒𝑚𝑜𝑗𝑖2>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}emojimix 🤣 🥰"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "error": "𝑆𝑜𝑟𝑟𝑦, 𝑒𝑚𝑜𝑗𝑖 %1 𝑎𝑛𝑑 %2 𝑐𝑎𝑛'𝑡 𝑏𝑒 𝑚𝑖𝑥𝑒𝑑",
        "success": "𝐸𝑚𝑜𝑗𝑖 %1 𝑎𝑛𝑑 %2 𝑚𝑖𝑥𝑒𝑑 𝑖𝑛𝑡𝑜 %3 𝑖𝑚𝑎𝑔𝑒𝑠",
        "goat_error": "🐐 𝑂ℎ 𝑛𝑜! 𝐸𝑚𝑜𝑗𝑖𝑠 %1 𝑎𝑛𝑑 %2 𝑎𝑟𝑒 𝑛𝑜𝑡 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑙𝑒 💔 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑜𝑛𝑒𝑠!",
        "goat_success": "🎉 𝑆𝑢𝑐𝑐𝑒𝑠𝑠! 𝐸𝑚𝑜𝑗𝑖𝑠 %1 𝑎𝑛𝑑 %2 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙𝑙𝑦 𝑚𝑖𝑥𝑒𝑑 🎨 𝑌𝑜𝑢'𝑣𝑒 𝑔𝑜𝑡 %3 𝑎𝑚𝑎𝑧𝑖𝑛𝑔 𝑛𝑒𝑤 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛𝑠!"
    }
};

module.exports.onStart = async function ({ message, event, args, getText }) {
    try {
        const emoji1 = args[0];
        const emoji2 = args[1];
        const attachments = [];

        if (!emoji1 || !emoji2) {
            return message.reply(
                `⚠️ 𝑈𝑠𝑎𝑔𝑒: ${this.config.guide.en.replace(/{p}/g, global.config.PREFIX || "{p}")}`,
                event.threadID,
                event.messageID
            );
        }

        const img1 = await generateEmojimix(emoji1, emoji2);
        const img2 = await generateEmojimix(emoji2, emoji1);

        if (img1) attachments.push(await global.utils.getStreamFromURL(img1));
        if (img2) attachments.push(await global.utils.getStreamFromURL(img2));

        if (attachments.length === 0) {
            return message.reply(
                getText("goat_error", emoji1, emoji2),
                event.threadID,
                event.messageID
            );
        }

        return message.reply({
            body: getText("goat_success", emoji1, emoji2, attachments.length),
            attachment: attachments
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error("𝐸𝑚𝑜𝑗𝑖𝑀𝑖𝑥 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑚𝑖𝑥𝑖𝑛𝑔 𝑒𝑚𝑜𝑗𝑖𝑠.", event.threadID, event.messageID);
    }
};

async function generateEmojimix(emoji1, emoji2) {
    try {
        const response = await axios.get(
            `https://emojik.vercel.app/s/${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}?size=128`,
            { responseType: "arraybuffer" }
        );
        
        if (response.status === 200) {
            return `https://emojik.vercel.app/s/${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}?size=128`;
        }
        return null;
    } catch (e) {
        return null;
    }
}
