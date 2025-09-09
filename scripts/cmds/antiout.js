module.exports.config = {
    name: "antiout",
    aliases: ["antileave", "preventleave"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    shortDescription: {
        en: "𝐸𝑛𝑎𝑏𝑙𝑒 𝑜𝑟 𝑑𝑖𝑠𝑎𝑏𝑙𝑒 𝑎𝑛𝑡𝑖𝑜𝑢𝑡"
    },
    longDescription: {
        en: "𝑃𝑟𝑒𝑣𝑒𝑛𝑡𝑠 𝑢𝑠𝑒𝑟𝑠 𝑓𝑟𝑜𝑚 𝑙𝑒𝑎𝑣𝑖𝑛𝑔 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦"
    },
    category: "group",
    guide: {
        en: "{p}antiout [𝑜𝑛 | 𝑜𝑓𝑓]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args, threadsData }) {
    try {
        if (!args[0] || !["𝑜𝑛", "𝑜𝑓𝑓"].includes(args[0].toLowerCase())) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 '𝑜𝑛' 𝑜𝑟 '𝑜𝑓𝑓' 𝑎𝑠 𝑎𝑛 𝑎𝑟𝑔𝑢𝑚𝑒𝑛𝑡");
        }

        const isEnabled = args[0].toLowerCase() === "𝑜𝑛";
        await threadsData.set(event.threadID, isEnabled, "settings.antiout");
        
        return message.reply(`✅ 𝐴𝑛𝑡𝑖𝑜𝑢𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 ${isEnabled ? "𝑒𝑛𝑎𝑏𝑙𝑒𝑑" : "𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑"}`);
        
    } catch (error) {
        console.error("𝐴𝑛𝑡𝑖𝑜𝑢𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};

module.exports.onEvent = async function({ api, event, threadsData }) {
    try {
        if (event.logMessageType !== "log:unsubscribe") {
            return;
        }

        const antioutEnabled = await threadsData.get(event.threadID, "settings.antiout");
        
        if (antioutEnabled && event.logMessageData && event.logMessageData.leftParticipantFbId) {
            const userId = event.logMessageData.leftParticipantFbId;
            
            // 𝐴𝑑𝑑 𝑎 𝑠𝑚𝑎𝑙𝑙 𝑑𝑒𝑙𝑎𝑦 𝑡𝑜 𝑒𝑛𝑠𝑢𝑟𝑒 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 ℎ𝑎𝑠 𝑎𝑐𝑡𝑢𝑎𝑙𝑙𝑦 𝑙𝑒𝑓𝑡
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            try {
                // 𝑇𝑟𝑦 𝑡𝑜 𝑎𝑑𝑑 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑏𝑎𝑐𝑘
                await api.addUserToGroup(userId, event.threadID);
                console.log(`✅ 𝑈𝑠𝑒𝑟 ${userId} 𝑤𝑎𝑠 𝑎𝑑𝑑𝑒𝑑 𝑏𝑎𝑐𝑘 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝`);
                
                // 𝑆𝑒𝑛𝑑 𝑎 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
                await api.sendMessage(
                    `⚠️ 𝐴𝑛𝑡𝑖𝑜𝑢𝑡 𝑆𝑦𝑠𝑡𝑒𝑚\n\n` +
                    `𝑈𝑠𝑒𝑟 𝑡𝑟𝑖𝑒𝑑 𝑡𝑜 𝑙𝑒𝑎𝑣𝑒 𝑏𝑢𝑡 𝑤𝑎𝑠 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑎𝑑𝑑𝑒𝑑 𝑏𝑎𝑐𝑘!\n` +
                    `𝑆𝑦𝑠𝑡𝑒𝑚: 𝐴𝑐𝑡𝑖𝑣𝑎𝑡𝑒𝑑`,
                    event.threadID
                );
                
            } catch (addError) {
                console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑎𝑑𝑑 𝑢𝑠𝑒𝑟 𝑏𝑎𝑐𝑘:", addError);
            }
        }
    } catch (error) {
        console.error("𝐴𝑛𝑡𝑖𝑜𝑢𝑡 𝑒𝑣𝑒𝑛𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};
