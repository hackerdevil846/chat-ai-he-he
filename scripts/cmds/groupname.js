module.exports.config = {
    name: "groupname",
    aliases: ["setname", "changename"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 1,
    category: "𝑔𝑟𝑜𝑢𝑝",
    shortDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝'𝑠 𝑛𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑒"
    },
    longDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑦𝑜𝑢𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑔𝑟𝑜𝑢𝑝 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑠𝑡𝑦𝑙𝑖𝑛𝑔"
    },
    guide: {
        en: "{p}groupname [𝑛𝑒𝑤 𝑛𝑎𝑚𝑒]"
    },
    dependencies: {}
};

module.exports.onStart = async function({ message, args, event, api }) {
    try {
        const { threadID, messageID, senderID } = event;
        const newName = args.join(" ");
        
        if (!newName) {
            return message.reply("🎯 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑛𝑒𝑤 𝑛𝑎𝑚𝑒 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝!\n💡 | 𝑈𝑠𝑎𝑔𝑒: 𝑔𝑟𝑜𝑢𝑝𝑛𝑎𝑚𝑒 [𝑛𝑒𝑤 𝑛𝑎𝑚𝑒]", threadID, messageID);
        }
        
        if (newName.length > 200) {
            return message.reply("❌ | 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑐𝑎𝑛𝑛𝑜𝑡 𝑒𝑥𝑐𝑒𝑒𝑑 200 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠!", threadID, messageID);
        }
        
        await api.setTitle(newName, threadID);
        
        const userInfo = await api.getUserInfo(senderID);
        const userName = userInfo[senderID]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
        
        return message.reply({
            body: `✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒!\n\n✨ | 𝑁𝑒𝑤 𝑁𝑎𝑚𝑒: 「 ${newName} 」\n👤 | 𝐶ℎ𝑎𝑛𝑔𝑒𝑑 𝐵𝑦: @${userName}`,
            mentions: [{
                tag: `@${userName}`,
                id: senderID
            }]
        }, threadID, messageID);
        
    } catch (error) {
        console.error("𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ | 𝐸𝑟𝑟𝑜𝑟 𝑐ℎ𝑎𝑛𝑔𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒!\n🔧 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑠𝑢𝑟𝑒 𝐼 ℎ𝑎𝑣𝑒 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑎𝑛𝑑 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!", event.threadID, event.messageID);
    }
};

module.exports.onChat = async function({ event }) {
    // Additional chat handling if needed
};

module.exports.onLoad = function() {
    // Code that runs when the command is loaded
    console.log("𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐿𝑜𝑎𝑑𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
};
