const axios = require("axios");

module.exports.config = {
    name: "encode",
    aliases: ["encrypt", "textencode"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 0,
    shortDescription: {
        en: "𝐸𝑛𝑐𝑜𝑑𝑒 𝑡𝑒𝑥𝑡 𝑢𝑠𝑖𝑛𝑔 𝑃𝑜𝑝𝐶𝑎𝑡 𝐴𝑃𝐼"
    },
    longDescription: {
        en: "𝐸𝑛𝑐𝑜𝑑𝑒𝑠 𝑡ℎ𝑒 𝑔𝑖𝑣𝑒𝑛 𝑡𝑒𝑥𝑡 𝑎𝑛𝑑 𝑟𝑒𝑡𝑢𝑟𝑛𝑠 𝑡ℎ𝑒 𝑒𝑛𝑐𝑜𝑑𝑒𝑑 𝑟𝑒𝑠𝑢𝑙𝑡"
    },
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    guide: {
        en: "{p}encode <𝑡𝑒𝑥𝑡>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}encode ℎ𝑒𝑙𝑙𝑜\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}encode 𝐻𝑒𝑙𝑙𝑜 𝑊𝑜𝑟𝑙𝑑\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}encode 123𝑎𝑏𝑐"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.langs = {
    "en": {
        "missing": "❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑒𝑛𝑐𝑜𝑑𝑒.\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}encode ℎ𝑒𝑙𝑙𝑜\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}encode 𝐻𝑒𝑙𝑙𝑜 𝑊𝑜𝑟𝑙𝑑",
        "error": "❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑒𝑛𝑐𝑜𝑑𝑒 𝑡𝑒𝑥𝑡."
    }
};

module.exports.onStart = async function ({ message, args, getLang }) {
    try {
        if (!args.length) return message.reply(getLang("missing"));

        const text = encodeURIComponent(args.join(" "));

        const res = await axios.get(`https://api.popcat.xyz/v2/encode?text=${text}`);
        if (!res.data || !res.data.result) return message.reply(getLang("error"));

        message.reply(`📝 𝐸𝑛𝑐𝑜𝑑𝑒𝑑 𝑇𝑒𝑥𝑡:\n${res.data.result}`);
    } catch (err) {
        console.error(err);
        message.reply(getLang("error"));
    }
};
