module.exports.config = {
	name: "work",
	version: "1.0.1",
	Permssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑲𝒂𝒂𝒋 𝒌𝒐𝒓𝒆 𝒕𝒂𝒌𝒂 𝒖𝒑𝒂𝒓𝒋𝒐𝒏 𝒌𝒐𝒓𝒖𝒏!",
	category: "Entertainment",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 1200000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "🥵 | 𝑨𝒑𝒏𝒊 𝒂𝒂𝒋𝒌𝒆 𝒌𝒂𝒂𝒋 𝒌𝒐𝒓𝒆 𝒇𝒆𝒍𝒆𝒄𝒉𝒆𝒏, 𝒌𝒍𝒂𝒏𝒕𝒊 𝒆𝒓𝒂𝒕𝒆 𝒅𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒂𝒃𝒂𝒓 𝒂𝒔𝒉𝒖𝒏: %1 𝒎𝒊𝒏𝒖𝒕𝒆 %2 𝒔𝒆𝒄𝒐𝒏𝒅 𝒑𝒐𝒓𝒆.",
        "rewarded": "🎉 | 𝑨𝒑𝒏𝒊 𝒌𝒂𝒂𝒋𝒕𝒊 𝒔𝒐𝒎𝒑𝒐𝒏𝒏𝒐 𝒌𝒐𝒓𝒆𝒄𝒉𝒆𝒏: %1 𝒆𝒃𝒐𝒏𝒈 𝒑𝒆𝒚𝒆𝒄𝒉𝒆𝒏: %2$.",
        "job1": "😈 Scammer",
        "job2": "🔧 Mechanic",
        "job3": "💻 Programmer",
        "job4": "😎 Hacker",
        "job5": "👨‍🍳 Chef",
        "job6": "👷‍♂️ Rajmistri",
        "job7": "🚕 Vua Taxi Driver",
        "job8": "👥 Group Project Manager",
        "job9": "🛠️ Plumber ( ͡° ͜ʖ ͡°)",
        "job10": "🎮 Streamer",
        "job11": "🛍️ Online Bikreta",
        "job12": "🏡 Grihini",
        "job13": '💐 "Ful" Bikreta',
        "job14": "🔎 Asif er jonno Code Finder",
        "job15": "🕺 Tiktoker"
    }
}

module.exports.run = async function({ event, api, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    if (typeof data.workTime !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
        var time = cooldown - (Date.now() - data.workTime),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0);
        
		return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), event.threadID, event.messageID);
    }
    else {
        const job = [
            getText("job1"),
            getText("job2"),
            getText("job3"),
            getText("job4"),
            getText("job5"),
            getText("job6"),
            getText("job7"),
            getText("job8"),
            getText("job9"),
            getText("job10"),
            getText("job11"),
            getText("job12"),
            getText("job13"),
            getText("job14"),
            getText("job15")
        ];
        const amount = Math.floor(Math.random() * 900) + 100; // Min 100
        return api.sendMessage(getText("rewarded", job[Math.floor(Math.random() * job.length)], amount), threadID, async () => {
            await Currencies.increaseMoney(senderID, parseInt(amount));
            data.workTime = Date.now();
            await Currencies.setData(event.senderID, { data });
            return;
        }, messageID);
    }     
}
