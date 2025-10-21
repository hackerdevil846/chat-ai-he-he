const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "marry3",
    aliases: [],
    version: "2.0",
    author: "Asif Mahmud",
    role: 0,
    category: "love",
    shortDescription: {
      en: "💍 Create a marriage proposal image with someone!"
    },
    longDescription: {
      en: "Generate a beautiful marriage proposal image with your loved one"
    },
    guide: {
      en: "{p}marry3 [@mention]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "jimp": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    let generatedImagePath = null;
    
    try {
      // Dependency check
      try {
        require("axios");
        require("jimp");
        require("fs-extra");
      } catch (e) {
        return message.reply("❌ Missing dependencies. Please install: axios, jimp, and fs-extra.");
      }

      const mention = Object.keys(event.mentions);
      if (mention.length === 0) {
        return message.reply("❌ Please mention someone to marry! Example: /marry3 @username");
      }

      const userOne = event.senderID;
      const userTwo = mention[0];

      // Validate user IDs
      if (!userOne || !userTwo) {
        return message.reply("❌ Invalid user IDs detected.");
      }

      console.log(`💍 Generating marriage image for ${userOne} and ${userTwo}`);

      generatedImagePath = await this.generateMarriageImage(userOne, userTwo);

      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        await message.reply({
          body: "💍 𝐌𝐚𝐫𝐫𝐢𝐚𝐠𝐞 𝐂𝐞𝐫𝐞𝐦𝐨𝐧𝐲 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞! 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! 🥰",
          attachment: fs.createReadStream(generatedImagePath)
        });
        console.log("✅ Successfully sent marriage image");
      } else {
        await message.reply("❌ Failed to create marriage image. Please try again later.");
      }

    } catch (error) {
      console.error("💥 Marry command error:", error);
      await message.reply("❌ Marriage failed! Something went wrong. Please try again.");
    } finally {
      // Clean up generated image
      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        try {
          fs.unlinkSync(generatedImagePath);
          console.log("🧹 Cleaned up generated image");
        } catch (cleanupError) {
          console.warn("⚠️ Failed to clean up:", cleanupError.message);
        }
      }
    }
  },

  generateMarriageImage: async function(one, two) {
    const cachePath = path.join(__dirname, "cache");
    const outputPath = path.join(cachePath, `marry_${one}_${two}_${Date.now()}.png`);
    
    try {
      // Ensure cache directory exists
      await fs.ensureDir(cachePath);
      console.log("✅ Cache directory verified");

      const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

      console.log("📥 Downloading images...");
      
      // Download all images with better error handling
      let avatarOne, avatarTwo, background;
      
      try {
        avatarOne = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`);
        console.log("✅ Downloaded first avatar");
      } catch (avatarOneError) {
        console.error(`❌ Failed to download avatar for ${one}:`, avatarOneError.message);
        throw new Error(`Cannot access profile picture of first user`);
      }

      try {
        avatarTwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`);
        console.log("✅ Downloaded second avatar");
      } catch (avatarTwoError) {
        console.error(`❌ Failed to download avatar for ${two}:`, avatarTwoError.message);
        throw new Error(`Cannot access profile picture of second user`);
      }

      try {
        background = await jimp.read("https://i.postimg.cc/XN1TcH3L/tumblr-mm9nfpt7w-H1s490t5o1-1280.jpg");
        console.log("✅ Downloaded background image");
      } catch (bgError) {
        console.error("❌ Failed to download background:", bgError.message);
        throw new Error("Cannot access background image");
      }

      // Process avatars - make circular and resize
      console.log("⭕ Processing avatars...");
      const avatarSizeMale = 75;
      const avatarSizeFemale = 70;
      
      avatarOne.resize(avatarSizeMale, avatarSizeMale);
      avatarOne.circle();
      
      avatarTwo.resize(avatarSizeFemale, avatarSizeFemale);
      avatarTwo.circle();

      // Process background
      console.log("🎨 Processing background...");
      background.resize(1024, 684);

      // Position avatars on background
      // These coordinates are carefully placed for the specific background image
      const avatarOneX = 200; // Male avatar X position
      const avatarOneY = 145; // Male avatar Y position
      const avatarTwoX = 310; // Female avatar X position
      const avatarTwoY = 100; // Female avatar Y position

      console.log("🖼️ Compositing images...");
      background.composite(avatarOne, avatarOneX, avatarOneY);
      background.composite(avatarTwo, avatarTwoX, avatarTwoY);

      // Save the final image
      console.log("💾 Saving final image...");
      await background.writeAsync(outputPath);

      // Verify the image was created successfully
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        if (stats.size > 0) {
          console.log(`✅ Successfully created marriage image: ${outputPath}`);
          return outputPath;
        } else {
          throw new Error("Generated image file is empty");
        }
      } else {
        throw new Error("Failed to create output image file");
      }

    } catch (error) {
      console.error("💥 Image generation error:", error);
      
      // Clean up partial files if they exist
      try {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (cleanupError) {
        console.warn("⚠️ Failed to clean up partial file:", cleanupError.message);
      }
      
      throw error;
    }
  }
};
