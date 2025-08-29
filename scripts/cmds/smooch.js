module.exports = {
    config: {
        name: "smooch",
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "love",
        shortDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑘𝑖𝑠𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑘𝑖𝑠𝑠 𝑡𝑜 𝑠𝑜𝑚𝑒𝑜𝑛𝑒"
        },
        guide: {
            en: "{𝑝}𝑠𝑚𝑜𝑜𝑐ℎ @𝑡𝑎𝑔"
        }
    },

    onStart: async function ({ event, message, usersData, args }) {
        try {
            const fs = require("fs-extra");
            const axios = require("axios");
            const path = require("path");
            
            const { mentions } = event;
            const mention = Object.keys(mentions);
            
            if (!mention[0]) {
                return message.reply("𝑇𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑚𝑜𝑜𝑐ℎ! 💋");
            }

            const tag = mentions[mention[0]].replace("@", "");
            const userId = mention[0];
            
            // Create cache directory
            const cacheDir = path.resolve(__dirname, '../scripts/cmds/cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            // Get random kiss image from API
            const apiResponse = await axios.get('https://nekos.life/api/v2/img/kiss');
            const picData = apiResponse.data;
            const getURL = picData.url;
            const ext = getURL.substring(getURL.lastIndexOf(".") + 1);
            const imagePath = path.resolve(cacheDir, `smooch.${ext}`);
            
            // Download the image
            const imageResponse = await axios.get(getURL, {
                responseType: 'arraybuffer'
            });
            
            fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
            
            await message.reply({
                body: `${tag}, 𝑀𝑊𝐴𝐻! 💋❤️`,
                mentions: [{
                    tag: tag,
                    id: userId
                }],
                attachment: fs.createReadStream(imagePath)
            });
            
            // Clean up after 5 seconds
            setTimeout(() => {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }, 5000);
            
        } catch (error) {
            console.error("𝑆𝑚𝑜𝑜𝑐ℎ 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑚𝑜𝑜𝑐ℎ!");
        }
    }
};
