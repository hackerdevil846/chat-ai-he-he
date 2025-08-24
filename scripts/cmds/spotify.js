const fs = require("fs-extra");
const https = require("https");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "spotify",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎵 Download high-quality Spotify tracks with full metadata",
  category: "Media",
  usages: "[Spotify URL or Track ID]",
  cooldowns: 15,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "https": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const tempPath = path.join(__dirname, `cache/spotify_${Date.now()}_${senderID}.mp3`);

  // Check user input
  if (!args[0]) {
    return api.sendMessage(
      `❌ Please provide a Spotify track URL or ID\nExample: ${global.config.PREFIX}spotify https://open.spotify.com/track/7jT3LcNj4XPYOlbNkPWNhU`,
      threadID,
      messageID
    );
  }

  // Extract track ID
  let trackId = args[0];
  if (trackId.includes("open.spotify.com/track/")) {
    const parts = trackId.split("/");
    trackId = parts[parts.length - 1].split("?")[0];
  }

  // Validate track ID
  if (!/^[a-zA-Z0-9]{22}$/.test(trackId)) {
    return api.sendMessage(
      "❌ Invalid Spotify track ID. Provide a valid URL or ID.\nExample: 7jT3LcNj4XPYOlbNkPWNhU",
      threadID,
      messageID
    );
  }

  try {
    // Notify user
    const processingMsg = await api.sendMessage(`⏳ Downloading track... Please wait`, threadID);

    // Spotify API request options
    const apiOptions = {
      method: 'GET',
      hostname: 'spotify-downloader9.p.rapidapi.com',
      path: `/downloadSong?songId=${encodeURIComponent(trackId)}`,
      headers: {
        'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
        'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
      },
      timeout: 45000
    };

    // Fetch track info
    const apiResponse = await new Promise((resolve, reject) => {
      const req = https.request(apiOptions, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', err => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('API request timed out'));
      });
      req.end();
    });

    const result = JSON.parse(apiResponse);
    if (!result || !result.audio || !result.title) throw new Error("API returned invalid data");

    // Download audio
    const audioResponse = await axios.get(result.audio, { responseType: 'arraybuffer', timeout: 120000 });
    fs.writeFileSync(tempPath, Buffer.from(audioResponse.data, 'binary'));

    // Rich metadata
    const metadata = `🎧 𝗦𝗽𝗼𝘁𝗶𝗳𝘆 𝗧𝗿𝗮𝗰𝗸\n\n` +
      `🎼 𝗧𝗶𝘁𝗹𝗲: ${result.title || "Unknown"}\n` +
      `🎤 𝗔𝗿𝘁𝗶𝘀𝘁: ${result.artists || "Unknown"}\n` +
      `💿 𝗔𝗹𝗯𝘂𝗺: ${result.album || "Unknown"}\n` +
      `📅 𝗥𝗲𝗹𝗲𝗮𝘀𝗲: ${result.release || "N/A"}\n` +
      `⏱ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${result.duration || "N/A"}\n` +
      `🔥 𝗣𝗼𝗽𝘂𝗹𝗮𝗿𝗶𝘁𝘆: ${result.popularity || "N/A"}\n` +
      `🔞 𝗘𝘅𝗽𝗹𝗶𝗰𝗶𝘁: ${result.explicit ? "Yes" : "No"}\n` +
      `💾 𝗤𝘂𝗮𝗹𝗶𝘁𝘆: 128kbps\n\n` +
      `🔗 Spotify Link: ${result.external_url || "N/A"}`;

    // Send track with metadata
    await api.sendMessage({
      body: metadata,
      attachment: fs.createReadStream(tempPath)
    }, threadID);

    // Cleanup
    api.unsendMessage(processingMsg.messageID);
    fs.unlinkSync(tempPath);

  } catch (error) {
    console.error("Spotify Download Error:", error);

    let errorMessage = "❌ Failed to download track. ";
    if (error.message.includes('timed out')) {
      errorMessage += "Request timed out. Try a smaller track.";
    } else if (error.message.includes('API returned')) {
      errorMessage += "Spotify API returned invalid data.";
    } else if (error.response?.status === 404) {
      errorMessage += "Track not found or region-restricted.";
    } else {
      errorMessage += `Error: ${error.message || "Unknown error"}`;
    }

    api.sendMessage(errorMessage, threadID, messageID);

    // Cleanup temp file if exists
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
};
