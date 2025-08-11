const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "poli",
  version: "1.2.0",
  hasPermission: 0,
  credits: "Asif",
  description: "Search and download images from Pinterest",
  category: "search",
  usages: "[search query]-[number of images]",
  cooldowns: 10,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

// Added required onStart function
module.exports.onStart = async function() {
  // Initialization if needed
};

module.exports.run = async function({ api, event, args }) {
  try {
    const input = args.join(" ");
    
    // Validate input format
    if (!input || !input.includes("-")) {
      return api.sendMessage(
        `🖼️ Pinterest Image Search\n\n` +
        `Usage: pic [search term]-[number of images]\n` +
        `Example: pic beautiful sunset-5\n\n` +
        `Note: Maximum 10 images per request`,
        event.threadID,
        event.messageID
      );
    }

    // Parse search parameters
    const parts = input.split("-").map(p => p.trim());
    const keyword = parts[0];
    let imageCount = parseInt(parts[1]) || 5;
    
    // Validate keyword
    if (!keyword) {
      return api.sendMessage(
        "🔍 | Please provide a search keyword",
        event.threadID,
        event.messageID
      );
    }

    // Set safety limits (1-10 images)
    imageCount = Math.max(1, Math.min(imageCount, 10));

    // Create temporary directory
    const tempDir = path.join(__dirname, 'pic_cache');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Cleanup previous files from same user
    const userFiles = fs.readdirSync(tempDir).filter(file => 
      file.startsWith(`${event.senderID}_`)
    );
    userFiles.forEach(file => fs.unlinkSync(path.join(tempDir, file)));

    // Get images from Pinterest
    api.sendMessage(`🔍 Searching Pinterest for "${keyword}"...`, event.threadID, event.messageID);
    
    const apiUrl = 'https://api.easy0.repl.co/v1/pinterest';
    const response = await axios.get(`${apiUrl}?search=${encodeURIComponent(keyword)}`);
    
    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return api.sendMessage(
        `❌ No images found for "${keyword}". Try a different search term.`,
        event.threadID,
        event.messageID
      );
    }

    const imageUrls = response.data.data.slice(0, imageCount);
    const imgPaths = [];

    // Download images
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const timestamp = Date.now();
        const imagePath = path.join(tempDir, `${event.senderID}_${timestamp}_${i}.jpg`);
        
        const imageRes = await axios.get(imageUrls[i], {
          responseType: 'arraybuffer',
          timeout: 15000
        });
        
        fs.writeFileSync(imagePath, imageRes.data);
        imgPaths.push(imagePath);
      } catch (error) {
        console.log(`Skipping image ${i + 1}:`, error.message);
      }
    }

    // Send results
    if (imgPaths.length > 0) {
      const attachments = imgPaths.map(path => fs.createReadStream(path));
      
      await api.sendMessage({
        body: `✅ Found ${imgPaths.length} image(s) for: "${keyword}"`,
        attachment: attachments
      }, event.threadID, (error) => {
        if (error) console.error("Send error:", error);
        
        // Cleanup after sending
        imgPaths.forEach(filePath => {
          try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch (cleanError) {
            console.error("Cleanup error:", cleanError);
          }
        });
      }, event.messageID);
    } else {
      api.sendMessage(
        "❌ Failed to download any images. Please try again later.",
        event.threadID,
        event.messageID
      );
    }

  } catch (error) {
    console.error("Image Search Error:", error);
    api.sendMessage(
      "⚠️ An error occurred while processing your request. Please try again later.",
      event.threadID,
      event.messageID
    );
  }
};
