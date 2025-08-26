module.exports.config = {
    name: "steal",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙏𝙖𝙠𝙖 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙖",
    category: "𝙏𝙖𝙠𝙖-𝙋𝙖𝙞𝙨𝙖",
    usages: "",
    cooldowns: 5
};

module.exports.onStart = async function({ api, event, Users, Currencies }) {
    try {
        const allUserIDs = global.data.allUserID;
        let victimID = allUserIDs[Math.floor(Math.random() * allUserIDs.length)];
        let victimData = await Users.getData(victimID);
        let nameVictim = victimData.name;

        if (victimID == api.getCurrentUserID() && event.senderID == victimID) {
            return api.sendMessage(
                '𝘿𝙪𝙠𝙝𝙞𝙩𝙤, 𝙖𝙥𝙣𝙞 𝙚𝙞 𝙗𝙮𝙖𝙠𝙩𝙞𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙝𝙚𝙠𝙚 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙩𝙚 𝙥𝙖𝙧𝙗𝙚𝙣 𝙣𝙖. 𝘼𝙗𝙖𝙧 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣.', 
                event.threadID, 
                event.messageID
            );
        }

        let route = Math.floor(Math.random() * 2);

        if (route === 0) {
            const victimMoney = (await Currencies.getData(victimID)).money || 0;
            const moneyToSteal = Math.floor(Math.random() * 1000) + 1;

            if (victimMoney <= 0) {
                return api.sendMessage(
                    `𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${nameVictim} 𝙚𝙧 𝙠𝙖𝙘𝙝𝙚, 𝙠𝙞𝙣𝙩𝙪 𝙩𝙖𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙖𝙠𝙖 𝙣𝙚𝙞. 𝙏𝙖𝙞 𝙖𝙥𝙣𝙞 𝙠𝙞𝙘𝙝𝙪 𝙥𝙖𝙞𝙡𝙚𝙣 𝙣𝙖!`,
                    event.threadID, 
                    event.messageID
                );
            } else if (victimMoney >= moneyToSteal) {
                await Currencies.increaseMoney(victimID, -moneyToSteal);
                await Currencies.increaseMoney(event.senderID, moneyToSteal);
                return api.sendMessage(
                    `𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${moneyToSteal}$ ${nameVictim} 𝙚𝙧 𝙠𝙖𝙘𝙝𝙚 𝙚𝙞 𝙜𝙧𝙪𝙥 𝙚!`,
                    event.threadID,
                    event.messageID
                );
            } else {
                await Currencies.increaseMoney(victimID, -victimMoney);
                await Currencies.increaseMoney(event.senderID, victimMoney);
                return api.sendMessage(
                    `𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${nameVictim} 𝙚𝙧 𝙨𝙤𝙗 𝙩𝙖𝙠𝙖 ${victimMoney}$ 𝙚𝙞 𝙜𝙧𝙪𝙥 𝙚!`,
                    event.threadID,
                    event.messageID
                );
            }
        } else {
            const senderData = await Users.getData(event.senderID);
            const senderMoney = (await Currencies.getData(event.senderID)).money || 0;
            const senderName = senderData.name;

            if (senderMoney <= 0) {
                return api.sendMessage(
                    "𝘼𝙥𝙣𝙖𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙖𝙠𝙖 𝙣𝙚𝙞, 𝙩𝙖𝙠𝙖 𝙠𝙖𝙢𝙖𝙞𝙩𝙚 𝙠𝙖𝙟 𝙠𝙤𝙧𝙪𝙣!",
                    event.threadID,
                    event.messageID
                );
            } else {
                const reward = Math.floor(senderMoney / 2);
                await Currencies.increaseMoney(event.senderID, -senderMoney);
                await Currencies.increaseMoney(victimID, reward);

                return api.sendMessage(
                    {
                        body: `𝘼𝙥𝙣𝙞 𝙙𝙝𝙤𝙧𝙧𝙖 𝙠𝙝𝙖𝙚𝙣 𝙚𝙗𝙤𝙣𝙜 𝙝𝙖𝙧𝙖𝙡𝙚𝙣 ${senderMoney}$!`,
                        mentions: [
                            { tag: nameVictim, id: victimID },
                            { tag: senderName, id: event.senderID }
                        ]
                    },
                    event.threadID,
                    event.messageID
                );
            }
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("⚠ 𝙀𝙧𝙧𝙤𝙧 𝙖𝙧𝙧𝙤𝙧 𝙝𝙤𝙞𝙩𝙚 𝙜𝙚𝙡𝙚.", event.threadID, event.messageID);
    }
};
