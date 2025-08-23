module.exports.config = {
	name: "daily",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "💰 𝗗𝗔𝗜𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 | 𝗚𝗲𝘁 𝟭𝟵𝗕+ 𝗖𝗼𝗶𝗻𝘀 𝗘𝘃𝗲𝗿𝘆 𝟭𝟮 𝗛𝗼𝘂𝗿𝘀",
	category: "economy",
	usages: "daily",
	cooldowns: 5,
	envConfig: {
		cooldownTime: 43200000,
		rewardCoin: 19011310000
	}
};

module.exports.languages = {
	"en": {
		"cooldown": "🕒 ╔════════════════╗\n      𝗗𝗔𝗜𝗟𝗬 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡\n╚════════════════╝\n\n⏳ 𝗥𝗲𝗺𝗮𝗶𝗻𝗶𝗻𝗴 𝗧𝗶𝗺𝗲:\n   ⇝ %1𝗁 %2ᴍ %3𝘴\n\n📌 𝗡𝗼𝘁𝗲: 𝗬𝗼𝘂 𝗰𝗮𝗻 𝗰𝗹𝗮𝗶𝗺 𝗮𝗴𝗮𝗶𝗻 𝗶𝗻 𝟭𝟮 𝗵𝗼𝘂𝗿𝘀",
		"rewarded": "✨ ╔══════════════════════╗\n       𝗥𝗘𝗪𝗔𝗥𝗗 𝗖𝗟𝗔𝗜𝗠𝗘𝗗!\n╚══════════════════════╝\n\n💰 𝗔𝗺𝗼𝘂𝗻𝘁 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱:\n   ⇝ %1 𝖢𝗈𝗂𝗇𝗌\n\n🎯 𝗡𝗲𝘅𝘁 𝗥𝗲𝘄𝗮𝗿𝗱 𝗶𝗻:\n   ⇝ 12 𝙷𝚘𝚞𝚛𝚜\n\n💡 𝗧𝗶𝗽: 𝗖𝗼𝗺𝗲 𝗯𝗮𝗰𝗸 𝗱𝗮𝗶𝗹𝘆 𝗳𝗼𝗿 𝗺𝗼𝗿𝗲 𝗿𝗲𝘄𝗮𝗿𝗱𝘀!",
		"firstTime": "🎊 ╔══════════════════════╗\n     𝗙𝗜𝗥𝗦𝗧 𝗧𝗜𝗠𝗘 𝗕𝗢𝗡𝗨𝗦!\n╚══════════════════════╝\n\n✨ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗗𝗮𝗶𝗹𝘆 𝗥𝗲𝘄𝗮𝗿𝗱𝘀!\n\n💰 𝗔𝗺𝗼𝘂𝗻𝘁 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱:\n   ⇝ %1 𝖢𝗈𝗂𝗇𝗌\n\n🎯 𝗡𝗲𝘅𝘁 𝗥𝗲𝘄𝗮𝗿𝗱 𝗶𝗻:\n   ⇝ 12 𝙷𝚘𝚞𝚛𝚜\n\n💡 𝗧𝗶𝗽: 𝗖𝗹𝗮𝗶𝗺 𝗱𝗮𝗶𝗹𝘆 𝘁𝗼 𝗯𝘂𝗶𝗹𝗱 𝘆𝗼𝘂𝗿 𝗳𝗼𝗿𝘁𝘂𝗻𝗲!"
	}
}

module.exports.run = async ({ event, api, Currencies, getText }) => {
	const { daily } = global.configModule;
	const { cooldownTime, rewardCoin } = daily;
	const { senderID, threadID, messageID } = event;

	const userData = await Currencies.getData(senderID);
	const data = userData.data || {};
	
	// Check if user has claimed before
	const isFirstTime = !data.hasClaimedDaily;
	
	if (data.dailyCoolDown && Date.now() - data.dailyCoolDown < cooldownTime) {
		const remaining = cooldownTime - (Date.now() - data.dailyCoolDown);
		const hours = Math.floor(remaining / 3600000);
		const minutes = Math.floor((remaining % 3600000) / 60000);
		const seconds = Math.floor((remaining % 60000) / 1000);
		
		return api.sendMessage(
			getText("cooldown", hours, minutes, seconds), 
			threadID, 
			messageID
		);
	}

	// Give bonus for first time claimers
	const actualReward = isFirstTime ? Math.floor(rewardCoin * 1.5) : rewardCoin;
	
	await Currencies.increaseMoney(senderID, actualReward);
	data.dailyCoolDown = Date.now();
	data.hasClaimedDaily = true;
	await Currencies.setData(senderID, { data });

	const formattedCoin = actualReward.toLocaleString('en-US');
	
	return api.sendMessage(
		getText(isFirstTime ? "firstTime" : "rewarded", formattedCoin), 
		threadID, 
		messageID
	);
};
