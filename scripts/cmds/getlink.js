module.exports.config = {
    name: "getlink",
    aliases: ["downloadlink", "mediaurl"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝐺𝑒𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑖𝑛𝑘𝑠 𝑓𝑜𝑟 𝑎𝑡𝑡𝑎𝑐ℎ𝑒𝑑 𝑚𝑒𝑑𝑖𝑎"
    },
    longDescription: {
        en: "𝑅𝑒𝑡𝑟𝑖𝑒𝑣𝑒𝑠 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑖𝑛𝑘𝑠 𝑓𝑜𝑟 𝑎𝑡𝑡𝑎𝑐ℎ𝑒𝑑 𝑚𝑒𝑑𝑖𝑎 𝑓𝑖𝑙𝑒𝑠"
    },
    guide: {
        en: "{p}getlink [𝑟𝑒𝑝𝑙𝑦]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "invaidFormat": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑝𝑙𝑦! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑎𝑢𝑑𝑖𝑜, 𝑣𝑖𝑑𝑒𝑜, 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒",
        "multipleAttachments": "❌ 𝑇𝑜𝑜 𝑚𝑎𝑛𝑦 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡𝑠! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑜𝑛𝑙𝑦 𝑜𝑛𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡",
        "success": "⬇️ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐿𝑖𝑛𝑘:\n\n🔗 %1"
    }
};

module.exports.onStart = async function({ message, event, getText }) {
    try {
        const { messageReply } = event;
        
        if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
            return message.reply(getText("invaidFormat"));
        }
        
        if (messageReply.attachments.length > 1) {
            return message.reply(getText("multipleAttachments"));
        }
        
        const attachment = messageReply.attachments[0];
        
        await message.reply({
            body: getText("success", attachment.url),
            attachment: await global.utils.getStreamFromURL(attachment.url)
        });

    } catch (error) {
        console.error("𝐺𝑒𝑡𝐿𝑖𝑛𝑘 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡");
    }
};
