const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "islamicvideo",
        aliases: ["islamvid", "quranvid", "muslimvideo"], // Changed aliases to avoid conflicts
        version: "1.1.1",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑖𝑠𝑙𝑎𝑚",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑣𝑖𝑑𝑒𝑜𝑠"
        },
        longDescription: {
            en: "𝑅𝑒𝑐𝑒𝑖𝑣𝑒 𝑟𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑜𝑟 𝑟𝑒𝑓𝑙𝑒𝑐𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{p}islamicvideo"
        },
        countDown: 15,
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            const videoLinks = [
                "https://drive.usercontent.google.com/download?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH",
                "https://drive.usercontent.google.com/download?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O",
                "https://drive.usercontent.google.com/download?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW",
                "https://drive.usercontent.google.com/download?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD",
                "https://drive.usercontent.google.com/download?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4",
                "https://drive.usercontent.google.com/download?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprD",
                "https://drive.usercontent.google.com/download?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA",
                "https://drive.usercontent.google.com/download?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441",
                "https://drive.usercontent.google.com/download?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8",
                "https://drive.usercontent.google.com/download?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo"
            ];

            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
            const videoPath = path.join(cacheDir, `islamic_${Date.now()}.mp4`);

            await message.reply("📥 | 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑐𝑜𝑛𝑡𝑒𝑛𝑡, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");

            const response = await axios({
                method: 'GET',
                url: randomVideo,
                responseType: 'stream',
                timeout: 120000
            });

            const writer = fs.createWriteStream(videoPath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            await message.reply({
                body: "✨ 𝑨𝒍𝒔𝒂𝒍𝒂𝒎𝒖 𝑨𝒍𝒂𝒊𝒌𝒖𝒎 𝑾𝒂 𝑹𝒂𝒉𝒎𝒂𝒕𝒖𝒍𝒍𝒂𝒉𝒊 𝑾𝒂 𝑩𝒂𝒓𝒂𝒌𝒂𝒕𝒖𝒉𝒖 ✨\n\n📿 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑎𝑛 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜 𝑓𝑜𝑟 𝑟𝑒𝑓𝑙𝑒𝑐𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛:\n\n🌙 𝑀𝑎𝑦 𝐴𝑙𝑙𝑎ℎ 𝑏𝑙𝑒𝑠𝑠 𝑦𝑜𝑢 𝑎𝑛𝑑 𝑔𝑢𝑖𝑑𝑒 𝑢𝑠 𝑎𝑙𝑙 𝑡𝑜 𝑡ℎ𝑒 𝑟𝑖𝑔ℎ𝑡 𝑝𝑎𝑡ℎ 🕋",
                attachment: fs.createReadStream(videoPath)
            });

            // Cleanup file after sending
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }

        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑖𝑠𝑙𝑎𝑚𝑖𝑐𝑣𝑖𝑑𝑒𝑜:", error);
            
            // Cleanup partial file if exists
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
            
            await message.reply("❌ | 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑐𝑜𝑛𝑡𝑒𝑛𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
