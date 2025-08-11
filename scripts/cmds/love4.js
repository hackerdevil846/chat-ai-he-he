const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "love4",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Asif",
    description: "Create a romantic love image with two users",
    prefix: true,
    category: "edit-img",
    usages: "[tag]",
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
      const baseImagePath = path.join(cacheDir, "love_template.png");

      // Create cache directory if it doesn't exist
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download base image if not exists
      if (!fs.existsSync(baseImagePath)) {
        const response = await axios({
          method: 'get',
          url: 'https://drive.google.com/uc?export=download&id=1ZGGhBH6ed8v4dku83G4NbxuPtNmN2iW9',
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        fs.writeFileSync(baseImagePath, response.data);
      }
    } catch (error) {
      console.error("Error during onLoad:", error);
    }
  },

  onStart: async function({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;

    // Check if a user was mentioned
    if (Object.keys(mentions).length === 0) {
      return api.sendMessage('📍 Please tag 1 person to create a love image!', threadID, messageID);
    }

    const [mentionId] = Object.keys(mentions);
    const mentionName = mentions[mentionId].replace(/@/g, '');

    try {
      api.sendMessage("💖 Creating your romantic love image...", threadID, messageID);
      
      // Generate the love image
      const imagePath = await this.generateLoveImage(senderID, mentionId);
      
      // Prepare the message
      const message = {
        body: `💌 ${mentionName}, love you so much! 🥰`,
        mentions: [{
          tag: mentionName,
          id: mentionId
        }],
        attachment: fs.createReadStream(imagePath)
      };

      // Send the message and clean up
      api.sendMessage(message, threadID, () => {
        try {
          fs.unlinkSync(imagePath);
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }, messageID);
    } catch (error) {
      console.error("Love4 command error:", error);
      api.sendMessage("❌ Error generating the image. Please try again later.", threadID, messageID);
    }
  },

  generateLoveImage: async function(user1ID, user2ID) {
    const cacheDir = path.join(__dirname, 'cache');
    const baseImagePath = path.join(cacheDir, 'love_template.png');
    
    // Load base image
    const baseImage = await Jimp.read(baseImagePath);
    
    // Process avatars
    const avatar1 = await this.processAvatar(user1ID);
    const avatar2 = await this.processAvatar(user2ID);

    // Create output path with timestamp
    const outputPath = path.join(cacheDir, `love4_${user1ID}_${user2ID}_${Date.now()}.png`);

    // Resize avatars
    avatar1.resize(200, 200);
    avatar2.resize(200, 200);

    // Composite images at specific positions
    baseImage
      .resize(1024, 800)
      .composite(avatar1, 300, 250)  // Position for first avatar
      .composite(avatar2, 650, 250); // Position for second avatar

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
        continue;
      }
    }

    if (!avatarBuffer) {
      throw new Error(`Failed to download avatar for user ${userId}`);
    }

    // Process and circle crop the avatar
    const avatar = await Jimp.read(avatarBuffer);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);
    
    return avatar
      .crop(0, 0, size, size)
      .circle();
  }
};
