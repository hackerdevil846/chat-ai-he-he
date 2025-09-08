const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "islam",
    aliases: ["islamic", "quran"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑖𝑠𝑙𝑎𝑚𝑖𝑐",
    shortDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑣𝑖𝑑𝑒𝑜 𝑤𝑖𝑡ℎ 𝑎 𝑔𝑟𝑒𝑒𝑡𝑖𝑛𝑔 𝑎𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑓 𝑏𝑙𝑒𝑠𝑠𝑖𝑛𝑔."
    },
    guide: {
        en: "{p}islam"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function ({ message }) {
    try {
        const islamDesign = `🕌┏━━━━━━━━━━━━━━━━━━┓🕌
📖  𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑚𝑜𝑑𝑢𝑙𝑒 𝑖𝑠 𝑟𝑒𝑎𝑑𝑦!
📖  𝑇𝑦𝑝𝑒 '𝑖𝑠𝑙𝑎𝑚' 𝑡𝑜 𝑔𝑒𝑡 𝐼𝑠𝑙𝑎𝑚𝑖𝑐
📖  𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑣𝑖𝑑𝑒𝑜𝑠
🕌┗━━━━━━━━━━━━━━━━━━┛🕌`;
        await message.reply(islamDesign);
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑛𝑆𝑡𝑎𝑟𝑡:", error);
    }
};

module.exports.onChat = async function ({ event, message }) {
    try {
        if (event.body && event.body.toLowerCase() === "islam") {
            await this.handleIslamicVideo({ message, event });
        }
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑛𝐶ℎ𝑎𝑡:", error);
    }
};

module.exports.handleIslamicVideo = async function ({ message, event }) {
    try {
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const processingDesign = `📥┏━━━━━━━━━━━━━━━━━━┓📥
🕋  𝐺𝑒𝑡𝑡𝑖𝑛𝑔 𝑎𝑛 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜
🕋  𝑓𝑜𝑟 𝑦𝑜𝑢...
🕋  𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡
📥┗━━━━━━━━━━━━━━━━━━┛📥`;
        
        const processingMsg = await message.reply(processingDesign);

        const greetings = [
            `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢 𝐴𝑙𝑎𝑖𝑘𝑢𝑚! 🖤💫\n📖  𝐵𝑟𝑜𝑡ℎ𝑒𝑟𝑠 𝑎𝑛𝑑 𝑠𝑖𝑠𝑡𝑒𝑟𝑠 - 𝐼 𝑏𝑟𝑜𝑢𝑔ℎ𝑡 𝑦𝑜𝑢\n📖  𝐻𝑜𝑙𝑦 𝑄𝑢𝑟'𝑎𝑛 𝑟𝑒𝑐𝑖𝑡𝑎𝑡𝑖𝑜𝑛\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`,
            `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢 𝐴𝑙𝑎𝑖𝑘𝑢𝑚 𝑊𝑎𝑅𝑎ℎ𝑚𝑎𝑡𝑢𝑙𝑙𝑎ℎ𝑖 𝑊𝑎𝐵𝑎𝑟𝑎𝑘𝑎𝑡𝑢ℎ𝑢\n📖  𝑆𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝑦𝑜𝑢\n📖  𝑤𝑖𝑡ℎ 𝐴𝑙𝑙𝑎ℎ'𝑠 𝑚𝑒𝑟𝑐𝑦\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`,
            `🕌┏━━━━━━━━━━━━━━━━━━┓🕌\n\n📖  𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢 𝐴𝑙𝑎𝑖𝑘𝑢𝑚 𝑏𝑟𝑜𝑡ℎ𝑒𝑟𝑠 𝑎𝑛𝑑 𝑠𝑖𝑠𝑡𝑒𝑟𝑠!\n📖  𝐴 𝑔𝑖𝑓𝑡 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑠𝑝𝑖𝑟𝑖𝑡𝑢𝑎𝑙 𝑛𝑜𝑢𝑟𝑖𝑠ℎ𝑚𝑒𝑛𝑡\n📖  𝑡ℎ𝑖𝑠 𝑣𝑖𝑑𝑒𝑜 𝑖𝑠 𝑓𝑜𝑟 𝑦𝑜𝑢\n\n🕌┗━━━━━━━━━━━━━━━━━━┛🕌`
        ];
        
        const islamicVideos = [
            "https://drive.usercontent.google.com/download?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH&export=download",
            "https://drive.usercontent.google.com/download?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O&export=download",
            "https://drive.usercontent.google.com/download?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW&export=download",
            "https://drive.usercontent.google.com/download?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD&export=download",
            "https://drive.usercontent.google.com/download?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4&export=download",
            "https://drive.usercontent.google.com/download?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprG&export=download",
            "https://drive.usercontent.google.com/download?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA&export=download",
            "https://drive.usercontent.google.com/download?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441&export=download",
            "https://drive.usercontent.google.com/download?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8&export=download",
            "https://drive.usercontent.google.com/download?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo&export=download"
        ];

        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        const randomVideo = islamicVideos[Math.floor(Math.random() * islamicVideos.length)];
        
        const videoPath = path.join(cacheDir, `islamic_${Date.now()}.mp4`);
        
        const response = await axios({
            method: 'GET',
            url: randomVideo,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const finalDesign = `✅┏━━━━━━━━━━━━━━━━━━┓✅\n\n📖  𝐻𝑜𝑙𝑦 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜\n📖  𝑠𝑒𝑛𝑡 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n📖  𝑀𝑎𝑦 𝐴𝑙𝑙𝑎ℎ 𝑖𝑛𝑐𝑟𝑒𝑎𝑠𝑒 𝑦𝑜𝑢𝑟 𝑓𝑎𝑖𝑡ℎ\n\n✅┗━━━━━━━━━━━━━━━━━━┛✅`;
        
        await message.reply({
            body: `${randomGreeting}\n\n${finalDesign}`,
            attachment: fs.createReadStream(videoPath)
        });

        fs.unlinkSync(videoPath);
        
        try {
            if (processingMsg && processingMsg.messageID) {
                await message.unsend(processingMsg.messageID);
            }
        } catch (e) {
            console.log("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", e);
        }

    } catch (error) {
        const errorDesign = `❌┏━━━━━━━━━━━━━━━━━━┓❌\n\n⚠️  𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜𝑠 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑟𝑖𝑔ℎ𝑡 𝑛𝑜𝑤\n⚠️  𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟\n⚠️  𝑀𝑎𝑦 𝐴𝑙𝑙𝑎ℎ 𝑔𝑖𝑣𝑒 𝑦𝑜𝑢 𝑡ℎ𝑒 𝑏𝑒𝑠𝑡 𝑟𝑒𝑤𝑎𝑟𝑑\n\n❌┗━━━━━━━━━━━━━━━━━━┛❌`;
        
        console.error("𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑉𝑖𝑑𝑒𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply(errorDesign);
    }
};
