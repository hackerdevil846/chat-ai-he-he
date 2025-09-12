module.exports.config = {
    name: "edit",
    aliases: ["imageedit", "imgedit"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐸𝑑𝑖𝑡 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝐴𝐼"
    },
    longDescription: {
        en: "𝐸𝑑𝑖𝑡 𝑖𝑚𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝐴𝐼 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡𝑠"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}edit <𝑝𝑟𝑜𝑚𝑝𝑡> (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒)"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, api, args, event }) {
    try {
        if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
            return message.reply("📸| 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑒𝑑𝑖𝑡 𝑖𝑡.");
        }

        if (!args[0]) {
            return message.reply("📝| 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡.");
        }

        const prompt = encodeURIComponent(args.join(" "));
        const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);
        const geditUrl = `https://smfahim.xyz/gedit?prompt=${prompt}&url=${imgurl}`;

        api.setMessageReaction("🦆", event.messageID, () => {}, true);

        const processingMsg = await message.reply("🦆| 𝐸𝑑𝑖𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");

        try {
            const attachment = await global.utils.getStreamFromURL(geditUrl);
            
            await message.reply({ 
                body: `🔥| 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑒𝑑𝑖𝑡𝑒𝑑 𝑖𝑚𝑎𝑔𝑒!`, 
                attachment: attachment 
            });

            await message.unsend(processingMsg.messageID);
            api.setMessageReaction("🌚", event.messageID, () => {}, true);
            
        } catch (error) {
            console.error("𝐸𝑑𝑖𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("📛| 𝑇ℎ𝑒𝑟𝑒 𝑤𝑎𝑠 𝑎𝑛 𝑒𝑟𝑟𝑜𝑟 𝑒𝑑𝑖𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒.");
            await message.unsend(processingMsg.messageID);
        }

    } catch (error) {
        console.error("𝑀𝑎𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌| 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
};
