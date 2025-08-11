const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const download = require('image-downloader');

module.exports = {
  config: {
    name: "removebg",
    version: "1.3.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Remove image background using advanced AI",
    usePrefix: true,
    category: "Image Tools",
    usages: "Reply to an image",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "image-downloader": ""
    }
  },

  onStart: async function() {}, // Empty onStart to prevent errors

  run: async function ({ api, event }) {
    try {
      if (event.type !== "message_reply") {
        return api.sendMessage("🖼️ | Please reply to an image to remove its background.", event.threadID, event.messageID);
      }

      const attachment = event.messageReply.attachments[0];
      if (!attachment || !["photo", "image"].includes(attachment.type)) {
        return api.sendMessage("❌ | Only image attachments are supported.", event.threadID, event.messageID);
      }

      const processingMsg = await api.sendMessage("✨ | Removing background... Please wait...", event.threadID);

      const imageUrl = encodeURIComponent(attachment.url);
      const apiUrl = `https://rapido.zetsu.xyz/api/remove-background?imageUrl=${imageUrl}`;
      
      const response = await axios.get(apiUrl, { timeout: 60000 });
      const resultUrl = response.data?.result;

      if (!resultUrl) {
        await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage("❌ | Background removal failed. Please try another image.", event.threadID, event.messageID);
      }

      const cacheDir = path.join(__dirname, 'cache', 'removebg');
      await fs.ensureDir(cacheDir);
      const outputPath = path.join(cacheDir, `nobg-${Date.now()}.png`);

      await download.image({
        url: resultUrl,
        dest: outputPath
      });

      await api.sendMessage({
        body: "✅ | Background removed successfully!",
        attachment: fs.createReadStream(outputPath)
      }, event.threadID);

      await fs.unlink(outputPath);
      await api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("Background Removal Error:", error);
      let errorMessage = "❌ | An error occurred while processing your image. Please try again.";
      
      if (error.response?.status === 429) {
        errorMessage = "⚠️ | Server is busy. Please try again later.";
      } 
      else if (error.code === 'ECONNABORTED') {
        errorMessage = "⏱️ | The request timed out. Please try again.";
      }
      
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
