const { downloadVideo } = require("priyansh-all-dl");
const axios = require("axios");
const fs = require("fs-extra");
const tempy = require("tempy");

module.exports.config = {
    name: "fbautodownload",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ 𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐯𝐢𝐝𝐞𝐨𝐬 𝐟𝐫𝐨𝐦 𝐬𝐡𝐚𝐫𝐞𝐝 𝐥𝐢𝐧𝐤𝐬",
    commandCategory: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
    usages: "[fb_video_url]",
    cooldowns: 5,
    dependencies: {
        "priyansh-all-dl": "",
        "axios": "",
        "fs-extra": "",
        "tempy": ""
    }
};

module.exports.run = async function({ api, event }) {
    return api.sendMessage(`🎭 | 𝐓𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐝𝐨𝐞𝐬𝐧'𝐭 𝐧𝐞𝐞𝐝 𝐭𝐨 𝐛𝐞 𝐮𝐬𝐞𝐝 𝐝𝐢𝐫𝐞𝐜𝐭𝐥𝐲!\n✦ 𝐉𝐮𝐬𝐭 𝐬𝐞𝐧𝐝 𝐚 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐯𝐢𝐝𝐞𝐨 𝐥𝐢𝐧𝐤 𝐚𝐧𝐝 𝐈'𝐥𝐥 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐢𝐭 𝐟𝐨𝐫 𝐲𝐨𝐮! ✨`, event.threadID, event.messageID);
};

module.exports.handleEvent = async function({ api, event }) {
    if (event.type !== "message" || !event.body) return;

    const fbRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/(share|reel)\/.+/i;
    if (!fbRegex.test(event.body)) return;

    try {
        api.sendMessage("🔄 | 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐯𝐢𝐝𝐞𝐨...", event.threadID, event.messageID);

        const videoInfo = await downloadVideo(event.body);
        const qualityPriority = ["720p", "480p", "360p", "240p"];
        const videoUrl = qualityPriority.find(q => videoInfo[q] && videoInfo[q] !== "Not found");

        if (!videoUrl) {
            return api.sendMessage("❌ | 𝐍𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐚𝐛𝐥𝐞 𝐯𝐢𝐝𝐞𝐨 𝐪𝐮𝐚𝐥𝐢𝐭𝐲 𝐟𝐨𝐮𝐧𝐝", event.threadID, event.messageID);
        }

        const response = await axios.get(videoInfo[videoUrl], { 
            responseType: "stream",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const tempPath = tempy.file({ extension: "mp4" });
        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        await api.sendMessage({
            body: `✨ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐯𝐢𝐝𝐞𝐨!\n✦ 𝐐𝐮𝐚𝐥𝐢𝐭𝐲: ${videoUrl}`,
            attachment: fs.createReadStream(tempPath)
        }, event.threadID);

        fs.unlinkSync(tempPath);

    } catch (error) {
        console.error("Download Error:", error);
        api.sendMessage(`❌ | 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐟𝐚𝐢𝐥𝐞𝐝!\n✦ 𝐄𝐫𝐫𝐨𝐫: ${error.message}`, event.threadID, event.messageID);
    }
};
