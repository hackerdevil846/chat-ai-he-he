const axios = require('axios');

module.exports.config = {
    name: "animated",
    aliases: ["gif", "gifs"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠"
    },
    longDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝐺𝐼𝐹𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}animated [𝑘𝑒𝑦𝑤𝑜𝑟𝑑] - 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}animated ℎ𝑢𝑔𝑔𝑖𝑛𝑔"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.langs = {
    "en": {
        "searching": "╔═══❖•°•°•°❖═══╗\n𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 ✨\n🔎 %1 𝑔𝑖𝑓\n╚═══❖•°•°•°❖═══╝"
    }
};

module.exports.onStart = async function({ message, args, getLang }) {
    try {
        const keyword = args.join(" ");
        
        if (!keyword) {
            return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑘𝑒𝑦𝑤𝑜𝑟𝑑 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠. 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}animated ℎ𝑢𝑔𝑔𝑖𝑛𝑔");
        }

        // Show searching message
        await message.reply(getLang("searching", keyword));
        
        // Search for GIFs using Giphy API
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: 'wBUEVK7mbqAaiCBRrYKYYEMMqZ1sPujI',
                q: keyword,
                limit: 25,
                offset: 0,
                rating: 'g',
                lang: 'en',
                bundle: 'messaging_non_clips'
            }
        });

        const gifs = response.data.data;
        
        if (gifs.length === 0) {
            return message.reply(`𝑁𝑜 𝐺𝐼𝐹𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${keyword}"`);
        }

        // Select a random GIF from the results
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        const gifUrl = randomGif.images.original.url;

        // Send the GIF as an attachment
        return message.reply({
            body: `✅ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 "${keyword}" 𝐺𝐼𝐹!`,
            attachment: await global.utils.getStreamFromURL(gifUrl)
        });
        
    } catch (error) {
        console.error("𝐺𝐼𝐹 𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply("𝑆𝑜𝑟𝑟𝑦, 𝑎𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠.");
    }
};
