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
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        // Check if user replied to an image
        if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0] || !event.messageReply.attachments[0].url) {
            return message.reply("🖼️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑣𝑒𝑟𝑡 𝑖𝑡 𝑡𝑜 𝑎𝑛𝑖𝑚𝑒 𝑠𝑡𝑦𝑙𝑒");
        }

        const imageUrl = event.messageReply.attachments[0].url;
        
        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const outputPath = path.join(cacheDir, `animefy_${Date.now()}.jpg`);

        // Show processing message
        await message.reply("🔄 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒...");

        try {
            // First API call to convert image
            const response = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`, {
                timeout: 30000
            });
            
            if (!response.data || !response.data.urls || !response.data.urls[1]) {
                throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝑎𝑛𝑖𝑚𝑒𝑖𝑓𝑦 𝐴𝑃𝐼");
            }

            const animeImageUrl = `https://www.drawever.com${response.data.urls[1]}`;

            // Download the converted image
            const imageResponse = await axios.get(animeImageUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });

            // Save the image
            fs.writeFileSync(outputPath, Buffer.from(imageResponse.data));

            // Send the result
            await message.reply({
                body: "🎨 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒:",
                attachment: fs.createReadStream(outputPath)
            });

            // Clean up
            fs.unlinkSync(outputPath);

        } catch (apiError) {
            console.error("𝐴𝑛𝑖𝑚𝑒𝑓𝑦 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟:", apiError);
            
            // Fallback to alternative API if first one fails
            try {
                const fallbackResponse = await axios.get(`https://api.rival.rocks/ai/animefy?url=${encodeURIComponent(imageUrl)}`, {
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                
                fs.writeFileSync(outputPath, Buffer.from(fallbackResponse.data));
                
                await message.reply({
                    body: "🎨 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 (𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐴𝑃𝐼):",
                    attachment: fs.createReadStream(outputPath)
                });
                
                fs.unlinkSync(outputPath);
                
            } catch (fallbackError) {
                console.error("𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟:", fallbackError);
                throw new Error("𝐵𝑜𝑡ℎ 𝐴𝑃𝐼𝑠 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }
        }

    } catch (error) {
        console.error("𝐴𝑛𝑖𝑚𝑒𝑓𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${error.message || "𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑖𝑚𝑎𝑔𝑒"}`);
    }
};
