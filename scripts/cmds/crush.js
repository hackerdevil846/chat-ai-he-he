const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "crush",
    version: "1.2.0",
    author: "Asif",
    category: "image-edit",
    shortDescription: "Create romantic crush images",
    longDescription: "Generate beautiful crush confession images with profile pictures on a romantic template",
    guide: {
      en: "{p}crush [@mention]"
    },
    cooldowns: 15,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function({ event, api }) {
    const { threadID, messageID, senderID } = event;
    
    try {
      // Validate mention
      const mention = Object.keys(event.mentions)[0];
      if (!mention) {
        return api.sendMessage(
          "💖 Please mention someone to create a crush pair\nExample: crush @yourcrush", 
          threadID, 
          messageID
        );
      }

      // Prevent self-pairing
      if (mention === senderID) {
        return api.sendMessage(
          "🤔 You can't create a crush pair with yourself! Please mention someone else.", 
          threadID, 
          messageID
        );
      }

      // Get user names
      const [senderInfo, targetInfo] = await Promise.all([
        api.getUserInfo(senderID),
        api.getUserInfo(mention)
      ]);
      
      const senderName = senderInfo[senderID].name;
      const targetName = targetInfo[mention].name;
      
      // Create cache directory
      const cachePath = path.join(__dirname, "crush-cache");
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath, { recursive: true });
      }
      
      // Show processing message
      const processingMsg = await api.sendMessage(
        `💕 Creating crush pair for ${senderName} and ${targetName}...\n⏱️ This may take 10-15 seconds`,
        threadID
      );
      
      try {
        // Create crush image
        const imagePath = await this.makeCrushImage(senderID, mention, cachePath);
        
        // Send result
        await api.sendMessage({
          body: `💘 SECRET CRUSH REVEALED!\n━━━━━━━━━━━━━━\n${senderName} has a crush on ${targetName}! ❤️\n\n"Love is when the other person's happiness is more important than your own" - H. Jackson Brown Jr.`,
          mentions: [
            { tag: senderName, id: senderID },
            { tag: targetName, id: mention }
          ],
          attachment: fs.createReadStream(imagePath)
        }, threadID, messageID);
        
        // Clean up generated image
        fs.unlinkSync(imagePath);
        
      } catch (imageError) {
        console.error("Image creation failed:", imageError);
        api.sendMessage(
          "❌ Failed to generate the crush image. Please try again later.",
          threadID,
          messageID
        );
      } finally {
        // Delete processing message
        api.unsendMessage(processingMsg.messageID);
      }

    } catch (error) {
      console.error("❌ Crush Command Error:", error);
      api.sendMessage(
        "😿 An unexpected error occurred. Please try again later.",
        threadID,
        messageID
      );
    }
  },

  makeCrushImage: async function(user1, user2, cacheDir) {
    const outputPath = path.join(cacheDir, `crush_${user1}_${user2}_${Date.now()}.png`);
    
    try {
      // Download template image
      const templateURL = "https://i.imgur.com/PlVBaM1.jpg";
      const templatePath = path.join(cacheDir, "crush_template.jpg");
      
      if (!fs.existsSync(templatePath)) {
        const { data } = await axios.get(templateURL, {
          responseType: "arraybuffer",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
          },
          timeout: 30000
        });
        fs.writeFileSync(templatePath, Buffer.from(data, "binary"));
      }
      
      // Process both avatars in parallel
      const [avatar1, avatar2] = await Promise.all([
        this.processAvatar(user1, cacheDir),
        this.processAvatar(user2, cacheDir)
      ]);
      
      // Load template image
      const template = await jimp.read(templatePath);
      
      // Composite avatars onto template with precise positioning
      template.resize(1024, 712)
             .composite(avatar1.resize(200, 200), 527, 141)  // Right position
             .composite(avatar2.resize(200, 200), 389, 407); // Left position
      
      // Add watermark
      const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
      template.print(font, 20, template.bitmap.height - 30, "Created with Crush Command");
      
      // Save final image
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
      
      // Load and process avatar
      const avatar = await jimp.read(avatarPath);
      await avatar.circle();
      
      return avatar;
      
    } catch (error) {
      console.error("👤 Avatar Processing Error:", error);
      
      // Use fallback avatar if available
      try {
        const fallbackPath = path.join(__dirname, "assets", "default_avatar.png");
        if (fs.existsSync(fallbackPath)) {
          console.log("Using fallback avatar");
          return jimp.read(fallbackPath);
        }
      } catch (fallbackError) {
        console.error("Fallback avatar failed:", fallbackError);
      }
      
      throw error;
    } finally {
      // Clean up temporary file if it exists
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }
  }
};
