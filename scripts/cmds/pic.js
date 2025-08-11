const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pic",
    version: "1.2.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Search images from Pinterest",
    category: "search",
    usages: "[search query]-[number of images]",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },
  
  onStart: async function() {}, // Fixed lifecycle hook
  
  run: async function({ api, event, args }) {
    try {
      const input = args.join(" ");
      
      // Validate input format
      if (!input.includes("-")) {
        return api.sendMessage(
          `🖼️ | Invalid format! Please use:\npic [search term]-[number]\nExample: pic beautiful sunset-5`,
          event.threadID,
          event.messageID
        );
      }

      // Parse search parameters
      const parts = input.split("-").map(p => p.trim());
      const keyword = parts[0];
      let imageCount = parseInt(parts[1]) || 5;
      imageCount = Math.min(Math.max(imageCount, 1), 10); // Limit 1-10 images
      
      if (!keyword) {
        return api.sendMessage(
          "🔍 | Please provide a search keyword",
          event.threadID,
          event.messageID
        );
      }

      // Create temporary directory
      const tempDir = path.join(__dirname, 'temp_pic');
      await fs.ensureDir(tempDir);
      
      // Cleanup previous files
      const files = await fs.readdir(tempDir);
      for (const file of files) {
        if (file.endsWith('.jpg') && file.includes(event.senderID)) {
          await fs.unlink(path.join(tempDir, file));
        }
      }

      // Get images from API
      const apiUrl = 'https://api.easy0.repl.co/v1/pinterest';
      const response = await axios.get(`${apiUrl}?search=${encodeURIComponent(keyword)}`);
      
      if (!response.data || !response.data.data) {
        return api.sendMessage(
          "❌ | Failed to get image data from API",
          event.threadID,
          event.messageID
        );
      }
      
      const imageUrls = response.data.data.slice(0, imageCount);
      
      if (imageUrls.length === 0) {
        return api.sendMessage(
          "❌ | No images found for your search",
          event.threadID,
          event.messageID
        );
      }

      // Download images
      const imgPaths = [];
      for (let i = 0; i < imageUrls.length; i++) {
        try {
          const imagePath = path.join(tempDir, `${event.senderID}_${Date.now()}_${i}.jpg`);
          const imageRes = await axios.get(imageUrls[i], {
            responseType: 'arraybuffer',
            timeout: 30000
          });
          await fs.writeFile(imagePath, imageRes.data);
          imgPaths.push(imagePath);
        } catch (error) {
          console.log(`⚠️ Skipping image ${i + 1}:`, error.message);
        }
      }

      // Send results
      if (imgPaths.length > 0) {
        const attachments = imgPaths.map(path => fs.createReadStream(path));
        await api.sendMessage({
          body: `✅ Found ${imgPaths.length} image(s) for: "${keyword}"`,
          attachment: attachments
        }, event.threadID, async () => {
          // Cleanup after sending
          for (const path of imgPaths) {
            if (fs.existsSync(path)) await fs.unlink(path);
          }
        });
      } else {
        api.sendMessage("❌ Failed to download any images", event.threadID, event.messageID);
      }

    } catch (error) {
      console.error("⚠️ Image Search Error:", error);
      api.sendMessage(
        "⚠️ An error occurred while searching images. Please try again later.",
        event.threadID,
        event.messageID
      );
    }
  }
};
