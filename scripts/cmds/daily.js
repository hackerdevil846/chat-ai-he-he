module.exports.config = {
	name: "daily",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒆𝒕 𝟏𝟗,𝟎𝟏𝟏,𝟑𝟏𝟎,𝟎𝟎𝟎 𝒄𝒐𝒊𝒏𝒔 𝒆𝒗𝒆𝒓𝒚 𝒅𝒂𝒚! 💰",
	commandCategory: "𝒆𝒄𝒐𝒏𝒐𝒎𝒚",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 43200000, // 12 hours
        rewardCoin: 19011310000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "⏰ 𝒀𝒐𝒖'𝒗𝒆 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒄𝒍𝒂𝒊𝒎𝒆𝒅 𝒕𝒐𝒅𝒂𝒚'𝒔 𝒓𝒆𝒘𝒂𝒓𝒅! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒄𝒐𝒎𝒆 𝒃𝒂𝒄𝒌 𝒊𝒏:\n%1 𝒉𝒐𝒖𝒓𝒔 %2 𝒎𝒊𝒏𝒖𝒕𝒆𝒔 %3 𝒔𝒆𝒄𝒐𝒏𝒅𝒔",
        "rewarded": "💰 𝑪𝑶𝑵𝑮𝑹𝑨𝑻𝑼𝑳𝑨𝑻𝑰𝑶𝑵𝑺! 𝑻𝒐𝒅𝒂𝒚'𝒔 𝒅𝒂𝒊𝒍𝒚 𝒓𝒆𝒘𝒂𝒓𝒅 𝒐𝒇 %1 𝒄𝒐𝒊𝒏𝒔 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒂𝒅𝒅𝒆𝒅 𝒕𝒐 𝒚𝒐𝒖𝒓 𝒃𝒂𝒍𝒂𝒏𝒄𝒆!\n\n💎 𝑪𝒐𝒎𝒆 𝒃𝒂𝒄𝒌 𝒊𝒏 12 𝒉𝒐𝒖𝒓𝒔 𝒇𝒐𝒓 𝒎𝒐𝒓𝒆!"
    }
}

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { daily } = global.configModule;
    const cooldownTime = daily.cooldownTime;
    const rewardCoin = daily.rewardCoin;

    const { senderID, threadID, messageID } = event;
    const userData = await Currencies.getData(senderID);
    const data = userData.data || {};

    // Format number with commas
    const formatNumber = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Check if user is on cooldown
    if (data.dailyCoolDown && (Date.now() - data.dailyCoolDown) < cooldownTime) {
        const remainingTime = cooldownTime - (Date.now() - data.dailyCoolDown);
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        
        return api.sendMessage(
            getText("cooldown", hours, minutes, seconds), 
            threadID, 
            messageID
        );
    }

    // Reward the user
    await Currencies.increaseMoney(senderID, rewardCoin);
    data.dailyCoolDown = Date.now();
    await Currencies.setData(senderID, { data });

    return api.sendMessage(
        getText("rewarded", formatNumber(rewardCoin)), 
        threadID, 
        messageID
    );
}
