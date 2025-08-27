const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "gifsearch",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    role: 0,
    guide: {
      en: {}
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length === 0) {
      api.sendMessage('𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠.', threadID, messageID);
      return;
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
          const path1 = path.join(__dirname, `cache/giphy${i}.gif`);
          
          const getContent = (await axios.get(gifURL, { responseType: 'arraybuffer' })).data;
          fs.writeFileSync(path1, Buffer.from(getContent, 'binary'));
          gifAttachments.push(fs.createReadStream(path1));
        }

        api.sendMessage({ 
          body: `𝐹𝑜𝑢𝑛𝑑 ${gifResults.length} 𝐺𝐼𝐹𝑠 𝑓𝑜𝑟 "${𝑞𝑢𝑒𝑟𝑦}"`,
          attachment: gifAttachments 
        }, threadID);
      } else {
        api.sendMessage('𝑁𝑜 𝐺𝐼𝐹𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑 𝑞𝑢𝑒𝑟𝑦.', threadID, messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠.', threadID, messageID);
    }
  }
};
