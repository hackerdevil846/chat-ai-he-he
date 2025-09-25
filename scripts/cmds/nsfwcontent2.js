const axios = require("axios");

module.exports = {
    config: {
        name: "nsfwcontent2",
        aliases: ["nsfw2"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑎𝑑𝑢𝑙𝑡",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑁𝑆𝐹𝑊 𝑐𝑜𝑛𝑡𝑒𝑛𝑡"
        },
        longDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑁𝑆𝐹𝑊 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑤𝑖𝑡ℎ 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠"
        },
        guide: {
            en: "{p}nsfwcontent2 [𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦]"
        },
        countDown: 5,
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
            }

            // Available categories
            const categories = {
        'neko': 'https://api.waifu.pics/nsfw/neko',
        'waifu': 'https://api.waifu.pics/nsfw/waifu',
        'blowjob': 'https://api.waifu.pics/nsfw/blowjob',
        'hentai': 'https://nekobot.xyz/api/image?type=hentai',
        'anal': 'https://nekobot.xyz/api/image?type=anal',
        'pgif': 'https://nekobot.xyz/api/image?type=pgif'
      };

            let category = args[0] || 'random';
            
            if (category === 'random') {
                const keys = Object.keys(categories);
                category = keys[Math.floor(Math.random() * keys.length)];
            }

            if (!categories[category]) {
                const availableCategories = Object.keys(categories).join(', ');
                return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦! 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒: ${availableCategories}`);
            }

            await message.reply(`🔞 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 ${category} 𝑐𝑜𝑛𝑡𝑒𝑛𝑡...`);

            const response = await axios.get(categories[category]);
            const imageUrl = response.data.url;

            if (!imageUrl) throw new Error("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑢𝑛𝑑");

            await message.reply({
                body: `🥵 ${category.toUpperCase()} 𝑁𝑆𝐹𝑊 𝐶𝑜𝑛𝑡𝑒𝑛𝑡\n━━━━━━━━━━━━━━\n✨ 𝐶𝑟𝑒𝑑𝑖𝑡: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
                attachment: await global.utils.getStreamFromURL(imageUrl)
            });

        } catch (error) {
            console.error("𝑁𝑆𝐹𝑊 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑐𝑜𝑛𝑡𝑒𝑛𝑡: " + error.message);
        }
    }
};
