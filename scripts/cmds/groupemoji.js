module.exports.config = {
    name: "groupemoji",
    aliases: ["setemoji", "changeemoji"],
    version: "1.0.0", 
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "𝑔𝑟𝑜𝑢𝑝",
    shortDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑒𝑚𝑜𝑗𝑖"
    },
    longDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑒𝑚𝑜𝑗𝑖 𝑜𝑓 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑟𝑜𝑢𝑝"
    },
    guide: {
        en: "{p}groupemoji [𝑒𝑚𝑜𝑗𝑖]"
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        const emoji = args.join(" ");
        
        if (!emoji) {
            return message.reply("❓ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎𝑛 𝑒𝑚𝑜𝑗𝑖 𝑡𝑜 𝑠𝑒𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝!");
        }
        
        await message.changeThreadEmoji(emoji);
        return message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑒𝑚𝑜𝑗𝑖 𝑡𝑜: ${emoji}`);
        
    } catch (error) {
        console.error(error);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑒𝑚𝑜𝑗𝑖. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
