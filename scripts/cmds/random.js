const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "random",
    version: "1.3.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Send random high-quality videos from various categories",
    category: "media",
    usages: "[category]",
    cooldowns: 15,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function() {
    // Initialize cache directory
    const cacheDir = path.join(__dirname, 'cache', 'random_videos');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    console.log("Random video command initialized. Cache directory ready.");
    
    // Start periodic cache cleaning
    this.startCacheCleaner();
  },

  startCacheCleaner: function() {
    // Clean cache every 10 minutes
    setInterval(() => {
      try {
        const cacheDir = path.join(__dirname, 'cache', 'random_videos');
        if (!fs.existsSync(cacheDir)) return;
        
        const files = fs.readdirSync(cacheDir);
        const now = Date.now();
        
        files.forEach(file => {
          const filePath = path.join(cacheDir, file);
          const stats = fs.statSync(filePath);
          const fileAge = now - stats.mtimeMs;
          
          if (fileAge > 600000) { // 10 minutes
            fs.unlinkSync(filePath);
          }
        });
      } catch (cleanError) {
        console.error('Cache cleanup error:', cleanError);
      }
    }, 600000); // 10 minutes
  },

  run: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;
      
      // API endpoints with categories
      const VIDEO_CATEGORIES = {
        funny: [
          "https://api.randomvideo.repl.co/funny",
          "https://api.easy0.repl.co/v1/funnyvideo"
        ],
        anime: [
          "https://api.randomvideo.repl.co/anime",
          "https://api.easy0.repl.co/v1/animevideo"
        ],
        nature: [
          "https://api.randomvideo.repl.co/nature",
          "https://api.easy0.repl.co/v1/naturevideo"
        ],
        gaming: [
          "https://api.randomvideo.repl.co/gaming",
          "https://api.easy0.repl.co/v1/gamingvideo"
        ],
        animal: [
          "https://api.randomvideo.repl.co/animals",
          "https://api.easy0.repl.co/v1/animalvideo"
        ],
        random: [
          "https://api.randomvideo.repl.co/random",
          "https://api.easy0.repl.co/v1/randomvideo"
        ]
      };
      
      // Determine category from arguments
      let category = args[0]?.toLowerCase() || 'random';
      if (!VIDEO_CATEGORIES[category]) {
        category = 'random';
      }
      
      // Get available APIs for this category
      const categoryApis = VIDEO_CATEGORIES[category];
      
      // Send processing message
      const processingMsg = await api.sendMessage(
        `⏳ Loading a ${category} video for you...`,
        threadID
      );
      
      let videoData;
      let apiIndex = 0;
      let apiSuccess = false;
      
      // Try different APIs until successful
      while (apiIndex < categoryApis.length && !apiSuccess) {
        try {
          const apiUrl = categoryApis[apiIndex];
          const response = await axios.get(apiUrl, { timeout: 10000 });
          
          if (response.data && response.data.url) {
            videoData = response.data;
            apiSuccess = true;
          }
        } catch (error) {
          console.error(`API ${apiIndex + 1} failed:`, error.message);
        }
        apiIndex++;
      }
      
      if (!apiSuccess) {
        throw new Error("All video APIs failed for this category");
      }
      
      // Create unique file path
      const cacheDir = path.join(__dirname, 'cache', 'random_videos');
      const videoPath = path.join(cacheDir, `video_${Date.now()}.mp4`);
      
      // Download the video
      const videoResponse = await axios({
        url: videoData.url,
        method: 'GET',
        responseType: 'stream',
        timeout: 30000
      });
      
      const writer = fs.createWriteStream(videoPath);
      videoResponse.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      
      // Prepare message body
      let messageBody = `🎬 Random ${category.charAt(0).toUpperCase() + category.slice(1)} Video\n\n`;
      if (videoData.title) messageBody += `📹 Title: ${videoData.title}\n`;
      if (videoData.views) messageBody += `👀 Views: ${videoData.views}\n`;
      if (videoData.author) messageBody += `👤 Author: ${videoData.author}\n`;
      
      // Send the video
      await api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(videoPath)
      }, threadID);
      
      // Delete processing message
      api.unsendMessage(processingMsg.messageID);
      
      // Clean up after sending
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      
    } catch (error) {
      console.error('Random Video Command Error:', error);
      
      // Delete processing message if exists
      if (processingMsg) {
        api.unsendMessage(processingMsg.messageID);
      }
      
      // Get available categories
      const availableCategories = Object.keys(VIDEO_CATEGORIES).join(', ');
      
      api.sendMessage(
        '❌ Failed to fetch video. Please try again later.\n\n' +
        'Possible solutions:\n' +
        '1. Try a different category\n' +
        '2. Check your internet connection\n' +
        '3. Try again in a few minutes\n\n' +
        `Available categories: ${availableCategories}\n` +
        'Example: !random funny',
        threadID,
        messageID
      );
    }
  }
};
