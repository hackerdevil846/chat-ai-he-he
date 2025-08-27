const axios = require('axios');

module.exports = {
  config: {
    name: "rushia",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🎀 𝑹𝒂𝒏𝒅𝒐𝒎 𝑹𝒖𝒔𝒉𝒊𝒂 𝒑𝒉𝒐𝒕𝒐 𝒅𝒆𝒌𝒉𝒂𝒏𝒐 𝒉𝒐𝒚",
    category: "random-img",
    usages: "rushia",
    cooldowns: 3,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message, event, api }) {
    try {
      const res = await axios.get('https://saikiapi-v3-production.up.railway.app/holo/rushia');
      
      if (!res.data.url) {
        return message.reply("❌ 𝑵𝒐 𝑹𝒖𝒔𝒉𝒊𝒂 𝒊𝒎𝒂𝒈𝒆 𝒇𝒐𝒖𝒏𝒅");
      }

      await message.reply({
        body: `✨ 𝑯𝒆𝒓𝒆 𝒊𝒔 𝒂 𝒄𝒖𝒕𝒆 𝑹𝒖𝒔𝒉𝒊𝒂 𝒊𝒎𝒂𝒈𝒆 𝒇𝒐𝒓 𝒚𝒐𝒖!`,
        attachment: await global.utils.getStreamFromURL(res.data.url)
      });

      // Set reaction if possible
      if (api.setMessageReaction) {
        api.setMessageReaction('✅', event.messageID, (err) => {}, true);
      }
      
    } catch (err) {
      console.error('𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒓𝒖𝒔𝒉𝒊𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:', err);
      message.reply('❌ 𝑷𝒉𝒐𝒕𝒐 𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒔𝒐𝒎𝒐𝒔𝒔𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒂𝒃𝒂𝒓𝒐 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏!');
    }
  }
};
