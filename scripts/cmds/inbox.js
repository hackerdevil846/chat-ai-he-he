module.exports.config = {
    name: "inbox",
    aliases: ["in"],
    version: "1.7",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑓𝑟𝑖𝑒𝑛𝑑𝑙𝑦 𝑖𝑛𝑏𝑜𝑥 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑒𝑚𝑜𝑗𝑖𝑠 ✨"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑓𝑟𝑖𝑒𝑛𝑑𝑙𝑦 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑖𝑛𝑏𝑜𝑥 𝑤𝑖𝑡ℎ 𝑐𝑢𝑡𝑒 𝑒𝑚𝑜𝑗𝑖𝑠"
    },
    guide: {
        en: "{p}inbox [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {}
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        const expectedAuthor = "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑";
        if (this.config.author !== expectedAuthor) {
            return message.reply("❌ 𝐴𝑢𝑡ℎ𝑜𝑟𝑖𝑧𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑: 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑢𝑡ℎ𝑜𝑟 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛");
        }

        const query = encodeURIComponent(args.join(' '));
        await message.reply("💌 𝑏𝑎𝑏𝑦 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑏𝑜𝑥 🐤");
        
        // Send private message to user
        await message.reply("😘 ℎ𝑖 𝑏𝑎𝑏𝑦", event.senderID);
        
    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("😢 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
};
