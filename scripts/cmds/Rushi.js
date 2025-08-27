const axios = require('axios');

module.exports = {
  config: {
    name: "rushia",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "random-img",
    shortDescription: {
      en: "🎀 𝑹𝒂𝒏𝒅𝒐𝒎 𝑹𝒖𝒔𝒉𝒊𝒂 𝒑𝒉𝒐𝒕𝒐 𝒅𝒆𝒌𝒉𝒂𝒏𝒐 𝒉𝒐𝒚"
    },
    longDescription: {
      en: "𝑺𝒆𝒏𝒅𝒔 𝒂 𝒓𝒂𝒏𝒅𝒐𝒎 𝑹𝒖𝒔𝒉𝒊𝒂 𝒊𝒎𝒂𝒈𝒆"
    },
    guide: {
      en: "{p}rushia"
    },
    cooldowns: 3
  },

  onStart: async function({ message }) {
    try {
      // List of backup APIs in order of priority
      const apis = [
        // Primary API
        'https://saikiapi-v3-production.up.railway.app/holo/rushia',
        // Backup APIs
        'https://safebooru.donmai.us/posts/random.json?tags=uruha_rushia',
        'https://danbooru.donmai.us/posts.json?tags=uruha_rushia+rating:safe&random=true&limit=1',
        'https://safebooru.donmai.us/posts.json?tags=uruha_rushia&random=true&limit=1',
        'https://api.waifu.pics/sfw/megumin', // Fallback to similar character
        'https://api.waifu.pics/sfw/shinobu'  // Fallback to similar character
      ];

      let imageUrl = null;
      let apiIndex = 0;

      // Try each API until we get a valid image
      while (apiIndex < apis.length && !imageUrl) {
        try {
          const apiUrl = apis[apiIndex];
          console.log(`Trying API ${apiIndex + 1}: ${apiUrl}`);
          
          const response = await axios.get(apiUrl, { timeout: 10000 });
          
          // Handle different API response formats
          if (apiIndex === 0) {
            // Primary API format
            if (response.data && response.data.url) {
              imageUrl = response.data.url;
            }
          } else if (apiIndex >= 1 && apiIndex <= 3) {
            // Safebooru/Danbooru format
            if (response.data && response.data[0] && response.data[0].file_url) {
              imageUrl = response.data[0].file_url;
              // Add protocol if missing
              if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
              }
            } else if (response.data && response.data.file_url) {
              // Single post format
              imageUrl = response.data.file_url;
              if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
              }
            }
          } else if (apiIndex >= 4) {
            // Waifu.pics format
            if (response.data && response.data.url) {
              imageUrl = response.data.url;
            }
          }
          
          if (imageUrl) {
            console.log(`Success with API ${apiIndex + 1}: ${imageUrl}`);
          }
          
        } catch (apiError) {
          console.error(`API ${apiIndex + 1} failed:`, apiError.message);
        }
        
        apiIndex++;
      }

      if (!imageUrl) {
        return message.reply("❌ 𝑨𝒍𝒍 𝑹𝒖𝒔𝒉𝒊𝒂 𝑨𝑷𝑰𝒔 𝒂𝒓𝒆 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝒖𝒏𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓!");
      }

      await message.reply({
        body: `✨ 𝑯𝒆𝒓𝒆 𝒊𝒔 𝒂 𝒄𝒖𝒕𝒆 𝑹𝒖𝒔𝒉𝒊𝒂 𝒊𝒎𝒂𝒈𝒆 𝒇𝒐𝒓 𝒚𝒐𝒖!`,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });
      
    } catch (error) {
      console.error('𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒓𝒖𝒔𝒉𝒊𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:', error);
      message.reply('❌ 𝑷𝒉𝒐𝒕𝒐 𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒔𝒐𝒎𝒐𝒔𝒔𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒂𝒃𝒂𝒓𝒐 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏!');
    }
  }
};
