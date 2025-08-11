module.exports.config = {
  name: "leave",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝒃𝒐𝒕 𝒌𝒆 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒌𝒐𝒓𝒂",
  commandCategory: "𝒂𝒅𝒎𝒊𝒏",
  usages: "𝒐𝒖𝒕 [𝒕𝒉𝒓𝒆𝒂𝒅𝑰𝑫]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
    const tid = args.join(" ");
    
    if (!tid) {
        // Leave current group with farewell message
        const threadInfo = await api.getThreadInfo(event.threadID);
        const threadName = threadInfo.threadName || "𝒆𝒊 𝒈𝒓𝒖𝒑";
        
        await api.sendMessage({
            body: `🤖 𝒃𝒐𝒕 𝒆𝒊 𝒈𝒓𝒖𝒑 𝒄𝒉𝒐𝒍𝒆 𝒈𝒆𝒍𝒐: ${threadName}\n𝒂𝒑𝒏𝒂𝒅𝒆𝒓 𝒌𝒂𝒋 𝒔𝒆𝒔𝒉 𝒌𝒐𝒓𝒆 😢`,
        }, event.threadID);
        
        // Delay before leaving to ensure message sends
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    } 
    else {
        // Leave specified group
        try {
            const threadInfo = await api.getThreadInfo(tid);
            const threadName = threadInfo.threadName || tid;
            
            api.removeUserFromGroup(api.getCurrentUserID(), tid);
            return api.sendMessage({
                body: `✅ 𝒃𝒐𝒕 𝒆𝒊 𝒈𝒓𝒖𝒑 𝒄𝒉𝒐𝒍𝒆 𝒈𝒆𝒍𝒐: ${threadName} (${tid})`
            }, event.threadID);
        } 
        catch (error) {
            return api.sendMessage({
                body: `❌ 𝒆𝒓𝒓𝒐𝒓: ${error.message}\n𝒑𝒍𝒆𝒂𝒔𝒆 𝒄𝒉𝒆𝒄𝒌 𝒕𝒉𝒓𝒆𝒂𝒅 𝑰𝑫 𝒂𝒏𝒅 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏`
            }, event.threadID);
        }
    }
};
