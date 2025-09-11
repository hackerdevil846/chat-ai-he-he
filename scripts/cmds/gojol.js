const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "gojol",
    aliases: ["gazal", "islamicsong"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "islamic",
    shortDescription: {
        en: "𝑃𝑙𝑎𝑦 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑔𝑎𝑧𝑎𝑙𝑠 🎶"
    },
    longDescription: {
        en: "𝑃𝑙𝑎𝑦 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑔𝑎𝑧𝑎𝑙𝑠 𝑎𝑛𝑑 𝑛𝑎𝑎𝑡𝑠"
    },
    guide: {
        en: "{p}gojol"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        // Check dependencies
        if (!fs.existsSync || !axios) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        // Ensure cache directory exists
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Islamic gazal messages
        const messages = [
            "🎧 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑔𝑎𝑧𝑎𝑙\n𝑈𝑠𝑒 ℎ𝑒𝑎𝑑𝑝ℎ𝑜𝑛𝑒𝑠 𝑓𝑜𝑟 𝑏𝑒𝑡𝑡𝑒𝑟 𝑒𝑥𝑝𝑒𝑟𝑖𝑒𝑛𝑐𝑒 🌸",
            "🕋 𝑁𝑎𝑎𝑡 𝑠ℎ𝑎𝑟𝑖𝑓\n𝑈𝑠𝑒 ℎ𝑒𝑎𝑑𝑝ℎ𝑜𝑛𝑒𝑠 𝑓𝑜𝑟 𝑏𝑒𝑠𝑡 𝑠𝑜𝑢𝑛𝑑 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 💖",
            "📿 𝐷𝑖𝑣𝑖𝑛𝑒 𝑚𝑒𝑙𝑜𝑑𝑖𝑒𝑠\n𝐻𝑒𝑎𝑑𝑝ℎ𝑜𝑛𝑒𝑠 𝑟𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑒𝑑 𝑓𝑜𝑟 𝑖𝑚𝑚𝑒𝑟𝑠𝑖𝑣𝑒 𝑒𝑥𝑝𝑒𝑟𝑖𝑒𝑛𝑐𝑒 ✨",
            "🌙 𝑆𝑝𝑖𝑟𝑖𝑡𝑢𝑎𝑙 𝑔𝑎𝑧𝑎𝑙𝑠\n𝑈𝑠𝑒 ℎ𝑒𝑎𝑑𝑝ℎ𝑜𝑛𝑒𝑠 𝑓𝑜𝑟 𝑐𝑙𝑒𝑎𝑟 𝑎𝑢𝑑𝑖𝑜 🤲"
        ];

        // Audio file URLs (Islamic gazals)
        const audioUrls = [
            "https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN",
            "https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e",
            "https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo",
            "https://drive.google.com/uc?id=1yHB48N_wPJnU5uV18KMZOLNqo5NE7L4W",
            "https://drive.google.com/uc?id=1xpwuubDL_ebjKJhujb-Ee-FikUF92oF6",
            "https://drive.google.com/uc?id=1yK0A3lyIJoPRp6g3UjNrC31n0yLfc1Ht",
            "https://drive.google.com/uc?id=1xrwhHLhsdKVAn_9umLfUysCt0S2v5QWe",
            "https://drive.google.com/uc?id=1yKwewV-oYbn57lGnlACykSD-yt8fOsfT",
            "https://drive.google.com/uc?id=1xulSi_qyJA47sF9rC9BUIPyBqh47t9Ls",
            "https://drive.google.com/uc?id=1y-PIYYziv-m8QRwmMBWCTl2wzuH8NpYJ",
            "https://drive.google.com/uc?id=1y0wV96m-notKVHnuNdF8xVCWiockSiME",
            "https://drive.google.com/uc?id=1xxMQnp-9-4BoLrGpReps93JQv4k8WUOP"
        ];

        // Pick random message & audio
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];

        // Unique filename
        const audioPath = path.join(cacheDir, `gazal_${Date.now()}.mp3`);

        // Notify user
        await message.reply("📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑔𝑎𝑧𝑎𝑙, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡... ⏳", event.threadID);

        // Download audio
        const response = await axios({
            method: 'GET',
            url: randomAudioUrl,
            responseType: 'stream',
            timeout: 60000
        });

        // Save file
        const writer = fs.createWriteStream(audioPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send gazal with message
        await message.reply({
            body: randomMessage,
            attachment: fs.createReadStream(audioPath)
        }, event.threadID);

        // Clean up
        try {
            fs.unlinkSync(audioPath);
        } catch (cleanupErr) {
            console.error('❌ 𝐹𝑖𝑙𝑒 𝑐𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:', cleanupErr);
        }

    } catch (error) {
        console.error('❌ 𝐺𝑎𝑧𝑎𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
        await message.reply("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑔𝑎𝑧𝑎𝑙. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID);
    }
};
