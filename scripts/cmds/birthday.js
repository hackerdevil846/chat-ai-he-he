const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports.config = {
    name: "bday",
    aliases: ["birthday", "countdown"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: {
        en: "𝑀𝑦 𝑏𝑖𝑟𝑡ℎ𝑑𝑎𝑦 𝑐𝑜𝑢𝑛𝑡𝑑𝑜𝑤𝑛"
    },
    longDescription: {
        en: "𝑆ℎ𝑜𝑤𝑠 𝑐𝑜𝑢𝑛𝑡𝑑𝑜𝑤𝑛 𝑡𝑜 𝑚𝑦 𝑏𝑖𝑟𝑡ℎ𝑑𝑎𝑦"
    },
    guide: {
        en: "{p}bday"
    },
    dependencies: {
        "axios": "",
        "request": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event }) {
    try {
        // Set target date to December 9, 2025 (next birthday)
        const targetDate = Date.parse("December 9, 2025 00:00:00");
        const now = Date.parse(new Date());
        const t = targetDate - now;

        if (t <= 0) {
            return api.sendMessage("🎉 𝑇𝑜𝑑𝑎𝑦 𝑖𝑠 𝑚𝑦 𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦! 𝑇ℎ𝑎𝑛𝑘 𝑦𝑜𝑢 𝑒𝑣𝑒𝑟𝑦𝑜𝑛𝑒! 🎂❤️", event.threadID, event.messageID);
        }

        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const days = Math.floor(t / (1000 * 60 * 60 * 24));

        const mathBoldItalic = text => {
            return text.replace(/[a-zA-Z]/g, char => {
                const code = char.charCodeAt(0);
                if (char >= 'A' && char <= 'Z') {
                    return String.fromCodePoint(0x1D468 + (code - 65));
                } else if (char >= 'a' && char <= 'z') {
                    return String.fromCodePoint(0x1D482 + (code - 97));
                }
                return char;
            });
        };

        const message = 
            `🎂 ${mathBoldItalic("My Birthday Countdown")} 🎂\n\n` +
            `📆 ${days} 𝑑𝑎𝑦𝑠\n` +
            `⏰ ${hours} ℎ𝑜𝑢𝑟𝑠\n` +
            `⏱️ ${minutes} 𝑚𝑖𝑛𝑢𝑡𝑒𝑠\n` +
            `⏲️ ${seconds} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠\n\n` +
            `❤️ ${mathBoldItalic("Thank you for the wishes!")} ❤️`;

        const callback = () => {
            api.sendMessage({
                body: message,
                attachment: fs.createReadStream(__dirname + "/cache/bday.png")
            }, event.threadID, () => {
                if (fs.existsSync(__dirname + "/cache/bday.png")) {
                    fs.unlinkSync(__dirname + "/cache/bday.png");
                }
            });
        };

        if (!fs.existsSync(__dirname + "/cache")) {
            fs.mkdirSync(__dirname + "/cache", { recursive: true });
        }

        // Use your Facebook profile picture link
        request(encodeURI(`https://www.facebook.com/share/1YBfDXHGtt/`))
            .pipe(fs.createWriteStream(__dirname + '/cache/bday.png'))
            .on('close', callback)
            .on('error', (err) => {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
                api.sendMessage(message, event.threadID, event.messageID);
            });

    } catch (error) {
        console.error("𝐵𝐷𝐴𝑌 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑏𝑖𝑟𝑡ℎ𝑑𝑎𝑦 𝑐𝑜𝑢𝑛𝑡𝑑𝑜𝑤𝑛", event.threadID, event.messageID);
    }
};
