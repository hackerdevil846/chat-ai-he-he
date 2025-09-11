const axios = require('axios');

module.exports.config = {
    name: "imgur",
    aliases: ["imagehost", "upload"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
        en: "🖼️ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟"
    },
    longDescription: {
        en: "𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟 𝑎𝑛𝑑 𝑔𝑒𝑡 𝑑𝑖𝑟𝑒𝑐𝑡 𝑙𝑖𝑛𝑘𝑠"
    },
    guide: {
        en: "{p}imgur [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒] 𝑜𝑟 𝑡𝑦𝑝𝑒 '𝑖𝑚𝑔𝑢𝑟' 𝑤𝑖𝑡ℎ 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function ({ message, event }) {
    await this.uploadImage(message, event);
};

module.exports.onChat = async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "imgur") {
        await this.uploadImage(message, event);
    }
};

module.exports.uploadImage = async function (message, event) {
    const csbApi = async () => {
        try {
            const base = await axios.get(
                "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
            );
            return base.data.csb;
        } catch (error) {
            console.error("𝐴𝑃𝐼 𝐹𝑒𝑡𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
            throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡");
        }
    };

    let imageUrl;
    if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        imageUrl = event.messageReply.attachments[0].url;
    } else if (event.attachments && event.attachments.length > 0) {
        imageUrl = event.attachments[0].url;
    } else {
        return message.reply('❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑎𝑡𝑡𝑎𝑐ℎ 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒!');
    }

    try {
        const apiUrl = `${await csbApi()}/nazrul/imgur?link=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(apiUrl);
        
        if (!response.data || !response.data.uploaded || !response.data.uploaded.image) {
            throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝐼𝑚𝑔𝑢𝑟 𝐴𝑃𝐼");
        }

        const imgurLink = response.data.uploaded.image;
        return message.reply(`✅ 𝐼𝑚𝑎𝑔𝑒 𝑢𝑝𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n🖼️ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑖𝑛𝑘: ${imgurLink}`);

    } catch (error) {
        console.error("𝐼𝑚𝑔𝑢𝑟 𝑈𝑝𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
