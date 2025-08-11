module.exports.config = {
	name: "coin",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒏𝒊𝒋𝒆𝒓 𝒃𝒂 𝒕𝒂𝒈 𝒌𝒐𝒓𝒂 𝒍𝒐𝒌𝒆𝒓 𝒕𝒂𝒌𝒂 𝒅𝒆𝒌𝒉𝒐",
	commandCategory: "𝑒𝒄𝒐𝒏𝒐𝒎𝒚",
	usages: "[𝒕𝒂𝒈]",
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"sotienbanthan": "💵 𝒏𝒊𝒋𝒆𝒓 𝒕𝒂𝒌𝒂: %1$",
		"sotiennguoikhac": "💳 %1 𝒆𝒓 𝒕𝒂𝒌𝒂: %2$"
	}
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
	const { threadID, messageID, senderID, mentions } = event;

	if (!args[0]) {
		const money = (await Currencies.getData(senderID)).money;
		return api.sendMessage(getText("sotienbanthan", money), threadID, messageID);
	}

	else if (Object.keys(event.mentions).length == 1) {
		var mention = Object.keys(mentions)[0];
		var money = (await Currencies.getData(mention)).money;
		if (!money) money = 0;
		return api.sendMessage({
			body: getText("sotiennguoikhac", 
				mentions[mention].replace(/\@/g, ""), 
				money
			),
			mentions: [{
				tag: mentions[mention].replace(/\@/g, ""),
				id: mention
			}]
		}, threadID, messageID);
	}

	else return global.utils.throwError(this.config.name, threadID, messageID);
}
