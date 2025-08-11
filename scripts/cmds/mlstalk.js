module.exports.config = {
	name: "mlstalk",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑴𝒐𝒃𝒂𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒑𝒍𝒂𝒚𝒆𝒓 𝒅𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒊𝒐𝒏 𝒅𝒆𝒌𝒉𝒂𝒏",
	usages: "[𝒊𝒅 | 𝒔𝒆𝒓𝒗𝒆𝒓]",
	commandCategory: "𝑮𝒂𝒎𝒆",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const axios = global.nodemodule["axios"];
	let text = args.join(" ");
	
	if (!text) {
		return api.sendMessage("𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒏𝒋𝒂 𝒊𝒅 𝒂𝒓 𝒔𝒆𝒓𝒗𝒆𝒓 𝒏𝒂𝒎 𝒅𝒆𝒘𝒂𝒓 𝒅𝒐𝒓𝒌𝒂𝒓 | 𝒖𝒔𝒂𝒈𝒆: 𝒎𝒍𝒔𝒕𝒂𝒍𝒌 12345 | 1234", event.threadID);
	}
	
	const text1 = text.substr(0, text.indexOf('|')).trim();
	const text2 = text.split("|").pop().trim();
	
	if (!text1 || !text2) {
		return api.sendMessage("𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒏𝒋𝒂 𝒊𝒅 𝒂𝒓 𝒔𝒆𝒓𝒗𝒆𝒓 𝒏𝒂𝒎 𝒕𝒉𝒊𝒌 𝒗𝒂𝒃𝒉𝒆 𝒅𝒆𝒘𝒂 𝒉𝒐𝒚𝒏𝒊 | 𝒖𝒔𝒂𝒈𝒆: 𝒎𝒍𝒔𝒕𝒂𝒍𝒌 12345 | 1234", event.threadID);
	}
	
	try {
		const res = await axios.get(`https://betabotz-api.herokuapp.com/api/stalk/ml?id=${text1}&server=${text2}&apikey=BetaBotz`);
		const playerName = res.data.result.userName;
		
		return api.sendMessage(`🎮 𝑴𝒐𝒃𝒂𝒊𝒍𝒆 𝑳𝒆𝒈𝒆𝒏𝒅𝒔 𝒑𝒍𝒂𝒚𝒆𝒓 𝒌𝒉𝒐𝒏𝒋𝒂𝒓 𝒏𝒂𝒎: ${playerName}`, event.threadID, event.messageID);
	} catch (error) {
		return api.sendMessage("𝒑𝒍𝒂𝒚𝒆𝒓 𝒌𝒉𝒖𝒏𝒋𝒂 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 | 𝒂𝒑𝒏𝒂𝒓 𝒅𝒆𝒐𝒘𝒂 𝒊𝒅 𝒂𝒓 𝒔𝒆𝒓𝒗𝒆𝒓 𝒏𝒂𝒎 𝒄𝒉𝒆𝒄𝒌 𝒌𝒐𝒓𝒖𝒏", event.threadID);
	}
};
