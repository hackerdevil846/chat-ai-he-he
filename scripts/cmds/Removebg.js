const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const download = require('image-downloader');

module.exports = {
  config: {
    name: "removebg",
    version: "1.3.0",
    hasPermission: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "𝑅𝑒𝑚𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑢𝑠𝑖𝑛𝑔 𝑎𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝐴𝐼",
    usePrefix: true,
    category: "𝐼𝑚𝑎𝑔𝑒 𝑇𝑜𝑜𝑙𝑠",
    usages: "𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "image-downloader": ""
    }
  },

  onStart: async function() {},

  run: async function ({ api, event }) {
    try {
      if (event.type !== "message_reply") {
        return api.sendMessage("🖼️ | 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒕𝒐 𝒓𝒆𝒎𝒐𝒗𝒆 𝒊𝒕𝒔 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅.", event.threadID, event.messageID);
      }

      const attachment = event.messageReply.attachments[0];
      if (!attachment || !["photo", "image"].includes(attachment.type)) {
        return api.sendMessage("❌ | 𝑶𝒏𝒍𝒚 𝒊𝒎𝒂𝒈𝒆 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕𝒔 𝒂𝒓𝒆 𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅.", event.threadID, event.messageID);
      }

      const processingMsg = await api.sendMessage("✨ | 𝑹𝒆𝒎𝒐𝒗𝒊𝒏𝒈 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅... 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕...", event.threadID);

      const imageUrl = encodeURIComponent(attachment.url);
      const apiUrl = `https://rapido.zetsu.xyz/api/remove-background?imageUrl=${imageUrl}`;
      
      const response = await axios.get(apiUrl, { timeout: 60000 });
      const resultUrl = response.data?.result;

      if (!resultUrl) {
        await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage("❌ | 𝑩𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒓𝒆𝒎𝒐𝒗𝒂𝒍 𝒇𝒂𝒊𝒍𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒏𝒐𝒕𝒉𝒆𝒓 𝒊𝒎𝒂𝒈𝒆.", event.threadID, event.messageID);
      }

      const cacheDir = path.join(__dirname, 'cache', 'removebg');
      await fs.ensureDir(cacheDir);
      const outputPath = path.join(cacheDir, `nobg-${Date.now()}.png`);

      await download.image({
        url: resultUrl,
        dest: outputPath
      });

      await api.sendMessage({
        body: "✅ | 𝑩𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!",
        attachment: fs.createReadStream(outputPath)
      }, event.threadID);

      await fs.unlink(outputPath);
      await api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑅𝑒𝑚𝑜𝑣𝑎𝑙 𝐸𝑟𝑟𝑜𝑟:", error);
      let errorMessage = "❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      
      if (error.response?.status === 429) {
        errorMessage = "⚠️ | 𝑆𝑒𝑟𝑣𝑒𝑟 𝑖𝑠 𝑏𝑢𝑠𝑦. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } 
      else if (error.code === 'ECONNABORTED') {
        errorMessage = "⏱️ | 𝑇ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      }
      
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
