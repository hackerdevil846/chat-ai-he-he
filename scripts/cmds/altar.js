const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "altar",
        aliases: ["worship", "holy"],
        version: "1.1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "𝐴𝑙𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎𝑛 𝑎𝑙𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
        },
        guide: {
            en: "{p}altar [@𝑡𝑎𝑔]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const outputPath = path.join(cacheDir, 'altar.png');
            
            // Get user ID from mention or use sender's ID
            const targetID = Object.keys(event.mentions)[0] || event.senderID;
            
            // Show processing message
            const processingMsg = await message.reply("🔄 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑎𝑙𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒...");

            try {
                // Load background image
                const background = await jimp.read('https://i.imgur.com/brK0Hbb.jpg');
                
                // Get user avatar with proper Facebook Graph API
                const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                const avatar = await jimp.read(avatarUrl);
                
                // Resize avatar to fit the altar frame (205x205)
                avatar.resize(205, 205);
                
                // Create circular mask for avatar
                const mask = new jimp(205, 205, 0x00000000);
                for (let y = 0; y < 205; y++) {
                    for (let x = 0; x < 205; x++) {
                        const distance = Math.sqrt(Math.pow(x - 102.5, 2) + Math.pow(y - 102.5, 2));
                        if (distance <= 102.5) {
                            mask.setPixelColor(0xFFFFFFFF, x, y);
                        }
                    }
                }
                
                // Apply circular mask to avatar
                avatar.mask(mask);
                
                // Composite avatar onto background at correct position (353, 158)
                background.composite(avatar, 353, 158);
                
                // Save the image
                await background.writeAsync(outputPath);

                // Send the result
                await message.reply({
                    body: "🕊️ 𝐻𝑒𝑦, ℎ𝑜𝑤 𝑎𝑟𝑒 𝑦𝑜𝑢? :))",
                    attachment: fs.createReadStream(outputPath)
                });

                // Clean up processing message
                if (processingMsg && processingMsg.messageID) {
                    await message.unsendMessage(processingMsg.messageID);
                }

                // Clean up file
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                }

            } catch (error) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
                // Don't send error message to avoid spam
            }

        } catch (error) {
            console.error("𝐴𝑙𝑡𝑎𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};
