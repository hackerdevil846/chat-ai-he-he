const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "groupimage",
    aliases: ["gavatar", "groupavatar"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "group",
    shortDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑖𝑚𝑎𝑔𝑒 𝑏𝑦 𝑟𝑒𝑝𝑙𝑦𝑖𝑛𝑔 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒𝑠 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟 𝑏𝑦 𝑟𝑒𝑝𝑙𝑦𝑖𝑛𝑔 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    },
    guide: {
        en: "{p}groupimage [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "noReply": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟",
        "noAttachment": "❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑒 𝑟𝑒𝑝𝑙𝑦",
        "multipleAttachments": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑜𝑛𝑙𝑦 𝑜𝑛𝑒 𝑖𝑚𝑎𝑔𝑒",
        "success": "✅ 𝐺𝑟𝑜𝑢𝑝 𝑖𝑚𝑎𝑔𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
        "failure": "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛"
    }
};

module.exports.onStart = async function({ message, event, getText }) {
    try {
        // Check dependencies
        if (!fs.existsSync) throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

        const languages = this.languages.en;
        
        if (event.type !== "message_reply") {
            return message.reply(languages.noReply);
        }
        
        if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
            return message.reply(languages.noAttachment);
        }
        
        if (event.messageReply.attachments.length > 1) {
            return message.reply(languages.multipleAttachments);
        }
        
        const imageUrl = event.messageReply.attachments[0].url;
        const pathImg = __dirname + '/cache/group_image_' + Date.now() + '.png';
        
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        await fs.writeFileSync(pathImg, Buffer.from(response.data, 'utf-8'));
        
        await message.reply({
            attachment: fs.createReadStream(pathImg),
            body: "⏳ 𝑈𝑝𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑖𝑚𝑎𝑔𝑒..."
        });

        await message.unsend(event.messageID);
        
        await message.changeGroupImage(
            fs.createReadStream(pathImg), 
            event.threadID
        );
        
        fs.unlinkSync(pathImg);
        
        return message.reply(languages.success);
        
    } catch (error) {
        console.error("𝐺𝑟𝑜𝑢𝑝 𝐼𝑚𝑎𝑔𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        
        // Clean up temporary files
        const files = fs.readdirSync(__dirname + '/cache/').filter(file => file.startsWith('group_image_'));
        for (const file of files) {
            try {
                fs.unlinkSync(__dirname + '/cache/' + file);
            } catch (e) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝐸𝑟𝑟𝑜𝑟:", e);
            }
        }
        
        return message.reply(this.languages.en.failure);
    }
};
