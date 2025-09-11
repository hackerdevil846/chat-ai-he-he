const axios = require('axios');

module.exports.config = {
    name: "imgurv2",
    aliases: ["imgurupload", "uploadimgur"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "tools",
    shortDescription: {
        en: "𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒/𝑣𝑖𝑑𝑒𝑜 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟"
    },
    longDescription: {
        en: "𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑜𝑟 𝑣𝑖𝑑𝑒𝑜𝑠 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟 𝑎𝑛𝑑 𝑔𝑒𝑡 𝑠ℎ𝑎𝑟𝑒𝑎𝑏𝑙𝑒 𝑙𝑖𝑛𝑘𝑠"
    },
    guide: {
        en: "{p}imgurv2 [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒/𝑣𝑖𝑑𝑒𝑜]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message, event, api }) {
    try {
        const link = event.messageReply?.attachments[0]?.url || event.attachments[0]?.url;
        
        if (!link) {
            return message.reply('📸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑣𝑖𝑑𝑒𝑜 𝑡𝑜 𝑢𝑝𝑙𝑜𝑎𝑑!');
        }

        await message.reply('🔄 𝑈𝑝𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟...');

        const res = await axios.get(`https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json`);
        const response = await axios.get(`${res.data.csb}/nazrul/imgur?link=${encodeURIComponent(link)}`);
        
        if (response.data.uploaded.image) {
            return message.reply(`✅ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙!\n\n🔗 𝐼𝑚𝑔𝑢𝑟 𝐿𝑖𝑛𝑘: ${response.data.uploaded.image}`);
        } else {
            return message.reply('❌ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.');
        }
    } catch (error) {
        console.error("𝐼𝑚𝑔𝑢𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply('⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑢𝑝𝑙𝑜𝑎𝑑𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.');
    }
};
