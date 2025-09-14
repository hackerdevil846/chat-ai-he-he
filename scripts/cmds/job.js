const moment = require("moment-timezone");

module.exports.config = {
    name: "jobcenter",
    aliases: ["work", "job"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "economy",
    shortDescription: {
        en: "💼 𝑊𝑜𝑟𝑘 𝑡𝑜 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑗𝑜𝑏𝑠 - 𝐸𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝐸𝑑𝑖𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "💼 𝑊𝑜𝑟𝑘 𝑡𝑜 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑗𝑜𝑏𝑠 - 𝐸𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝐸𝑑𝑖𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}jobcenter [𝑗𝑜𝑏 𝑛𝑢𝑚𝑏𝑒𝑟]"
    },
    envConfig: {
        cooldownTime: 300000
    },
    dependencies: {
        "moment-timezone": ""
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "⏱️ 𝐶𝑜𝑜𝑙𝑑𝑜𝑤𝑛: 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 %1 𝑚𝑖𝑛𝑢𝑡𝑒(𝑠) %2 𝑠𝑒𝑐𝑜𝑛𝑑(𝑠) 𝑏𝑒𝑓𝑜𝑟𝑒 𝑤𝑜𝑟𝑘𝑖𝑛𝑔 𝑎𝑔𝑎𝑖𝑛 ✨",
        "invalidNumber": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑗𝑜𝑏 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1-7 🌟",
        "invalidJob": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑗𝑜𝑏 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎 𝑗𝑜𝑏 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑙𝑖𝑠𝑡 📋",
        "jobError": "❌ 𝐽𝑜𝑏 𝑒𝑟𝑟𝑜𝑟! 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑦𝑜𝑢𝑟 𝑗𝑜𝑏. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟 🔄",
        "systemError": "❌ 𝑆𝑦𝑠𝑡𝑒𝑚 𝑒𝑟𝑟𝑜𝑟! 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑎𝑐𝑐𝑒𝑠𝑠 𝑗𝑜𝑏 𝑐𝑒𝑛𝑡𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟 🛠️",
        "welcome": "💼 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝑡ℎ𝑒 𝐸𝑙𝑖𝑡𝑒 𝐽𝑜𝑏 𝐶𝑒𝑛𝑡𝑒𝑟! 𝐸𝑎𝑟𝑛 𝑐𝑜𝑖𝑛𝑠 𝑎𝑛𝑑 𝑙𝑒𝑣𝑒𝑙 𝑢𝑝 𝑦𝑜𝑢𝑟 𝑐𝑎𝑟𝑒𝑒𝑟 🚀"
    }
};

