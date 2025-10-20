const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const Jimp = require("jimp"); // Changed to Jimp (capital J) for consistency

module.exports = {
  config: {
    name: "love8",
    aliases: [],
    version: "2.6.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    countDown: 5,
    role: 0,
    category: "love",
    shortDescription: {
      en: "💕 Create a love image"
    },
    longDescription: {
      en: "Creates a romantic love image with a tagged user"
    },
    guide: {
      en: "{p}love8 @tag"
    },
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "jimp": "", // Dependency remains
      "path": ""
    }
  },

  onStart: async function({ message, event }) {
    let tempFiles = []; // Array to keep track of files to be cleaned up
    
    try {
      const { senderID, mentions } = event;
      const mention = Object.keys(mentions)[0]; // Get the ID of the first mentioned user
      
      // Check if a user was tagged
      if (!mention) {
        return message.reply("💕 Please tag someone to create a love image with!");
      }

      const tag = mentions[mention].replace("@", ""); // Get the tagged user's name
      const one = senderID; // The sender's ID
      const two = mention; // The tagged user's ID
      
      // Define cache directory for assets
      const dirMaterial = path.join(__dirname, 'cache', 'canvas');
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true }); // Create directory if it doesn't exist
      }

      const templatePath = path.join(dirMaterial, "love.jpg"); // Path for the background template

      // Download the template image if it's not already cached
      if (!fs.existsSync(templatePath)) {
        try {
          console.log("📥 Downloading love template...");
          const { data } = await axios.get("https://i.imgur.com/zwBuMaE.jpg", {
            responseType: 'arraybuffer', // Ensure binary data response
            timeout: 30000 // 30-second timeout for download
          });
          fs.writeFileSync(templatePath, Buffer.from(data, 'binary')); // Save the template
          console.log("✅ Love template downloaded successfully");
        } catch (error) {
          console.error("❌ Failed to download love template:", error.message);
          return message.reply("❌ Failed to download love template! Please try again later.");
        }
      }

      // Generate unique filenames for temporary avatar and final image files
      const timestamp = Date.now();
      const pathImg = path.join(dirMaterial, `love_${one}_${two}_${timestamp}.png`);
      const avatarOne = path.join(dirMaterial, `avt_${one}_${timestamp}.png`);
      const avatarTwo = path.join(dirMaterial, `avt_${two}_${timestamp}.png`);
      
      // Add these temporary files to the cleanup list
      tempFiles.push(pathImg, avatarOne, avatarTwo);

      // Download profile pictures for both users concurrently
      console.log("📥 Downloading profile pictures...");
      try {
        const [avatarOneResponse, avatarTwoResponse] = await Promise.all([
          axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
            responseType: 'arraybuffer',
            timeout: 15000 // 15-second timeout for each avatar
          }),
          axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
            responseType: 'arraybuffer',
            timeout: 15000
          })
        ]);

        fs.writeFileSync(avatarOne, Buffer.from(avatarOneResponse.data, 'binary'));
        fs.writeFileSync(avatarTwo, Buffer.from(avatarTwoResponse.data, 'binary'));
        console.log("✅ Profile pictures downloaded successfully");
        
      } catch (error) {
        console.error("❌ Failed to download profile pictures:", error.message);
        return message.reply("❌ Failed to download profile pictures! Users might have private profiles or network issues.");
      }

      // Image processing logic
      console.log("🎨 Processing love image...");
      try {
        const loveImage = await Jimp.read(templatePath); // Read the background template
        
        // Helper function to create circular avatars with resizing and a fallback
        async function createCircularAvatar(avatarPath, width, height) {
          try {
            const image = await Jimp.read(avatarPath); // Read the avatar image
            image.resize(width, height); // Resize to fit the frame
            image.circle(); // Crop into a circle
            return image;
          } catch (error) {
            console.error(`❌ Error creating circular avatar from ${avatarPath}:`, error.message);
            // Fallback: Create a gray circular image if processing fails
            const fallbackImage = new Jimp(width, height, 0x808080FF); // Grey color (RGBA)
            fallbackImage.circle();
            return fallbackImage;
          }
        }

        // Define avatar dimensions to fit the template's 'holes'
        const avatarWidth = 90;
        const avatarHeight = 70;

        // Create circular avatars for both users
        // Note: 'circleTwo' (tagged user) goes to the left position, 'circleOne' (sender) to the right.
        const circleTwo = await createCircularAvatar(avatarTwo, avatarWidth, avatarHeight); // Tagged user (left)
        const circleOne = await createCircularAvatar(avatarOne, avatarWidth, avatarHeight); // Sender (right)
        
        // Composite the avatars onto the love template at specific coordinates
        // Coordinates (x, y) were determined to align with the provided image
        loveImage.composite(circleTwo, 76, 178);  // Left character's face (octopus)
        loveImage.composite(circleOne, 215, 177); // Right character's face (chicken)
        
        // Save the final composite image
        await loveImage.writeAsync(pathImg);
        
        // Final verification of the generated image before sending
        if (!fs.existsSync(pathImg)) {
          throw new Error("Final image file was not created.");
        }
        const fileStats = fs.statSync(pathImg);
        if (fileStats.size === 0) {
          throw new Error("Final image file is empty.");
        }

        console.log("✅ Love image created successfully");

        // Send the final image with a message and mentions
        await message.reply({
          body: `💝 𝐈 𝐥𝐨𝐯𝐞 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡, ${tag}! 💕`,
          mentions: [{
            tag: tag,
            id: mention
          }],
          attachment: fs.createReadStream(pathImg)
        });

        console.log("✅ Love image sent successfully");
        
      } catch (error) {
        console.error("❌ Image processing error:", error.message);
        await message.reply("❌ Error processing love image! Please try again.");
      }
      
    } catch (error) {
      console.error("💥 Love command error:", error.message);
      await message.reply("❌ An unexpected error occurred while creating the love image! Please try again later.");
    } finally {
      // Clean up temporary files with a delay to ensure the image is fully sent
      setTimeout(() => {
        tempFiles.forEach(file => {
          try {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file); // Delete the temporary file
              console.log(`🧹 Cleaned up: ${file}`);
            }
          } catch (cleanupError) {
            console.warn(`⚠️ Could not delete temporary file ${file}:`, cleanupError.message);
          }
        });
      }, 10000); // Wait 10 seconds before cleaning up
    }
  }
};
