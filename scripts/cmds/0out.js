module.exports.config = {
    name: "out",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "𝑩𝒐𝒕 𝒌𝒆 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "Admin",
    usages: "out [id]",
    cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
    try {
        if (!args[0]) {
            // Send emotional leaving message
            await api.sendMessage(
                `🥲 𝑨𝒎𝒊 𝒕𝒐𝒅𝒆𝒓 𝒔𝒖𝒌𝒉 𝒅𝒆𝒘𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒂𝒔𝒄𝒉𝒊𝒍𝒂𝒎...\n😞 𝑲𝒊𝒏𝒕𝒖 𝒕𝒐𝒓𝒂 𝒂𝒎𝒂𝒓 𝒋𝒐𝒈𝒈𝒐 𝒏𝒂...`,
                event.threadID
            );
            
            // Wait 2 seconds before leaving
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Leave current group
            return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        }
        
        if (!isNaN(args[0])) {
            // Leave specified group directly
            return api.removeUserFromGroup(api.getCurrentUserID(), args[0]);
        }
    } catch (error) {
        console.log("𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒐𝒖𝒕 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:", error);
    }
}
