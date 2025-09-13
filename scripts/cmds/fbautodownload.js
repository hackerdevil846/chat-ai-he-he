const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports.config = {
    name: "fbautodownload",
    aliases: ["fbdl", "facebookdl"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑠ℎ𝑎𝑟𝑒𝑑 𝑙𝑖𝑛𝑘𝑠"
    },
    longDescription: {
        en: "✨ 𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑠ℎ𝑎𝑟𝑒𝑑 𝑙𝑖𝑛𝑘𝑠"
    },
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑠𝑒𝑛𝑑 𝑎 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑛𝑘"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message }) {
    return message.reply(
        `🎭 | 𝐸𝑖 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑑𝑖𝑟𝑒𝑐𝑡𝑙𝑦 𝑢𝑠𝑒 𝑘𝑜𝑟𝑡𝑒 ℎ𝑜𝑏𝑒 𝑛𝑎!\n✦ 𝐽𝑢𝑠𝑡 𝑒𝑘𝑡𝑎 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑛𝑘 𝑝𝑎𝑡ℎ𝑎𝑜, 𝑎𝑟 𝑎𝑚𝑖 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑘𝑜𝑟𝑒 𝑝𝑎𝑡ℎ𝑎𝑖 𝑑𝑖𝑏𝑜 ✨`
    );
};

module.exports.onChat = async function({ message, event }) {
    if (event.type !== "message" || !event.body) return;
    
    const fbRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/(share|reel|watch)\/.+/i;
    const fbRegex2 = /^(https?:\/\/)?(www\.)?fb\.watch\/.+/i;
    
    if (!fbRegex.test(event.body) && !fbRegex2.test(event.body)) return;
    
    try {
        await message.reply("🔄 | 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑠𝑢𝑟𝑢 ℎ𝑜𝑐𝑐ℎ𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...", event.threadID, event.messageID);
        
        // Try multiple download methods
        let videoUrl;
        
        // Method 1: Try using Facebook's internal API
        try {
            const apiResponse = await axios.get(`https://fb-api.0x87.repl.co/fb?url=${encodeURIComponent(event.body)}`);
            if (apiResponse.data && apiResponse.data.hd) {
                videoUrl = apiResponse.data.hd;
            } else if (apiResponse.data && apiResponse.data.sd) {
                videoUrl = apiResponse.data.sd;
            }
        } catch (e) {
            console.log("API method failed, trying alternative");
        }
        
        // Method 2: Try alternative API
        if (!videoUrl) {
            try {
                const api2Response = await axios.get(`https://apis-samir.onrender.com/fbdl?url=${encodeURIComponent(event.body)}`);
                if (api2Response.data && api2Response.data.videoUrl) {
                    videoUrl = api2Response.data.videoUrl;
                }
            } catch (e) {
                console.log("Alternative API method failed");
            }
        }
        
        if (!videoUrl) {
            return message.reply(
                "❌ | 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑎𝑏𝑙𝑒 𝑘𝑜𝑛𝑜 𝑣𝑖𝑑𝑒𝑜 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑝𝑎𝑜𝑤𝑎 𝑗𝑎𝑖𝑛𝑖!",
                event.threadID,
                event.messageID
            );
        }
        
        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        
        const tempPath = path.join(os.tmpdir(), `fb_video_${Date.now()}.mp4`);
        const writer = fs.createWriteStream(tempPath);
        
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
        
        // Check file size
        const stats = fs.statSync(tempPath);
        const fileSize = stats.size;
        
        if (fileSize > 25000000) { // 25MB limit
            fs.unlinkSync(tempPath);
            return message.reply(
                "❌ | 𝑉𝑖𝑑𝑒𝑜 𝑠𝑖𝑧𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒 (𝑚𝑜𝑟𝑒 𝑡ℎ𝑎𝑛 25𝑀𝐵)!",
                event.threadID,
                event.messageID
            );
        }
        
        await message.reply(
            {
                body: `✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑦𝑜𝑢𝑟 𝑣𝑖𝑑𝑒𝑜!\n🎥 𝑄𝑢𝑎𝑙𝑖𝑡𝑦: 𝐻𝐷`,
                attachment: fs.createReadStream(tempPath)
            },
            event.threadID
        );
        
        fs.unlinkSync(tempPath);
        
    } catch (error) {
        console.error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply(
            `❌ | 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑!\n⚠ 𝐸𝑟𝑟𝑜𝑟: ${error.message}`,
            event.threadID,
            event.messageID
        );
    }
};
