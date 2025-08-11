module.exports.config = {
    name: "steal",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙏𝙖𝙠𝙖 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙖",
    commandCategory: "𝙏𝙖𝙠𝙖-𝙋𝙖𝙞𝙨𝙖",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event, Users, Currencies }) {
    var alluser = global.data.allUserID
    let victim = alluser[Math.floor(Math.random() * alluser.length)];
    let nameVictim = (await Users.getData(victim)).name
    
    if (victim == api.getCurrentUserID() && event.senderID == victim) {
        return api.sendMessage('𝘿𝙪𝙠𝙝𝙞𝙩𝙤, 𝙖𝙥𝙣𝙞 𝙚𝙞 𝙗𝙮𝙖𝙠𝙩𝙞𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙝𝙚𝙠𝙚 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙩𝙚 𝙥𝙖𝙧𝙗𝙚𝙣 𝙣𝙖. 𝘼𝙗𝙖𝙧 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣.', event.threadID, event.messageID);
    }
    
    var route = Math.floor(Math.random() * 2);
    
    if (route > 1 || route == 0) {
        const moneydb = (await Currencies.getData(victim)).money;
        var money = Math.floor(Math.random() * 1000) + 1;
        
        if (moneydb <= 0 || moneydb == undefined) {
            return api.sendMessage(`𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${nameVictim} 𝙚𝙧 𝙠𝙖𝙘𝙝𝙚, 𝙠𝙞𝙣𝙩𝙪 𝙩𝙖𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙖𝙠𝙖 𝙣𝙚𝙞. 𝙏𝙖𝙞 𝙖𝙥𝙣𝙞 𝙠𝙞𝙘𝙝𝙪 𝙥𝙖𝙞𝙡𝙚𝙣 𝙣𝙖!`, event.threadID, event.messageID);
        }
        else if (moneydb >= money) {
            return api.sendMessage(`𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${money}$ ${nameVictim} 𝙚𝙧 𝙠𝙖𝙘𝙝𝙚 �𝙚𝙠𝙚 𝙚𝙞 𝙜𝙧𝙪𝙥 𝙚!`, event.threadID, async () => {
                await Currencies.increaseMoney(victim, parseInt("-"+money))
                await Currencies.increaseMoney(event.senderID, parseInt(money))
            }, event.messageID);
        }
        else if (moneydb < money) {
            return api.sendMessage(`𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${nameVictim} 𝙚𝙧 𝙨𝙤𝙗 𝙩𝙖𝙠𝙖 ${moneydb}$ 𝙚𝙞 𝙜𝙧𝙪𝙥 𝙚!`, event.threadID, async () => {
                await Currencies.increaseMoney(victim, parseInt("-"+moneydb))
                await Currencies.increaseMoney(event.senderID, parseInt(moneydb))
            }, event.messageID);
        }
    }
    else if (route == 1) {
        var name = (await Users.getData(event.senderID)).name
        var moneyuser = (await Currencies.getData(event.senderID)).money
        
        if (moneyuser <= 0) {
            return api.sendMessage("𝘼𝙥𝙣𝙖𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙖𝙠𝙖 𝙣𝙚𝙞, 𝙩𝙖𝙠𝙖 𝙠𝙖𝙢𝙖𝙞𝙩𝙚 𝙠𝙖𝙟 𝙠𝙤𝙧𝙪𝙣!", event.threadID, event.messageID);
        }
        else if (moneyuser > 0) {
            const reward = Math.floor(moneyuser / 2);
            return api.sendMessage(`𝘼𝙥𝙣𝙞 𝙙𝙝𝙤𝙧𝙧𝙖 𝙠𝙝𝙖𝙚𝙣 𝙚𝙗𝙤𝙣𝙜 𝙝𝙖𝙧𝙖𝙡𝙚𝙣 ${moneyuser}$!`, event.threadID, () => {
                api.sendMessage({
                    body: `𝘼𝙗𝙝𝙞𝙣𝙖𝙣𝙙𝙖𝙣 ${nameVictim}! 𝘼𝙥𝙣𝙞 𝙙𝙝𝙤𝙧𝙡𝙚𝙣 ${name} 𝙠𝙚 𝙚𝙗𝙤𝙣𝙜 𝙥𝙚𝙡𝙚𝙣 ${reward}$ 𝙥𝙪𝙧𝙖𝙨𝙠𝙖𝙧 𝙝𝙞𝙨𝙝𝙚𝙗𝙚!`,
                    mentions: [
                        { tag: nameVictim, id: victim },
                        { tag: name, id: event.senderID }
                    ]
                }, event.threadID, async () => {
                    await Currencies.increaseMoney(event.senderID, parseInt("-"+ moneyuser))
                    await Currencies.increaseMoney(victim, parseInt(reward)) 
                });
            }, event.messageID);
        }
    }
};
