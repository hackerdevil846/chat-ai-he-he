const axios = require("axios");

module.exports = {
  config: {
    name: "nsfwanime",
    aliases: ["animegif", "hentaigif"],
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 1,
    category: "adult",
    shortDescription: {
      en: "🔞 𝑵𝑺𝑭𝑾 𝑨𝒏𝒊𝒎𝒆 𝑮𝑰𝑭 𝒄𝒐𝒎𝒎𝒂𝒏𝒅"
    },
    longDescription: {
      en: "🔞 𝑮𝒆𝒕 𝑵𝑺𝑭𝑾 𝑨𝒏𝒊𝒎𝒆 𝑮𝑰𝑭𝒔 𝒇𝒓𝒐𝒎 𝑵𝒆𝒌𝒐𝑩𝒐𝒕 𝑨𝑷𝑰"
    },
    guide: {
      en: "{p}nsfwanime"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ api, event }) {
    try {
      // Dependency check
      if (!axios) {
        throw new Error("❌ 𝑴𝒊𝒔𝒔𝒊𝒏𝒈 𝒅𝒆𝒑𝒆𝒏𝒅𝒆𝒏𝒄𝒚: 𝒂𝒙𝒊𝒐𝒔");
      }

      const { threadID, messageID } = event;
      
      const response = await axios.get('https://nekobot.xyz/api/image?type=pgif');
      const url = response.data.message;
      
      await api.sendMessage({
        body: `🔞 | 𝑵𝑺𝑭𝑾 𝑨𝑵𝑰𝑴𝑬 𝑮𝑰𝑭\n━━━━━━━━━━━━━━\n\n✨ 𝑮𝒊𝒇 𝒇𝒐𝒓 𝒚𝒐𝒖 𝒃𝒂𝒃𝒚...`,
        attachment: await global.utils.getStreamFromURL(url)
      }, threadID, messageID);
      
    } catch (error) {
      console.error("𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒏𝒔𝒇𝒘𝒂𝒏𝒊𝒎𝒆:", error);
      await api.sendMessage("❌ | 𝑬𝒓𝒓𝒐𝒓 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝑵𝑺𝑭𝑾 𝒈𝒊𝒇!", event.threadID, event.messageID);
    }
  }
};
