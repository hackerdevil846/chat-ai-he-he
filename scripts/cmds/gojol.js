const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "gojol",
    version: "1.0.0",
    role: 0,
    author: "Asif Developer",
    description: "Play beautiful Islamic gazals",
    category: "islamic",
    usage: "gojol",
    example: "gojol",
    cooldown: 5
  },

  onStart: async function({ api, event }) {
    try {
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Islamic gazal messages
      const messages = [
        "🎧 ইসলামিক গজল\nহেডফোন ব্যবহার করে শুনলে আরও ভালো শোনাবে",
        "🕋 আল্লাহর স্মরণে গজল\nভালো শোনার জন্য হেডফোন ব্যবহার করুন",
        "📿 আল্লাহর প্রেমের গজল\nপূর্ণ মনোযোগের জন্য হেডফোন ব্যবহার করুন",
        "🌙 আল্লাহর রহমতের গজল\nসেরা শব্দের জন্য হেডফোন ব্যবহার করুন"
      ];
      
      // Audio file URLs (Islamic gazals)
      const audioUrls = [
        "https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN",
        "https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e",
        "https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo",
        "https://drive.google.com/uc?id=1yHB48N_wPJnU5uV18KMZOLNqo5NE7L4W",
        "https://drive.google.com/uc?id=1xpwuubDL_ebjKJhujb-Ee-FikUF92oF6",
        "https://drive.google.com/uc?id=1yK0A3lyIJoPRp6g3UjNrC31n0yLfc1Ht",
        "https://drive.google.com/uc?id=1xrwhHLhsdKVAn_9umLfUysCt0S2v5QWe",
        "https://drive.google.com/uc?id=1yKwewV-oYbn57lGnlACykSD-yt8fOsfT",
        "https://drive.google.com/uc?id=1xulSi_qyJA47sF9rC9BUIPyBqh47t9Ls",
        "https://drive.google.com/uc?id=1y-PIYYziv-m8QRwmMBWCTl2wzuH8NpYJ",
        "https://drive.google.com/uc?id=1y0wV96m-notKVHnuNdF8xVCWiockSiME",
        "https://drive.google.com/uc?id=1xxMQnp-9-4BoLrGpReps93JQv4k8WUOP"
      ];

      // Select random message and audio
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];
      
      // Generate unique filename
      const audioPath = path.join(cacheDir, `gazal_${Date.now()}.mp3`);
      
      // Send downloading message
      api.sendMessage("📥 গজল ডাউনলোড হচ্ছে, একটু অপেক্ষা করুন...", event.threadID, event.messageID);
      
      // Download the audio file
      const response = await axios({
        method: 'GET',
        url: randomAudioUrl,
        responseType: 'stream',
        timeout: 60000 // 60 seconds timeout
      });

      // Save to cache
      const writer = fs.createWriteStream(audioPath);
      response.data.pipe(writer);
      
      // Wait for download to complete
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      
      // Send audio with message
      return api.sendMessage({
        body: randomMessage,
        attachment: fs.createReadStream(audioPath)
      }, event.threadID, () => {
        // Clean up file after sending
        try {
          fs.unlinkSync(audioPath);
        } catch (cleanupErr) {
          console.error('File cleanup error:', cleanupErr);
        }
      }, event.messageID);

    } catch (error) {
      console.error('Gazal command error:', error);
      return api.sendMessage("❌ গজল ডাউনলোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
  }
};
