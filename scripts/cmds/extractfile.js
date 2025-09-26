const fs = require('fs');

module.exports.config = {
    name: "extractfile",
    aliases: [],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐸𝑥𝑡𝑟𝑎𝑐𝑡 𝑓𝑖𝑙𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡𝑠"
    },
    longDescription: {
        en: "𝐸𝑥𝑡𝑟𝑎𝑐𝑡 𝑎𝑛𝑑 𝑣𝑖𝑒𝑤 𝑡ℎ𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡𝑠 𝑜𝑓 𝑎 𝑓𝑖𝑙𝑒"
    },
    category: "𝑜𝑤𝑛𝑒𝑟",
    guide: {
        en: "{p}extractfile <𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒>"
    },
    dependencies: {
        "fs": ""
    }
};

module.exports.onStart = async function ({ message, args, api, event }) {
    try {
        const permission = ["61571630409265"];
        if (!permission.includes(event.senderID)) {
            return message.reply("⩸__ ✨🦋 𝒀𝒐𝒖 𝒅𝒂𝒓𝒆 𝒕𝒐 𝒖𝒔𝒆 𝒕𝒉𝒊𝒔 𝒔𝒂𝒄𝒓𝒆𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅!? 💥\n\n⚠️ 𝒪𝓃𝓁𝓎 𝒕𝒉𝒆 𝒎𝒚𝒕𝒉, 𝒕𝒉𝒆 𝒍𝒆𝒈𝒆𝓃𝒅 — 🧧 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 🧧 — 𝒉𝒐𝓁𝒹𝓈 𝒕𝒉𝒆 𝓀𝑒𝓎 𝓉𝑜 𝓊𝓃𝓁𝑒𝒶𝓈𝒽 𝓉𝒽𝒾𝓈 𝓅𝑜𝓌𝑒𝓇~! 🗝️\n\n💢 𝓈𝓉𝒶𝓃𝒹 𝒹𝑜𝓌𝓃, 𝓂𝑜𝓇𝓉𝒶𝓁... 𝑜𝓇 𝒻𝒶𝒸𝑒 𝓉𝒽𝑒 𝒸𝓊𝓇𝓈𝑒 𝑜𝒻 𝓉𝒽𝑒 𝒻𝑜𝓇𝒷𝒾𝒹𝒹𝑒𝓃 𝒻𝒾𝓁𝑒 💀");
        }

        const fileName = args[0];
        if (!fileName) {
            return message.reply("🔰 𝑃𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑓𝑖𝑙𝑒 𝑛𝑎𝑚𝑒!");
        }

        const filePath = __dirname + `/${fileName}.js`;
        if (!fs.existsSync(filePath)) {
            return message.reply(`𝐹𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑: ${fileName}.𝑗𝑠`);
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        await message.reply({ body: fileContent });

    } catch (error) {
        console.error("𝐸𝑥𝑡𝑟𝑎𝑐𝑡𝐹𝑖𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑒𝑥𝑡𝑟𝑎𝑐𝑡 𝑓𝑖𝑙𝑒.");
    }
};
