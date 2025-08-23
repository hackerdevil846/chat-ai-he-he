module.exports.config = {
    name: "anifact",
    version: "1.0.2",
    hasPermission: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 (updated by Manus)",
    description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝒂𝒏𝒊𝒎e 𝒇𝒂𝒄𝒕𝒔 𝒘𝒊𝒕𝒉 𝒊𝒎𝒂𝒈𝒆𝒔",
    category: "𝒓𝒂𝒏𝒅𝒐𝒎-𝒊𝒎𝒈",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    try {
        const axios = require('axios');
        const fs = require("fs-extra");
        const path = require("path");
        
        const response = await axios.get('https://nekos.best/api/v2/neko');
        const imageUrl = response.data.results[0].url;
        const artistName = response.data.results[0].artist_name;
        const artistHref = response.data.results[0].artist_href;

        const imagePath = path.join(__dirname, 'cache', `anime_fact_${event.senderID}.png`);
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
        
        api.sendMessage({
            body: `🦄 𝑨𝒏𝒊𝒎𝒆 𝑭𝒂𝒄𝒕 𝒘𝒊𝒕𝒉 𝒊𝒎𝒂𝒈𝒆:\nArtist: ${artistName}\nSource: ${artistHref}`,
            attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
        
    } catch (error) {
        console.error(error);
        api.sendMessage("🔴 𝑬𝒓𝒓𝒐𝒓: 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒇𝒆𝒕𝒄𝒉 𝒂𝒏𝒊𝒎𝒆 𝒅𝒂𝒕𝒂 𝒐𝒓 𝒊𝒎𝒂𝒈𝒆", event.threadID, event.messageID);
    }
}

