module.exports.config = {
    name: "fish",
    aliases: ["fishing", "machdhora"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "economy",
    shortDescription: {
        en: "🎣 𝐹𝑖𝑠ℎ 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦"
    },
    longDescription: {
        en: "🎣 𝐶𝑎𝑡𝑐ℎ 𝑓𝑖𝑠ℎ 𝑎𝑛𝑑 𝑠𝑒𝑙𝑙 𝑡ℎ𝑒𝑚 𝑡𝑜 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦"
    },
    guide: {
        en: "{p}fish"
    },
    envConfig: {
        cooldownTime: 1000000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "⏰ | 𝑌𝑜𝑢 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑓𝑖𝑠ℎ𝑒𝑑 𝑡𝑜𝑑𝑎𝑦!\n🔁 | 𝑊𝑎𝑖𝑡 %1 𝑚𝑖𝑛𝑢𝑡𝑒𝑠 %2 𝑠𝑒𝑐𝑜𝑛𝑑𝑠 𝑡𝑜 𝑓𝑖𝑠ℎ 𝑎𝑔𝑎𝑖𝑛",
        "rewarded": "🎣 | 𝑌𝑜𝑢 𝑐𝑎𝑢𝑔ℎ𝑡 𝑎 𝑟𝑎𝑟𝑒 %1!\n💰 | 𝑆𝑎𝑙𝑒 𝑝𝑟𝑖𝑐𝑒: %2$",
        "fishing": "🐟 𝐹𝑖𝑠ℎ"
    }
};

module.exports.onStart = async function({ event, api, Currencies, getText }) {
    try {
        const { threadID, messageID, senderID } = event;
        const cooldown = global.configModule[this.config.name].cooldownTime;
        let userData = await Currencies.getData(senderID);
        
        let data = userData.data || {};

        if (typeof data !== "undefined" && data.fishTime && cooldown - (Date.now() - data.fishTime) > 0) {
            const time = cooldown - (Date.now() - data.fishTime);
            const minutes = Math.floor(time / 60000);
            const seconds = Math.floor((time % 60000) / 1000);
            
            return api.sendMessage(getText("cooldown", minutes, seconds), threadID, messageID);
        }

        const amount = Math.floor(Math.random() * 1000000);
        const rareFishes = ["🐋 𝑊ℎ𝑎𝑙𝑒", "🦈 𝑆ℎ𝑎𝑟𝑘", "🐠 𝐶𝑜𝑟𝑎𝑙 𝐹𝑖𝑠ℎ", "🦑 𝑂𝑐𝑡𝑜𝑝𝑢𝑠", "🐡 𝐵𝑙𝑜𝑤𝑓𝑖𝑠ℎ"];
        const rareFish = rareFishes[Math.floor(Math.random() * rareFishes.length)];

        await Currencies.increaseMoney(senderID, amount);
        
        if (!userData.data) userData.data = {};
        userData.data.fishTime = Date.now();
        await Currencies.setData(senderID, userData);

        return api.sendMessage(getText("rewarded", rareFish, amount), threadID, messageID);
        
    } catch (error) {
        console.error("𝐹𝑖𝑠ℎ𝑖𝑛𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑖𝑠ℎ𝑖𝑛𝑔", event.threadID, event.messageID);
    }
};
