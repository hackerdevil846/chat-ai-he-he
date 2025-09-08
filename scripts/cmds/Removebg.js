const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
    name: "removebg",
    aliases: ["nobg", "transparent"],
    version: "1.3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "image",
    shortDescription: {
        en: "𝑅𝑒𝑚𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑢𝑠𝑖𝑛𝑔 𝑎𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝐴𝐼"
    },
    longDescription: {
        en: "𝑅𝑒𝑚𝑜𝑣𝑒𝑠 𝑡ℎ𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑓𝑟𝑜𝑚 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑢𝑠𝑖𝑛𝑔 𝐴𝐼 𝑡𝑒𝑐ℎ𝑛𝑜𝑙𝑜𝑔𝑦"
    },
    guide: {
        en: "{p}removebg [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "form-data": ""
    }
};

module.exports.onStart = async function ({ message, event }) {
    try {
        // Check dependencies
        if (!axios || !fs || !FormData) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        if (event.type !== "message_reply") {
            return message.reply("🖼️ | 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒕𝒐 𝒓𝒆𝒎𝒐𝒗𝒆 𝒊𝒕𝒔 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅.");
        }

        const attachment = event.messageReply.attachments[0];
        if (!attachment || !["photo", "image", "sticker"].includes(attachment.type)) {
            return message.reply("❌ | 𝑶𝒏𝒍𝒚 𝒊𝒎𝒂𝒈𝒆 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕𝒔 𝒂𝒓𝒆 𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅.");
        }

        const processingMsg = await message.reply("✨ | 𝑹𝒆𝒎𝒐𝒗𝒊𝒏𝒈 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅... 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕...");

        // Create cache directory
        const cacheDir = path.join(__dirname, 'cache', 'removebg');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const inputPath = path.join(cacheDir, `input-${Date.now()}.jpg`);
        const outputPath = path.join(cacheDir, `nobg-${Date.now()}.png`);

        // Download the image
        const imageResponse = await axios({
            method: 'GET',
            url: attachment.url,
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        await fs.writeFileSync(inputPath, Buffer.from(imageResponse.data));

        // Use remove.bg API
        const formData = new FormData();
        formData.append('image_file', fs.createReadStream(inputPath));
        formData.append('size', 'auto');

        try {
            const response = await axios({
                method: 'POST',
                url: 'https://api.remove.bg/v1.0/removebg',
                data: formData,
                headers: {
                    'X-Api-Key': 'C3tFmS6WbZ8EY6tqRvp6mJ35',
                    ...formData.getHeaders()
                },
                responseType: 'arraybuffer',
                timeout: 30000
            });

            if (response.data && response.data.length > 0) {
                await fs.writeFileSync(outputPath, response.data);
                
                await message.reply({
                    body: "✅ | 𝑩𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!",
                    attachment: fs.createReadStream(outputPath)
                });

            } else {
                throw new Error('𝐸𝑚𝑝𝑡𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝑟𝑒𝑚𝑜𝑣𝑒.𝑏𝑔 𝐴𝑃𝐼');
            }

        } catch (apiError) {
            console.error('𝑅𝑒𝑚𝑜𝑣𝑒.𝑏𝑔 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:', apiError);
            
            // Fallback to alternative API
            try {
                const fallbackResponse = await axios({
                    method: 'GET',
                    url: `https://api.memegen.cc/removebg?url=${encodeURIComponent(attachment.url)}`,
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                
                if (fallbackResponse.data && fallbackResponse.data.length > 0) {
                    await fs.writeFileSync(outputPath, Buffer.from(fallbackResponse.data));
                    
                    await message.reply({
                        body: "✅ | 𝑩𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 (𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐴𝑃𝐼)!",
                        attachment: fs.createReadStream(outputPath)
                    });
                } else {
                    throw new Error('𝐵𝑜𝑡ℎ 𝐴𝑃𝐼𝑠 𝑓𝑎𝑖𝑙𝑒𝑑');
                }
            } catch (fallbackError) {
                console.error('𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:', fallbackError);
                throw new Error('𝐴𝑙𝑙 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑟𝑒𝑚𝑜𝑣𝑎𝑙 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠 𝑎𝑟𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒');
            }
        }

        // Clean up files
        try {
            if (fs.existsSync(inputPath)) await fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) await fs.unlinkSync(outputPath);
        } catch (cleanupError) {
            console.log('𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:', cleanupError);
        }

        // Try to unsend the processing message
        try {
            if (processingMsg && processingMsg.messageID) {
                await message.unsend(processingMsg.messageID);
            }
        } catch (unsendError) {
            console.log("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", unsendError);
        }

    } catch (error) {
        console.error("𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑅𝑒𝑚𝑜𝑣𝑎𝑙 𝐸𝑟𝑟𝑜𝑟:", error);
        
        let errorMessage = "❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
        
        if (error.response?.status === 429) {
            errorMessage = "⚠️ | 𝐴𝑃𝐼 𝑙𝑖𝑚𝑖𝑡 𝑒𝑥𝑐𝑒𝑒𝑑𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
        } 
        else if (error.code === 'ECONNABORTED') {
            errorMessage = "⏱️ | 𝑇ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
        }
        else if (error.message.includes('unavailable')) {
            errorMessage = "🔧 | 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑟𝑒𝑚𝑜𝑣𝑎𝑙 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠 𝑎𝑟𝑒 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑖𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒.";
        }
        
        await message.reply(errorMessage);
    }
};
