module.exports.config = {
    name: "fbget",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒆𝒓 𝒗𝒊𝒅𝒆𝒐/𝒂𝒖𝒅𝒊𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 📥",
    category: "𝑼𝒕𝒊𝒍𝒊𝒕𝒊𝒆𝒔",
    usages: "[audio/video] [facebook video link]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    const axios = global.nodemodule['axios'];  
    const fs = global.nodemodule["fs-extra"];
    
    if (!event.attachments || !event.attachments[0] || !event.attachments[0].playableUrl) {
        return api.sendMessage("❌ 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒕𝒂𝒄𝒉 𝒌𝒐𝒓𝒆𝒏 𝒏𝒂𝒊! 𝑨𝒓 𝒌𝒐𝒏𝒐 𝒇𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒕𝒂𝒄𝒉 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
    }
    try { 
        const downloadType = args[0]?.toLowerCase();
        
        if (downloadType === 'audio') {
            const processingMsg = await api.sendMessage("🔊 𝑨𝒖𝒅𝒊𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒔𝒖𝒓𝒖 𝒉𝒐𝒄𝒄𝒉𝒆...", event.threadID);
            
            const path = __dirname + `/cache/audio_${event.senderID}.mp3`;
            const response = await axios.get(event.attachments[0].playableUrl, { 
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
                }
            });
            
            fs.writeFileSync(path, Buffer.from(response.data, "binary"));
            
            await api.sendMessage({
                body: `✅ 𝑨𝒖𝒅𝒊𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒔𝒐𝒎𝒑𝒕𝒐 𝒉𝒐𝒍𝒐! 🎧\n━━━━━━━━━━━━━━\n𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒅 𝑩𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
                attachment: fs.createReadStream(path)
            }, event.threadID);
            
            fs.unlinkSync(path);
            api.unsendMessage(processingMsg.messageID);
        } 
        else if (downloadType === 'video') {
            const processingMsg = await api.sendMessage("📥 𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒔𝒖𝒓𝒖 𝒉𝒐𝒄𝒄𝒉𝒆...", event.threadID);
            
            const path = __dirname + `/cache/video_${event.senderID}.mp4`;
            const response = await axios.get(event.attachments[0].playableUrl, { 
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
                }
            });
            
            fs.writeFileSync(path, Buffer.from(response.data, "binary"));
            
            await api.sendMessage({
                body: `✅ 𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒔𝒐𝒎𝒑𝒕𝒐 𝒉𝒐𝒍𝒐! 🎬\n━━━━━━━━━━━━━━\n𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒅 𝑩𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
                attachment: fs.createReadStream(path)
            }, event.threadID);
            
            fs.unlinkSync(path);
            api.unsendMessage(processingMsg.messageID);
        } 
        else {
            api.sendMessage(`📝 𝑼𝒔𝒂𝒈𝒆 𝑮𝒖𝒊𝒅𝒆:\n𝒇𝒃𝒈𝒆𝒕 audio - 𝒂𝒖𝒅𝒊𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆\n𝒇𝒃𝒈𝒆𝒕 video - 𝒗𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆\n\n⚠️ 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒕𝒂𝒄𝒉 𝒌𝒐𝒓𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒅𝒊𝒚𝒆 𝒌𝒂𝒋 𝒌𝒐𝒓𝒖𝒏`, event.threadID, event.messageID);
        }
    } 
    catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒄𝒄𝒉𝒆, 𝒅𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒂𝒂𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
    }
};
