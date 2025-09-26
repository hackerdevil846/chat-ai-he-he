const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "animefy",
    aliases: ["animefilter", "animeart"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    shortDescription: {
        en: "𝐶𝑜𝑛𝑣𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒 𝑖𝑛𝑡𝑜 𝑎𝑛𝑖𝑚𝑒 𝑠𝑡𝑦𝑙𝑒"
    },
    longDescription: {
        en: "𝑇𝑟𝑎𝑛𝑠𝑓𝑜𝑟𝑚 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒𝑠 𝑖𝑛𝑡𝑜 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑎𝑟𝑡"
    },
    category: "𝑎𝑛𝑖𝑚𝑒",
    guide: {
        en: "{p}animefy [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        if (!event.messageReply ||
            !event.messageReply.attachments ||
            !event.messageReply.attachments[0] ||
            !event.messageReply.attachments[0].url) {
            return message.reply("🖼️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑣𝑒𝑟𝑡 𝑖𝑡 𝑡𝑜 𝑎𝑛𝑖𝑚𝑒 𝑠𝑡𝑦𝑙𝑒");
        }

        const imageUrl = event.messageReply.attachments[0].url;

        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

        const outputPath = path.join(cacheDir, `animefy_${Date.now()}.jpg`);
        await message.reply("🔄 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒...");

        // DeepAI API
        const deepAIKey = "cd38ec31-8f59-4435-953c-ad63fc1cd16b";
        const resp = await axios.post("https://api.deepai.org/api/anime-portrait-generator", {
            image: imageUrl
        }, {
            headers: { 'Api-Key': deepAIKey },
            timeout: 30000
        });

        if (!resp.data || !resp.data.output_url) throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝐷𝑒𝑒𝑝𝐴𝐼");

        const animeImageUrl = resp.data.output_url;

        const imageResponse = await axios.get(animeImageUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });

        fs.writeFileSync(outputPath, Buffer.from(imageResponse.data));

        await message.reply({
            body: "🎨 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒:",
            attachment: fs.createReadStream(outputPath)
        });

        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error("𝐴𝑛𝑖𝑚𝑒𝑓𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        // No error message to chat
    }
};
