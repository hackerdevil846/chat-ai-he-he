const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "arrest",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Arrest a mentioned user with their profile picture",
    category: "fun",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onStart: async function() {
    const cachePath = path.join(__dirname, "cache");
    const canvasPath = path.join(cachePath, "canvas");
    const templatePath = path.join(canvasPath, "arrest_template.png");
    
    try {
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }
      if (!fs.existsSync(canvasPath)) {
        fs.mkdirSync(canvasPath);
      }
      
      if (!fs.existsSync(templatePath)) {
        const { data } = await axios.get("https://i.imgur.com/ep1gG3r.png", {
          responseType: "arraybuffer",
          timeout: 30000
        });
        fs.writeFileSync(templatePath, Buffer.from(data, "binary"));
      }
    } catch (err) {
      console.error("Arrest Template Initialization Error:", err);
    }
  },

  run: async function({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    
    try {
      const mention = Object.keys(event.mentions)[0];
      if (!mention) {
        return api.sendMessage("⚠️ Please mention someone to arrest!", threadID, messageID);
      }
      
      const targetName = event.mentions[mention];
      const canvasPath = path.join(__dirname, "cache", "canvas");
      const outputPath = path.join(canvasPath, `arrest_${senderID}_${Date.now()}.png`);
      
      const imagePath = await this.makeArrestImage(senderID, mention, canvasPath);
      
      api.sendMessage({
        body: `🚨 You're under arrest ${targetName}! 🚨`,
        mentions: [{ tag: targetName, id: mention }],
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        try { 
          fs.unlinkSync(imagePath);
        } catch (cleanupErr) {
          console.warn("Failed to clean up image:", cleanupErr);
        }
      }, messageID);

    } catch (error) {
      console.error("Arrest Command Error:", error);
      api.sendMessage("❌ Failed to create arrest image. Please try again later.", threadID, messageID);
    }
  },

  makeArrestImage: async function(user1, user2, cacheDir) {
    const templatePath = path.join(cacheDir, "arrest_template.png");
    const outputPath = path.join(cacheDir, `arrest_${user1}_${user2}_${Date.now()}.png`);
    
    try {
      const [avatar1, avatar2, template] = await Promise.all([
        this.getAvatar(user1),
        this.getAvatar(user2),
        jimp.read(templatePath)
      ]);
      
      template.resize(500, 500);
      avatar1.resize(100, 100);
      avatar2.resize(100, 100);
      
      template.composite(avatar1, 375, 9);
      template.composite(avatar2, 160, 92);
      
      await template.writeAsync(outputPath);
      return outputPath;
    } catch (error) {
      console.error("Image Creation Error:", error);
      throw error;
    }
  },
  
  getAvatar: async function(userID) {
    try {
      const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const { data } = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 15000
      });
      
      const avatar = await jimp.read(data);
      return avatar.circle();
    } catch (error) {
      console.error("Avatar Loading Error:", error);
      // Create a blank avatar as fallback
      return new jimp(100, 100, 0xFFFFFFFF).circle();
    }
  }
};
