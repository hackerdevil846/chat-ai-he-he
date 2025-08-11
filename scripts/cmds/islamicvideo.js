const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "islamicvideo",
    version: "1.1.1",
    hasPermission: 0,
    credits: "Asif",
    description: "Get random Islamic inspirational videos",
    category: "islam",
    usages: "[islamicvideo]",
    cooldowns: 15,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },
  
  onStart: async function ({ api, event }) {
    const videoLinks = [
      "https://drive.usercontent.google.com/download?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH",
      "https://drive.usercontent.google.com/download?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O",
      "https://drive.usercontent.google.com/download?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW",
      "https://drive.usercontent.google.com/download?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD",
      "https://drive.usercontent.google.com/download?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4",
      "https://drive.usercontent.google.com/download?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprD",
      "https://drive.usercontent.google.com/download?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA",
      "https://drive.usercontent.google.com/download?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441",
      "https://drive.usercontent.google.com/download?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8",
      "https://drive.usercontent.google.com/download?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo"
    ];

    try {
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const videoUrl = videoLinks[Math.floor(Math.random() * videoLinks.length)];
      const videoPath = path.join(cacheDir, `islamic_${Date.now()}.mp4`);

      api.sendMessage("📥 Downloading Islamic content, please wait...", event.threadID, event.messageID);

      const { data } = await axios.get(videoUrl, {
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(videoPath);
      data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      api.sendMessage({
        body: "السلام عليكم ورحمة الله وبركاته\n\nHere is an Islamic video for reflection:",
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);

    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❌ Could not retrieve Islamic content. Please try again later.", event.threadID, event.messageID);
    }
  }
};
