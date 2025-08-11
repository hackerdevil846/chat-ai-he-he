const { downloadVideo } = require('priyansh-all-dl');
const axios = require("axios");
const fs = require("fs-extra");
const tempy = require('tempy');

module.exports.config = {
    name: "igautodownload",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑰𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 𝒗𝒊𝒅𝒆𝒐 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒆",
    commandCategory: "𝑼𝒕𝒊𝒍𝒊𝒕𝒚",
    usages: "[𝑰𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 𝒗𝒊𝒅𝒆𝒐 𝑼𝑹𝑳]",
    cooldowns: 5,
    dependencies: {
        "priyansh-all-dl": "latest",
        "axios": "0.21.1",
        "fs-extra": "10.0.0",
        "tempy": "0.4.0"
    }
};

module.exports.handleEvent = async function({ api, event }) {
    if (event.type === "message" && event.body) {
        const instaRegex = /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|share)\/[^\/\s?]+/gi;
        const instaMatch = event.body.match(instaRegex);
        
        if (instaMatch) {
            try {
                for (const url of instaMatch) {
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
                        attachment: fs.createReadStream(tempFilePath),
                        body: "𝑵𝒊𝒋𝒆𝒓 𝑰𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 𝒗𝒊𝒅𝒆𝒐 📥"
                    }, event.threadID);

                    fs.unlinkSync(tempFilePath);
                }
            } catch (error) {
                console.error('Error downloading Instagram video:', error);
                api.sendMessage("𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊 😢\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓", event.threadID);
            }
        }
    }
};

module.exports.run = async function ({ api, event }) {
    return api.sendMessage(
        `𝑰𝒔𝒔 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒌𝒆 𝒅𝒊𝒓𝒆𝒄𝒕 𝒄𝒉𝒂𝒍𝒂𝒏𝒐 𝒔𝒖𝒑𝒑𝒐𝒓𝒕 𝒏𝒆𝒊 😊\n𝑱𝒖𝒔𝒕 𝒔𝒆𝒏𝒅 𝑰𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 𝒍𝒊𝒏𝒌 𝒉𝒆𝒓𝒆!`,
        event.threadID,
        event.messageID
    );
};
