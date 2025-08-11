module.exports.config = {
	name: "setmoney",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑪𝒉𝒂𝒏𝒈𝒆 𝒕𝒉𝒆 𝒂𝒎𝒐𝒖𝒏𝒕 𝒐𝒇 𝒎𝒐𝒏𝒆𝒚 𝒇𝒐𝒓 𝒚𝒐𝒖𝒓𝒔𝒆𝒍𝒇 𝒐𝒓 𝒕𝒂𝒈𝒈𝒆𝒅 𝒖𝒔𝒆𝒓𝒔",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "𝒔𝒆𝒕𝒎𝒐𝒏𝒆𝒚 [𝒎𝒆/𝒅𝒆𝒍/𝑼𝑰𝑫] [𝒂𝒎𝒐𝒖𝒏𝒕/𝒕𝒂𝒈]",
	cooldowns: 5,
	info: [
		{
			key: '𝑶𝒑𝒕𝒊𝒐𝒏𝒔',
			prompt: '𝒎𝒆: 𝒔𝒆𝒕 𝒚𝒐𝒖𝒓 𝒎𝒐𝒏𝒆𝒚\n𝒅𝒆𝒍: 𝒅𝒆𝒍𝒆𝒕𝒆 𝒎𝒐𝒏𝒆𝒚\n𝑼𝑰𝑫: 𝒔𝒆𝒕 𝒃𝒚 𝑼𝒔𝒆𝒓 𝑰𝑫',
			type: '𝑺𝒕𝒓𝒊𝒏𝒈',
			example: '𝒎𝒆 1000'
		}
	]
};

module.exports.run = async function({ api, event, args, Currencies, Users }) {
    try {
        const { threadID, messageID, senderID, mentions } = event;
        const action = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        const uid = args[1];
        const setAmount = parseInt(args[2]);

        // Set money for yourself
        if (action === "me") {
            if (isNaN(amount)) return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒏𝒖𝒎𝒃𝒆𝒓", threadID, messageID);
            
            await Currencies.setData(senderID, { money: amount });
            return api.sendMessage(`✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒕 𝒚𝒐𝒖𝒓 𝒎𝒐𝒏𝒆𝒚 𝒕𝒐 ${amount} 💸`, threadID, messageID);
        }
        
        // Delete money
        else if (action === "del") {
            const target = args[1]?.toLowerCase();
            
            // Delete your own money
            if (target === "me") {
                const currentMoney = (await Currencies.getData(senderID)).money;
                await Currencies.setData(senderID, { money: 0 });
                return api.sendMessage(`✅ 𝑫𝒆𝒍𝒆𝒕𝒆𝒅 𝒂𝒍𝒍 𝒚𝒐𝒖𝒓 𝒎𝒐𝒏𝒆𝒚!\n💸 𝑨𝒎𝒐𝒖𝒏𝒕 𝒓𝒆𝒎𝒐𝒗𝒆𝒅: ${currentMoney}`, threadID, messageID);
            }
            // Delete money for mentioned user
            else if (Object.keys(mentions).length === 1) {
                const mentionID = Object.keys(mentions)[0];
                const name = mentions[mentionID].replace("@", "");
                const currentMoney = (await Currencies.getData(mentionID)).money;
                
                await Currencies.setData(mentionID, { money: 0 });
                return api.sendMessage(`✅ 𝑫𝒆𝒍𝒆𝒕𝒆𝒅 𝒂𝒍𝒍 𝒎𝒐𝒏𝒆𝒚 𝒇𝒐𝒓 ${name}!\n💸 𝑨𝒎𝒐𝒖𝒏𝒕 𝒓𝒆𝒎𝒐𝒗𝒆𝒅: ${currentMoney}`, threadID, messageID);
            }
        }
        
        // Set money by UID
        else if (action === "uid") {
            if (isNaN(uid) return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑼𝒔𝒆𝒓 𝑰𝑫", threadID, messageID);
            if (isNaN(setAmount)) return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕", threadID, messageID);
            
            const userName = (await Users.getData(uid)).name;
            await Currencies.setData(uid, { money: setAmount });
            return api.sendMessage(`✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒕 𝒎𝒐𝒏𝒆𝒚 𝒇𝒐𝒓 ${userName} (${uid}) 𝒕𝒐 ${setAmount} 💸`, threadID, messageID);
        }
        
        // Set money for mentioned user
        else if (Object.keys(mentions).length === 1) {
            if (isNaN(amount)) return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒏𝒖𝒎𝒃𝒆𝒓", threadID, messageID);
            
            const mentionID = Object.keys(mentions)[0];
            const name = mentions[mentionID].replace("@", "");
            
            await Currencies.setData(mentionID, { money: amount });
            return api.sendMessage({
                body: `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒕 𝒎𝒐𝒏𝒆𝒚 𝒇𝒐𝒓 ${name} 𝒕𝒐 ${amount} 💸`,
                mentions: [{
                    tag: name,
                    id: mentionID
                }]
            }, threadID, messageID);
        }
        
        // Invalid command
        else {
            return api.sendMessage("ℹ️ 𝑼𝒔𝒂𝒈𝒆:\𝒏𝒔𝒆𝒕𝒎𝒐𝒏𝒆𝒚 𝒎𝒆 [𝒂𝒎𝒐𝒖𝒏𝒕]\𝒏𝒔𝒆𝒕𝒎𝒐𝒏𝒆𝒚 𝒅𝒆𝒍 𝒎𝒆\𝒏𝒔𝒆𝒕𝒎𝒐𝒏𝒆𝒚 @𝒖𝒔𝒆𝒓 [𝒂𝒎𝒐𝒖𝒏𝒕]\𝒏𝒔𝒆𝒕𝒎𝒐𝒏𝒆𝒚 𝑼𝑰𝑫 [𝒖𝒔𝒆𝒓𝑰𝑫] [𝒂𝒎𝒐𝒖𝒏𝒕]", threadID, messageID);
        }
        
    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕", threadID, messageID);
    }
};
