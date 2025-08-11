const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "love3",
    version: "1.0.1",
    hasPermssion: 0, // Corrected spelling (two 's')
    credits: "Asif",
    description: "Create a romantic love image with two users",
    prefix: true,
    category: "edit-img", // Fixed category
    usages: "love3 @mention",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
      const cacheDir = path.join(__dirname, "cache");
      const baseImagePath = path.join(cacheDir, "lpwft.png");

      // Create cache directory
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download base image if not exists
      if (!fs.existsSync(baseImagePath)) {
        const response = await axios({
          method: 'get',
          url: 'https://drive.google.com/uc?export=download&id=1DYZWSDbcl8fD601uZxLglSuyPsxJzAZf',
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        fs.writeFileSync(baseImagePath, response.data);
        console.log("Base image downloaded successfully");
      }
    } catch (error) {
      console.error("Error during onLoad:", error);
    }
  },

  onStart: async function({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;

    if (Object.keys(mentions).length === 0) {
      return api.sendMessage('📍 Please tag 1 person to create a love image!', threadID, messageID);
    }

    const [mentionId] = Object.keys(mentions);
    const mentionName = mentions[mentionId].replace(/@/g, '');

    try {
      api.sendMessage("💖 Creating your romantic love image...", threadID, messageID);
      
      const imagePath = await this.makeImage(senderID, mentionId);
      
      const message = {
        body: `💌 ${mentionName}, love you so much! 🥰`,
        mentions: [{
          tag: mentionName,
          id: mentionId
        }],
        attachment: fs.createReadStream(imagePath)
      };

      api.sendMessage(message, threadID, () => {
        try {
          fs.unlinkSync(imagePath);
          console.log("Temporary image cleaned up");
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }, messageID);
    } catch (error) {
      console.error("Love3 command error:", error);
      return api.sendMessage("❌ Error generating the image. Please try again later.", threadID, messageID);
    }
  },

  makeImage: async function(user1Id, user2Id) {
    const cacheDir = path.join(__dirname, 'cache');
    const baseImagePath = path.join(cacheDir, 'lpwft.png');
    
    // Load base image
    const baseImage = await Jimp.read(baseImagePath);
    baseImage.resize(1278, 720); // Resize to proper dimensions

    // Create output path
    const outputPath = path.join(cacheDir, `love3_${user1Id}_${user2Id}_${Date.now()}.png`);

    // Process avatars
    const avatar1 = await this.processAvatar(user1Id);
    const avatar2 = await this.processAvatar(user2Id);

    // Resize avatars to fit the design
    avatar1.resize(250, 250);
    avatar2.resize(250, 250);

    // Composite images at specific positions
    baseImage
      .composite(avatar1, 159, 220)  // Position for first avatar
      .composite(avatar2, 849, 220); // Position for second avatar

    // Save the final image
    await baseImage.writeAsync(outputPath);

    return outputPath;
  },

  processAvatar: async function(userId) {
    const avatarOptions = [
      `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
      `https://graph.facebook.com/${userId}/picture?type=large`,
      `https://graph.facebook.com/${userId}/picture`,
      `https://graph.facebook.com/v12.0/${userId}/picture`
    ];

    let avatarBuffer;
    for (const url of avatarOptions) {
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (response.data) {
          avatarBuffer = Buffer.from(response.data);
          break;
        }
      } catch (error) {
        console.log(`Trying next avatar source for ${userId}...`);
        continue;
      }
    }

    if (!avatarBuffer) {
      throw new Error(`❌ Failed to download avatar for user ${userId}`);
    }

    // Process and circle crop
    const avatar = await Jimp.read(avatarBuffer);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);
    
    return avatar
      .crop(0, 0, size, size) // Crop to square
      .circle(); // Apply circular mask
  }
};
