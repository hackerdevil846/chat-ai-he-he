module.exports.config = {
	name: "restart",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒐𝒕 𝒌𝒆 𝒑𝒖𝒏𝒂𝒓𝒂𝒃𝒂𝒓 𝒔𝒖𝒓𝒖 𝒌𝒂𝒓𝒂𝒏𝒐",
	commandCategory: "system",
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;
	return api.sendMessage(`[ ${global.config.BOTNAME} ] 𝑩𝒐𝒕 𝒑𝒖𝒏𝒂𝒓𝒂𝒃𝒂𝒓 𝒔𝒖𝒓𝒖 𝒉𝒐𝒄𝒄𝒉𝒆...`, threadID, () => process.exit(1));
}
