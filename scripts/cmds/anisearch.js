const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "anisearch",
    aliases: ["aniedit", "anitoks", "tiktokani"],
    author: "Mahi Changes made by Asif",
    version: "2.1",
    role: 0,
    prefix: true,
    shortDescription: {
      en: "Search TikTok anime edit videos"
    },
    longDescription: {
      en: "Search and fetch TikTok anime edit videos based on your query"
    },
    category: "media",
    guide: {
      en: "{p}anisearch [query]"
    },
    cooldowns: 15
  },
  onStart: async function ({ api, event, args }) {
    try {
      // Show processing reaction
      api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
      
      // Check if query is provided
      if (!args[0]) {
        return api.sendMessage("🔍 Please provide a search query (e.g., naruto fight)", event.threadID, event.messageID);
      }

      // Prepare the search query
      const query = encodeURIComponent(args.join(' ') + " anime edit");
      const apiUrl = `https://mahi-apis.onrender.com/api/tiktok?search=${query}`;
      
      // Fetch videos from API
      const response = await axios.get(apiUrl);
      const videos = response.data.data;
      
      // Check if videos were found
      if (!videos || videos.length === 0) {
        return api.sendMessage("❌ No videos found for your search", event.threadID, event.messageID);
      }

      // Select a random video
      const videoData = videos[Math.floor(Math.random() * videos.length)];
      const videoUrl = videoData.video;
      const title = videoData.title || "Untitled";

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      // Set file path
      const tempPath = path.join(cacheDir, `anitok_${Date.now()}.mp4`);
      
      // Download the video
      const writer = fs.createWriteStream(tempPath);
      const videoResponse = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream'
      });

      videoResponse.data.pipe(writer);
      
      // Wait for download to complete
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Show success reaction
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      
      // Send the video
      api.sendMessage({
        body: `🎬 Title: ${title}\n🔍 Query: ${args.join(' ')}\n\nEnjoy the anime edit!`,
        attachment: fs.createReadStream(tempPath)
      }, event.threadID, () => {
        // Clean up: delete the temporary file
        try {
          fs.unlinkSync(tempPath);
        } catch (e) {
          console.error("Error deleting file:", e);
        }
      }, event.messageID);
      
    } catch (error) {
      console.error("Anisearch Error:", error);
      // Show error reaction
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
      api.sendMessage("⚠️ An error occurred while processing your request. Please try again later.", event.threadID, event.messageID);
    }
  }
};
