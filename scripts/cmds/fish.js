module.exports.config = {
	name: "fish",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🎣 মাছ ধরে বিক্রি করে অর্থ উপার্জন করুন",
	commandCategory: "💰 Economy",
	usages: "[fish]",
	cooldowns: 5,
	envConfig: {
		cooldownTime: 1000000
	}
};

module.exports.languages = {
	"en": {
		"cooldown": "⏰ | আপনি ইতিমধ্যে আজ মাছ ধরেছেন!\n🔁 | পরবর্তী মাছ ধরতে %1 মিনিট %2 সেকেন্ড অপেক্ষা করুন",
		"rewarded": "🎣 | আপনি একটি বিরল %1 ধরেছেন!\n💰 | বিক্রয় মূল্য: %2$",
		"fishing": "🐟 মাছ"
	},
	"bn": {
		"cooldown": "⏰ | আপনি ইতিমধ্যে আজ মাছ ধরেছেন!\n🔁 | পরবর্তী মাছ ধরতে %1 মিনিট %2 সেকেন্ড অপেক্ষা করুন",
		"rewarded": "🎣 | আপনি একটি বিরল %1 ধরেছেন!\n💰 | বিক্রয় মূল্য: %2$",
		"fishing": "🐟 মাছ"
	}
};

module.exports.run = async ({ event, api, Currencies, getText }) => {
	const { threadID, messageID, senderID } = event;
	const cooldown = global.configModule[this.config.name].cooldownTime;
	let data = (await Currencies.getData(senderID)).data || {};

	if (typeof data !== "undefined" && cooldown - (Date.now() - data.fishTime) > 0) {
		const time = cooldown - (Date.now() - data.fishTime);
		const minutes = Math.floor(time / 60000);
		const seconds = Math.floor((time % 60000) / 1000);
		
		return api.sendMessage(getText("cooldown", minutes, seconds), threadID, messageID);
	}

	const amount = Math.floor(Math.random() * 1000000);
	const rareFish = ["🐋 তিমি", "🦈 হাঙ্গর", "🐠 প্রবাল মাছ", "🦑 অক্টোপাস", "🐡 ব্লোফিশ"][Math.floor(Math.random() * 5)];

	await Currencies.increaseMoney(senderID, amount);
	data.fishTime = Date.now();
	await Currencies.setData(senderID, { data });

	return api.sendMessage(getText("rewarded", rareFish, amount), threadID, messageID);
};
