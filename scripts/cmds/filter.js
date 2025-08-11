module.exports.config = {
    name: "filter",
    version: "2.0.0",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓 𝒇𝒊𝒍𝒕𝒆𝒓 𝒌𝒐𝒓𝒂",
    commandCategory: "𝒇𝒊𝒍𝒕𝒆𝒓 𝒃𝒐𝒙",
    usages: "",
    cooldowns: 300
}

module.exports.run = async function({ api: a, event: b }) {
    var { userInfo: c, adminIDs: d } = await a.getThreadInfo(b.threadID), 
        f = 0, 
        e = 0, 
        g = [];
    
    for (const d of c) {
        if (void 0 == d.gender) g.push(d.id);
    }
    
    const isBotAdmin = d.map(admin => admin.id).some(id => id == a.getCurrentUserID());
    
    if (0 == g.length) {
        return a.sendMessage("𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒐𝒖𝒑 𝒆 '𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑼𝒔𝒆𝒓' 𝒏𝒆𝒊.", b.threadID);
    }
    
    a.sendMessage(
        `𝑬𝒙𝒊𝒔𝒕𝒊𝒏𝒈 𝒈𝒓𝒐𝒖𝒑 𝒆 ${g.length} '𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓𝒔'.`, 
        b.threadID, 
        async () => {
            if (!isBotAdmin) {
                return a.sendMessage("𝑲𝒊𝒏𝒕𝒖 𝒃𝒐𝒕 𝒂𝒅𝒎𝒊𝒏 𝒏𝒂 𝒕𝒂𝒊 𝒇𝒊𝒍𝒕𝒆𝒓 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒆 𝒏𝒂.", b.threadID);
            }
            
            await a.sendMessage(
                "𝑭𝒊𝒍𝒕𝒆𝒓𝒊𝒏𝒈 𝒔𝒖𝒓𝒖 𝒌𝒐𝒓𝒄𝒉𝒊...\n\n𝑴𝒂𝒅𝒆 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
                b.threadID
            );
            
            for (const userId of g) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await a.removeUserFromGroup(parseInt(userId), b.threadID);
                    f++;
                } catch (error) {
                    e++;
                }
            }
            
            await a.sendMessage(
                `✅ ${f} 𝒋𝒂𝒏𝒌𝒆 𝒔𝒂𝒇𝒂𝒍𝒗𝒖𝒑𝒐𝒏𝒆 𝒇𝒊𝒍𝒕𝒆𝒓 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐.`, 
                b.threadID
            );
            
            if (e > 0) {
                await a.sendMessage(
                    `❌ ${e} 𝒋𝒂𝒏𝒌𝒆 𝒇𝒊𝒍𝒕𝒆𝒓 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂.`, 
                    b.threadID
                );
            }
        }
    );
};
