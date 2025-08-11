const http = global.nodemodule["https"];

module.exports.config = {
  name: "playlist",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Asif",
  description: "Get YouTube playlist information",
  category: "Media",
  usages: "[playlist ID]",
  cooldowns: 10,
  dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  
  // Set default playlist ID if not provided
  const playlistId = args[0] || 'PLL8jFEKG82Z79hz1lbhWtUioO9fhVKUAr';

  // Validate playlist ID format
  if (!/^[a-zA-Z0-9_-]{34}$/.test(playlistId)) {
    return api.sendMessage(
      "❌ Invalid playlist ID format. Please provide a valid YouTube playlist ID.",
      threadID,
      messageID
    );
  }

  const options = {
    method: 'GET',
    hostname: 'youtube-music-api-yt.p.rapidapi.com',
    path: `/get-playlist-videos?playlistId=${encodeURIComponent(playlistId)}`,
    headers: {
      'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
      'x-rapidapi-host': 'youtube-music-api-yt.p.rapidapi.com'
    },
    timeout: 15000 // 15 seconds timeout
  };

  try {
    // Send processing message
    const processingMsg = await api.sendMessage(
      `⌛ Fetching YouTube playlist data for ID: ${playlistId}...`,
      threadID
    );

    const playlistData = await new Promise((resolve, reject) => {
      const request = http.request(options, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse API response'));
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timed out'));
      });

      request.end();
    });

    // Check for API errors
    if (playlistData.status === false || !playlistData.data) {
      return api.sendMessage(
        `❌ API Error: ${playlistData.message || 'No playlist data found'}`,
        threadID,
        messageID
      );
    }

    const playlist = playlistData.data;
    const videos = playlist.videos.slice(0, 10); // Get first 10 videos

    // Format response message
    let message = `🎵 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗣𝗹𝗮𝘆𝗹𝗶𝘀𝘁 𝗜𝗻𝗳𝗼\n\n`;
    message += `📛 𝗧𝗶𝘁𝗹𝗲: ${playlist.title}\n`;
    message += `👤 𝗔𝘂𝘁𝗵𝗼𝗿: ${playlist.author}\n`;
    message += `🎬 𝗧𝗼𝘁𝗮𝗹 𝗩𝗶𝗱𝗲𝗼𝘀: ${playlist.videoCount}\n\n`;
    message += '🎧 𝗧𝗼𝗽 𝟭𝟬 𝗩𝗶𝗱𝗲𝗼𝘀:\n';

    videos.forEach((video, index) => {
      message += `\n${index + 1}. ${video.title}\n`;
      message += `   ⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${video.duration}\n`;
      message += `   👀 𝗩𝗶𝗲𝘄𝘀: ${video.views}\n`;
      message += `   🔗 𝗟𝗶𝗻𝗸: https://youtu.be/${video.videoId}\n`;
    });

    message += `\n🔗 𝗙𝘂𝗹𝗹 𝗣𝗹𝗮𝘆𝗹𝗶𝘀𝘁 𝗟𝗶𝗻𝗸: https://www.youtube.com/playlist?list=${playlistId}`;

    // Send final message
    await api.sendMessage(message, threadID);
    
    // Delete processing message
    api.unsendMessage(processingMsg.messageID);

  } catch (error) {
    console.error('Playlist Error:', error);
    
    let errorMessage = "❌ ";
    if (error.message.includes('timed out')) {
      errorMessage += "Request timed out. Please try again later.";
    } else if (error.message.includes('parse')) {
      errorMessage += "Invalid API response received.";
    } else {
      errorMessage += `Error: ${error.message || 'Unknown error'}`;
    }
    
    api.sendMessage(errorMessage, threadID, messageID);
  }
};
