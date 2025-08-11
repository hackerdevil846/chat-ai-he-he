const fs = require("fs-extra");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");

module.exports = {
  config: {
    name: "art",
    version: "1.1.0",
    hasPermission: 0,
    credits: "Asif Developer",
    description: "Apply anime-style AI art filter to images",
    category: "image",
    usages: "Reply to an image message",
    cooldowns: 15,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "form-data": ""
    }
  },

  onStart: async function() {
    // Initialize cache directory
    const cacheDir = path.join(__dirname, "cache", "art");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    console.log("Art command initialized. Cache directory ready.");
  },

  run: async function({ api, event }) {
    const { threadID, messageID, messageReply } = event;
    const cacheDir = path.join(__dirname, "cache", "art");
    const cachePath = path.join(cacheDir, `art_${Date.now()}.jpg`);
    
    try {
      // Validate image reply
      if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
        return api.sendMessage("🖼️ Please reply to an image to apply the AI art filter", threadID, messageID);
      }

      const attachment = messageReply.attachments[0];
      
      // Validate attachment type
      if (!attachment.type || !["photo", "image"].includes(attachment.type.toLowerCase())) {
        return api.sendMessage("❌ Only image files can be processed", threadID, messageID);
      }

      // Download image
      api.sendMessage("⏳ Downloading your image...", threadID, messageID);
      const imageResponse = await axios.get(attachment.url, {
        responseType: "arraybuffer",
        timeout: 30000
      });
      
      fs.writeFileSync(cachePath, Buffer.from(imageResponse.data));

      // Prepare API request
      const form = new FormData();
      form.append("image", fs.createReadStream(cachePath));

      // Send to art API
      api.sendMessage("🎨 Applying AI anime art filter, this may take up to 1 minute...", threadID, messageID);
      
      const artResponse = await axios.post(
        "https://art-api-97wn.onrender.com/artify?style=anime",
        form,
        { 
          headers: form.getHeaders(), 
          responseType: "arraybuffer",
          timeout: 60000
        }
      );

      // Save processed image
      const outputPath = path.join(cacheDir, `art_result_${Date.now()}.png`);
      fs.writeFileSync(outputPath, artResponse.data);

      // Send result
      api.sendMessage({
        body: "✅ AI Anime Art Filter Applied Successfully!",
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Clean up after sending
        [cachePath, outputPath].forEach(filePath => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      });

    } catch (error) {
      console.error("Art Command Error:", error);
      
      // Clean up cache files
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
      
      let errorMessage = "❌ Failed to process image. Please try again later.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "⏱️ The request timed out. The image might be too large or the server is busy.";
      } else if (error.response) {
        errorMessage = `❌ API Error: ${error.response.status} - ${error.response.statusText}`;
      } else if (error.message.includes("ENOENT")) {
        errorMessage = "❌ File system error. Could not access cache directory.";
      }
      
      api.sendMessage(errorMessage, threadID, messageID);
    }
  }
};
