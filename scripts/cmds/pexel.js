const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Cache for storing video data
const videoCache = new Map();

module.exports.config = {
    name: "pexels",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑷𝒆𝒙𝒆𝒍𝒔 𝒕𝒉𝒆𝒌𝒆 𝒇𝒓𝒆𝒆 𝒇𝒐𝒕𝒐 𝒃𝒂 𝒗𝒊𝒅𝒆𝒐 𝒌𝒉𝒖𝒏𝒋𝒖𝒏",
    category: "media",
    usages: "pexels <query> | pexels video <query>",
    cooldowns: 3,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onStart = async function ({ api, event, args }) {
    const isVideo = args[0] && args[0].toLowerCase() === "video";
    const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
    
    if (!query) {
        return api.sendMessage("🔎 𝑺𝒆𝒂𝒓𝒄𝒉 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒅𝒂𝒐 𝒃𝒉𝒂𝒊", event.threadID);
    }

    // Your Pexels API Key
    const API_KEY = "ce3yCvqQIaFKTiRuMUhqjFtViXJmtsbCKG9yAnEzngjWto4MtFiqzwNW";
    
    const endpoint = isVideo
        ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10`
        : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`;

    try {
        const res = await axios.get(endpoint, {
            headers: { Authorization: API_KEY }
        });

        if (isVideo) {
            const videos = res.data.videos;
            if (!videos.length) {
                return api.sendMessage("❌ 𝑲𝒐𝒏𝒐 𝒗𝒊𝒅𝒆𝒐 𝒑𝒂𝒘𝒂 𝒈𝒆𝒍𝒐 𝒏𝒂𝒉𝒊", event.threadID);
            }

            let msg = "🎬 𝑷𝒆𝒙𝒆𝒍𝒔 𝑽𝒊𝒅𝒆𝒐 𝑹𝒆𝒔𝒖𝒍𝒕𝒔:\n\n";
            videos.forEach((vid, i) => {
                msg += `${i + 1}. 📽️ ${vid.user.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏"} [${vid.duration}s]\n`;
            });
            msg += "\n👉 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 1–10 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏";

            api.sendMessage(msg, event.threadID, (err, info) => {
                videoCache.set(info.messageID, {
                    type: "video",
                    data: videos,
                    author: event.senderID
                });
                // Cache expires after 1 minute
                setTimeout(() => videoCache.delete(info.messageID), 60000);
            });
        } else {
            const photos = res.data.photos;
            if (!photos.length) {
                return api.sendMessage("❌ 𝑲𝒐𝒏𝒐 𝒇𝒐𝒕𝒐 𝒑𝒂𝒘𝒂 𝒈𝒆𝒍𝒐 𝒏𝒂𝒉𝒊", event.threadID);
            }

            const attachments = [];
            const cleanFiles = [];

            for (const [i, photo] of photos.entries()) {
                try {
                    const imageUrl = photo.src.large2x || photo.src.large;
                    const ext = path.extname(imageUrl.split('?')[0]) || '.jpg';
                    const filePath = path.join(__dirname, 'cache', `pexels_${Date.now()}_${i}${ext}`);
                    
                    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                    fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
                    
                    attachments.push(fs.createReadStream(filePath));
                    cleanFiles.push(filePath);
                } catch (error) {
                    console.error(`Error downloading image ${i+1}:`, error);
                }
            }

            if (attachments.length === 0) {
                return api.sendMessage("❌ 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒚𝒆𝒄𝒉𝒆", event.threadID);
            }

            api.sendMessage({
                body: `📷 𝐓𝐨𝐩 ${attachments.length} 𝐏𝐡𝐨𝐭𝐨𝐬 𝐟𝐨𝐫 "${query}"\n✨ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐬: ${photos.slice(0, attachments.length).map(p => p.photographer).join(', ')}`,
                attachment: attachments
            }, event.threadID, () => {
                cleanFiles.forEach(file => {
                    if (fs.existsSync(file)) fs.unlinkSync(file);
                });
            });
        }
    } catch (error) {
        console.error("Pexels API Error:", error.response?.data || error.message);
        api.sendMessage("❌ 𝑨𝑷𝑰 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒑𝒖𝒏𝒐𝒓𝒊𝒃𝒂𝒓 𝒌𝒐𝒓𝒖𝒏", event.threadID);
    }
};

module.exports.handleReply = async function ({ api, event }) {
    const { messageReply } = event;
    const cachedData = videoCache.get(messageReply.messageID);
    
    if (!cachedData || event.senderID !== cachedData.author) return;
    
    const index = parseInt(event.body);
    if (isNaN(index) || index < 1 || index > cachedData.data.length) {
        return api.sendMessage("❗ 𝑺𝒂𝒕𝒊𝒌 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒂𝒐 (1–10)", event.threadID);
    }

    const video = cachedData.data[index - 1];
    const videoFile = video.video_files.find(v => v.quality === "hd") || 
                      video.video_files.find(v => v.quality === "sd");
    
    if (!videoFile) {
        return api.sendMessage("❌ 𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓", event.threadID);
    }

    try {
        const ext = path.extname(videoFile.link.split('?')[0]) || '.mp4';
        const filePath = path.join(__dirname, 'cache', `pexels_video_${Date.now()}${ext}`);
        
        const response = await axios.get(videoFile.link, { 
            responseType: 'arraybuffer',
            headers: { Authorization: "ce3yCvqQIaFKTiRuMUhqjFtViXJmtsbCKG9yAnEzngjWto4MtFiqzwNW" }
        });
        
        fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
        
        api.sendMessage({
            body: `🎥 ${video.user.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏"} | ${video.duration}𝒔`,
            attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error("Video Download Error:", error);
        api.sendMessage("❌ 𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓", event.threadID);
    }
};
