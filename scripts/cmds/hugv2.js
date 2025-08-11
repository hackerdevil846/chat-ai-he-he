const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

module.exports = {
  config: {
    name: "hugv2",
    version: "3.1.1",
    role: 0,
    author: "Asif",
    description: "Create hug images with avatars 🥰",
    category: "image",
    usage: "[@mention]",
    example: "hugv2 @friend",
    cooldown: 5
  },

  onLoad: async function() {
    const canvasDir = path.join(__dirname, 'cache', 'canvas');
    const imagePath = path.join(canvasDir, 'hugv2.png');
    
    try {
      if (!fs.existsSync(canvasDir)) {
        await fs.mkdirp(canvasDir);
      }
      
      if (!fs.existsSync(imagePath)) {
        const imageURL = "https://i.ibb.co/zRdZJzG/1626342271-28-kartinkin-com-p-anime-obnimashki-v-posteli-anime-krasivo-30.jpg";
        // FIX: Use module.exports to access downloadFile directly
        await module.exports.downloadFile(imageURL, imagePath);
        console.log("Hug template downloaded successfully");
      }
    } catch (error) {
      console.error("Hug command initialization error:", error);
    }
  },

  onStart: async function({ event, api, args }) {
    try {
      const { threadID, messageID, senderID } = event;
      const mentions = Object.keys(event.mentions || {});
      
      // Validate mention
      if (!mentions.length) {
        return api.sendMessage("💖 Please mention someone to hug!", threadID, messageID);
      }
      
      const targetID = mentions[0];
      
      // Prevent self-hug
      if (senderID === targetID) {
        return api.sendMessage("🤔 You can't hug yourself!", threadID, messageID);
      }
      
      // Send processing message
      await api.sendMessage("🖼️ Creating your hug image...", threadID, messageID);
      
      // Generate hug image
      const outputPath = await this.makeImage(senderID, targetID);
      
      // Send result
      return api.sendMessage({
        body: "🤗 Here's your hug!",
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Cleanup temporary files
        try {
          fs.unlinkSync(outputPath);
          fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${senderID}.png`));
          fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${targetID}.png`));
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }
      }, messageID);
      
    } catch (error) {
      console.error("Error in hug command:", error);
      return api.sendMessage("❌ Failed to create hug image. Please try again later.", threadID, messageID);
    }
  },

  makeImage: async function(one, two) {
    const canvasDir = path.join(__dirname, 'cache', 'canvas');
    const templatePath = path.join(canvasDir, 'hugv2.png');
    const outputPath = path.join(canvasDir, `hug_${one}_${two}.png`);
    const avatarOnePath = path.join(canvasDir, `avt_${one}.png`);
    const avatarTwoPath = path.join(canvasDir, `avt_${two}.png`);

    try {
      // Download avatars in parallel
      const [avatar1, avatar2] = await Promise.all([
        this.getAvatar(one),
        this.getAvatar(two)
      ]);
      
      // Save avatars to disk
      await fs.writeFile(avatarOnePath, avatar1);
      await fs.writeFile(avatarTwoPath, avatar2);

      // Load template and process avatars
      const template = await jimp.read(templatePath);
      const circleOne = await this.createCircle(avatarOnePath);
      const circleTwo = await this.createCircle(avatarTwoPath);

      // Composite avatars onto template
      template.composite(circleOne.resize(100, 100), 370, 40)   // Position for first avatar
             .composite(circleTwo.resize(100, 100), 330, 150);  // Position for second avatar

      // Save final image
      await template.writeAsync(outputPath);
      
      return outputPath;
    } catch (error) {
      console.error("Image creation error:", error);
      throw new Error("Failed to create hug image");
    }
  },

  getAvatar: async function(userId) {
    try {
      const url = `https://graph.facebook.com/${userId}/picture?width=512&height=512`;
      const response = await axios.get(url, { 
        responseType: 'arraybuffer',
        timeout: 10000
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error("Avatar download error for user:", userId, error);
      throw new Error("Failed to get user avatar");
    }
  },

  createCircle: async function(imagePath) {
    try {
      const image = await jimp.read(imagePath);
      image.circle();
      return image;
    } catch (error) {
      console.error("Avatar processing error:", error);
      throw new Error("Failed to create circular avatar");
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
