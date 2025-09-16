const axios = require("axios");

module.exports = {
  config: {
    name: "nsfwcontent",
    aliases: ["nsfw2", "adult"],
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "adult",
    shortDescription: {
      en: "🥵 𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑁𝑆𝐹𝑊 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑤𝑖𝑡ℎ 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠"
    },
    longDescription: {
      en: "🥵 𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑁𝑆𝐹𝑊 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑤𝑖𝑡ℎ 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠"
    },
    guide: {
      en: "{𝑝}nsfwcontent [𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦]\n𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠: 𝑛𝑒𝑘𝑜, 𝑤𝑎𝑖𝑓𝑢, 𝑏𝑙𝑜𝑤𝑗𝑜𝑏, ℎ𝑒𝑛𝑡𝑎𝑖, 𝑎𝑛𝑎𝑙, 𝑝𝑔𝑖𝑓"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Dependency check
      if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
      
      const { threadID, messageID } = event;
      
      // Available categories with their endpoints (same URLs)
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
        // Get random category from available options
        const keys = Object.keys(categories);
        category = keys[Math.floor(Math.random() * keys.length)];
      }

      if (!categories[category]) {
        const availableCategories = Object.keys(categories).join(', ');
        return api.sendMessage(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦! 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠: ${availableCategories}`, threadID, messageID);
      }

      api.sendMessage(`🔞 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 ${category} 𝑁𝑆𝐹𝑊 𝑐𝑜𝑛𝑡𝑒𝑛𝑡...`, threadID, messageID);

      const response = await axios.get(categories[category]);
      const imageUrl = response.data.url || response.data.message || response.data.image;

      if (!imageUrl) throw new Error("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");

      await api.sendMessage({
        body: `🥵 ${category.toUpperCase()} 𝑁𝑆𝐹𝑊 𝐶𝑜𝑛𝑡𝑒𝑛𝑡\n━━━━━━━━━━━━━━\n✨ 𝐶𝑟𝑒𝑑𝑖𝑡: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      }, threadID, messageID);

    } catch (error) {
      console.error("𝑁𝑆𝐹𝑊 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑁𝑆𝐹𝑊 𝑐𝑜𝑛𝑡𝑒𝑛𝑡: " + error.message, event.threadID, event.messageID);
    }
  }
};
