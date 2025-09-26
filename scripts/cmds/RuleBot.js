module.exports.config = {
    name: "rulebot",
    aliases: ["botrules", "rulesbot"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "group",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑢𝑠𝑎𝑔𝑒 𝑟𝑢𝑙𝑒𝑠"
    },
    longDescription: {
        en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑡ℎ𝑒 𝑟𝑢𝑙𝑒𝑠 𝑓𝑜𝑟 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡𝑏𝑜𝑡"
    },
    guide: {
        en: "{p}rulebot"
    }
};

module.exports.onStart = async function({ message }) {
    try {
        const rulesMessage = "💌 𝐶ℎ𝑎𝑡𝑏𝑜𝑡 𝑏𝑎𝑏𝑜ℎ𝑎𝑟 𝑛𝑖𝑦𝑜𝑚:\n" +
               "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
               "❯ 𝑆𝑜𝑢𝑟𝑐𝑒 𝐶𝑜𝑑𝑒 𝐵𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n" +
               "❯ 𝑈𝑠𝑒𝑟 𝑟𝑎 𝑏𝑜𝑡 𝑘𝑒 20 𝑏𝑎𝑟/𝑑𝑖𝑛𝑒𝑟 𝑐ℎ𝑒𝑦𝑒 𝑠𝑝𝑎𝑚 𝑛𝑎 𝑘𝑜𝑟𝑏𝑒𝑛\n" +
               "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
               "💖 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑";
        
        await message.reply(rulesMessage);
    } catch (error) {
        console.error("𝑅𝑢𝑙𝑒𝐵𝑜𝑡 𝑜𝑛𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠ℎ𝑜𝑤 𝑟𝑢𝑙𝑒𝑠.");
    }
};

module.exports.onChat = async function({ event, message }) {
    try {
        const triggers = ["rulebot", "bot rules", "rules", "rule bot"];
        
        if (event.body && triggers.some(trigger =>
            event.body.toLowerCase().includes(trigger.toLowerCase())
        )) {
            const rulesMessage = "💌 𝐶ℎ𝑎𝑡𝑏𝑜𝑡 𝑏𝑎𝑏𝑜ℎ𝑎𝑟 𝑛𝑖𝑦𝑜𝑚:\n" +
                   "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
                   "❯ 𝑆𝑜𝑢𝑟𝑐𝑒 𝐶𝑜𝑑𝑒 𝐵𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n" +
                   "❯ 𝑈𝑠𝑒𝑟𝑑𝑒𝑟𝑎 𝑏𝑜𝑡 𝑘𝑒 20 𝑏𝑎𝑟/𝑑𝑖𝑛𝑒𝑟 𝑐ℎ𝑒𝑦𝑒 𝑠𝑝𝑎𝑚 𝑛𝑎 𝑘𝑜𝑟𝑏𝑒𝑛\n" +
                   "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
                   "💖 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑";
            
            await message.reply(rulesMessage);
        }
    } catch (error) {
        console.error("𝑅𝑢𝑙𝑒𝐵𝑜𝑡 𝑜𝑛𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};
