module.exports.config = {
    name: "luckynum",
    aliases: ["lucky", "randomnum"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑦𝑜𝑢𝑟 𝑙𝑢𝑐𝑘𝑦 𝑛𝑢𝑚𝑏𝑒𝑟 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑓𝑜𝑟𝑚𝑎𝑡𝑡𝑖𝑛𝑔"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑙𝑢𝑐𝑘𝑦 𝑛𝑢𝑚𝑏𝑒𝑟 𝑤𝑖𝑡ℎ𝑖𝑛 𝑎 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑒𝑑 𝑟𝑎𝑛𝑔𝑒"
    },
    guide: {
        en: "{p}luckynum\n{p}luckynum [𝑚𝑖𝑛] [𝑚𝑎𝑥]"
    },
    envConfig: {
        defaultRange: [0, 10]
    }
};

module.exports.languages = {
    "en": {
        "returnResultDefault": "✨ 𝑌𝑜𝑢𝑟 𝑙𝑢𝑐𝑘𝑦 𝑛𝑢𝑚𝑏𝑒𝑟 𝑖𝑠: 【%1】 🍀",
        "invalidMax": "⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑏𝑜𝑡ℎ 𝑆𝑇𝐴𝑅𝑇 𝑎𝑛𝑑 𝐸𝑁𝐷 𝑟𝑎𝑛𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟𝑠!",
        "invalidInput": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑛𝑝𝑢𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑝𝑜𝑠𝑖𝑡𝑖𝑣𝑒 𝑛𝑢𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝐸𝑁𝐷 > 𝑆𝑇𝐴𝑅𝑇",
        "returnResult": "🎉 𝑌𝑜𝑢𝑟 𝑙𝑢𝑐𝑘𝑦 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 %2 𝑎𝑛𝑑 %3 𝑖𝑠: 【%1】 🌈"
    }
};

module.exports.onStart = async function({ message, event, args, getText }) {
    try {
        const { defaultRange } = global.configModule[this.config.name].envConfig;

        if (args.length === 0) {
            const randomNum = Math.floor(Math.random() * (defaultRange[1] - defaultRange[0] + 1)) + defaultRange[0];
            return message.reply(getText("returnResultDefault", randomNum));
        }
        
        if (args.length !== 2) {
            return message.reply(getText("invalidMax"));
        }
        
        const min = parseInt(args[0]);
        const max = parseInt(args[1]);
        
        if (isNaN(min) || isNaN(max) || max <= min || min < 0 || max < 0) {
            return message.reply(getText("invalidInput"));
        }
        
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return message.reply(getText("returnResult", randomNum, min, max));
        
    } catch (error) {
        console.error("𝐿𝑢𝑐𝑘𝑦 𝑁𝑢𝑚𝑏𝑒𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑙𝑢𝑐𝑘𝑦 𝑛𝑢𝑚𝑏𝑒𝑟.");
    }
};