const jobTypes = {
    1: {
        name: "🏭 𝐼𝑛𝑑𝑢𝑠𝑡𝑟𝑖𝑎𝑙 𝑍𝑜𝑛𝑒",
        tasks: [
            "ℎ𝑖𝑟𝑖𝑛𝑔 𝑠𝑡𝑎𝑓𝑓", 
            "ℎ𝑜𝑡𝑒𝑙 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟", 
            "𝑎𝑡 𝑡ℎ𝑒 𝑝𝑜𝑤𝑒𝑟 𝑝𝑙𝑎𝑛𝑡", 
            "𝑟𝑒𝑠𝑡𝑎𝑢𝑟𝑎𝑛𝑡 𝑐ℎ𝑒𝑓", 
            "𝑓𝑎𝑐𝑡𝑜𝑟𝑦 𝑤𝑜𝑟𝑘𝑒𝑟"
        ],
        minCoins: 200,
        maxCoins: 600,
        emoji: "🏭"
    },
    2: {
        name: "💼 𝑆𝑒𝑟𝑣𝑖𝑐𝑒 𝐴𝑟𝑒𝑎",
        tasks: [
            "𝑝𝑙𝑢𝑚𝑏𝑒𝑟", 
            "𝐴𝐶 𝑟𝑒𝑝𝑎𝑖𝑟 𝑡𝑒𝑐ℎ𝑛𝑖𝑐𝑖𝑎𝑛", 
            "𝑚𝑢𝑙𝑡𝑖-𝑙𝑒𝑣𝑒𝑙 𝑠𝑎𝑙𝑒𝑠", 
            "𝑓𝑙𝑦𝑒𝑟 𝑑𝑖𝑠𝑡𝑟𝑖𝑏𝑢𝑡𝑖𝑜𝑛", 
            "𝑑𝑒𝑙𝑖𝑣𝑒𝑟𝑦 𝑑𝑟𝑖𝑣𝑒𝑟", 
            "𝑐𝑜𝑚𝑝𝑢𝑡𝑒𝑟 𝑟𝑒𝑝𝑎𝑖𝑟", 
            "𝑡𝑜𝑢𝑟 𝑔𝑢𝑖𝑑𝑒", 
            "𝑐ℎ𝑖𝑙𝑑 𝑐𝑎𝑟𝑒"
        ],
        minCoins: 200,
        maxCoins: 1000,
        emoji: "💼"
    },
    3: {
        name: "🛢️ 𝑂𝑖𝑙 𝐹𝑖𝑒𝑙𝑑",
        tasks: [
            "𝑑𝑟𝑖𝑙𝑙𝑖𝑛𝑔 𝑠𝑢𝑝𝑒𝑟𝑣𝑖𝑠𝑜𝑟", 
            "𝑝𝑖𝑝𝑒𝑙𝑖𝑛𝑒 𝑡𝑒𝑐ℎ𝑛𝑖𝑐𝑖𝑎𝑛", 
            "𝑠𝑎𝑓𝑒𝑡𝑦 𝑖𝑛𝑠𝑝𝑒𝑐𝑡𝑜𝑟", 
            "𝑒𝑞𝑢𝑖𝑝𝑚𝑒𝑛𝑡 𝑜𝑝𝑒𝑟𝑎𝑡𝑜𝑟", 
            "𝑟𝑒𝑓𝑖𝑛𝑒𝑟𝑦 𝑤𝑜𝑟𝑘𝑒𝑟"
        ],
        minCoins: 300,
        maxCoins: 800,
        emoji: "🛢️"
    },
    4: {
        name: "⛏️ 𝑀𝑖𝑛𝑖𝑛𝑔 𝑂𝑟𝑒",
        tasks: [
            "𝑖𝑟𝑜𝑛 𝑜𝑟𝑒 𝑒𝑥𝑡𝑟𝑎𝑐𝑡𝑖𝑜𝑛", 
            "𝑔𝑜𝑙𝑑 𝑚𝑖𝑛𝑖𝑛𝑔", 
            "𝑐𝑜𝑎𝑙 𝑚𝑖𝑛𝑖𝑛𝑔", 
            "𝑐𝑜𝑝𝑝𝑒𝑟 𝑒𝑥𝑐𝑎𝑣𝑎𝑡𝑖𝑜𝑛", 
            "𝑚𝑖𝑛𝑒𝑟𝑎𝑙 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔"
        ],
        minCoins: 250,
        maxCoins: 750,
        emoji: "⛏️"
    },
    5: {
        name: "💎 𝐷𝑖𝑔𝑔𝑖𝑛𝑔 𝑅𝑜𝑐𝑘",
        tasks: [
            "𝑑𝑖𝑎𝑚𝑜𝑛𝑑 𝑝𝑟𝑜𝑠𝑝𝑒𝑐𝑡𝑖𝑛𝑔", 
            "𝑔𝑒𝑚𝑠𝑡𝑜𝑛𝑒 𝑒𝑥𝑐𝑎𝑣𝑎𝑡𝑖𝑜𝑛", 
            "𝑞𝑢𝑎𝑟𝑟𝑦 𝑤𝑜𝑟𝑘𝑒𝑟", 
            "𝑔𝑒𝑜𝑙𝑜𝑔𝑖𝑐𝑎𝑙 𝑠𝑢𝑟𝑣𝑒𝑦𝑜𝑟", 
            "𝑠𝑡𝑜𝑛𝑒 𝑐𝑢𝑡𝑡𝑖𝑛𝑔"
        ],
        minCoins: 200,
        maxCoins: 500,
        emoji: "💎"
    },
    6: {
        name: "🌟 𝑆𝑝𝑒𝑐𝑖𝑎𝑙 𝐽𝑜𝑏",
        tasks: [
            "𝑉𝐼𝑃 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡", 
            "𝑝𝑎𝑡𝑒𝑛𝑡 𝑐𝑜𝑛𝑠𝑢𝑙𝑡𝑎𝑛𝑡", 
            "𝑝𝑟𝑖𝑣𝑎𝑡𝑒 𝑖𝑛𝑣𝑒𝑠𝑡𝑖𝑔𝑎𝑡𝑜𝑟", 
            "𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑣𝑒 𝑐ℎ𝑎𝑢𝑓𝑓𝑒𝑢𝑟", 
            "𝑙𝑢𝑥𝑢𝑟𝑦 𝑒𝑣𝑒𝑛𝑡 𝑝𝑙𝑎𝑛𝑛𝑒𝑟"
        ],
        minCoins: 500,
        maxCoins: 1500,
        emoji: "🌟"
    },
    7: {
        name: "🚀 𝐸𝑙𝑖𝑡𝑒 𝑀𝑖𝑠𝑠𝑖𝑜𝑛",
        tasks: [
            "𝑐𝑦𝑏𝑒𝑟𝑠𝑒𝑐𝑢𝑟𝑖𝑡𝑦 𝑒𝑥𝑝𝑒𝑟𝑡", 
            "𝑎𝐼 𝑟𝑒𝑠𝑒𝑎𝑟𝑐ℎ𝑒𝑟", 
            "𝑞𝑢𝑎𝑛𝑡𝑢𝑚 𝑐𝑜𝑚𝑝𝑢𝑡𝑖𝑛𝑔 𝑠𝑝𝑒𝑐𝑖𝑎𝑙𝑖𝑠𝑡", 
            "𝑠𝑝𝑎𝑐𝑒 𝑒𝑛𝑔𝑖𝑛𝑒𝑒𝑟", 
            "𝑏𝑙𝑜𝑐𝑘𝑐ℎ𝑎𝑖𝑛 𝑑𝑒𝑣𝑒𝑙𝑜𝑝𝑒𝑟"
        ],
        minCoins: 800,
        maxCoins: 2500,
        emoji: "🚀"
    }
};

