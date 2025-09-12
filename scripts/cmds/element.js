const axios = require("axios");

module.exports.config = {
    name: "element",
    aliases: ["periodic", "chemistry"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐺𝑒𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑎 𝑝𝑒𝑟𝑖𝑜𝑑𝑖𝑐 𝑡𝑎𝑏𝑙𝑒 𝑒𝑙𝑒𝑚𝑒𝑛𝑡"
    },
    longDescription: {
        en: "𝐹𝑒𝑡𝑐ℎ𝑒𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑎 𝑐ℎ𝑒𝑚𝑖𝑐𝑎𝑙 𝑒𝑙𝑒𝑚𝑒𝑛𝑡 𝑓𝑟𝑜𝑚 𝑃𝑜𝑝𝑐𝑎𝑡 𝐴𝑃𝐼"
    },
    category: "𝑒𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛",
    guide: {
        en: "{p}element <𝑛𝑎𝑚𝑒 𝑜𝑟 𝑠𝑦𝑚𝑏𝑜𝑙>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}element 𝑔𝑜𝑙𝑑\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}element 𝐴𝑢\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}element ℎ𝑦𝑑𝑟𝑜𝑔𝑒𝑛\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}element 𝐻"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.langs = {
    "en": {
        "missing": "❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎𝑛 𝑒𝑙𝑒𝑚𝑒𝑛𝑡 𝑛𝑎𝑚𝑒 𝑜𝑟 𝑠𝑦𝑚𝑏𝑜𝑙!\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}element 𝑔𝑜𝑙𝑑\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}element 𝐴𝑢",
        "notFound": "❌ | 𝑁𝑜 𝑒𝑙𝑒𝑚𝑒𝑛𝑡 𝑓𝑜𝑢𝑛𝑑 𝑤𝑖𝑡ℎ 𝑡ℎ𝑎𝑡 𝑛𝑎𝑚𝑒 𝑜𝑟 𝑠𝑦𝑚𝑏𝑜𝑙.\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}element 𝑜𝑥𝑦𝑔𝑒𝑛\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}element 𝑂",
        "result": "🧪 | 𝐸𝑙𝑒𝑚𝑒𝑛𝑡 𝐼𝑛𝑓𝑜:\n\n🔹 𝑁𝑎𝑚𝑒: %1\n🔹 𝑆𝑦𝑚𝑏𝑜𝑙: %2\n🔹 𝐴𝑡𝑜𝑚𝑖𝑐 𝑁𝑢𝑚𝑏𝑒𝑟: %3\n🔹 𝐴𝑡𝑜𝑚𝑖𝑐 𝑀𝑎𝑠𝑠: %4\n🔹 𝐴𝑝𝑝𝑒𝑎𝑟𝑎𝑛𝑐𝑒: %5\n🔹 𝐶𝑎𝑡𝑒𝑔𝑜𝑟𝑦: %6\n🔹 𝐷𝑖𝑠𝑐𝑜𝑣𝑒𝑟𝑒𝑑 𝐵𝑦: %7\n🔹 𝑃ℎ𝑎𝑠𝑒: %8\n🔹 𝑆𝑢𝑚𝑚𝑎𝑟𝑦: %9"
    }
};

module.exports.onStart = async function({ message, args, getLang }) {
    try {
        if (!args[0]) {
            return message.reply(getLang("missing"));
        }

        const element = encodeURIComponent(args.join(" "));

        const res = await axios.get(`https://api.popcat.xyz/v2/periodic-table?element=${element}`);
        const data = res.data;

        const replyText = getLang(
            "result", 
            data.name, 
            data.symbol, 
            data.atomic_number, 
            data.atomic_mass, 
            data.appearance || "𝑁/𝐴", 
            data.category, 
            data.discovered_by || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛", 
            data.phase, 
            data.summary
        );
        
        await message.reply(replyText);
        
    } catch (err) {
        return message.reply(getLang("notFound"));
    }
};
