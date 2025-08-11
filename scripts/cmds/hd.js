const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "hd",
    version: "3.0",
    role: 0,
    author: "Asif",
    description: "Enhance image quality to HD",
    category: "image",
    usage: "Reply to an image with 'hd'",
    example: "hd",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;
    const cacheDir = path.join(__dirname, 'cache', 'hd-images');
    const imagePath = path.join(cacheDir, `enhanced_${Date.now()}.jpg`);

    try {
      // Create cache directory if needed
      if (!fs.existsSync(cacheDir)) {
        await fs.mkdirp(cacheDir);
      }

      // Validate message reply
      if (!messageReply || !messageReply.attachments || !messageReply.attachments[0] || 
          !['photo', 'sticker'].includes(messageReply.attachments[0].type)) {
        return api.sendMessage(
          "🖼️ How to use HD command:\n" +
          "1. Reply to an image\n" +
          "2. Type 'hd' to enhance it",
          threadID,
          messageID
        );
      }

      const photoUrl = messageReply.attachments[0].url;
      
      // Send processing message
      api.sendMessage(
        "🔍 Enhancing your image to HD quality...\nPlease wait 10-30 seconds...",
        threadID,
        messageID
      );

      // Enhance image using Remini API
      const enhanceResponse = await axios.get(
        `https://code-merge-api-hazeyy01.replit.app/api/try/remini?url=${encodeURIComponent(photoUrl)}`,
        { timeout: 60000 }
      );
      
      if (!enhanceResponse.data || !enhanceResponse.data.image_data) {
        throw new Error("API didn't return enhanced image data");
      }

      // Download the enhanced image
      const imageResponse = await axios.get(enhanceResponse.data.image_data, {
        responseType: 'arraybuffer',
        timeout: 60000
      });

      // Save the image
      await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));

      // Send the enhanced image
      return api.sendMessage({
        body: "✅ Image enhanced to HD quality!",
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        // Clean up after sending
        try {
          fs.unlinkSync(imagePath);
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }
      }, messageID);

    } catch (error) {
      console.error("HD Command Error:", error);
      
      let errorMessage = "❌ Failed to enhance image. ";
      
      if (error.response) {
        errorMessage += `API error (${error.response.status})`;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += "Request timed out. Please try again.";
      } else if (error.message.includes('image_data')) {
        errorMessage += "The enhancement API is currently unavailable.";
      } else {
        errorMessage += error.message;
      }
      
      // Clean up if file exists
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }
      }
      
      return api.sendMessage(errorMessage, threadID, messageID);
    }
  }
};
