const axios = require("axios");

module.exports.config = {
    name: "baybayin",
    aliases: ["ancient", "filipinoscript"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝐶𝑜𝑛𝑣𝑒𝑟𝑡 𝑡𝑒𝑥𝑡 𝑡𝑜 𝐵𝑎𝑦𝑏𝑎𝑦𝑖𝑛 𝑠𝑐𝑟𝑖𝑝𝑡"
    },
    longDescription: {
        en: "𝐶𝑜𝑛𝑣𝑒𝑟𝑡𝑠 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑎𝑛𝑐𝑖𝑒𝑛𝑡 𝐹𝑖𝑙𝑖𝑝𝑖𝑛𝑜 𝐵𝑎𝑦𝑏𝑎𝑦𝑖𝑛 𝑠𝑐𝑟𝑖𝑝𝑡"
    },
    guide: {
        en: "{p}baybayin [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "noText": "🌺 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑐𝑜𝑛𝑣𝑒𝑟𝑡 𝑡𝑜 𝐵𝑎𝑦𝑏𝑎𝑦𝑖𝑛 𝑠𝑐𝑟𝑖𝑝𝑡!\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑏𝑎𝑦𝑏𝑎𝑦𝑖𝑛 𝑘𝑎𝑚𝑢𝑠𝑡𝑎",
        "error": "❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑜𝑛𝑣𝑒𝑟𝑡𝑖𝑛𝑔 \"{𝑡𝑒𝑥𝑡}\" 𝑡𝑜 𝐵𝑎𝑦𝑏𝑎𝑦𝑖𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        if (!args[0]) {
            return message.reply(module.exports.languages.en.noText);
        }

        const text = args.join(" ");
        const response = await axios.get(`https://api-baybayin-transliterator.vercel.app/?text=${encodeURIComponent(text)}`);
        const baybayinText = response.data.baybay;

        const formattedMessage = `
🪷 𝗕𝗮𝘆𝗯𝗮𝘆𝗶𝗻 𝗖𝗼𝗻𝘃𝗲𝗿𝘀𝗶𝗼𝗻 🪷

✨ 𝗢𝗿𝗶𝗴𝗶𝗻𝗮𝗹:
"${text}"

🏮 𝗕𝗮𝘆𝗯𝗮𝘆𝗶𝗻 𝗦𝗰𝗿𝗶𝗽𝘁:
"${baybayinText}"

📜 𝗔𝗯𝗼𝘂𝘁 𝗕𝗮𝘆𝗯𝗮𝘆𝗶𝗻:
𝐵𝑎𝑦𝑏𝑎𝑦𝑖𝑛 𝑖𝑠 𝑎𝑛 𝑎𝑛𝑐𝑖𝑒𝑛𝑡 𝐹𝑖𝑙𝑖𝑝𝑖𝑛𝑜 𝑠𝑐𝑟𝑖𝑝𝑡 𝑢𝑠𝑒𝑑 𝑏𝑒𝑓𝑜𝑟𝑒 𝑡ℎ𝑒 𝑆𝑝𝑎𝑛𝑖𝑠ℎ 𝑒𝑟𝑎. 
𝐼𝑡 𝑓𝑒𝑎𝑡𝑢𝑟𝑒𝑠 𝑓𝑙𝑜𝑤𝑖𝑛𝑔 𝑐𝑢𝑟𝑣𝑒𝑠 𝑎𝑛𝑑 𝑑𝑖𝑎𝑐𝑟𝑖𝑡𝑖𝑐𝑎𝑙 𝑚𝑎𝑟𝑘𝑠 𝑡𝑜 𝑟𝑒𝑝𝑟𝑒𝑠𝑒𝑛𝑡 𝑣𝑜𝑤𝑒𝑙 𝑠𝑜𝑢𝑛𝑑𝑠.`;

        return message.reply(formattedMessage);

    } catch (error) {
        console.error("𝐵𝑎𝑦𝑏𝑎𝑦𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        const text = args.join(" ") || "";
        return message.reply(module.exports.languages.en.error.replace("{𝑡𝑒𝑥𝑡}", text));
    }
};
