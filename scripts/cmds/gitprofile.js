const axios = require("axios");

module.exports.config = {
    name: "gitprofile",
    aliases: ["github", "gitinfo"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐺𝑒𝑡 𝐺𝑖𝑡𝐻𝑢𝑏 𝑢𝑠𝑒𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑖𝑛𝑓𝑜"
    },
    longDescription: {
        en: "𝐹𝑒𝑡𝑐ℎ 𝐺𝑖𝑡𝐻𝑢𝑏 𝑢𝑠𝑒𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 𝑢𝑠𝑖𝑛𝑔 𝑢𝑠𝑒𝑟𝑛𝑎𝑚𝑒"
    },
    category: "𝑖𝑛𝑓𝑜",
    guide: {
        en: "{p}gitprofile <𝑢𝑠𝑒𝑟𝑛𝑎𝑚𝑒>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}gitprofile 𝑏𝑟𝑎𝑛𝑑𝑐ℎ𝑖𝑡𝑟𝑜𝑛"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.langs = {
    en: {
        missing: "❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝐺𝑖𝑡𝐻𝑢𝑏 𝑢𝑠𝑒𝑟𝑛𝑎𝑚𝑒.",
        notFound: "❌ | 𝐺𝑖𝑡𝐻𝑢𝑏 𝑢𝑠𝑒𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.",
        result: `🐙 𝐺𝑖𝑡𝐻𝑢𝑏 𝑃𝑟𝑜𝑓𝑖𝑙𝑒 𝐼𝑛𝑓𝑜:\n\n👤 𝑁𝑎𝑚𝑒: %1\n📛 𝐿𝑜𝑔𝑖𝑛: %2\n📄 𝐵𝑖𝑜: %3\n🏢 𝐶𝑜𝑚𝑝𝑎𝑛𝑦: %4\n🌍 𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛: %5\n🔗 𝑈𝑅𝐿: %6\n📅 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑎𝑡: %7\n📦 𝑃𝑢𝑏𝑙𝑖𝑐 𝑅𝑒𝑝𝑜𝑠: %8\n👥 𝐹𝑜𝑙𝑙𝑜𝑤𝑒𝑟𝑠: %9\n➡️ 𝐹𝑜𝑙𝑙𝑜𝑤𝑖𝑛𝑔: %10`
    }
};

module.exports.onStart = async function ({ message, args, getLang }) {
    try {
        if (!args[0]) return message.reply(getLang("missing"));

        const username = args[0];

        const res = await axios.get(`https://api.popcat.xyz/v2/github/${encodeURIComponent(username)}`);
        const data = res.data;

        if (!data || data.message === "Not Found") return message.reply(getLang("notFound"));

        const reply = getLang("result",
            data.name || "𝑁/𝐴",
            data.login || "𝑁/𝐴",
            data.bio || "𝑁/𝐴",
            data.company || "𝑁/𝐴",
            data.location || "𝑁/𝐴",
            data.html_url || "𝑁/𝐴",
            data.created_at ? new Date(data.created_at).toLocaleDateString() : "𝑁/𝐴",
            data.public_repos || 0,
            data.followers || 0,
            data.following || 0
        );

        await message.reply(reply);
    } catch (error) {
        console.error("𝐺𝑖𝑡𝑃𝑟𝑜𝑓𝑖𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply(getLang("notFound"));
    }
};
