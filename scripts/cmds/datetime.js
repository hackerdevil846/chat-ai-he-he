const moment = require('moment-timezone');

module.exports.config = {
    name: "datetime",
    aliases: ["bdtime", "timebd", "bangladeshtime"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝑆ℎ𝑜𝑤 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ 𝑑𝑎𝑡𝑒 𝑎𝑛𝑑 𝑡𝑖𝑚𝑒 𝑤𝑖𝑡ℎ 𝑖𝑛𝑓𝑜"
    },
    longDescription: {
        en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ 𝑑𝑎𝑡𝑒 𝑎𝑛𝑑 𝑡𝑖𝑚𝑒 𝑤𝑖𝑡ℎ 𝑎𝑑𝑑𝑖𝑡𝑖𝑜𝑛𝑎𝑙 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}datetime"
    },
    dependencies: {
        "moment-timezone": ""
    },
    envConfig: {
        timezone: "Asia/Dhaka"
    }
};

module.exports.onStart = async function ({ message, event, args }) {
    try {
        const bdTime = moment.tz("Asia/Dhaka");
        const date = bdTime.format("DD MMMM YYYY");
        const day = bdTime.format("dddd");
        const time = bdTime.format("hh:mm:ss A");
        const week = bdTime.week();
        const dayOfYear = bdTime.dayOfYear();
        const daysLeft = 365 - dayOfYear;
        
        const response = `✨ 𝗕𝗔𝗡𝗚𝗟𝗔𝗗𝗘𝗦𝗛 𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢 ✨
        
📅 𝗗𝗔𝗧𝗘: ${date}
🗓️ 𝗗𝗔𝗬: ${day}
⏰ 𝗧𝗜𝗠𝗘: ${time}
        
📊 𝗪𝗘𝗘𝗞 𝗡𝗨𝗠𝗕𝗘𝗥: ${week}
🌤️ 𝗗𝗔𝗬 𝗢𝗙 𝗬𝗘𝗔𝗥: ${dayOfYear}
⏳ 𝗗𝗔𝗬𝗦 𝗟𝗘𝗙𝗧: ${daysLeft}
        
🌏 𝗧𝗜𝗠𝗘𝗭𝗢𝗡𝗘: Asia/Dhaka (GMT+6)
🔮 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: ${this.config.author}
        
🇧🇩 𝗦𝗛𝗢𝗡𝗔𝗥 𝗕𝗔𝗡𝗚𝗟𝗔 𝗗𝗘𝗦𝗛 𝗧𝗜𝗠𝗘 🇧🇩`;

        await message.reply(response);
    } 
    catch (error) {
        console.error("DateTime Error:", error);
        await message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡𝑖𝑚𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};

module.exports.onChat = async function ({ event, message }) {
    const lowerBody = event.body.toLowerCase();
    if (lowerBody.includes("time") && lowerBody.includes("bd")) {
        this.onStart({ message, event, args: [] });
    }
};