module.exports.onLoad = function () {
    console.log("🔄 𝐽𝑜𝑏 𝐶𝑒𝑛𝑡𝑒𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
};

module.exports.onReply = async function({ event, api, handleReply, Currencies, getText }) {
    const { threadID, senderID, body } = event;
    const jobType = parseInt(body);

    if (isNaN(jobType)) {
        return api.sendMessage(getText("invalidNumber"), threadID);
    }

    if (!jobTypes[jobType]) {
        return api.sendMessage(getText("invalidJob"), threadID);
    }

    try {
        const job = jobTypes[jobType];
        const task = job.tasks[Math.floor(Math.random() * job.tasks.length)];
        const coinsEarned = Math.floor(Math.random() * (job.maxCoins - job.minCoins + 1)) + job.minCoins;
        
        const bonusChance = Math.random();
        let bonusMessage = "";
        let totalCoins = coinsEarned;
        
        if (bonusChance < 0.2) {
            const bonusCoins = Math.floor(coinsEarned * 0.5);
            totalCoins += bonusCoins;
            bonusMessage = `\n\n🎉 𝐵𝑂𝑁𝑈𝑆! 𝑌𝑜𝑢 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑎𝑛 𝑒𝑥𝑡𝑟𝑎 ${bonusCoins} 𝑐𝑜𝑖𝑛𝑠 𝑓𝑜𝑟 𝑒𝑥𝑐𝑒𝑙𝑙𝑒𝑛𝑡 𝑝𝑒𝑟𝑓𝑜𝑟𝑚𝑎𝑛𝑐𝑒!`;
        }

        await Currencies.increaseMoney(senderID, totalCoins);

        const messages = [
            `💼 ${job.emoji} 𝑌𝑂𝑈𝑅 𝑊𝑂𝑅𝐾 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 ${job.emoji}\n\n𝐽𝑜𝑏: ${task}\n𝐴𝑟𝑒𝑎: ${job.name}\n𝐶𝑜𝑖𝑛𝑠 𝐸𝑎𝑟𝑛𝑒𝑑: ${totalCoins} 💰${bonusMessage}\n\n𝐾𝑒𝑒𝑝 𝑢𝑝 𝑡ℎ𝑒 𝑔𝑟𝑒𝑎𝑡 𝑤𝑜𝑟𝑘! 🚀`,
            `🎯 𝑊𝑂𝑅𝐾 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸𝐷!\n\n𝑅𝑜𝑙𝑒: ${task}\n𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛: ${job.name}\n𝑅𝑒𝑤𝑎𝑟𝑑: ${totalCoins} 𝑐𝑜𝑖𝑛𝑠 💵${bonusMessage}\n\n𝑌𝑜𝑢𝑟 𝑐𝑎𝑟𝑒𝑒𝑟 𝑖𝑠 𝑝𝑟𝑜𝑔𝑟𝑒𝑠𝑠𝑖𝑛𝑔! 🌟`,
            `🏆 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿 𝑊𝑂𝑅𝐾 𝐷𝐴𝑌!\n\n𝑇𝑎𝑠𝑘: ${task}\n𝐷𝑒𝑝𝑎𝑟𝑡𝑚𝑒𝑛𝑡: ${job.name}\n𝐸𝑎𝑟𝑛𝑖𝑛𝑔𝑠: ${totalCoins} 𝑐𝑜𝑖𝑛𝑠 🪙${bonusMessage}\n\n𝑌𝑜𝑢'𝑟𝑒 𝑏𝑢𝑖𝑙𝑑𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑓𝑢𝑡𝑢𝑟𝑒! 💪`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        api.unsendMessage(handleReply.messageID);
        api.sendMessage(randomMessage, threadID);

        const userData = await Currencies.getData(senderID);
        userData.data = userData.data || {};
        userData.data.workTime = Date.now();
        await Currencies.setData(senderID, userData);

    } catch (error) {
        console.error("𝐽𝑜𝑏 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage(getText("jobError"), threadID);
    }
};

module.exports.onStart = async function({ event, api, Currencies, getText }) {
    const { threadID, senderID } = event;
    const cooldownTime = this.config.envConfig.cooldownTime;
    
    try {
        const userData = await Currencies.getData(senderID);
        const workData = userData.data || {};
        
        if (workData.workTime && (Date.now() - workData.workTime) < cooldownTime) {
            const remainingTime = cooldownTime - (Date.now() - workData.workTime);
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            
            return api.sendMessage(
                getText("cooldown", minutes, seconds < 10 ? "0" + seconds : seconds), 
                threadID
            );
        }

        let menu = `✨━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✨\n`;
        menu += `         💼 𝐸𝐿𝐼𝑇𝐸 𝐽𝑂𝐵 𝐶𝐸𝑁𝑇𝐸𝑅 💼\n`;
        menu += `✨━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✨\n\n`;
        menu += `${getText("welcome")}\n\n`;
        menu += `🎯 𝐶ℎ𝑜𝑜𝑠𝑒 𝑎 𝑗𝑜𝑏 𝑏𝑦 𝑟𝑒𝑝𝑙𝑦𝑖𝑛𝑔 𝑤𝑖𝑡ℎ 𝑖𝑡𝑠 𝑛𝑢𝑚𝑏𝑒𝑟:\n\n`;
        
        for (const [id, job] of Object.entries(jobTypes)) {
            menu += `🔸 ${id}. ${job.name} (${job.minCoins}-${job.maxCoins} 𝑐𝑜𝑖𝑛𝑠) ${job.emoji}\n`;
        }
        
        menu += `\n💡 𝑇𝑖𝑝: 𝐻𝑖𝑔ℎ𝑒𝑟 𝑟𝑖𝑠𝑘 𝑗𝑜𝑏𝑠 𝑜𝑓𝑓𝑒𝑟 𝑔𝑟𝑒𝑎𝑡𝑒𝑟 𝑟𝑒𝑤𝑎𝑟𝑑𝑠!\n`;
        menu += `⏱️ 𝐶𝑜𝑜𝑙𝑑𝑜𝑤𝑛: 5 𝑚𝑖𝑛𝑢𝑡𝑒𝑠 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑗𝑜𝑏𝑠\n\n`;
        menu += `💝 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑗𝑜𝑏 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑤𝑜𝑟𝑘𝑖𝑛𝑔`;

        api.sendMessage(menu, threadID, (error, info) => {
            if (error) {
                console.error("𝑀𝑒𝑛𝑢 𝐸𝑟𝑟𝑜𝑟:", error);
                return api.sendMessage(getText("systemError"), threadID);
            }
            
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "jobSelection"
            });
        });

    } catch (error) {
        console.error("𝐽𝑜𝑏 𝑆𝑦𝑠𝑡𝑒𝑚 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage(getText("systemError"), threadID);
    }
};
