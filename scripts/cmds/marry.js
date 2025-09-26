const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marry",
        aliases: [], // Changed "marriage" to "wedding"
        version: "3.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑟𝑜𝑚𝑎𝑛𝑐𝑒",
        shortDescription: {
            en: "💍 𝑃𝑟𝑜𝑝𝑜𝑠𝑒 𝑡𝑜 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑐𝑒𝑟𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑒"
        },
        longDescription: {
            en: "💍 𝑆𝑒𝑛𝑑 𝑎 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑝𝑟𝑜𝑝𝑜𝑠𝑎𝑙 𝑤𝑖𝑡ℎ 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑐𝑒𝑟𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑒"
        },
        guide: {
            en: "{p}marry [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: function() {
        const dirMaterial = path.resolve(__dirname, 'cache', 'canvas');
        
        if (!fs.existsSync(dirMaterial)) {
            fs.mkdirSync(dirMaterial, { recursive: true });
        }
        
        const bgPath = path.resolve(dirMaterial, 'marry_bg.png');
        if (!fs.existsSync(bgPath)) {
            const sourcePath = path.resolve(__dirname, 'cache', 'canvas', 'marrywi.png');
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, bgPath);
            } else {
                console.error("❌ 𝑚𝑎𝑟𝑟𝑦𝑤𝑖.𝑝𝑛𝑔 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑐𝑎𝑐ℎ𝑒/𝑐𝑎𝑛𝑣𝑎𝑠 𝑓𝑜𝑙𝑑𝑒𝑟!");
            }
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑝𝑎𝑡ℎ, 𝑎𝑛𝑑 𝑗𝑖𝑚𝑝.");
            }

            const { threadID, messageID, senderID } = event;

            // Function to create circular profile images
            const circle = async (imageBuffer) => {
                const image = await jimp.read(imageBuffer);
                image.circle();
                return await image.getBufferAsync("image/png");
            };

            // Process mentions
            const mention = Object.keys(event.mentions);
            if (!mention[0]) {
                return message.reply("🌸 𝑇𝑎𝑔 𝑦𝑜𝑢𝑟 𝑙𝑜𝑣𝑒𝑑 𝑜𝑛𝑒 💍");
            }

            const targetID = mention[0];
            const bgPath = path.resolve(__dirname, 'cache', 'canvas', 'marry_bg.png');
            const outputPath = path.resolve(__dirname, 'cache', 'canvas', `marry_${senderID}_${targetID}.png`);
            
            // Get names for certificate
            const senderName = await usersData.getName(senderID);
            const targetName = await usersData.getName(targetID);

            // Download profile pictures
            const [avatar1, avatar2] = await Promise.all([
                axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                    { responseType: 'arraybuffer' }),
                axios.get(`https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                    { responseType: 'arraybuffer' })
            ]);

            // Process images
            const bgImage = await jimp.read(bgPath);
            const [circularAvatar1, circularAvatar2] = await Promise.all([
                circle(avatar1.data),
                circle(avatar2.data)
            ]);
            
            // Composite images
            bgImage
                .resize(432, 280)
                .composite(await jimp.read(circularAvatar1).then(img => img.resize(60, 60)), 200, 23)
                .composite(await jimp.read(circularAvatar2).then(img => img.resize(60, 60)), 136, 40);
            
            // Save and send
            await bgImage.writeAsync(outputPath);
            
            await message.reply({
                body: `💞 ${senderName} - ${targetName} 𝑀𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝐶𝑒𝑟𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑒\n\n"𝐼 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠𝑝𝑒𝑛𝑑 𝑒𝑣𝑒𝑟𝑦 𝑚𝑜𝑚𝑒𝑛𝑡 𝑜𝑓 𝑚𝑦 𝑙𝑖𝑓𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢 💍"`,
                attachment: fs.createReadStream(outputPath)
            });

            // Cleanup
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }

        } catch (error) {
            console.error('𝑀𝑎𝑟𝑟𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑝𝑟𝑜𝑝𝑜𝑠𝑎𝑙! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟");
        }
    }
};
