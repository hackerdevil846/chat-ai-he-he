const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "fact2",
    version: "1.5.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Create beautiful fact images with custom text",
    category: "image",
    usages: "fact2 [text]",
    cooldowns: 10,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    // Get text input
    const text = args.join(" ");
    if (!text) {
      return api.sendMessage(
        "📝 Fact Image Generator\n━━━━━━━━━━━━━━\nUsage: fact2 [text]\nExample: fact2 Honey never spoils\n\n💡 Tip: Keep text under 150 characters for best results",
        threadID, 
        messageID
      );
    }

    // Check text length
    if (text.length > 150) {
      return api.sendMessage(
        "⚠️ Text is too long! Please keep it under 150 characters.",
        threadID,
        messageID
      );
    }
    
    try {
      // Send processing message
      const processingMsg = await api.sendMessage(
        "🖼️ Creating your fact image... Please wait a moment...",
        threadID
      );
      
      // Create cache directory
      const cacheDir = path.join(__dirname, 'cache', 'facts');
      await fs.ensureDir(cacheDir);
      
      // Define output path
      const outputPath = path.join(cacheDir, `fact_${Date.now()}.png`);
      
      // Fetch image from API
      const response = await axios.get(
        `https://api.popcat.xyz/facts?text=${encodeURIComponent(text)}`, 
        {
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: {
            'User-Agent': 'Goat-Bot-Fact2-Command'
          }
        }
      );
      
      // Validate response
      if (!response.data || response.data.length === 0) {
        throw new Error("Empty API response");
      }
      
      // Save image
      await fs.writeFile(outputPath, Buffer.from(response.data, 'binary'));
      
      // Send result
      await api.unsendMessage(processingMsg.messageID);
      api.sendMessage({
        body: `✅ Your Fact Image Is Ready!\n━━━━━━━━━━━━━━\n📝 Text: "${text}"`,
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Clean up file after sending
        fs.unlink(outputPath, (err) => {
          if (err) console.error("Cleanup error:", err);
        });
      }, messageID);
      
    } catch (error) {
      console.error("Fact2 command error:", error);
      
      let errorMessage;
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "⚠️ Fact image service is currently unavailable";
            break;
          case 429:
            errorMessage = "🚫 Too many requests! Please try again later";
            break;
          case 500:
            errorMessage = "🛠️ Server error. Please try again later";
            break;
          default:
            errorMessage = `⚠️ API error: ${error.response.status}`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "⏱️ Request timed out. Please try again with shorter text.";
      } else if (error.message.includes("Empty API")) {
        errorMessage = "🖼️ Couldn't generate image. Please try different text.";
      } else {
        errorMessage = "❌ An unexpected error occurred. Please try again!";
      }
      
      api.sendMessage(errorMessage, threadID, messageID);
    }
  }
};
