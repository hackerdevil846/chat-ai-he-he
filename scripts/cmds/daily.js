module.exports.config = {
    name: "daily",
    aliases: ["reward", "claim"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "economy",
    shortDescription: {
        en: "💰 𝐷𝐴𝐼𝐿𝑌 𝑅𝐸𝑊𝐴𝑅𝐷 𝑆𝑌𝑆𝑇𝐸𝑀 | 𝐺𝑒𝑡 19𝐵+ 𝐶𝑜𝑖𝑛𝑠 𝐸𝑣𝑒𝑟𝑦 12 𝐻𝑜𝑢𝑟𝑠"
    },
    longDescription: {
        en: "𝐶𝑙𝑎𝑖𝑚 𝑦𝑜𝑢𝑟 𝑑𝑎𝑖𝑙𝑦 𝑟𝑒𝑤𝑎𝑟𝑑 𝑜𝑓 19𝐵+ 𝑐𝑜𝑖𝑛𝑠 𝑒𝑣𝑒𝑟𝑦 12 ℎ𝑜𝑢𝑟𝑠"
    },
    guide: {
        en: "{p}daily"
    },
    envConfig: {
        cooldownTime: 43200000,
        rewardCoin: 19011310000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "🕒 ╔════════════════╗\n      𝐷𝐴𝐼𝐿𝑌 𝐶𝑂𝑂𝐿𝐷𝑂𝑊𝑁\n╚════════════════╝\n\n⏳ 𝑅𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔 𝑇𝑖𝑚𝑒:\n   ⇝ %1𝗁 %2ᴍ %3𝘴\n\n📌 𝑁𝑜𝑡𝑒: 𝑌𝑜𝑢 𝑐𝑎𝑛 𝑐𝑙𝑎𝑖𝑚 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛 12 ℎ𝑜𝑢𝑟𝑠",
        "rewarded": "✨ ╔══════════════════════╗\n       𝑅𝐸𝑊𝐴𝑅𝐷 𝐶𝐿𝐴𝐼𝑀𝐸𝐷!\n╚══════════════════════╝\n\n💰 𝐴𝑚𝑜𝑢𝑛𝑡 𝑅𝑒𝑐𝑒𝑖𝑣𝑒𝑑:\n   ⇝ %1 𝖢𝗈𝗂𝗇𝗌\n\n🎯 𝑁𝑒𝑥𝑡 𝑅𝑒𝑤𝑎𝑟𝑑 𝑖𝑛:\n   ⇝ 12 𝐻𝑜𝑢𝑟𝑠\n\n💡 𝑇𝑖𝑝: 𝐶𝑜𝑚𝑒 𝑏𝑎𝑐𝑘 𝑑𝑎𝑖𝑙𝑦 𝑓𝑜𝑟 𝑚𝑜𝑟𝑒 𝑟𝑒𝑤𝑎𝑟𝑑𝑠!",
        "firstTime": "🎊 ╔══════════════════════╗\n     𝐹𝐼𝑅𝑆𝑇 𝑇𝐼𝑀𝐸 𝐵𝑂𝑁𝑈𝑆!\n╚══════════════════════╝\n\n✨ 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝐷𝑎𝑖𝑙𝑦 𝑅𝑒𝑤𝑎𝑟𝑑𝑠!\n\n💰 𝐴𝑚𝑜𝑢𝑛𝑡 𝑅𝑒𝑐𝑒𝑖𝑣𝑒𝑑:\n   ⇝ %1 𝖢𝗈𝗂𝗇𝗌\n\n🎯 𝑁𝑒𝑥𝑡 𝑅𝑒𝑤𝑎𝑟𝑑 𝑖𝑛:\n   ⇝ 12 𝐻𝑜𝑢𝑟𝑠\n\n💡 𝑇𝑖𝑝: 𝐶𝑙𝑎𝑖𝑚 𝑑𝑎𝑖𝑙𝑦 𝑡𝑜 𝑏𝑢𝑖𝑙𝑑 𝑦𝑜𝑢𝑟 𝑓𝑜𝑟𝑡𝑢𝑛𝑒!"
    }
};

module.exports.onStart = async function({ event, api, Currencies, getText }) {
    try {
        const { cooldownTime, rewardCoin } = this.config.envConfig;
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

    } catch (error) {
        console.error("𝐷𝑎𝑖𝑙𝑦 𝑅𝑒𝑤𝑎𝑟𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑑𝑎𝑖𝑙𝑦 𝑟𝑒𝑤𝑎𝑟𝑑.", event.threadID, event.messageID);
    }
};
