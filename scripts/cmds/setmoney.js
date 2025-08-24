module.exports.config = {
    name: "setmoney",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Change the amount of money for yourself or tagged users",
    category: "system",
    usages: "setmoney [me/del/uid/@user] [amount/userID]",
    cooldowns: 5,
    dependencies: {},
    envConfig: {}
};

module.exports.languages = {
    "en": {},
    "vi": {}
};

module.exports.run = async function({ api, event, args, Users, Currencies }) {
    try {
        const { threadID, messageID, senderID, mentions } = event;
        const action = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        const uid = args[1];
        const setAmount = parseInt(args[2]);

        // Set money for yourself
        if (action === "me") {
            if (isNaN(amount)) 
                return api.sendMessage("❌ Invalid amount! Please enter a number.", threadID, messageID);
            
            await Currencies.setData(senderID, { money: amount });
            return api.sendMessage(`✅ Successfully set your money to ${amount} 💸`, threadID, messageID);
        }

        // Delete money
        else if (action === "del") {
            const target = args[1]?.toLowerCase();

            // Delete your own money
            if (target === "me") {
                const currentMoney = (await Currencies.getData(senderID)).money;
                await Currencies.setData(senderID, { money: 0 });
                return api.sendMessage(`✅ Deleted all your money!\n💸 Amount removed: ${currentMoney}`, threadID, messageID);
            }
            // Delete money for mentioned user
            else if (Object.keys(mentions).length === 1) {
                const mentionID = Object.keys(mentions)[0];
                const name = mentions[mentionID].replace("@", "");
                const currentMoney = (await Currencies.getData(mentionID)).money;

                await Currencies.setData(mentionID, { money: 0 });
                return api.sendMessage(`✅ Deleted all money for ${name}!\n💸 Amount removed: ${currentMoney}`, threadID, messageID);
            }
        }

        // Set money by UID
        else if (action === "uid") {
            if (isNaN(uid)) 
                return api.sendMessage("❌ Invalid User ID", threadID, messageID);
            if (isNaN(setAmount)) 
                return api.sendMessage("❌ Invalid amount", threadID, messageID);

            const userName = (await Users.getData(uid)).name;
            await Currencies.setData(uid, { money: setAmount });
            return api.sendMessage(`✅ Successfully set money for ${userName} (${uid}) to ${setAmount} 💸`, threadID, messageID);
        }

        // Set money for mentioned user
        else if (Object.keys(mentions).length === 1) {
            if (isNaN(amount)) 
                return api.sendMessage("❌ Invalid amount! Please enter a number.", threadID, messageID);

            const mentionID = Object.keys(mentions)[0];
            const name = mentions[mentionID].replace("@", "");

            await Currencies.setData(mentionID, { money: amount });
            return api.sendMessage({
                body: `✅ Successfully set money for ${name} to ${amount} 💸`,
                mentions: [{ tag: name, id: mentionID }]
            }, threadID, messageID);
        }

        // Invalid command usage
        else {
            return api.sendMessage("ℹ️ Usage:\nsetmoney me [amount]\nsetmoney del me\nsetmoney @user [amount]\nsetmoney uid [userID] [amount]", threadID, messageID);
        }

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ An error occurred while processing your request", event.threadID, event.messageID);
    }
};
