module.exports.config = {
    name: "out",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "𝑩𝒐𝒕 𝒌𝒆 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒌𝒐𝒓𝒖𝒏",
    category: "Admin",
    usages: "out [id]",
    cooldowns: 10
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        if (!args[0]) {
            await api.sendMessage(
                `🥲 𝑨𝒎𝒊 𝒕𝒐𝒅𝒆𝒓 𝒔𝒖𝒌𝒉 𝒅𝒆𝒘𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒂𝒔𝒄𝒉𝒊𝒍𝒂𝒎...\n😞 𝑲𝒊𝒏𝒕𝒖 𝒕𝒐𝒓𝒂 𝒂𝒎𝒂𝒓 𝒋𝒐𝒈𝒈𝒐 𝒏𝒂...`,
                event.threadID
            );
            await new Promise(resolve => setTimeout(resolve, 2000));
            return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        }

        if (!isNaN(args[0])) {
            return api.removeUserFromGroup(api.getCurrentUserID(), args[0]);
        }

        await api.sendMessage("❌ 𝑩𝒂𝒓𝒐 𝒈𝒓𝒐𝒖𝒑 ID 𝒅𝒊𝒂 𝒏𝒂...", event.threadID);
    } catch (error) {
        console.log("𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒐𝒖𝒕 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:", error);
    }
}
