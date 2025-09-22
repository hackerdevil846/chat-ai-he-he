const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const axios = require("axios");

module.exports = {
  config: {
    name: "inappropriatefilter",
    aliases: ["contentfilter", "badwordfilter"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "protection",
    shortDescription: {
      en: "🛡️ 𝐴𝑢𝑡𝑜-𝑑𝑒𝑡𝑒𝑐𝑡𝑠 𝑖𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑒𝑡𝑒𝑐𝑡𝑠 𝑖𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑤𝑜𝑟𝑑𝑠 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑𝑠 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠"
    },
    guide: {
      en: "{p}inappropriatefilter on/off"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "https": ""
    }
};

const imageLinks = [
    "https://i.imgur.com/B6G3NlF.jpeg",
    "https://i.imgur.com/T7RtKlp.gif",
    "https://i.imgur.com/BmGxEFs.gif",
    "https://i.imgur.com/MEdpECT.jpeg",
    "https://i.imgur.com/KU8N4Ca.jpeg",
    "https://i.imgur.com/roBS6oX.gif",
    "https://i.imgur.com/SkfGapy.jpeg",
    "https://i.imgur.com/GGQv16z.jpeg",
    "https://i.imgur.com/VAf5Eue.gif",
    "https://i.imgur.com/ZZpapGi.jpeg",
    "https://i.imgur.com/4LvXywY.jpeg",
    "https://i.imgur.com/NZ5iyCh.jpeg",
    "https://i.imgur.com/BkrKZ8b.jpeg",
    "https://i.imgur.com/Yf1LRak.jpeg",
    "https://i.imgur.com/1fsJf6B.jpeg",
    "https://i.imgur.com/MR2h7jw.jpeg",
    "https://i.imgur.com/K9fFzgm.jpeg",
    "https://i.imgur.com/Se05IOn.jpeg",
    "https://i.imgur.com/h1Yhryc.jpeg",
    "https://i.imgur.com/sUgF4oQ.jpeg",
    "https://i.imgur.com/8oHuIf8.jpeg",
    "https://i.imgur.com/fiH5dUv.jpeg",
    "https://i.imgur.com/FSKnHZt.jpeg",
    "https://i.imgur.com/80YYI12.jpeg",
    "https://i.imgur.com/ibd1j8n.jpeg",
    "https://i.imgur.com/J8vbW7x.jpeg",
    "https://i.imgur.com/fOmuOKl.jpeg",
    "https://i.imgur.com/qDwypw6.jpeg",
    "https://i.imgur.com/9dVyEEe.gif",
    "https://i.imgur.com/d3yM7FX.jpeg",
    "https://i.imgur.com/JToFUJo.jpeg",
    "https://i.imgur.com/aJ5sbvo.jpeg",
    "https://i.imgur.com/09qesDj.gif",
    "https://i.imgur.com/HES8mee.jpeg",
    "https://i.imgur.com/ovETysm.jpeg",
    "https://i.imgur.com/mpCMAYQ.jpeg",
    "https://i.imgur.com/iQV82Jq.jpeg",
    "https://i.imgur.com/qkM2t0l.jpeg",
    "https://i.imgur.com/VAf5Eue.gif"
];

const warningMessages = [
    "𝐵𝑜𝑛𝑑ℎ𝑢😭 𝑏ℎ𝑎𝑙𝑜 ℎ𝑜𝑦𝑒 𝑗𝑎!😞",
    "𝐵𝑜𝑠𝑒 𝑗𝑎 𝑏ℎ𝑎𝑖🥲 𝑙𝑜𝑗𝑗𝑎 𝑘𝑜𝑟!🫣",
    "𝐵ℎ𝑎𝑖 𝑒𝑡𝑎 𝑘𝑖 𝑏𝑜𝑙𝑙𝑖!😓 𝑒𝑘𝑡𝑢 𝑠ℎ𝑎𝑛𝑡𝑜 ℎ𝑜🙏",
    "𝑇𝑜𝑘𝑒 𝑘𝑖 𝑒𝑠𝑜𝑏 𝑠ℎ𝑒𝑘ℎ𝑎𝑦 𝑘𝑒𝑢?😠 𝑑𝑜𝑦𝑎 𝑘𝑜𝑟𝑒 𝑡ℎ𝑎𝑚𝑜🙏",
    "𝐵ℎ𝑎𝑙𝑜 𝑘𝑜𝑡ℎ𝑎 𝑏𝑜𝑙 🙃 𝑛𝑜𝑦𝑡𝑜 𝑏𝑙𝑜𝑐𝑘 𝑘𝑜𝑟𝑏𝑜🚫",
    "𝐵ℎ𝑎𝑖 𝑝𝑙𝑖𝑧 𝑒𝑠𝑜𝑏 𝑏𝑎𝑑 𝑑𝑒𝑜😭 𝑠𝑜𝑚𝑚𝑜𝑛 𝑟𝑎𝑘ℎ𝑜😞",
    "𝑇𝑜𝑘𝑒 𝑛𝑖𝑦𝑒 𝑚𝑎𝑦𝑎 𝑙𝑎𝑔𝑒 𝑟𝑒 𝑏ℎ𝑎𝑖🥺 𝑏ℎ𝑜𝑑𝑟𝑜 𝑟𝑎𝑘ℎ𝑜🥲",
    "𝐷𝑜𝑠𝑡𝑜, 𝑒𝑠𝑜𝑏 𝑏𝑜𝑙𝑎 𝑙𝑎𝑔𝑒?😐 𝑒𝑘𝑡𝑢 𝑏ℎ𝑜𝑑𝑟𝑜𝑡𝑎 𝑠ℎ𝑖𝑘ℎ𝑜🧠",
    "𝑇𝑢𝑖 𝑘𝑖 𝑟𝑖𝑦𝑒𝑙 𝑙𝑎𝑖𝑓𝑒𝑜 𝑒𝑚𝑜𝑛?😑",
    "𝐵𝑎ℎ! 𝑉𝑜𝑐𝑎𝑏𝑢𝑙𝑎𝑟𝑦 𝟭𝟴+ 𝑐ℎ𝑎𝑟𝑎 𝑘ℎ𝑎𝑙𝑖?🤦",
    "𝐷𝑜𝑦𝑎 𝑘𝑜𝑟𝑒 𝑒𝑘𝑡𝑢 𝑏ℎ𝑜𝑑𝑟𝑜 ℎ𝑜𝑜🙏 𝑎𝑚𝑖 𝑘𝑜𝑠𝑡ℎ𝑜 𝑝𝑎𝑖😢"
];

const downloadedImages = [];
let lastSent = null;

module.exports.onStart = async function({ message, args, globalData }) {
    try {
        const key = "inappropriatefilter_enabled";
        const subCmd = args[0]?.toLowerCase();

        if (!subCmd) {
            const status = globalData[key] === true ? "🟢 𝑂𝑁" : "🔴 𝑂𝐹𝐹";
            return message.reply(`🔐 𝐼𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝐶𝑜𝑛𝑡𝑒𝑛𝑡 𝐹𝑖𝑙𝑡𝑒𝑟 𝑀𝑜𝑑𝑒 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦: ${status}`);
        }

        if (subCmd === "on") {
            globalData[key] = true;
            return message.reply("✅ 𝐼𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑑𝑒𝑡𝑒𝑐𝑡𝑖𝑜𝑛 𝑖𝑠 𝑛𝑜𝑤 𝑂𝑁.");
        }

        if (subCmd === "off") {
            globalData[key] = false;
            return message.reply("❌ 𝐼𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑑𝑒𝑡𝑒𝑐𝑡𝑖𝑜𝑛 𝑖𝑠 𝑛𝑜𝑤 𝑂𝐹𝐹.");
        }

        return message.reply("⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒. 𝑈𝑠𝑒: {𝑝}inappropriatefilter on/off");

    } catch (error) {
        console.error("𝐹𝑖𝑙𝑡𝑒𝑟 𝑂𝑛𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
};

module.exports.onChat = async function({ event, message, globalData }) {
    try {
        if (globalData["inappropriatefilter_enabled"] !== true) return;
        if (!event.body) return;

        const badWords = [
            "fuck", "fuk", "f*ck", "phuck", "phuk", "fawk",
            "sex", "s3x", "s ex", "seggs", "sxx", "sx",
            "cum", "cumm", "masturbate", "mastubate", "masterbate",
            "ma5turbate", "mastabate", "dick", "dik", "dyke", "d!ck", "d1ck",
            "boobs", "boob", "b00bs", "bo0bs", "pussy", "pusy", "pussee", "puszi",
            "vagina", "vajina", "vaginaa", "v@gin@", "vajenaa", "penis", "p3nis",
            "pns", "pénis", "nipple", "nippl", "chod", "chud", "choda", "chudi",
            "chodon", "gud", "gudmara", "gudmaar", "bokachoda", "gandu", "gando",
            "bokachudi", "jewra", "joray", "dhan", "dhon", "vodai", "vodar", "bira",
            "biral", "kutta", "baccha", "shuyor", "bal", "shawa", "heda", "lawra",
            "putki", "pukki", "mara", "magi", "khanki", "bessha", "nunu", "tuntuni",
            "bang", "loda", "lora", "boner", "horny",
            "চোদ", "চুদ", "চুদা", "চুদি", "গুদের", "গুদ", "যোনি", "যৌন", "বাঁড়া",
            "ভোদা", "ভোদ", "ফাক", "ধন", "স্তন", "মাস্টারবেট", "মাল", "ভোদার", "দুধ",
            "কাম", "ঝার", "হস্তমৈথুন", "সেক্স", "চুষ"
        ];

        const normalize = str => str.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
        const text = normalize(event.body);

        const matched = badWords.some(word =>
            text.includes(word.replace(/[^a-zA-Zঅ-ৣ]/g, ""))
        );

        if (!matched) return;

        const cacheFolder = path.join(__dirname, "cache/inappropriatefilter");
        if (!fs.existsSync(cacheFolder)) {
            fs.mkdirSync(cacheFolder, { recursive: true });
        }

        for (let url of imageLinks) {
            const fileName = path.basename(url);
            const fullPath = path.join(cacheFolder, fileName);
            
            if (!fs.existsSync(fullPath)) {
                try {
                    const response = await axios.get(url, { responseType: "arraybuffer" });
                    await fs.writeFileSync(fullPath, Buffer.from(response.data));
                } catch (error) {
                    console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ${url}:`, error);
                    continue;
                }
            }
            
            if (!downloadedImages.includes(fullPath)) {
                downloadedImages.push(fullPath);
            }
        }

        const available = downloadedImages.filter(img => img !== lastSent && fs.existsSync(img));
        if (available.length === 0) return;

        const selected = available[Math.floor(Math.random() * available.length)];
        lastSent = selected;

        const warning = warningMessages[Math.floor(Math.random() * warningMessages.length)];

        await message.reply({
            body: warning,
            attachment: fs.createReadStream(selected)
        });

    } catch (error) {
        console.error("𝐹𝑖𝑙𝑡𝑒𝑟 𝑂𝑛𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};
