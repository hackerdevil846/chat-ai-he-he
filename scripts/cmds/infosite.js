const axios = require('axios');
const fs = require("fs-extra");

module.exports.config = {
    name: "siteinf",
    aliases: ["websiteinfo", "siteinfo"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
        en: "𝑊𝑒𝑏𝑠𝑖𝑡𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐ℎ𝑒𝑐𝑘𝑒𝑟"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑎 𝑤𝑒𝑏𝑠𝑖𝑡𝑒"
    },
    guide: {
        en: "{p}siteinf [𝑤𝑒𝑏𝑠𝑖𝑡𝑒 𝑢𝑟𝑙]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        // Check dependencies
        if (!axios || !fs) {
            return message.reply("❌ 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔");
        }

        if (!args[0]) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑤𝑒𝑏𝑠𝑖𝑡𝑒 𝑈𝑅𝐿", event.threadID, event.messageID);
        }
        
        await message.reply("🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑤𝑒𝑏𝑠𝑖𝑡𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛...", event.threadID);
        
        const response = await axios.get(`https://list.ly/api/v4/meta?url=${encodeURIComponent(args[0])}`);
        const data = response.data;
        
        if (!data.name || !data.description) {
            return message.reply("⚠️ 𝑁𝑜 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑔𝑖𝑣𝑒𝑛 𝑈𝑅𝐿", event.threadID);
        }
        
        const imagePath = __dirname + `/cache/siteinf_${event.senderID}.png`;
        let hasImage = false;
        
        if (data.image) {
            try {
                const imageResponse = await axios.get(data.image, { responseType: 'arraybuffer' });
                await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
                hasImage = true;
            } catch (imageError) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", imageError);
            }
        }
        
        const messageText = `🌐 𝑊𝑒𝑏𝑠𝑖𝑡𝑒 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛
━━━━━━━━━━━━━━━━━
📛 𝑁𝑎𝑚𝑒: ${data.name}
📝 𝐷𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛: ${data.description}
🔗 𝑈𝑅𝐿: ${data.url}
━━━━━━━━━━━━━━━━━
✨ 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦: ${this.config.author}`;
        
        if (hasImage && fs.existsSync(imagePath)) {
            await message.reply({
                body: messageText,
                attachment: fs.createReadStream(imagePath)
            });
            fs.unlinkSync(imagePath);
        } else {
            await message.reply(messageText);
        }
        
    } catch (error) {
        console.error("𝑆𝑖𝑡𝑒𝐼𝑛𝑓 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑤𝑒𝑏𝑠𝑖𝑡𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛", event.threadID);
    }
};
