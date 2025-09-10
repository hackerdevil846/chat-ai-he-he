const moment = require("moment-timezone");

module.exports.config = {
    name: "autoreset",
    aliases: ["autorestart", "botreset"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "system",
    shortDescription: {
        en: "𝐴𝑈𝑇𝑂 𝑅𝐸𝑆𝑇𝐴𝑅𝑇 𝑆𝑌𝑆𝑇𝐸𝑀"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑡𝑎𝑟𝑡𝑠 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑎𝑡 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑡𝑖𝑚𝑒𝑠"
    },
    guide: {
        en: ""
    },
    dependencies: {
        "moment-timezone": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
        await message.reply(`🕒 𝐴𝑘ℎ𝑛𝑒𝑟 𝑠𝑜𝑚𝑜𝑦: ${timeNow}`);
    } catch (error) {
        console.error("𝐴𝑢𝑡𝑜𝑟𝑒𝑠𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onChat = async function({ message, event }) {
    try {
        const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
        const seconds = moment.tz("Asia/Dhaka").format("ss");
        const adminIDs = global.config.ADMINBOT || [];
        
        // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑡𝑖𝑚𝑒 𝑠𝑡𝑟𝑖𝑛𝑔𝑠 𝑓𝑜𝑟 𝑒𝑎𝑐ℎ ℎ𝑜𝑢𝑟
        const restartTimes = Array.from({length: 24}, (_, i) => 
            `${i.toString().padStart(2, '0')}:00:${seconds}`
        );
        
        // 𝐶ℎ𝑒𝑐𝑘 𝑖𝑓 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑡𝑖𝑚𝑒 𝑚𝑎𝑡𝑐ℎ𝑒𝑠 𝑎𝑛𝑦 𝑟𝑒𝑠𝑡𝑎𝑟𝑡 𝑡𝑖𝑚𝑒
        if (restartTimes.includes(timeNow) && parseInt(seconds) < 6) {
            for (const adminID of adminIDs) {
                await message.reply(
                    `⚡️ 𝐴𝑘ℎ𝑜𝑛 𝑠𝑜𝑚𝑜𝑦: ${timeNow}\n𝐵𝑎𝑏𝑦 𝑟𝑒𝑠𝑡𝑎𝑟𝑡 ℎ𝑜𝑐𝑐ℎ𝑒!!!`,
                    adminID
                );
            }
            process.exit(1);
        }
    } catch (error) {
        console.error("𝐴𝑢𝑡𝑜𝑟𝑒𝑠𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};
