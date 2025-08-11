const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "bf",
    version: "1.1",
    hasPermission: 0,
    credits: "Asif",
    description: "Create couple avatar images",
    category: "image",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  // Add the required initialization function
  onStart: async function() {
    // Initialization logic can go here
    // (Not required for this module but needed by the system)
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    try {
      // Check if user mentioned someone
      const mention = Object.keys(event.mentions)[0];
      if (!mention) {
        return api.sendMessage("💑 Please mention someone to create a couple avatar!", threadID, messageID);
      }

      const targetID = mention;
      const targetName = event.mentions[mention].replace("@", "");
      
      // Send processing message
      const processingMsg = await api.sendMessage("⏳ Creating your couple avatar...", threadID, messageID);
      
      // Create cache directory
      const cacheDir = path.join(__dirname, "cache", "couple");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      // Generate output path
      const outputPath = path.join(cacheDir, `couple_${senderID}_${targetID}_${Date.now()}.png`);
      
      // Create the couple image
      await this.createCoupleImage(senderID, targetID, cacheDir, outputPath);
      
      // Send result
      await api.sendMessage({
        body: `❤️ Couple Avatar Created with ${targetName}!`,
        mentions: [{ tag: targetName, id: targetID }],
        attachment: fs.createReadStream(outputPath)
      }, threadID);
      
      // Cleanup
      fs.unlinkSync(outputPath);
      api.unsendMessage(processingMsg.messageID);
      
    } catch (error) {
      console.error("Couple Avatar Error:", error);
      api.sendMessage("❌ Failed to create couple avatar. Please try again later.", threadID, messageID);
    }
  },

  createCoupleImage: async function(uid1, uid2, cacheDir, outputPath) {
    try {
      // Template setup
      const templateURL = "https://i.imgur.com/iaOiAXe.png";
      const templatePath = path.join(cacheDir, "couple_template.png");
      
      // Download template if missing
      if (!fs.existsSync(templatePath)) {
        const { data } = await axios.get(templateURL, { responseType: 'arraybuffer' });
        fs.writeFileSync(templatePath, Buffer.from(data));
      }

      // Process avatars
      const avatar1 = await this.processAvatar(uid1, cacheDir);
      const avatar2 = await this.processAvatar(uid2, cacheDir);
      
      // Load template and composite avatars
      const template = await jimp.read(templatePath);
      template.composite(avatar1.resize(180, 180), 250, 100)
             .composite(avatar2.resize(180, 180), 700, 100);
      
      // Save output
      await template.writeAsync(outputPath);
      return outputPath;
      
    } catch (error) {
      console.error("Image Creation Error:", error);
      throw error;
    }
  },

  processAvatar: async function(uid, cacheDir) {
    const avatarPath = path.join(cacheDir, `avt_${uid}_${Date.now()}.png`);
    
    try {
      // Download avatar
      const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const { data } = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(avatarPath, Buffer.from(data));
      
      // Process and circle crop
      const avatar = await jimp.read(avatarPath);
      avatar.circle();
      
      // Cleanup temporary avatar
      fs.unlinkSync(avatarPath);
      
      return avatar;
      
    } catch (error) {
      console.error("Avatar Processing Error:", error);
      throw error;
    }
  }
};
