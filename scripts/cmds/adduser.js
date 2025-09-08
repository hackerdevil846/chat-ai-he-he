module.exports.config = {
    name: "adduser",
    aliases: ["addmember", "invite"],
    version: "2.4.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "group",
    shortDescription: {
        en: "𝐴𝑑𝑑 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝 𝑏𝑦 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑖𝑑"
    },
    longDescription: {
        en: "𝐴𝑑𝑑 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒𝑖𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘"
    },
    guide: {
        en: "{p}adduser [𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑈𝑅𝐿]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message, event, args, api }) {
    try {
        if (!args[0]) {
            return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘");
        }

        const threadInfo = await api.getThreadInfo(event.threadID);
        const participantIDs = threadInfo.participantIDs.map(id => id.toString());
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id.toString());

        let targetID;
        let userName = "𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟";

        // Check if input is a numeric ID
        if (!isNaN(args[0])) {
            targetID = args[0].toString();
            try {
                const userInfo = await api.getUserInfo(targetID);
                userName = userInfo[targetID]?.name || userName;
            } catch (error) {
                console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜:", error);
            }
        } 
        // Check if input is a Facebook profile URL
        else if (args[0].includes("facebook.com") || args[0].includes("fb.com")) {
            try {
                // Extract ID from URL (simple approach)
                const url = args[0];
                let extractedID = url.match(/(?:\/|id=)(\d+)/);
                
                if (extractedID && extractedID[1]) {
                    targetID = extractedID[1];
                    const userInfo = await api.getUserInfo(targetID);
                    userName = userInfo[targetID]?.name || userName;
                } else {
                    return message.reply("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑒𝑥𝑡𝑟𝑎𝑐𝑡 𝐼𝐷 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘");
                }
            } catch (error) {
                return message.reply("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘 𝑜𝑟 𝐼𝐷 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
            }
        } 
        else {
            return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘");
        }

        // Check if user is already in the group
        if (participantIDs.includes(targetID)) {
            return message.reply("𝑇ℎ𝑖𝑠 𝑢𝑠𝑒𝑟 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝");
        }

        // Try to add the user to the group
        try {
            await api.addUserToGroup(targetID, event.threadID);
            return message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑎𝑑𝑑𝑒𝑑 ${userName} 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝`);
        } catch (error) {
            console.error("𝐴𝑑𝑑 𝑢𝑠𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
            
            if (error.message.includes("approval")) {
                return message.reply(`📝 ${userName} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑎𝑑𝑑𝑒𝑑 𝑡𝑜 𝑡ℎ𝑒 𝑎𝑝𝑝𝑟𝑜𝑣𝑎𝑙 𝑙𝑖𝑠𝑡. 𝑇ℎ𝑒𝑦 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑎𝑐𝑐𝑒𝑝𝑡 𝑡ℎ𝑒 𝑖𝑛𝑣𝑖𝑡𝑒.`);
            } else if (error.message.includes("friend")) {
                return message.reply(`❌ 𝐶𝑎𝑛'𝑡 𝑎𝑑𝑑 ${userName}. 𝑇ℎ𝑒 𝑏𝑜𝑡 𝑛𝑒𝑒𝑑𝑠 𝑡𝑜 𝑏𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑓𝑖𝑟𝑠𝑡.`);
            } else if (error.message.includes("privacy")) {
                return message.reply(`🔒 ${userName}'𝑠 𝑝𝑟𝑖𝑣𝑎𝑐𝑦 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑝𝑟𝑒𝑣𝑒𝑛𝑡 𝑎𝑑𝑑𝑖𝑛𝑔 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝𝑠.`);
            } else {
                return message.reply(`❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑎𝑑𝑑 ${userName}: ${error.message}`);
            }
        }

    } catch (error) {
        console.error("𝐴𝑑𝑑𝑈𝑠𝑒𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
