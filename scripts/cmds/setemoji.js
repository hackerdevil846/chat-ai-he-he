module.exports.config = {
    name: "setemoji",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑪𝒉𝒂𝒏𝒈𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆𝒎𝒐𝒋𝒊",
    commandCategory: "𝑮𝒓𝒐𝒖𝒑",
    usages: "𝒔𝒆𝒕𝒆𝒎𝒐𝒋𝒊 [𝒆𝒎𝒐𝒋𝒊]",
    cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    // Check if emoji is provided
    if (!args[0]) {
        return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂𝒏 𝒆𝒎𝒐𝒋𝒊 𝒕𝒐 𝒔𝒆𝒕!", threadID, messageID);
    }

    const emoji = args.join(" ");
    
    try {
        // Change group emoji
        await api.changeThreadEmoji(emoji, threadID);
        
        // Success message
        return api.sendMessage(`✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒕 𝒈𝒓𝒐𝒖𝒑 𝒆𝒎𝒐𝒋𝒊 𝒕𝒐: ${emoji}`, threadID, messageID);
    } catch (error) {
        console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒄𝒉𝒂𝒏𝒈𝒊𝒏𝒈 𝒆𝒎𝒐𝒋𝒊:", error);
        
        // Different error messages based on common issues
        if (error.message.includes("permission")) {
            return api.sendMessage("❌ 𝑰 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒆𝒎𝒐𝒋𝒊. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒂𝒌𝒆 𝒎𝒆 𝒂𝒅𝒎𝒊𝒏!", threadID, messageID);
        } else if (error.message.includes("invalid")) {
            return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒆𝒎𝒐𝒋𝒊! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒖𝒔𝒆 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒆𝒎𝒐𝒋𝒊.", threadID, messageID);
        } else {
            return api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒄𝒉𝒂𝒏𝒈𝒊𝒏𝒈 𝒆𝒎𝒐𝒋𝒊. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", threadID, messageID);
        }
    }
};
