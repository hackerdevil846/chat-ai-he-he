const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "date",
    version: "1.2.0",
    author: "Asif",
    category: "image-edit",
    shortDescription: "Create romantic couple images",
    longDescription: "Generate beautiful love ship images for you and your partner",
    guide: {
      en: "{p}date [@mention]"
    },
    cooldowns: 15,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const mentions = Object.keys(event.mentions);
    
    // Help message if no mention
    if (!mentions.length) {
      return api.sendMessage(
        "💖 DATE COMMAND\n━━━━━━━━━━━━━━\nCreate romantic couple images with your crush!\n\nUsage: date @mention\nExample: date @yourcrush",
        threadID,
        messageID
      );
    }

    const partnerID = mentions[0];
    const partnerName = event.mentions[partnerID].replace("@", "");
    
    // Prevent self-shipping
    if (partnerID === senderID) {
      return api.sendMessage(
        "🤔 You can't create a love ship with yourself! Please mention someone else.",
        threadID,
        messageID
      );
    }

    try {
      // Get user names for personalized message
      const [senderInfo, partnerInfo] = await Promise.all([
        api.getUserInfo(senderID),
        api.getUserInfo(partnerID)
      ]);
      
      const senderName = senderInfo[senderID].name;
      
      // Show processing message
      const processingMsg = await api.sendMessage(
        `💞 Creating love ship for ${senderName} and ${partnerName}...\n⏱️ This may take 10-15 seconds`,
        threadID
      );

      // Create the love ship image
      const imagePath = await this.makeImage(senderID, partnerID);
      
      // Send result
      await api.sendMessage({
        body: `💘 PERFECT MATCH!\n━━━━━━━━━━━━━━\n${senderName} ❤️ ${partnerName}\n\n"Love is not about how many days, weeks or months you've been together, it's all about how much you love each other every day."`,
        mentions: [
          { tag: senderName, id: senderID },
          { tag: partnerName, id: partnerID }
        ],
        attachment: fs.createReadStream(imagePath)
      }, threadID, messageID);
      
      // Clean up generated image
      fs.unlinkSync(imagePath);
      
      // Delete processing message
      api.unsendMessage(processingMsg.messageID);
      
    } catch (error) {
      console.error("❌ Love Ship Error:", error);
      api.sendMessage(
        "😿 Failed to create love ship image. Please try again later.",
        threadID,
        messageID
      );
    }
  },

  makeImage: async function(user1, user2) {
    const cachePath = path.join(__dirname, "date-cache");
    const templatePath = path.join(cachePath, "love_ship_template.png");
    const outputPath = path.join(cachePath, `ship_${user1}_${user2}_${Date.now()}.png`);
    
    // Create cache directory if needed
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
    }
    
    try {
      // Download template if missing
      if (!fs.existsSync(templatePath)) {
        const { data } = await axios.get("https://i.imgur.com/ha8gxu5.jpg", {
          responseType: "arraybuffer",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
          },
          timeout: 30000
        });
        fs.writeFileSync(templatePath, Buffer.from(data, "binary"));
      }

      // Process avatars in parallel
      const [avatar1, avatar2] = await Promise.all([
        this.processAvatar(user1, cachePath),
        this.processAvatar(user2, cachePath)
      ]);

      // Load template
      const template = await jimp.read(templatePath);
      
      // Composite avatars onto template with precise positioning
      template.resize(800, 600)  // Resize to optimal dimensions
             .composite(avatar1.resize(150, 150), 100, 50)   // Position 1
             .composite(avatar2.resize(150, 150), 350, 150); // Position 2
      
      // Add watermark
      const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
      template.print(font, 10, template.bitmap.height - 30, "Created with Date Command");
      
      // Save image
      await template.writeAsync(outputPath);
      
      return outputPath;
      
    } catch (error) {
      console.error("🖼️ Image Creation Error:", error);
      throw error;
    }
  },
  
  processAvatar: async function(userID, cacheDir) {
    const avatarPath = path.join(cacheDir, `avt_${userID}_${Date.now()}.png`);
    
    try {
      // Get profile picture
      const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const { data } = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 30000
      });
      await fs.writeFile(avatarPath, Buffer.from(data, "binary"));
      
      // Load and circle crop
      const avatar = await jimp.read(avatarPath);
      await avatar.circle();
      
      return avatar;
      
    } catch (error) {
      console.error("👤 Avatar Processing Error:", error);
      
      // Use fallback if available
      try {
        const fallbackPath = path.join(__dirname, "assets", "default_avatar.png");
        if (fs.existsSync(fallbackPath)) {
          console.log("Using fallback avatar");
          const fallbackAvatar = await jimp.read(fallbackPath);
          await fallbackAvatar.circle();
          return fallbackAvatar;
        }
      } catch (e) {
        console.error("Fallback avatar error:", e);
      }
      
      throw error;
    } finally {
      // Clean up temporary file
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }
  }
};
