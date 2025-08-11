module.exports.config = {
	name: "fish",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑴𝒂𝒄𝒉 𝒅𝒉𝒂𝒓𝒂 𝒂𝒓 𝒃𝒊𝒌𝒓𝒊 𝒌𝒐𝒓𝒂",
	commandCategory: "𝑬𝒄𝒐𝒏𝒐𝒎𝒚",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 1000000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "𝑨𝒑𝒏𝒊 𝒂𝒋𝒌𝒆 𝒌𝒂𝒋 𝒌𝒐𝒓𝒆𝒄𝒉𝒆𝒏, 𝒑𝒖𝒏𝒂𝒓𝒂𝒚 𝒂𝒏𝒕𝒂𝒓 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒅𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒂𝒔𝒖𝒏: %1 minute(s) %2 second(s).",
        "rewarded": "𝑨𝒑𝒏𝒊 𝒂𝒋𝒌𝒆 𝒂𝒓𝒐 𝒆𝒌𝒕𝒂 𝒃𝒂𝒓𝒐 𝒎𝒂𝒄𝒉 𝒑𝒂𝒘𝒂𝒍𝒂 𝒉𝒐𝒍𝒐! 𝑩𝒊𝒌𝒓𝒊 𝒑𝒓𝒊𝒅𝒉𝒂𝒏: %2$ 💰",
        "Fishing": "𝑴𝒂𝒄𝒉 𝒅𝒉𝒂𝒓𝒂",
    }
}

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    
    if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
        var time = cooldown - (Date.now() - data.workTime),
            minutes = Math.floor(time / 60000),
            seconds = Math.floor((time % 60000) / 1000);
        
		return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), event.threadID, event.messageID);
    }
    else {
        const job = [
            getText("Fishing"),
        ];
        const amount = Math.floor(Math.random() * 1000000);
        return api.sendMessage(getText("rewarded", job[Math.floor(Math.random() * job.length)], amount), threadID, async () => {
            await Currencies.increaseMoney(senderID, parseInt(amount));
            data.workTime = Date.now();
            await Currencies.setData(event.senderID, { data });
            return;
        }, messageID);
    }     
}
