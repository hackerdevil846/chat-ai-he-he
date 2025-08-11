module.exports.config = {
	name: "fact",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝒇𝒂𝒄𝒕𝒔 𝒋𝒂𝒏𝒂𝒏",
	commandCategory: "𝑭𝒖𝒏",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const axios = global.nodemodule["axios"];
	const res = await axios.get(`https://api.popcat.xyz/fact`);
	const fact = res.data.fact;
	return api.sendMessage(`𝑻𝒖𝒎𝒊 𝒋𝒂𝒏𝒐? ✨\n\n${fact}`, event.threadID, event.messageID);
}
