const https = require('https');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "playlist",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎶 Get YouTube playlist information with a visual stylish display",
  category: "media",
  usages: "[playlist ID]",
  cooldowns: 15,
  dependencies: {
    "canvas": ""
  },
  envConfig: {}
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const playlistId = args[0] || 'PLL8jFEKG82Z79hz1lbhWtUioO9fhVKUAr';
  
  // Validate Playlist ID
  if (!/^[a-zA-Z0-9_-]{34}$/.test(playlistId)) {
    return api.sendMessage(
      "❌ Invalid playlist ID format. Please provide a valid YouTube playlist ID.",
      threadID,
      messageID
    );
  }

  // API Request Options
  const options = {
    method: 'GET',
    hostname: 'youtube-music-api-yt.p.rapidapi.com',
    path: `/get-playlist-videos?playlistId=${encodeURIComponent(playlistId)}`,
    headers: {
      'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
      'x-rapidapi-host': 'youtube-music-api-yt.p.rapidapi.com'
    },
    timeout: 15000
  };

  try {
    // Processing Message
    const processingMsg = await api.sendMessage(
      `⌛ Fetching YouTube playlist data for ID: ${playlistId}...`,
      threadID
    );

    // Fetch Playlist Data
    const playlistData = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
          try { resolve(JSON.parse(data)); } 
          catch (e) { reject(new Error('Failed to parse API response')); }
        });
      });
      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timed out'));
      });
      request.end();
    });

    if (playlistData.status === false || !playlistData.data) {
      return api.sendMessage(
        `❌ API Error: ${playlistData.message || 'No playlist data found'}`,
        threadID,
        messageID
      );
    }

    const playlist = playlistData.data;
    const videos = playlist.videos.slice(0, 10);
    
    // Create Canvas
    const canvasWidth = 1000;
    const canvasHeight = 600;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    // Add roundRect function to ctx
    ctx.roundRect = function (x, y, width, height, radius) {
      if (width < 2 * radius) radius = width / 2;
      if (height < 2 * radius) radius = height / 2;
      this.beginPath();
      this.moveTo(x + radius, y);
      this.arcTo(x + width, y, x + width, y + height, radius);
      this.arcTo(x + width, y + height, x, y + height, radius);
      this.arcTo(x, y + height, x, y, radius);
      this.arcTo(x, y, x + width, y, radius);
      this.closePath();
      return this;
    };

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, '#8A2BE2');
    gradient.addColorStop(1, '#1E90FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Decorative circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      const radius = Math.random() * 50 + 10;
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Playlist Title
    ctx.font = 'bold 42px "Segoe UI"';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('🎵 YouTube Playlist Info', canvasWidth / 2, 60);
    
    // Playlist details box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.roundRect(100, 100, 800, 150, 20);
    ctx.fill();
    
    // Playlist Info
    ctx.font = 'bold 30px "Segoe UI"';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'left';
    ctx.fillText(`📛 ${truncate(playlist.title, 30)}`, 130, 150);
    
    ctx.font = '24px "Segoe UI"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`👤 Author: ${playlist.author}`, 130, 190);
    ctx.fillText(`🎬 Videos: ${playlist.videoCount}`, 130, 230);
    
    // Videos header
    ctx.font = 'bold 30px "Segoe UI"';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText('🎧 Top Videos', canvasWidth / 2, 300);
    
    // Video list
    ctx.font = '20px "Segoe UI"';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    
    const startY = 350;
    const lineHeight = 30;
    const maxVideos = Math.min(videos.length, 8);
    
    for (let i = 0; i < maxVideos; i++) {
      const video = videos[i];
      ctx.fillText(`▶️ ${i + 1}. ${truncate(video.title, 40)}`, 150, startY + i * lineHeight);
      ctx.fillText(`⏱️ ${video.duration}`, 750, startY + i * lineHeight);
    }
    
    // Footer
    ctx.font = '20px "Segoe UI"';
    ctx.fillStyle = '#7CFC00';
    ctx.textAlign = 'center';
    ctx.fillText(`🔗 Full Playlist: youtube.com/playlist?list=${playlistId}`, canvasWidth / 2, 570);
    
    // Credit Watermark (Only your name)
    ctx.font = '16px "Segoe UI"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Credit: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅', canvasWidth / 2, 595);
    
    // Save image
    const imgPath = path.join(__dirname, `cache/playlist_${threadID}.png`);
    fs.writeFileSync(imgPath, canvas.toBuffer('image/png'));
    
    // Send result
    const msgBody = `✅ Playlist Retrieved Successfully!\n\n` +
                   `📛 Title: ${playlist.title}\n` +
                   `👤 Author: ${playlist.author}\n` +
                   `🎬 Total Videos: ${playlist.videoCount}`;
    
    api.sendMessage({
      body: msgBody,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath));
    
    // Remove processing message
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

// Helper function
function truncate(str, maxLength) {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}
