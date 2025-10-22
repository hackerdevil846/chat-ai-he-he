const axios = require("axios");

module.exports = {
  config: {
    name: "vidx",
    aliases: [],
    version: "2.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 2,
    category: "adult",
    shortDescription: {
      en: "🔍 Search adult videos"
    },
    longDescription: {
      en: "Search and get adult videos with direct download links"
    },
    guide: {
      en: "{p}vidx [search term]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ message, args, event }) {
    const query = args.join(" ");
    if (!query) {
      return message.reply("❌ | Please provide a search term.\nExample: /vidx teen");
    }

    try {
      // Show searching message
      const searchingMsg = await message.reply(`🔍 | Searching videos for: "${query}"...`);

      const apiUrl = `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(query)}&per_page=10&format=json`;

      const res = await axios.get(apiUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const data = res.data;

      if (!data?.videos?.length) {
        await message.unsend(searchingMsg.messageID);
        return message.reply(`❌ | No videos found for: "${query}"`);
      }

      const videos = data.videos.slice(0, 5);
      let output = `🔍 Search Results for: "${query}"\n\n`;
      
      // Add video list
      videos.forEach((video, index) => {
        output += `${index + 1}. ${video.title}\n`;
        output += `   ⏰ ${video.length_min} min | 👍 ${video.rating}/5\n`;
        output += `   📊 Quality: ${video.quality}\n\n`;
      });

      output += `💬 Reply with number (1-${videos.length}) to get the video download link.`;

      // Send thumbnail of first video as preview
      const previewThumb = videos[0].default_thumb.src;
      
      await message.unsend(searchingMsg.messageID);
      await message.reply({
        body: output,
        attachment: await global.utils.getStreamFromURL(previewThumb)
      });

      // Store video data for reply handling
      global.vidxData = global.vidxData || {};
      global.vidxData[event.messageID] = {
        videos: videos,
        query: query,
        timestamp: Date.now()
      };

      // Auto cleanup after 5 minutes
      setTimeout(() => {
        if (global.vidxData && global.vidxData[event.messageID]) {
          delete global.vidxData[event.messageID];
        }
      }, 5 * 60 * 1000);

    } catch (error) {
      console.error("Vidx Search Error:", error);
      return message.reply("❌ | Failed to search videos. Please try again later.");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    try {
      if (!global.vidxData || !global.vidxData[event.messageID]) {
        return message.reply("❌ | Session expired. Please start a new search.");
      }

      const { videos, query } = global.vidxData[event.messageID];
      const selectedNum = parseInt(event.body.trim());

      if (isNaN(selectedNum) || selectedNum < 1 || selectedNum > videos.length) {
        return message.reply(`❌ | Please reply with a number between 1 and ${videos.length}.`);
      }

      const videoIndex = selectedNum - 1;
      const selectedVideo = videos[videoIndex];

      // Show processing message
      const processingMsg = await message.reply(`⏳ | Processing video: "${selectedVideo.title}"...`);

      try {
        // Get video page to extract download links
        const videoPageUrl = `https://www.eporner.com/video-${selectedVideo.id}/x/`;
        const pageResponse = await axios.get(videoPageUrl, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const pageHtml = pageResponse.data;
        
        // Try to find download links in the page
        let downloadUrl = null;
        
        // Method 1: Look for download links in HTML
        const downloadLinkMatch = pageHtml.match(/href="(https:\/\/[^"]*\.mp4[^"]*)"/i);
        if (downloadLinkMatch) {
          downloadUrl = downloadLinkMatch[1];
        }
        
        // Method 2: Try to construct download URL from video ID
        if (!downloadUrl) {
          // Common eporner download URL pattern
          downloadUrl = `https://www.eporner.com/download/${selectedVideo.id}/`;
        }

        // Method 3: Use embed page to get video source
        if (!downloadUrl) {
          try {
            const embedUrl = `https://www.eporner.com/embed/${selectedVideo.id}`;
            const embedResponse = await axios.get(embedUrl, { timeout: 10000 });
            const embedHtml = embedResponse.data;
            
            const sourceMatch = embedHtml.match(/src="(https:\/\/[^"]*\.mp4[^"]*)"/i);
            if (sourceMatch) {
              downloadUrl = sourceMatch[1];
            }
          } catch (embedError) {
            console.error("Embed page error:", embedError);
          }
        }

        await message.unsend(processingMsg.messageID);

        if (downloadUrl) {
          // Send the video directly
          try {
            await message.reply({
              body: `🎥 ${selectedVideo.title}\n⏰ ${selectedVideo.length_min} min | 👍 ${selectedVideo.rating}/5\n📊 Quality: ${selectedVideo.quality}\n\n✅ Here's your video:`,
              attachment: await global.utils.getStreamFromURL(downloadUrl)
            });
          } catch (streamError) {
            console.error("Stream error:", streamError);
            // If stream fails, send the download link
            await message.reply({
              body: `🎥 ${selectedVideo.title}\n⏰ ${selectedVideo.length_min} min | 👍 ${selectedVideo.rating}/5\n📊 Quality: ${selectedVideo.quality}\n\n🔗 Download Link:\n${downloadUrl}\n\n❌ Could not send video directly. Use the link above.`,
              attachment: await global.utils.getStreamFromURL(selectedVideo.default_thumb.src)
            });
          }
        } else {
          // Fallback: Send video page link
          await message.reply({
            body: `🎥 ${selectedVideo.title}\n⏰ ${selectedVideo.length_min} min | 👍 ${selectedVideo.rating}/5\n📊 Quality: ${selectedVideo.quality}\n\n🔗 Video Page:\n${videoPageUrl}\n\n❌ Could not extract direct download link. Visit the page to watch.`,
            attachment: await global.utils.getStreamFromURL(selectedVideo.default_thumb.src)
          });
        }

      } catch (videoError) {
        console.error("Video processing error:", videoError);
        await message.unsend(processingMsg.messageID);
        await message.reply({
          body: `❌ | Failed to process video: "${selectedVideo.title}"\n\nPlease try another video or search again.`,
          attachment: await global.utils.getStreamFromURL(selectedVideo.default_thumb.src)
        });
      }

      // Clean up stored data
      delete global.vidxData[event.messageID];

    } catch (error) {
      console.error("Vidx Reply Error:", error);
      await message.reply("❌ | An error occurred while processing your selection.");
      
      // Clean up on error
      if (global.vidxData && global.vidxData[event.messageID]) {
        delete global.vidxData[event.messageID];
      }
    }
  }
};
