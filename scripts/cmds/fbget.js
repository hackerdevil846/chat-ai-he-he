module.exports.config = {
    name: "fbget",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒆𝒓 𝒗𝒊𝒅𝒆𝒐 𝒂𝒖𝒅𝒊𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
    commandCategory: "𝑼𝒕𝒊𝒍𝒊𝒕𝒊𝒆𝒔",
    usages: "𝒂𝒖𝒅𝒊𝒐/𝒗𝒊𝒅𝒆𝒐 [𝒍𝒊𝒏𝒌]",
    cooldowns: 0
};

module.exports.run = async function ({api, event, args})  {
    const axios = global.nodemodule['axios'];  
    const fs = global.nodemodule["fs-extra"];
    
    // Check if there's an attachment
    if (!event.attachments || !event.attachments[0] || !event.attachments[0].playableUrl) {
        return api.sendMessage("𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒕𝒂𝒄𝒉 𝒌𝒐𝒓𝒆𝒏 𝒏𝒂𝒊 😞", event.threadID, event.messageID);
    }

    try { 
        if (args[0] === 'audio') {
            api.sendMessage("𝑨𝒖𝒅𝒊𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒔𝒖𝒓𝒖 𝒉𝒐𝒄𝒄𝒉𝒆... 🔊", event.threadID, async (err, info) => {
                setTimeout(() => api.unsendMessage(info.messageID), 20000);
                
                const path = __dirname + `/cache/audio_${Date.now()}.mp3`;
                const response = await axios.get(event.attachments[0].playableUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
                
                api.sendMessage({
                    body: "𝑨𝒖𝒅𝒊𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒔𝒐𝒎𝒂𝒑𝒕𝒐 𝒉𝒐𝒍𝒆 𝒈𝒆𝒍𝒐! 🎧",
                    attachment: fs.createReadStream(path)
                }, event.threadID, () => fs.unlinkSync(path), event.messageID);
            });
        } 
        else if (args[0] === 'video') {
            api.sendMessage("𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒔𝒖𝒓𝒖 𝒉𝒐𝒄𝒄𝒉𝒆... 📥", event.threadID, async (err, info) => {
                setTimeout(() => api.unsendMessage(info.messageID), 20000);
                
                const path = __dirname + `/cache/video_${Date.now()}.mp4`;
                const response = await axios.get(event.attachments[0].playableUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
                
                api.sendMessage({
                    body: "𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒔𝒐𝒎𝒂𝒑𝒕𝒐 𝒉𝒐𝒍𝒆 𝒈𝒆𝒍𝒐! 🎬",
                    attachment: fs.createReadStream(path)
                }, event.threadID, () => fs.unlinkSync(path), event.messageID);
            });
        } 
        else {
            api.sendMessage("𝑽𝒖𝒍 𝒍𝒆𝒌𝒉𝒆𝒏: 𝒇𝒃𝒈𝒆𝒕 𝒂𝒖𝒅𝒊𝒐 𝒂𝒕𝒉𝒂𝒃𝒂 𝒇𝒃𝒈𝒆𝒕 𝒗𝒊𝒅𝒆𝒐\n𝑨𝒓 𝒇𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒆𝒓 𝒗𝒊𝒅𝒆𝒐 𝒕𝒂 𝒂𝒕𝒕𝒂𝒄𝒉 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
        }
    } 
    catch (error) {
        console.error(error);
        api.sendMessage("𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒄𝒄𝒉𝒆, 𝒅𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒂𝒂𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏 😞", event.threadID, event.messageID);
    }
}
