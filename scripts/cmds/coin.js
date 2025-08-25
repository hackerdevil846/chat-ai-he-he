module.exports.config = {
    name: "coin",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💰 Check coin balances in the economy system",
    category: "economy",
    usages: "[@mention | help]",
    cooldowns: 3,
    dependencies: {},
    envConfig: {}
};

module.exports.languages = {
    "en": {
        "own_balance": "💰 𝗬𝗢𝗨𝗥 𝗕𝗔𝗟𝗔𝗡𝗖𝗘\n━━━━━━━━━━━━━━\n🪙 | You currently have: %1 coins\n\n💹 | Keep earning more coins through activities!",
        "other_balance": "💰 𝗨𝗦𝗘𝗥 𝗕𝗔𝗟𝗔𝗡𝗖𝗘\n━━━━━━━━━━━━━━\n👤 | User: %1\n🪙 | Balance: %2 coins",
        "no_user": "⚠️ 𝗨𝗦𝗘𝗥 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗\n━━━━━━━━━━━━━━\nPlease mention a valid user to check their balance",
        "error": "❌ 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗘𝗥𝗥𝗢𝗿\n━━━━━━━━━━━━━━\nFailed to fetch balance. Please try again later.",
        "help": "💎 𝗖𝗢𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗛𝗘𝗟𝗣\n━━━━━━━━━━━━━━\n\n" +
                "📌 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗮𝗴𝗲:\n" +
                "• {p}coin - Check your own balance\n" +
                "• {p}coin @mention - Check someone else's balance\n" +
                "• {p}coin help - Show this help message\n\n" +
                "💡 𝗔𝗯𝗼𝘂𝘁 𝗖𝗼𝗶𝗻𝘀:\n" +
                "• Coins are earned through activities, games, and rewards\n" +
                "• Use coins to purchase items, play games, or access premium features\n" +
                "• Check your balance regularly to track your earnings!\n\n" +
                "✨ 𝗧𝗶𝗽: Stay active to earn more coins daily!"
    }
};

module.exports.onLoad = function() {
    console.log("✅ Coin command loaded successfully!");
};

module.exports.onStart = async function({ api, event, args, Users, Currencies, getText }) {
    try {
        const { threadID, messageID, senderID, mentions } = event;

        if (args[0]?.toLowerCase() === "help") {
            return api.sendMessage(getText("help"), threadID, messageID);
        }

        if (args.length === 0 || Object.keys(mentions).length === 0) {
            const userData = await Currencies.getData(senderID);
            const balance = userData.money || 0;
            return api.sendMessage(
                getText("own_balance", balance.toLocaleString()), 
                threadID,
                messageID
            );
        }

        const targetID = Object.keys(mentions)[0];
        const targetName = mentions[targetID].replace(/@/g, "");
        const targetData = await Currencies.getData(targetID);

        if (!targetData) {
            return api.sendMessage(getText("no_user"), threadID, messageID);
        }

        const targetBalance = targetData.money || 0;
        return api.sendMessage(
            {
                body: getText("other_balance", targetName, targetBalance.toLocaleString()),
                mentions: [{
                    tag: targetName,
                    id: targetID
                }]
            },
            threadID,
            messageID
        );

    } catch (error) {
        console.error("Coin command error:", error);
        return api.sendMessage(
            getText("error"),
            event.threadID,
            event.messageID
        );
    }
};
