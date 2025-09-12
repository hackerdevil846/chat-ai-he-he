module.exports.config = {
    name: "botsay",
    aliases: ["say", "repeat"],
    version: "1.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑤𝑖𝑙𝑙 𝑟𝑒𝑝𝑒𝑎𝑡 𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 📣"
    },
    longDescription: {
        en: "𝐵𝑜𝑡 𝑤𝑖𝑙𝑙 𝑟𝑒𝑝𝑒𝑎𝑡 𝑡ℎ𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑦𝑜𝑢 𝑝𝑟𝑜𝑣𝑖𝑑𝑒"
    },
    guide: {
        en: "{p}botsay [𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        const say = args.join(" ");
        
        if (!say) {
            return message.reply("❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝑚𝑒 𝑡𝑜 𝑟𝑒𝑝𝑒𝑎𝑡!");
        }

        return message.reply(`🗨️ ${say}`);
        
    } catch (error) {
        console.error("𝐵𝑜𝑡𝑆𝑎𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
};
