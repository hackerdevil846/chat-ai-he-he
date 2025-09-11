const axios = require("axios");

module.exports.config = {
    name: "binarydecode",
    aliases: ["bindecode", "bdecode"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 0,
    shortDescription: {
        en: "𝐷𝑒𝑐𝑜𝑑𝑒 𝑏𝑖𝑛𝑎𝑟𝑦 𝑡𝑒𝑥𝑡 𝑢𝑠𝑖𝑛𝑔 𝑃𝑜𝑝𝐶𝑎𝑡 𝐴𝑃𝐼"
    },
    longDescription: {
        en: "𝐷𝑒𝑐𝑜𝑑𝑒𝑠 𝑏𝑖𝑛𝑎𝑟𝑦 𝑠𝑡𝑟𝑖𝑛𝑔𝑠 𝑡𝑜 𝑡𝑒𝑥𝑡"
    },
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    guide: {
        en: "{p}binarydecode <𝑏𝑖𝑛𝑎𝑟𝑦>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}binarydecode 0110100001100101"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.langs = {
    en: {
        missing: "❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑏𝑖𝑛𝑎𝑟𝑦 𝑠𝑡𝑟𝑖𝑛𝑔 𝑡𝑜 𝑑𝑒𝑐𝑜𝑑𝑒.",
        error: "❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑒𝑐𝑜𝑑𝑒 𝑏𝑖𝑛𝑎𝑟𝑦."
    }
};

module.exports.onStart = async function({ message, args, getLang }) {
    try {
        if (!args.length) return message.reply(getLang("missing"));

        const binary = args.join("");

        // Validate binary input
        if (!/^[01]+$/.test(binary)) {
            return message.reply("❌ | 𝐼𝑛𝑝𝑢𝑡 𝑐𝑜𝑛𝑡𝑎𝑖𝑛𝑠 𝑛𝑜𝑛-𝑏𝑖𝑛𝑎𝑟𝑦 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠.");
        }

        const res = await axios.get(`https://api.popcat.xyz/v2/decode?binary=${encodeURIComponent(binary)}`);
        
        if (!res.data || !res.data.result) {
            return message.reply(getLang("error"));
        }

        await message.reply(`🔡 𝐷𝑒𝑐𝑜𝑑𝑒𝑑 𝑇𝑒𝑥𝑡:\n${res.data.result}`);

    } catch (err) {
        console.error("𝐵𝑖𝑛𝑎𝑟𝑦 𝐷𝑒𝑐𝑜𝑑𝑒 𝐸𝑟𝑟𝑜𝑟:", err);
        message.reply(getLang("error"));
    }
};
