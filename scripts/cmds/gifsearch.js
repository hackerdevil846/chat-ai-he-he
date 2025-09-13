const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "gifsearch",
    aliases: ["gif", "searchgif"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠 𝑢𝑠𝑖𝑛𝑔 𝐺𝐼𝑃𝐻𝑌 𝐴𝑃𝐼"
    },
    longDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑 𝐺𝐼𝐹𝑠 𝑓𝑟𝑜𝑚 𝐺𝐼𝑃𝐻𝑌 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑞𝑢𝑒𝑟𝑦"
    },
    guide: {
        en: "{p}gifsearch <𝑞𝑢𝑒𝑟𝑦>"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function ({ message, event, args }) {
    const { threadID, messageID } = event;
    
    if (!args.length) {
        return message.reply('𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠.');
    }

    const query = args.join(' ');
    const apiKey = 'QHv1qVaxy4LS3AmaNuUYNT9zr40ReFBI';

    try {
        const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
            params: {
                q: query,
                api_key: apiKey,
                limit: 5,
                rating: 'g'
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            const gifResults = response.data.data;
            const gifAttachments = [];

            for (let i = 0; i < gifResults.length; i++) {
                const gifData = gifResults[i];
                const gifURL = gifData.images.original.url;
                const gifPath = path.join(__dirname, 'cache', `giphy_${i}.gif`);
                
                // Create cache directory if it doesn't exist
                if (!fs.existsSync(path.join(__dirname, 'cache'))) {
                    fs.mkdirSync(path.join(__dirname, 'cache'));
                }

                const gifBuffer = (await axios.get(gifURL, { responseType: 'arraybuffer' })).data;
                await fs.writeFile(gifPath, Buffer.from(gifBuffer, 'binary'));
                gifAttachments.push(fs.createReadStream(gifPath));
            }

            await message.reply({ 
                body: `𝐹𝑜𝑢𝑛𝑑 ${gifResults.length} 𝐺𝐼𝐹𝑠 𝑓𝑜𝑟 "${𝑞𝑢𝑒𝑟𝑦}"`,
                attachment: gifAttachments 
            });

            // Clean up cache files
            setTimeout(() => {
                for (let i = 0; i < gifResults.length; i++) {
                    const gifPath = path.join(__dirname, 'cache', `giphy_${i}.gif`);
                    if (fs.existsSync(gifPath)) {
                        fs.unlinkSync(gifPath);
                    }
                }
            }, 5000);

        } else {
            await message.reply('𝑁𝑜 𝐺𝐼𝐹𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑 𝑞𝑢𝑒𝑟𝑦.');
        }
    } catch (error) {
        console.error('𝐺𝐼𝐹 𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:', error);
        await message.reply('𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠.');
    }
};
