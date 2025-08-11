module.exports.config = {
    name: "setexp",
    version: "1.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑴𝒐𝒅𝒊𝒇𝒚 𝑬𝑿𝑷 𝒍𝒆𝒗𝒆𝒍𝒔 𝒇𝒐𝒓 𝒖𝒔𝒆𝒓𝒔",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "setexp [me/del/UID] [amount/userID]",
    cooldowns: 5,
    info: [
        {
            key: '𝒐𝒑𝒕𝒊𝒐𝒏𝒔',
            prompt: '𝒎𝒆: 𝒔𝒆𝒕 𝒚𝒐𝒖𝒓 𝑬𝑿𝑷\𝒅𝒆𝒍: 𝒓𝒆𝒔𝒆𝒕 𝑬𝑿𝑷 𝒕𝒐 𝟬\𝑼𝑰𝑫: 𝒔𝒆𝒕 𝑬𝑿𝑷 𝒃𝒚 𝒖𝒔𝒆𝒓 𝑰𝑫',
            type: '𝑺𝒕𝒓𝒊𝒏𝒈',
            example: 'setexp me 100 | setexp del @user | setexp UID 12345678 500'
        }
    ]
};

module.exports.run = async function({ api, event, args, Currencies, Users }) {
    try {
        const { threadID, messageID, senderID } = event;
        const action = args[0]?.toLowerCase();
        const target = args[1];
        const amount = parseInt(args[2]);

        // Set own EXP
        if (action === 'me') {
            const expValue = parseInt(args[1]);
            if (isNaN(expValue)) {
                return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑬𝑿𝑷 𝒗𝒂𝒍𝒖𝒆! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒏𝒖𝒎𝒃𝒆𝒓", threadID, messageID);
            }
            await Currencies.setData(senderID, { exp: expValue });
            return api.sendMessage(`✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒕 𝒚𝒐𝒖𝒓 𝑬𝑿𝑷 𝒕𝒐 ${expValue} 🥇`, threadID, messageID);
        }

        // Reset EXP to zero
        if (action === 'del') {
            // Reset own EXP
            if (target === 'me') {
                const currentExp = (await Currencies.getData(senderID)).exp;
                await Currencies.setData(senderID, { exp: 0 });
                return api.sendMessage(`✅ 𝑹𝒆𝒔𝒆𝒕 𝒚𝒐𝒖𝒓 𝑬𝑿𝑷!\n𝑹𝒆𝒎𝒐𝒗𝒆𝒅 ${currentExp} 𝑬𝑿𝑷 𝒑𝒐𝒊𝒏𝒕𝒔`, threadID, messageID);
            }
            
            // Reset mentioned user's EXP
            if (event.mentions && Object.keys(event.mentions).length === 1) {
                const mentionID = Object.keys(event.mentions)[0];
                const userName = event.mentions[mentionID].replace("@", "");
                const currentExp = (await Currencies.getData(mentionID)).exp;
                await Currencies.setData(mentionID, { exp: 0 });
                return api.sendMessage(`✅ 𝑹𝒆𝒔𝒆𝒕 ${userName}'𝒔 𝑬𝑿𝑷!\n𝑹𝒆𝒎𝒐𝒗𝒆𝒅 ${currentExp} 𝑬𝑿𝑷 𝒑𝒐𝒊𝒏𝒕𝒔`, threadID, messageID);
            }
            
            return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒖𝒔𝒂𝒈𝒆: 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒂𝒈 𝒂 𝒖𝒔𝒆𝒓 𝒐𝒓 𝒖𝒔𝒆 '𝒎𝒆'", threadID, messageID);
        }

        // Set EXP by UID
        if (action === 'uid') {
            if (!target || isNaN(amount)) {
                return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒔𝒚𝒏𝒕𝒂𝒙: 𝑼𝒔𝒆 '𝒔𝒆𝒕𝒆𝒙𝒑 𝑼𝑰𝑫 [𝒖𝒔𝒆𝒓𝑰𝑫] [𝒂𝒎𝒐𝒖𝒏𝒕]'", threadID, messageID);
            }
            const userData = await Users.getData(target);
            if (!userData || !userData.name) {
                return api.sendMessage("❌ 𝑼𝒔𝒆𝒓 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒄𝒉𝒆𝒄𝒌 𝒕𝒉𝒆 𝑼𝑰𝑫", threadID, messageID);
            }
            await Currencies.setData(target, { exp: amount });
            return api.sendMessage(`✅ 𝑺𝒆𝒕 ${userData.name}'𝒔 𝑬𝑿𝑷 𝒕𝒐 ${amount} 🥇`, threadID, messageID);
        }

        // Set EXP for mentioned user
        if (event.mentions && Object.keys(event.mentions).length === 1) {
            const mentionID = Object.keys(event.mentions)[0];
            const expValue = parseInt(args[args.length - 1]);
            if (isNaN(expValue)) {
                return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑬𝑿𝑷 𝒗𝒂𝒍𝒖𝒆! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒏𝒖𝒎𝒃𝒆𝒓", threadID, messageID);
            }
            const userName = event.mentions[mentionID].replace("@", "");
            await Currencies.setData(mentionID, { exp: expValue });
            return api.sendMessage({
                body: `✅ 𝑺𝒆𝒕 ${userName}'𝒔 𝑬𝑿𝑷 𝒕𝒐 ${expValue} 🥇`,
                mentions: [{ tag: userName, id: parseInt(mentionID) }]
            }, threadID, messageID);
        }

        // Default error message
        return api.sendMessage(`❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅! 𝑼𝒔𝒂𝒈𝒆 𝒆𝒙𝒂𝒎𝒑𝒍𝒆𝒔:
• 𝒔𝒆𝒕𝒆𝒙𝒑 𝒎𝒆 𝟭𝟬𝟬
• 𝒔𝒆𝒕𝒆𝒙𝒑 @𝒖𝒔𝒆𝒓 𝟱𝟬𝟬
• 𝒔𝒆𝒕𝒆𝒙𝒑 𝒅𝒆𝒍 @𝒖𝒔𝒆𝒓
• 𝒔𝒆𝒕𝒆𝒙𝒑 𝑼𝑰𝑫 𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴 𝟭𝟬𝟬𝟬`, threadID, messageID);

    } catch (error) {
        console.error("𝑺𝒆𝒕𝑬𝑿𝑷 𝑬𝒓𝒓𝒐𝒓:", error);
        api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕", event.threadID, event.messageID);
    }
};
