module.exports.config = {
    name: "fuckyou",
    aliases: ["fy", "middlefinger"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "no-prefix",
    shortDescription: {
        en: "🖕 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 '𝑓𝑢𝑐𝑘' 𝑡𝑟𝑖𝑔𝑔𝑒𝑟"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑤𝑖𝑡ℎ 𝑚𝑖𝑑𝑑𝑙𝑒 𝑓𝑖𝑛𝑔𝑒𝑟 𝑤ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑠𝑎𝑦𝑠 '𝑓𝑢𝑐𝑘'"
    },
    guide: {
        en: "[𝑎𝑢𝑡𝑜-𝑡𝑟𝑖𝑔𝑔𝑒𝑟]"
    },
    dependencies: {
        "axios": ""
    },
    envConfig: {}
};

module.exports.onStart = async function({ message, event }) {
    try {
        if (event.body?.toLowerCase().trim() === "fuck") {
            await message.reply({
                body: "🖕 *𝐹𝑢𝑐𝑘 𝑦𝑜𝑢 𝑡𝑜𝑜!*",
                attachment: [
                    await global.utils.getStreamFromURL(
                        "https://i.imgur.com/9bNeakd.gif"
                    )
                ]
            });
        }
    } catch (err) {
        console.error("❌ [𝐹𝑢𝑐𝑘𝑌𝑜𝑢 𝐸𝑟𝑟𝑜𝑟]", err);
        await message.reply("❌ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
    }
};

module.exports.onChat = async function({ message, event }) {
    try {
        if (event.body?.toLowerCase().trim() === "fuck") {
            await message.reply({
                body: "🖕 *𝐹𝑢𝑐𝑘 𝑦𝑜𝑢 𝑡𝑜𝑜!*",
                attachment: [
                    await global.utils.getStreamFromURL(
                        "https://i.imgur.com/9bNeakd.gif"
                    )
                ]
            });
        }
    } catch (err) {
        console.error("❌ [𝐹𝑢𝑐𝑘𝑌𝑜𝑢 𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟]", err);
    }
};
