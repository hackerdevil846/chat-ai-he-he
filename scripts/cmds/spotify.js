const fs = global.nodemodule["fs-extra"];
const https = global.nodemodule["https"];
const axios = global.nodemodule["axios"];

module.exports.config = {
  name: "spotify",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ASIF",
  description: "Download high-quality Spotify tracks",
  category: "Media",
  usages: "[Spotify URL or Track ID]",
  cooldowns: 15,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "https": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const tempPath = __dirname + `/cache/spotify_${Date.now()}_${event.senderID}.mp3`;

  // Check if user provided input
  if (!args[0]) {
    return api.sendMessage(
      `🎵 Please provide a Spotify track URL or ID\nExample: ${global.config.PREFIX}spotify https://open.spotify.com/track/7jT3LcNj4XPYOlbNkPWNhU`,
      threadID,
      messageID
    );
  }

  // Extract track ID from input
  let trackId = args[0];
  if (trackId.includes("open.spotify.com/track/")) {
    const urlParts = trackId.split("/");
    trackId = urlParts[urlParts.length - 1];
    if (trackId.includes("?")) trackId = trackId.split("?")[0];
  }

  // Validate track ID format
  if (!/^[a-zA-Z0-9]{22}$/.test(trackId)) {
    return api.sendMessage(
      "❌ Invalid Spotify track ID. Please provide a valid URL or ID.\nExample: 7jT3LcNj4XPYOlbNkPWNhU",
      threadID,
      messageID
    );
  }

  try {
    // Send processing message
    const processingMsg = await api.sendMessage(
      `⏳ Downloading track... This may take a moment`,
      threadID
    );

    // Prepare API request options
    const apiOptions = {
      method: 'GET',
      hostname: 'spotify-downloader9.p.rapidapi.com',
      path: `/downloadSong?songId=${encodeURIComponent(trackId)}`,
      headers: {
        'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
        'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
      },
      timeout: 45000 // 45 seconds timeout
    };

    // Make API request
    const apiResponse = await new Promise((resolve, reject) => {
      const req = https.request(apiOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('API request timed out'));
      });

      req.end();
    });

    // Parse API response
    const result = JSON.parse(apiResponse);
    
    if (!result || !result.audio || !result.title) {
      throw new Error("API returned invalid data");
    }

    // Download the audio file
    const audioResponse = await axios.get(result.audio, {
      responseType: 'arraybuffer',
      timeout: 120000 // 2 minutes timeout
    });

    // Save to cache
    fs.writeFileSync(tempPath, Buffer.from(audioResponse.data, 'binary'));

    // Prepare metadata
    const metadata = `🎧 𝗦𝗽𝗼𝘁𝗶𝗳𝘆 𝗧𝗿𝗮𝗰𝗸\n\n𝗧𝗶𝘁𝗹𝗲: ${result.title || "Unknown"}\n𝗔𝗿𝘁𝗶𝘀𝘁: ${result.artists || "Unknown"}\n𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${result.duration || "N/A"}\n𝗤𝘂𝗮𝗹𝗶𝘁𝘆: 128kbps`;

    // Send result
    await api.sendMessage({
      body: metadata,
      attachment: fs.createReadStream(tempPath)
    }, threadID);

    // Cleanup
    api.unsendMessage(processingMsg.messageID);
    fs.unlinkSync(tempPath);

  } catch (error) {
    console.error('Spotify Download Error:', error);
    
    let errorMessage = "❌ Failed to download track. ";
    if (error.message.includes('timed out')) {
      errorMessage += "The request took too long. Please try a smaller track.";
    } else if (error.message.includes('API returned')) {
      errorMessage += "Spotify API returned invalid data.";
    } else if (error.response?.status === 404) {
      errorMessage += "Track not found. It may be region-restricted.";
    } else {
      errorMessage += `Error: ${error.message || "Unknown error"}`;
    }
    
    api.sendMessage(errorMessage, threadID, messageID);
    
    // Cleanup if file exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
};
