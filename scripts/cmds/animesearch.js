const https = require('https');

module.exports.config = {
  name: "animesearch",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Search anime info from AnimeDB API",
  category: "media",
  usages: "[search term]",
  cooldowns: 5
};

async function fetchAnimeData(searchTerm = "Fullmetal") {
  const options = {
    method: 'GET',
    hostname: 'anime-db.p.rapidapi.com',
    port: 443,
    path: `/anime?page=1&size=10&search=${encodeURIComponent(searchTerm)}&genres=Fantasy%2CDrama&sortBy=ranking&sortOrder=asc`,
    headers: {
      'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
      'x-rapidapi-host': 'anime-db.p.rapidapi.com'
    },
    timeout: 10000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`API request failed with status code: ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch (err) {
          reject(new Error('Failed to parse API response as JSON'));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 10 seconds'));
    });

    req.end();
  });
}

module.exports.run = async function({ api, event, args }) {
  const searchTerm = args.join(" ") || "Fullmetal";

  try {
    const animeData = await fetchAnimeData(searchTerm);

    if (!animeData.data || !Array.isArray(animeData.data) || animeData.data.length === 0) {
      return api.sendMessage(`❌ No results found for: ${searchTerm}`, event.threadID, event.messageID);
    }

    let resultMsg = `✨ Anime Search Results for: "${searchTerm}" ✨\n\n`;

    animeData.data.forEach((anime, index) => {
      resultMsg += `🔹 ${index + 1}. ${anime.title || anime.name || 'Unknown Title'}\n`;
      if (anime.synopsis) {
        resultMsg += `   📖 ${anime.synopsis.substring(0, 100)}...\n`;
      }
      if (anime.type) {
        resultMsg += `   🎬 Type: ${anime.type}\n`;
      }
      if (anime.episodes) {
        resultMsg += `   🎞 Episodes: ${anime.episodes}\n`;
      }
      if (anime.status) {
        resultMsg += `   📌 Status: ${anime.status}\n`;
      }
      resultMsg += "\n";
    });

    api.sendMessage(resultMsg, event.threadID, event.messageID);

  } catch (error) {
    api.sendMessage(`⚠️ Error fetching anime data: ${error.message}`, event.threadID, event.messageID);
  }
};
