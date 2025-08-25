module.exports.config = {
	name: "luckynum",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🎲 Generate your lucky number with beautiful formatting",
	category: "game",
	usages: "[min] [max]",
	cooldowns: 5,
	envConfig: {
		defaultRange: [0, 10]
	}
};

module.exports.languages = {
	"en": {
		"returnResultDefault": "✨ 𝗬𝗼𝘂𝗿 𝗹𝘂𝗰𝗸𝘆 𝗻𝘂𝗺𝗯𝗲𝗿 𝗶𝘀: 【%1】 🍀",
		"invalidMax": "⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗯𝗼𝘁𝗵 𝗦𝗧𝗔𝗥𝗧 𝗮𝗻𝗱 𝗘𝗡𝗗 𝗿𝗮𝗻𝗴𝗲 𝗻𝘂𝗺𝗯𝗲𝗿𝘀!",
		"invalidInput": "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗶𝗻𝗽𝘂𝘁! 𝗣𝗹𝗲𝗮𝘀𝗲 𝘂𝘀𝗲 𝗽𝗼𝘀𝗶𝘁𝗶𝘃𝗲 𝗻𝘂𝗺𝗯𝗲𝗿𝘀 𝘄𝗶𝘁𝗵 𝗘𝗡𝗗 > 𝗦𝗧𝗔𝗥𝗧",
		"returnResult": "🎉 𝗬𝗼𝘂𝗿 𝗹𝘂𝗰𝗸𝘆 𝗻𝘂𝗺𝗯𝗲𝗿 𝗯𝗲𝘁𝘄𝗲𝗲𝗻 %2 𝗮𝗻𝗱 %3 𝗶𝘀: 【%1】 🌈"
	}
}

module.exports.onStart = function ({ event, api, args, getText }) {
    const { threadID, messageID } = event;
    const { defaultRange } = global.configModule[this.config.name].envConfig;

    if (args.length === 0) {
        const randomNum = Math.floor(Math.random() * (defaultRange[1] - defaultRange[0] + 1)) + defaultRange[0];
        return api.sendMessage({
            body: getText("returnResultDefault", randomNum),
            mentions: [{
                tag: event.senderID,
                id: event.senderID
            }]
        }, threadID, messageID);
    }
    
    if (args.length !== 2) {
        return api.sendMessage(getText("invalidMax"), threadID, messageID);
    }
    
    const min = parseInt(args[0]);
    const max = parseInt(args[1]);
    
    if (isNaN(min) || isNaN(max) || max <= min || min < 0 || max < 0) {
        return api.sendMessage(getText("invalidInput"), threadID, messageID);
    }
    
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return api.sendMessage(
        getText("returnResult", randomNum, min, max), 
        threadID, 
        messageID
    );
}
