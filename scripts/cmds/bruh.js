const fs = require("fs-extra");

module.exports.config = {
    name: "bruh",
    aliases: ["bruhh", "bruhvoice"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝐵𝑟𝑢ℎ 𝑠𝑜𝑢𝑛𝑑 𝑒𝑓𝑓𝑒𝑐𝑡"
    },
    longDescription: {
        en: "𝑃𝑙𝑎𝑦𝑠 𝑏𝑟𝑢ℎ 𝑠𝑜𝑢𝑛𝑑 𝑒𝑓𝑓𝑒𝑐𝑡 𝑤ℎ𝑒𝑛 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑"
    },
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑏𝑟𝑢ℎ' 𝑖𝑛 𝑐ℎ𝑎𝑡"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    en: {
        success: "𝐵𝑟𝑢ℎ 𝐵𝑟𝑢𝑢𝑢ℎ 😏",
        fileMissing: "(⚠) 𝐵𝑟𝑢ℎ 𝑠𝑜𝑢𝑛𝑑 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑆𝑒𝑛𝑑𝑖𝑛𝑔 𝑡𝑒𝑥𝑡 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘..."
    }
};

module.exports.onLoad = function () {
    try {
        const filePath = __dirname + "/noprefix/xxx.mp3";
        if (!fs.existsSync(filePath)) {
            console.warn("[𝑏𝑟𝑢ℎ] 𝑤𝑎𝑟𝑛𝑖𝑛𝑔: 𝑠𝑜𝑢𝑛𝑑 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡:", filePath);
        }
    } catch (e) {
        console.warn("[𝑏𝑟𝑢ℎ] 𝑜𝑛𝐿𝑜𝑎𝑑 𝑐ℎ𝑒𝑐𝑘 𝑓𝑎𝑖𝑙𝑒𝑑:", e);
    }
};

module.exports.onChat = async function({ event, api, message }) {
    try {
        if (!event || !event.body) return;

        const { threadID, messageID, senderID, body } = event;

        let otherBots = [];
        try {
            if (global.config && Array.isArray(global.config.OTHERBOT)) {
                otherBots = global.config.OTHERBOT;
            }
        } catch (err) {
            otherBots = [];
        }

        const firstWord = body.trim().split(/\s+/)[0] || "";
        if (firstWord.toLowerCase() !== "bruh") return;

        if (otherBots.includes(senderID)) return;

        const filePath = __dirname + "/noprefix/xxx.mp3";

        const msg = {
            body: module.exports.languages.en.success,
        };

        if (fs.existsSync(filePath)) {
            msg.attachment = fs.createReadStream(filePath);
            await message.reply(msg);
        } else {
            msg.body = module.exports.languages.en.fileMissing + "\n" + module.exports.languages.en.success;
            console.warn("[𝑏𝑟𝑢ℎ] 𝑠𝑜𝑢𝑛𝑑 𝑓𝑖𝑙𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔, 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑡𝑒𝑥𝑡 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘. 𝐸𝑥𝑝𝑒𝑐𝑡𝑒𝑑:", filePath);
            await message.reply(msg);
        }
    } catch (error) {
        console.error("[𝑏𝑟𝑢ℎ] 𝑜𝑛𝐶ℎ𝑎𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        const { threadID, messageID } = event;
        await message.reply(module.exports.languages.en.success);
    } catch (error) {
        console.error("[𝑏𝑟𝑢ℎ] 𝑜𝑛𝑆𝑡𝑎𝑟𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};
