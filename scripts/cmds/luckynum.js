module.exports.config = {
	name: "luckynum",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝒍𝒖𝒄𝒌𝒚 𝒏𝒖𝒎𝒃𝒆𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓",
	commandCategory: "𝑮𝒂𝒎𝒆",
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"returnResultDefault": "✨ %1 𝒉𝒐𝒍𝒐 𝒂𝒑𝒏𝒂𝒓 𝒍𝒖𝒄𝒌𝒚 𝒏𝒖𝒎𝒃𝒆𝒓 :thinking:",
		"invalidMax": "⚠️ 𝑽𝒖𝒍 𝒍𝒊𝒎𝒊𝒕 𝒅𝒆𝒚𝒂 𝒉𝒐𝒍𝒐!",
		"invalidInput": "⚠️ 𝑺𝒕𝒂𝒓𝒕 𝒂𝒕𝒉𝒂𝒃𝒂 𝒆𝒏𝒅 𝒓𝒂𝒏𝒈𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒏𝒐𝒚!",
		"returnResult": "✨ %1 𝒉𝒐𝒍𝒐 𝒂𝒑𝒏𝒂𝒓 𝒍𝒖𝒄𝒌𝒚 𝒏𝒖𝒎𝒃𝒆𝒓 %2 𝒕𝒉𝒆𝒌𝒆 %3 𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 :thinking:"
	}
}

module.exports.run = function ({ event, api, args, getText }) {
    const { threadID, messageID } = event;

    if (args.length == 0) {
        return api.sendMessage(
            getText("returnResultDefault", Math.floor(Math.random() * 11)), 
            threadID, 
            messageID
        );
    }
    
    if (args.length != 2) {
        return api.sendMessage(
            getText("invalidMax"), 
            threadID, 
            messageID
        );
    }
    
    if (isNaN(args[0]) || isNaN(args[1]) || args[1] <= args[0] || args[0] < 0 || args[1] < 0) {
        return api.sendMessage(
            getText("invalidInput"), 
            threadID, 
            messageID
        );
    }
    
    const randomNum = Math.floor(Math.random() * (args[1] - args[0] + 1) + args[0];
    return api.sendMessage(
        getText("returnResult", randomNum, args[0], args[1]), 
        threadID, 
        messageID
    );
}
