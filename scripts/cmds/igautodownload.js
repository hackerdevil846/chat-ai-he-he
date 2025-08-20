const { downloadVideo } = require('priyansh-all-dl');
const axios = require("axios");
const fs = require("fs-extra");
const tempy = require('tempy');

module.exports.config = {
    name: "igautodownload",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🟦 | 𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐯𝐢𝐝𝐞𝐨𝐬",
    commandCategory: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
    usages: "[instagram-link]",
    cooldowns: 5,
    dependencies: {
        "priyansh-all-dl": "",
        "axios": "",
        "fs-extra": "",
        "tempy": ""
    }
};

module.exports.run = async function({ api, event }) {
    return api.sendMessage(`✨ | 𝐓𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐝𝐨𝐞𝐬𝐧'𝐭 𝐧𝐞𝐞𝐝 𝐭𝐨 𝐛𝐞 𝐩𝐫𝐞𝐟𝐢𝐱𝐞𝐝!\n𝐉𝐮𝐬𝐭 𝐬𝐞𝐧𝐝 𝐚𝐧 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐯𝐢𝐝𝐞𝐨 𝐥𝐢𝐧𝐤 𝐢𝐧 𝐭𝐡𝐞 𝐜𝐡𝐚𝐭 💙`, event.threadID, event.messageID);
};

module.exports.handleEvent = async function({ api, event }) {
    if (event.type !== "message" || !event.body) return;

    const instaRegex = /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p)\/([^\/\s?]+)/gi;
    const instaMatch = event.body.match(instaRegex);
    
    if (!instaMatch) return;

    for (const url of instaMatch) {
        try {
            api.sendMessage("⬇️ | 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐯𝐢𝐝𝐞𝐨...", event.threadID, event.messageID);

            const videoInfo = await downloadVideo(url);
            const hdLink = videoInfo.video;
            const response = await axios.get(hdLink, { responseType: 'stream' });
            const tempFilePath = tempy.file({ extension: 'mp4' });
            
            const writer = fs.createWriteStream(tempFilePath);
            response.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            await api.sendMessage({
                body: "✅ | 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐲𝐨𝐮𝐫 𝐯𝐢𝐝𝐞𝐨!\n𝐂𝐫𝐞𝐝𝐢𝐭𝐬: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
                attachment: fs.createReadStream(tempFilePath)
            }, event.threadID);

            fs.unlinkSync(tempFilePath);
            
        } catch (error) {
            console.error('Error:', error);
            api.sendMessage("❌ | 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐟𝐚𝐢𝐥𝐞𝐝! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.", event.threadID, event.messageID);
        }
    }
};
