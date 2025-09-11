module.exports.config = {
    name: "idst",
    aliases: ["stickerid", "stid"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "sticker",
    shortDescription: {
        en: "𝐺𝑒𝑡 𝑠𝑡𝑖𝑐𝑘𝑒𝑟 𝐼𝐷 𝑜𝑟 𝑠𝑒𝑛𝑑 𝑠𝑡𝑖𝑐𝑘𝑒𝑟 𝑏𝑦 𝐼𝐷"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑠𝑡𝑖𝑐𝑘𝑒𝑟 𝐼𝐷 𝑓𝑟𝑜𝑚 𝑟𝑒𝑝𝑙𝑦 𝑜𝑟 𝑠𝑒𝑛𝑑 𝑠𝑡𝑖𝑐𝑘𝑒𝑟 𝑢𝑠𝑖𝑛𝑔 𝐼𝐷"
    },
    guide: {
        en: "{p}idst [𝑟𝑒𝑝𝑙𝑦|𝑠𝑡𝑖𝑐𝑘𝑒𝑟𝐼𝐷]"
    },
    dependencies: {}
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        if (event.type === "message_reply") {
            if (event.messageReply.attachments && event.messageReply.attachments[0]?.type === "sticker") {
                const stickerInfo = event.messageReply.attachments[0];
                return message.reply({
                    body: `🎟️ 𝑆𝑡𝑖𝑐𝑘𝑒𝑟 𝐼𝐷: ${stickerInfo.ID}\n📝 𝐶𝑎𝑝𝑡𝑖𝑜𝑛: ${stickerInfo.description || '𝑁𝑜 𝑐𝑎𝑝𝑡𝑖𝑜𝑛 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒'}`,
                    mentions: []
                });
            }
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑠𝑡𝑖𝑐𝑘𝑒𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
        }

        if (args[0]) {
            return message.reply({
                body: "✨ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑠𝑡𝑖𝑐𝑘𝑒𝑟:",
                sticker: args[0]
            });
        }

        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒!\n💡 𝑈𝑠𝑎𝑔𝑒:\n• 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑠𝑡𝑖𝑐𝑘𝑒𝑟 𝑡𝑜 𝑔𝑒𝑡 𝐼𝐷\n• 𝑃𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑡𝑖𝑐𝑘𝑒𝑟 𝐼𝐷 𝑡𝑜 𝑠𝑒𝑛𝑑");

    } catch (error) {
        console.error("𝑆𝑡𝑖𝑐𝑘𝑒𝑟 𝐼𝐷 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑");
    }
};
