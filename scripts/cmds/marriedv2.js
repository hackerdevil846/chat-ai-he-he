const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const jimp = require('jimp');

// Background URL defined as constant
const BACKGROUND_URL = "https://i.ibb.co/mc9KNm1/1619885987-21-pibig-info-p-anime-romantika-svadba-anime-krasivo-24.jpg";

// Helper function for downloading files
async function downloadFile(url, filePath) {
  try {
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    fs.writeFileSync(filePath, Buffer.from(response.data));
    return true;
  } catch (error) {
    console.error('Download error:', error);
    return false;
  }
}

module.exports = {
  config: {
    name: "marriedv2",
    version: "3.2.1",
    hasPermssion: 0,
    credits: "Asif",
    description: "Create a marriage certificate with profile pictures",
    category: "img",
    usages: "[@mention]",
    cooldowns: 10,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    },
    envConfig: {
      backgroundUrl: BACKGROUND_URL
    }
  },

  onLoad: async function() {
    const cachePath = path.join(__dirname, 'cache', 'canvas');
    const bgPath = path.join(cachePath, 'marriedv02.png');
    
    // Create cache directory
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
    }
    
    // Download background if not exists
    if (!fs.existsSync(bgPath)) {
      await downloadFile(BACKGROUND_URL, bgPath);
    }
  },

  circleImage: async function(imagePath) {
    try {
      const image = await jimp.read(imagePath);
      image.circle();
      return await image.getBufferAsync(jimp.MIME_PNG);
    } catch (error) {
      console.error('Circle image error:', error);
      throw error;
    }
  },

  makeMarriageImage: async function({ one, two }) {
    try {
      const cacheDir = path.join(__dirname, 'cache', 'canvas');
      const bgPath = path.join(cacheDir, 'marriedv02.png');
      const outputPath = path.join(cacheDir, `married_${one}_${two}_${Date.now()}.png`);
      const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
      const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);

      // Download profile pictures
      const [avatarOne, avatarTwo] = await Promise.all([
        axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { 
          responseType: 'arraybuffer',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        }),
        axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { 
          responseType: 'arraybuffer',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        })
      ]);

      fs.writeFileSync(avatarOnePath, avatarOne.data);
      fs.writeFileSync(avatarTwoPath, avatarTwo.data);

      // Process images
      const [circleOne, circleTwo, background] = await Promise.all([
        this.circleImage(avatarOnePath),
        this.circleImage(avatarTwoPath),
        jimp.read(bgPath)
      ]);

      const circleOneImg = await jimp.read(circleOne);
      const circleTwoImg = await jimp.read(circleTwo);

      // Composite images
      background.composite(circleOneImg.resize(100, 100), 55, 48);
      background.composite(circleTwoImg.resize(100, 100), 190, 40);

      // Save final image
      await background.writeAsync(outputPath);

      // Cleanup temp files
      [avatarOnePath, avatarTwoPath].forEach(path => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      });

      return outputPath;
    } catch (error) {
      console.error('Marriage image creation error:', error);
      throw error;
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID, senderID, mentions } = event;
      
      // Check if user mentioned someone
      if (!mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage("💍 Please mention someone to marry!", threadID, messageID);
      }

      const targetID = Object.keys(mentions)[0];
      const targetName = mentions[targetID].replace(/@/g, '');
      
      // Get user names
      const userInfo = await api.getUserInfo([senderID, targetID]);
      const userName = userInfo[senderID]?.name || "You";
      const spouseName = userInfo[targetID]?.name || "Your Spouse";
      
      api.sendMessage(`💞 Preparing marriage certificate for ${userName} and ${spouseName}...`, threadID, messageID);
      
      // Generate marriage certificate
      const imagePath = await this.makeMarriageImage({ 
        one: senderID, 
        two: targetID 
      });

      // Send the result
      await api.sendMessage({
        body: `💒 Congratulations! ${userName} and ${spouseName} are now officially married! 💖\nMay your love last forever! ❤️`,
        mentions: [{
          tag: spouseName,
          id: targetID
        }],
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        // Clean up after sending
        try {
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }, messageID);

    } catch (error) {
      console.error('Marriage command error:', error);
      api.sendMessage("❌ An error occurred while creating the marriage certificate. Please try again later.", threadID, messageID);
    }
  }
};
