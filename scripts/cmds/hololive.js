const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "hololive",
    aliases: ["vtuber", "holo"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝐻𝑜𝑙𝑜𝑙𝑖𝑣𝑒 𝑉𝑇𝑢𝑏𝑒𝑟 𝑃ℎ𝑜𝑡𝑜 𝐺𝑎𝑙𝑙𝑒𝑟𝑦"
    },
    longDescription: {
        en: "𝐹𝑒𝑡𝑐ℎ𝑒𝑠 𝐻𝑜𝑙𝑜𝑙𝑖𝑣𝑒 𝑉𝑇𝑢𝑏𝑒𝑟 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑎𝑛 𝐴𝑃𝐼"
    },
    guide: {
        en: "{p}hololive [𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟_𝑛𝑎𝑚𝑒]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args, event }) {
    try {
        const { threadID, messageID } = event;

        const characterList = {
            rushia: "🌸 𝑈𝑟𝑢ℎ𝑎 𝑅𝑢𝑠ℎ𝑖𝑎 (烏羽らすえ)",
            pekora: "🐰 𝑈𝑠𝑎𝑑𝑎 𝑃𝑒𝑘𝑜𝑟𝑎 (兎田ぺこら)", 
            coco: "🐉 𝐾𝑖𝑟𝑦𝑢 𝐶𝑜𝑐𝑜 (桐生ココ)",
            gura: "🐋 𝐺𝑎𝑤𝑟 𝐺𝑢𝑟𝑎 (がうる・ぐら)",
            marine: "🏴‍☠️ 𝐻𝑜𝑢𝑠ℎ𝑜𝑢 𝑀𝑎𝑟𝑖𝑛 (宝鐘マリン)"
        };

        if (!args[0]) {
            const availableCharacters = Object.entries(characterList)
                .map(([key, value]) => `• ${key} - ${value}`)
                .join('\n');
            
            return message.reply(
                `🎌 𝗛𝗢𝗟𝗢𝗟𝗜𝗩𝗘 𝗩𝗧𝗨𝗕𝗘𝗥 𝗚𝗔𝗟𝗟𝗘𝗥𝗬\n\n` +
                `𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿𝘀:\n${availableCharacters}\n\n` +
                `𝗨𝘀𝗮𝗴𝗲: ${this.config.name} [𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟_𝑛𝑎𝑚𝑒]`
            );
        }

        const character = args[0].toLowerCase();
        if (!characterList[character]) {
            return message.reply(
                `❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟!\n` +
                `𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒: ${Object.keys(characterList).join(', ')}`
            );
        }

        const res = await axios.get(`https://api.randvtuber-saikidesu.ml?character=${character}`);
        const ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
        const path = __dirname + `/cache/${character}_${Date.now()}.${ext}`;

        const imageBuffer = (await axios.get(res.data.url, { responseType: "arraybuffer" })).data;
        await fs.writeFileSync(path, Buffer.from(imageBuffer, "utf-8"));

        await message.reply({
            body: `🎀 𝐶ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟: ${characterList[character]}\n` +
                  `📦 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑖𝑚𝑎𝑔𝑒𝑠: ${res.data.count}\n` +
                  `✨ 𝐶𝑟𝑒𝑑𝑖𝑡𝑠: ${res.data.author || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"}`,
            attachment: fs.createReadStream(path)
        });

        fs.unlinkSync(path);
        
    } catch (err) {
        console.error("𝐻𝑜𝑙𝑜𝑙𝑖𝑣𝑒 𝐸𝑟𝑟𝑜𝑟:", err);
        message.reply(
            "❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒!\n" +
            "𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟"
        );
    }
};
