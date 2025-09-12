const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports.config = {
    name: "fakechat",
    aliases: ["chatedit", "fchat"],
    version: "1.4",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑓𝑎𝑘𝑒 𝑀𝑒𝑠𝑠𝑒𝑛𝑔𝑒𝑟 𝑠𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑎𝑘𝑒 𝑀𝑒𝑠𝑠𝑒𝑛𝑔𝑒𝑟 𝑠𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡 𝑤𝑖𝑡ℎ 𝑈𝐼𝐷/𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}fakechat <@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑈𝐼𝐷> - <𝑡𝑒𝑥𝑡1> - [𝑡𝑒𝑥𝑡2] - [𝑚𝑜𝑑𝑒=𝑑𝑎𝑟𝑘]\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}fakechat @𝑚𝑒𝑛𝑡𝑖𝑜𝑛 - 𝐻𝑒𝑙𝑙𝑜 - 𝐻𝑜𝑤 𝑎𝑟𝑒 𝑦𝑜𝑢? - 𝑑𝑎𝑟𝑘\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}fakechat 123456789 - 𝐻𝑖 𝑡ℎ𝑒𝑟𝑒! - 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑎 𝑡𝑒𝑠𝑡 - 𝑙𝑖𝑔ℎ𝑡\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}fakechat @𝑓𝑟𝑖𝑒𝑛𝑑 - 𝐺𝑜𝑜𝑑 𝑚𝑜𝑟𝑛𝑖𝑛𝑔! - 𝑑𝑎𝑟𝑘"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "https": ""
    }
};

module.exports.onStart = async function({ args, message, event, api, usersData }) {
    try {
        if (args.length < 2) {
            return message.reply("⚠️ 𝑈𝑠𝑎𝑔𝑒:\n{p}fakechat <@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑈𝐼𝐷> - <𝑡𝑒𝑥𝑡1> - [𝑡𝑒𝑥𝑡2] - [𝑚𝑜𝑑𝑒]\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}fakechat @𝑚𝑒𝑛𝑡𝑖𝑜𝑛 - 𝐻𝑒𝑙𝑙𝑜 - 𝐻𝑜𝑤 𝑎𝑟𝑒 𝑦𝑜𝑢? - 𝑑𝑎𝑟𝑘");
        }

        const input = args.join(" ").split("-").map(i => i.trim());
        let [target, text1, text2 = "", modeRaw = "light"] = input;

        // Get UID from mention or raw input
        let uid;
        if (Object.keys(event.mentions).length > 0) {
            uid = Object.keys(event.mentions)[0];
        } else if (/^\d{6,}$/.test(target)) {
            uid = target;
        } else {
            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑈𝐼𝐷 𝑜𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛.");
        }

        // Fetch user name from Facebook API
        let name = "𝑈𝑠𝑒𝑟";
        try {
            const userInfo = await api.getUserInfo(uid);
            name = userInfo[uid]?.name || name;
        } catch (e) {
            // fallback to "User"
        }

        const mode = modeRaw.toLowerCase() === "dark" ? "dark" : "light";

        // 💸 Check and deduct 50 coins
        const userData = await usersData.get(event.senderID);
        const balance = userData.money || 0;
        
        if (balance < 50) {
            return message.reply("❌ 𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 50 𝑐𝑜𝑖𝑛𝑠 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
        }
        
        await usersData.set(event.senderID, {
            money: balance - 50
        });

        // Prepare API
        const apiURL = `https://fchat-5pni.onrender.com/fakechat?uid=${encodeURIComponent(uid)}&name=${encodeURIComponent(name)}&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&mode=${mode}`;

        const cacheDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const cachePath = path.join(cacheDir, `fchat_${event.senderID}_${Date.now()}.png`);

        const file = fs.createWriteStream(cachePath);
        
        https.get(apiURL, (res) => {
            if (res.statusCode !== 200) {
                throw new Error(`𝐴𝑃𝐼 𝑟𝑒𝑡𝑢𝑟𝑛𝑒𝑑 𝑠𝑡𝑎𝑡𝑢𝑠 ${res.statusCode}`);
            }
            
            res.pipe(file);
            
            file.on("finish", () => {
                file.close(() => {
                    message.reply({
                        body: `🎭 𝐹𝑎𝑘𝑒 𝐶ℎ𝑎𝑡 𝐶𝑟𝑒𝑎𝑡𝑒𝑑\n👤 𝑁𝑎𝑚𝑒: ${name}\n💬 𝑇𝑒𝑥𝑡1: ${text1}${text2 ? `\n💬 𝑇𝑒𝑥𝑡2: ${text2}` : ""}\n🎨 𝑀𝑜𝑑𝑒: ${mode.toUpperCase()}\n💸 -50 𝑐𝑜𝑖𝑛𝑠`,
                        attachment: fs.createReadStream(cachePath)
                    }, () => {
                        if (fs.existsSync(cachePath)) {
                            fs.unlinkSync(cachePath);
                        }
                    });
                });
            });
            
        }).on("error", (err) => {
            if (fs.existsSync(cachePath)) {
                fs.unlinkSync(cachePath);
            }
            console.error("𝐻𝑇𝑇𝑃𝑆 𝐸𝑟𝑟𝑜𝑟:", err);
            message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑓𝑎𝑘𝑒 𝑐ℎ𝑎𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        });

    } catch (error) {
        console.error("𝐹𝑎𝑘𝑒𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
