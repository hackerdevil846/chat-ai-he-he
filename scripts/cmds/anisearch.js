const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "anisearch",
    aliases: ["aniedit", "anitoks", "tiktokani"],
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    version: "2.1",
    countDown: 15,
    role: 0,
    shortDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑇𝑖𝑘𝑇𝑜𝑘 𝑎𝑛𝑖𝑚𝑒 𝑒𝑑𝑖𝑡 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑓𝑒𝑡𝑐ℎ 𝑇𝑖𝑘𝑇𝑜𝑘 𝑎𝑛𝑖𝑚𝑒 𝑒𝑑𝑖𝑡 𝑣𝑖𝑑𝑒𝑜𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑞𝑢𝑒𝑟𝑦"
    },
    category: "𝑚𝑒𝑑𝑖𝑎",
    guide: {
        en: "{p}anisearch [𝑞𝑢𝑒𝑟𝑦]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function ({ api, event, args }) {
    try {
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        // Set loading reaction
        api.setMessageReaction("🕐", event.messageID, () => {}, true);

        // No query check
        if (!args[0]) {
            return api.sendMessage("🔍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 (𝑒.𝑔., 𝑛𝑎𝑟𝑢𝑡𝑜 𝑓𝑖𝑔ℎ𝑡)", event.threadID, event.messageID);
        }

        const query = encodeURIComponent(args.join(' ') + " anime edit");
        const apiUrl = `https://mahi-apis.onrender.com/api/tiktok?search=${query}`;

        // Fetch videos
        const response = await axios.get(apiUrl);
        const videos = response.data.data;

        if (!videos || videos.length === 0) {
            return api.sendMessage("❌ 𝑁𝑜 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑞𝑢𝑒𝑟𝑦", event.threadID, event.messageID);
        }

        // Pick random video
        const videoData = videos[Math.floor(Math.random() * videos.length)];
        const videoUrl = videoData.video;
        const title = videoData.title || "𝑈𝑛𝑡𝑖𝑡𝑙𝑒𝑑";

        // Cache setup
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        const tempPath = path.join(cacheDir, `anitok_${Date.now()}.mp4`);

        // Download video
        const writer = fs.createWriteStream(tempPath);
        const videoResponse = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream'
        });
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Success reaction
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        // Send video
        await api.sendMessage({
            body: `🎬 𝑇𝑖𝑡𝑙𝑒: ${title}\n🔍 𝑄𝑢𝑒𝑟𝑦: ${args.join(' ')}\n\n𝐸𝑛𝑗𝑜𝑦 𝑡ℎ𝑒 𝑎𝑛𝑖𝑚𝑒 𝑒𝑑𝑖𝑡! ✨`,
            attachment: fs.createReadStream(tempPath)
        }, event.threadID, event.messageID);

        // Clean up
        fs.unlinkSync(tempPath);

    } catch (error) {
        console.error("𝐴𝑛𝑖𝑠𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        api.sendMessage("⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
};
