const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

module.exports = {
  config: {
    name: "hugv3",
    version: "7.3.1",
    role: 0,
    author: "Asif",
    description: "Create beautiful hug images with avatars 🥰",
    category: "image",
    usage: "[@mention]",
    example: "hugv3 @friend",
    cooldown: 5
  },

  onLoad: async function() {
    const canvasDir = path.join(__dirname, 'cache', 'canvas');
    const templatePath = path.join(canvasDir, 'hugv3.png');
    
    try {
      if (!fs.existsSync(canvasDir)) {
        await fs.mkdirp(canvasDir);
      }
      
      if (!fs.existsSync(templatePath)) {
        console.log("Downloading hug template...");
        await this.downloadFile("https://i.imgur.com/7lPqHjw.jpg", templatePath);
        console.log("Hug template downloaded successfully");
      }
    } catch (error) {
      console.error("Hug command initialization error:", error);
    }
  },

  onStart: async function({ event, api }) {
    try {
      const { threadID, messageID, senderID } = event;
      const mentions = Object.keys(event.mentions || {});
      
      // Validate mention
      if (mentions.length === 0) {
        return api.sendMessage("💕 Please mention someone to hug!", threadID, messageID);
      }
      
      const targetID = mentions[0];
      
      // Prevent self-hug
      if (senderID === targetID) {
        return api.sendMessage("🤔 You can't hug yourself!", threadID, messageID);
      }
      
      // Send processing message
      await api.sendMessage("🖼️ Creating your special hug image...", threadID, messageID);
      
      const startTime = Date.now();
      const imagePath = await this.createHugImage(senderID, targetID);
      const creationTime = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Send result
      return api.sendMessage({
        body: `🤗 Sent with love! (Created in ${creationTime}s)`,
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        // Cleanup temporary files
        try {
          fs.unlinkSync(imagePath);
          fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${senderID}.png`));
          fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${targetID}.png`));
          console.log("Cleaned up temporary files");
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }
      }, messageID);
      
    } catch (error) {
      console.error("Hug command error:", error);
      return api.sendMessage("❌ Failed to create hug image. Please try again later.", threadID, messageID);
    }
  },

  createHugImage: async function(user1, user2) {
    const canvasDir = path.join(__dirname, 'cache', 'canvas');
    const templatePath = path.join(canvasDir, 'hugv3.png');
    const outputPath = path.join(canvasDir, `hug_${user1}_${user2}.png`);
    const avatar1Path = path.join(canvasDir, `avt_${user1}.png`);
    const avatar2Path = path.join(canvasDir, `avt_${user2}.png`);
    
    try {
      // Download avatars in parallel
      const [avatar1, avatar2] = await Promise.all([
        this.fetchAvatar(user1),
        this.fetchAvatar(user2)
      ]);
      
      // Save avatars to disk
      await fs.writeFile(avatar1Path, avatar1);
      await fs.writeFile(avatar2Path, avatar2);
      
      // Load template
      const template = await jimp.read(templatePath);
      
      // Process avatars
      const processedAvatar1 = await this.processAvatar(avatar1Path);
      const processedAvatar2 = await this.processAvatar(avatar2Path);
      
      // Position avatars on template
      template.composite(processedAvatar1.resize(220, 220), 200, 50)   // Left position
             .composite(processedAvatar2.resize(220, 220), 490, 200);  // Right position
      
      // Save final image
      await template.writeAsync(outputPath);
      
      return outputPath;
    } catch (error) {
      console.error("Image creation failed:", error);
      throw new Error("Failed to create hug image");
    }
  },

  fetchAvatar: async function(userID) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${userID}/picture?width=512&height=512`,
        { 
          responseType: 'arraybuffer',
          timeout: 10000  // 10 seconds timeout
        }
      );
      return Buffer.from(response.data);
    } catch (error) {
      console.error(`Avatar download failed for ${userID}:`, error);
      throw new Error("Couldn't fetch profile picture");
    }
  },

  processAvatar: async function(avatarPath) {
    try {
      const image = await jimp.read(avatarPath);
      image.circle();  // Convert to circular avatar
      return image;
    } catch (error) {
      console.error("Failed to process avatar:", error);
      throw new Error("Avatar processing error");
    }
  },

  downloadFile: async function(url, savePath) {
    try {
      const response = await axios.get(url, { responseType: 'stream' });
      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);
      
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.error("Template download error:", error);
      throw new Error("Failed to download template image");
    }
  }
};
