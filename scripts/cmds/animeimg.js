module.exports = {
  config: {
    name: "animeimg",
    aliases: ["animeimage"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "funny",
    shortDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒."
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑒𝑡𝑐ℎ𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝐴𝑃𝐼."
    },
    guide: {
      en: "{p}animeimg"
    }
  },
  onStart: async function({ message, event, api, global }) {
    try {
      const axios = require('axios');
      const url = 'https://any-anime.p.rapidapi.com/anime/img';
      const headers = {
        'X-RapidAPI-Key': 'b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b',
        'X-RapidAPI-Host': 'any-anime.p.rapidapi.com'
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200 && response.data) {
        const imageURL = response.data.url;
        const imageStream = await global.utils.getStreamFromURL(imageURL);

        if (imageStream) {
          await message.reply({
            body: "𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒:",
            attachment: imageStream
          });
        } else {
          throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑈𝑅𝐿.");
        }
      } else {
        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑑𝑎𝑡𝑎 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝐴𝑃𝐼.");
      }
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟:", error.message);
      await message.reply("❌ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
