const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "kanna",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🌸 𝑲𝒂𝒏𝒏𝒂 𝒄𝒉𝒂𝒏 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒖𝒏",
    category: "🎀 𝑹𝒂𝒏𝒅𝒐𝒎-𝑰𝒎𝒂𝒈𝒆𝒔",
    usages: "kanna",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {},
    "bn": {}
};

module.exports.onLoad = function() {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
};

module.exports.onStart = async function({ api, event }) {
    try {
        // Get random Kanna image data
        const response = await axios.get('https://apikanna.khoahoang2.repl.co');
        const imageUrl = response.data.data;
        const count = response.data.count;
        const ext = path.extname(imageUrl) || ".jpg";

        // Prepare local cache path
        const cachePath = path.join(__dirname, "cache", `kanna_${Date.now()}${ext}`);
        const writer = fs.createWriteStream(cachePath);

        // Download image as stream
        const imageResponse = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "stream"
        });
        imageResponse.data.pipe(writer);

        // Wait until image is fully downloaded
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        // Send image to thread
        api.sendMessage({
            body: `🌸 Kanna chan er image! <3\n🌸 Total available: ${count} images`,
            attachment: fs.createReadStream(cachePath)
        }, event.threadID, () => fs.unlinkSync(cachePath), event.messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage("❌ Kanna er image pathate parchi nai! Punar chesta korun.", event.threadID, event.messageID);
    }
};
