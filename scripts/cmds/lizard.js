module.exports = {
    config: {
        name: "lizard",
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "image",
        shortDescription: {
            en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑙𝑖𝑧𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑙𝑖𝑧𝑎𝑟𝑑 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
        },
        guide: {
            en: "{𝑝}𝑙𝑖𝑧𝑎𝑟𝑑"
        }
    },

    onStart: async function ({ message }) {
        try {
            const axios = require("axios");
            const fs = require("fs-extra");
            const path = require("path");

            // Get random lizard image from API
            const response = await axios.get('https://nekos.life/api/v2/img/lizard');
            const imageUrl = response.data.url;
            const fileExtension = imageUrl.substring(imageUrl.lastIndexOf(".") + 1);
            
            // Create cache directory if it doesn't exist
            const cacheDir = path.resolve(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const filePath = path.resolve(cacheDir, `lizard.${fileExtension}`);
            
            // Download the image
            const imageResponse = await axios.get(imageUrl, { 
                responseType: 'arraybuffer' 
            });
            
            // Save image to cache
            fs.writeFileSync(filePath, Buffer.from(imageResponse.data, 'binary'));
            
            // Send the image
            await message.reply({
                body: "🦎 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑟𝑎𝑛𝑑𝑜𝑚 𝑙𝑖𝑧𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒!",
                attachment: fs.createReadStream(filePath)
            });
            
            // Clean up after sending
            setTimeout(() => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }, 5000);
            
        } catch (error) {
            console.error("𝐿𝑖𝑧𝑎𝑟𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑙𝑖𝑧𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!");
        }
    }
};
