module.exports.config = {
	name: "setname",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑪𝒉𝒂𝒏𝒈𝒆 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆𝒔 𝒊𝒏 𝒈𝒓𝒐𝒖𝒑 𝒄𝒉𝒂𝒕𝒔",
	commandCategory: "𝑩𝒐𝒙 𝑪𝒉𝒂𝒕",
	usages: "[𝒏𝒆𝒘 𝒏𝒂𝒎𝒆] 𝒐𝒓 [𝒏𝒆𝒘 𝒏𝒂𝒎𝒆] @𝒎𝒆𝒏𝒕𝒊𝒐𝒏",
	cooldowns: 3
};

module.exports.run = async function({ api, event, args, Threads }) {
    try {
        // Check if name argument is provided
        if (args.length === 0) {
            return api.sendMessage("ℹ️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒏𝒆𝒘 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆!", event.threadID);
        }

        const name = args.join(" ");
        const mention = Object.keys(event.mentions)[0];
        
        // Change own nickname
        if (!mention) {
            await api.changeNickname(name, event.threadID, event.senderID);
            return api.sendMessage(`✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒚𝒐𝒖𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒕𝒐: ${name}`, event.threadID);
        }
        
        // Change mentioned user's nickname
        const newName = name.replace(event.mentions[mention], "").trim();
        if (!newName) {
            return api.sendMessage("ℹ️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒂𝒇𝒕𝒆𝒓 𝒕𝒉𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏", event.threadID);
        }
        
        await api.changeNickname(newName, event.threadID, mention);
        
        // Get user name for confirmation message
        const userInfo = await api.getUserInfo(mention);
        const userName = userInfo[mention]?.name || "𝒕𝒉𝒆 𝒖𝒔𝒆𝒓";
        
        return api.sendMessage(`✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 ${userName}'𝒔 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒕𝒐: ${newName}`, event.threadID);
        
    } catch (error) {
        console.error("❌ 𝑬𝒓𝒓𝒐𝒓:", error);
        api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒄𝒉𝒂𝒏𝒈𝒊𝒏𝒈 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID);
    }
};
