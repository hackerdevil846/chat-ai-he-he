module.exports.config = {
	name: "reload",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒐𝒕 𝒌𝒎𝒂𝒏𝒅 𝒑𝒖𝒏𝒂𝒓𝒂𝒓𝒎𝒃𝒉𝒐 𝒌𝒐𝒓𝒃𝒆",
	commandCategory: "𝑷𝒆𝒏𝒈𝒖𝒊𝒏",
	usages: "reload + somoy",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const permission = global.config.GOD;
	if (!permission.includes(event.senderID)) return api.sendMessage(`⚠️𝑨𝒑𝒏𝒂𝒓 𝒆𝒊 𝒌𝒎𝒂𝒏𝒅 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒔𝒐𝒎𝒑𝒂𝒕𝒕𝒐 𝒏𝒆𝒊!`, event.threadID, event.messageID);
	
	const { threadID, messageID } = event;
	var time = args.join(" ");
	var rstime = "68";
	
	if (!time) rstime = "69";
	else rstime = time;
	
	api.sendMessage(`[𝑩𝒐𝒕] => 𝑩𝒐𝒕 𝒑𝒖𝒏𝒂𝒓𝒂𝒓𝒎𝒃𝒉𝒐 𝒉𝒐𝒃𝒆 ${rstime} 𝒔𝒆𝒌𝒆𝒏𝒅 𝒑𝒐𝒓!`, threadID);
	
	return setTimeout(() => { 
		api.sendMessage("[𝑩𝒐𝒕] => 𝑩𝒐𝒕 𝒑𝒖𝒏𝒂𝒓𝒂𝒓𝒎𝒃𝒉𝒐 𝒌𝒐𝒓𝒂 𝒉𝒐𝒄𝒄𝒉𝒆!", threadID, () => process.exit(1));
	}, rstime * 1000);
}
