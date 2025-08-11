const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "sing",
    version: "3.1.0",
    aliases: ["music", "play"],
    credits: "Asif",
    countDown: 10,
    hasPermssion: 0,
    description: "🎵 Download high-quality audio from YouTube",
    category: "music",
    usages: "[song name | YouTube link]",
    cooldowns: 20,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const youtubeRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
      const query = args.join(" ").trim();

      // Show help if no query
      if (!query) {
        const helpMessage = "🎵 Music Player Help:\n\n" +
          "• Play by name: sing <song name>\n" +
          "• Play by link: sing <youtube link>\n\n" +
          "Examples:\n" +
          "  sing chipi chipi chapa chapa\n" +
          "  sing https://youtu.be/dQw4w9WgXcQ\n\n" +
          "⏱️ Cooldown: 20 seconds";
        return api.sendMessage(helpMessage, event.threadID, event.messageID);
      }

      // Handle YouTube links
      if (youtubeRegex.test(query)) {
        const videoID = query.match(youtubeRegex)[1];
        return await this.handleDirectLink(api, event, videoID);
      }

      // Handle search queries
      await this.handleSearch(api, event, query);
    } catch (error) {
      console.error("Sing Command Error:", error);
      api.sendMessage(
        "❌ An error occurred: " + (error.message || "Please try again later"), 
        event.threadID,
        event.messageID
      );
    }
  },

  handleDirectLink: async function (api, event, videoID) {
    try {
      api.sendMessage("⬇️ Downloading audio... Please wait 10-30 seconds!", event.threadID, event.messageID);
      
      const apiUrl = "https://api--dipto.repl.co";
      const { data } = await axios.get(`${apiUrl}/ytDl3?link=${videoID}&format=mp3`, {
        timeout: 30000
      });
      
      if (!data.downloadLink) {
        throw new Error("No download link found");
      }

      const audioPath = path.join(__dirname, 'cache', `audio_${Date.now()}.mp3`);
      await this.downloadFile(data.downloadLink, audioPath);

      // Check file size (25MB limit)
      const fileSize = fs.statSync(audioPath).size;
      if (fileSize > 25 * 1024 * 1024) {
        fs.unlinkSync(audioPath);
        throw new Error("File size exceeds 25MB limit");
      }

      api.sendMessage({
        body: `🎵 Now Playing: ${data.title || "Unknown Title"}\n🎚️ Quality: ${data.quality || "Unknown"}\n⏱️ Duration: ${data.duration || "Unknown"}`,
        attachment: fs.createReadStream(audioPath)
      }, event.threadID, () => {
        try {
          fs.unlinkSync(audioPath);
        } catch (cleanError) {
          console.error("Cleanup error:", cleanError);
        }
      }, event.messageID);
    } catch (error) {
      console.error("Direct Link Error:", error);
      api.sendMessage(
        `❌ Failed to download audio: ${error.message || "Server might be busy"}`,
        event.threadID,
        event.messageID
      );
    }
  },

  handleSearch: async function (api, event, query) {
    try {
      api.sendMessage(`🔍 Searching for "${query}"...`, event.threadID, event.messageID);
      
      const apiUrl = "https://api--dipto.repl.co";
      const response = await axios.get(`${apiUrl}/ytFullSearch?songName=${encodeURIComponent(query)}`, {
        timeout: 20000
      });
      
      const results = response.data.slice(0, 6);

      if (!results.length) {
        return api.sendMessage(
          `🔍 No results found for: "${query}"`,
          event.threadID,
          event.messageID
        );
      }

      let messageBody = "🎵 Search Results:\n\n";
      const choices = [];

      for (const [index, result] of results.entries()) {
        messageBody += `${index + 1}. ${result.title}\n⏱️ ${result.time} | 👤 ${result.channel.name}\n\n`;
        choices.push({
          title: result.title,
          id: result.id,
          duration: result.time
        });
      }

      messageBody += "Reply with the number (1-6) to play the song";

      api.sendMessage(messageBody, event.threadID, (error, info) => {
        if (error) return console.error(error);
        
        // Set up reply handler
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          choices
        });
      }, event.messageID);
    } catch (error) {
      console.error("Search Error:", error);
      api.sendMessage(
        "❌ Failed to search for songs. The service might be down or you're offline.",
        event.threadID,
        event.messageID
      );
    }
  },

  onReply: async function ({ api, event, Reply }) {
    try {
      const choice = parseInt(event.body);
      const { choices, messageID } = Reply;
      
      if (isNaN(choice) || choice < 1 || choice > choices.length) {
        return api.sendMessage(
          "🔢 Please reply with a number between 1 and 6",
          event.threadID,
          event.messageID
        );
      }

      api.unsendMessage(messageID);
      const selected = choices[choice - 1];
      api.sendMessage(
        `⏳ Preparing: ${selected.title}\n⏱️ Duration: ${selected.duration || "Unknown"}`,
        event.threadID,
        event.messageID
      );
      return await this.handleDirectLink(api, event, selected.id);
    } catch (error) {
      console.error("Reply Error:", error);
      api.sendMessage(
        "❌ Failed to process your selection. The audio might be too large (max 25MB) or unavailable.",
        event.threadID,
        event.messageID
      );
    }
  },

  downloadFile: async function (url, outputPath) {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 60000
    });

    await fs.writeFile(outputPath, response.data);
    return outputPath;
  }
};
