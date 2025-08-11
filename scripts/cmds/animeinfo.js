const Scraper = require('mal-scraper');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "animeinfo",
    aliases: ["mal", "anime"],
    version: "3.0",
    author: "Asif",
    countDown: 20,
    role: 0,
    shortDescription: {
      en: "Get anime details from MyAnimeList"
    },
    longDescription: {
      en: "Fetch comprehensive anime information using MyAnimeList database"
    },
    category: "anime",
    guide: {
      en: "{pn} [anime title]"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const animeTitle = args.join(" ");
      if (!animeTitle) {
        return api.sendMessage("❌ Please enter an anime title!", event.threadID, event.messageID);
      }

      api.sendMessage(`🔍 Searching MyAnimeList for "${animeTitle}"...`, event.threadID, event.messageID);

      const animeData = await Scraper.getInfoFromName(animeTitle);
      if (!animeData) {
        return api.sendMessage("❌ No results found for this title!", event.threadID, event.messageID);
      }

      const imagePath = path.join(__dirname, 'cache', `mal_${event.senderID}.jpg`);
      const imageUrl = animeData.picture;
      
      // Download image
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

      // Format data
      const genres = animeData.genres.join(", ") || "N/A";
      const studios = animeData.studios || "N/A";
      const producers = animeData.producers || "N/A";

      const messageBody = `🎬 𝗧𝗜𝗧𝗟𝗘: ${animeData.title || "N/A"}
🇯🇵 𝗝𝗮𝗽𝗮𝗻𝗲𝘀𝗲: ${animeData.japaneseTitle || "N/A"}
📺 𝗧𝗬𝗣𝗘: ${animeData.type || "N/A"}
📊 𝗦𝗧𝗔𝗧𝗨𝗦: ${animeData.status || "N/A"}
🗓️ 𝗣𝗥𝗘𝗠𝗜𝗘𝗥𝗘𝗗: ${animeData.premiered || "N/A"}
⏰ 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧: ${animeData.broadcast || "N/A"}
📡 𝗔𝗜𝗥𝗘𝗗: ${animeData.aired || "N/A"}
🏭 𝗣𝗥𝗢𝗗𝗨𝗖𝗘𝗥𝗦: ${producers}
🎥 𝗦𝗧𝗨𝗗𝗜𝗢𝗦: ${studios}
📚 𝗦𝗢𝗨𝗥𝗖𝗘: ${animeData.source || "N/A"}
📈 𝗘𝗣𝗜𝗦𝗢𝗗𝗘𝗦: ${animeData.episodes || "N/A"}
⏱️ 𝗗𝗨𝗥𝗔𝗧𝗜𝗢𝗡: ${animeData.duration || "N/A"}
🏷️ 𝗚𝗘𝗡𝗥𝗘𝗦: ${genres}
🌟 𝗣𝗢𝗣𝗨𝗟𝗔𝗥𝗜𝗧𝗬: #${animeData.popularity || "N/A"}
🏆 𝗥𝗔𝗡𝗞𝗘𝗗: #${animeData.ranked || "N/A"}
⭐ 𝗦𝗖𝗢𝗥𝗘: ${animeData.score || "N/A"} 
🔞 𝗥𝗔𝗧𝗜𝗡𝗚: ${animeData.rating || "N/A"}

📝 𝗦𝗬𝗡𝗢𝗣𝗦𝗜𝗦:\n${animeData.synopsis || "No synopsis available"}

🔗 𝗩𝗜𝗘𝗪 𝗙𝗨𝗟𝗟 𝗗𝗘𝗧𝗔𝗜𝗟𝗦: ${animeData.url}`;

      // Send result
      api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => {
        // Clean up after sending
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }, event.messageID);

    } catch (error) {
      console.error("AnimeInfo Error:", error);
      api.sendMessage("❌ An error occurred while fetching anime data. Please try again later.", event.threadID, event.messageID);
    }
  }
};
