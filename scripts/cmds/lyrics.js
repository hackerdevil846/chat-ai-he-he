const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "lyrics",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒂𝒏𝒆𝒓 𝒆𝒓 𝒍𝒚𝒓𝒊𝒄𝒔 𝒋𝒂𝒏𝒂𝒏",
    commandCategory: "𝑴𝒆𝒅𝒊𝒂",
    usages: "𝒍𝒚𝒓𝒊𝒄𝒔 [𝒈𝒂𝒏𝒆𝒓 𝒏𝒂𝒎]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    try {
        const songName = args.join(' ');
        if (!songName) {
            return api.sendMessage("𝑮𝒂𝒏𝒆𝒓 𝒆𝒓 𝒏𝒂𝒎 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏 🎵", event.threadID);
        }

        api.sendMessage(`🔍 "${songName}" 𝒆𝒓 𝒍𝒚𝒓𝒊𝒄𝒔 𝒌𝒉𝒖𝒏𝒄𝒉𝒊...`, event.threadID);

        // Fetch lyrics data
        const lyricsResponse = await axios.get(`https://ai.new911.repl.co/api/tools/lyrics?song=${encodeURIComponent(songName)}`);
        const lyricsData = lyricsResponse.data;
        
        // Download lyrics image
        const imageResponse = await axios.get(lyricsData.image, { responseType: 'arraybuffer' });
        const imagePath = __dirname + '/cache/lyrics.png';
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
        
        // Format lyrics text
        const formattedText = 
            `❏ 𝑪𝒓𝒆𝒅𝒊𝒕𝒔: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n\n` +
            `❏ 𝑮𝒂𝒏 𝒆𝒓 𝒏𝒂𝒎: ${lyricsData.title}\n` +
            `❏ 𝑮𝒐𝒍𝒐𝒌: ${lyricsData.artist}\n\n` +
            `❏ 𝑳𝒚𝒓𝒊𝒄𝒔:\n${lyricsData.lyrics}`;
        
        // Send results
        api.sendMessage({
            body: formattedText,
            attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => fs.unlinkSync(imagePath));
        
    } catch (error) {
        console.error("𝑳𝒚𝒓𝒊𝒄𝒔 𝒆𝒓𝒓𝒐𝒓:", error);
        api.sendMessage("⚠️ 𝑳𝒚𝒓𝒊𝒄𝒔 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂, 𝒑𝒖𝒏𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏 😢", event.threadID);
    }
};
