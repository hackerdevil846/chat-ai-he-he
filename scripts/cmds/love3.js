const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "love3",
    aliases: [],
    version: "1.0.1",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "💖 𝐂𝐫𝐞𝐚𝐭𝐞 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐭𝐰𝐨 𝐮𝐬𝐞𝐫𝐬"
    },
    longDescription: {
      en: "𝐂𝐫𝐞𝐚𝐭𝐞𝐬 𝐚 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐰𝐨 𝐮𝐬𝐞𝐫𝐬' 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞𝐬"
    },
    guide: {
      en: "{p}love3 @𝐦𝐞𝐧𝐭𝐢𝐨𝐧"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    try {
      console.log("🔄 𝐈𝐧𝐢𝐭𝐢𝐚𝐥𝐢𝐳𝐢𝐧𝐠 𝐥𝐨𝐯𝐞𝟑 𝐜𝐨𝐦𝐦𝐚𝐧𝐝...");

      const cacheDir = path.join(__dirname, "cache");
      const baseImagePath = path.join(cacheDir, "lpwft.png"); // Path to base template image, unchanged

      // Ensure cache directory exists
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log("✅ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐜𝐚𝐜𝐡𝐞 𝐝𝐢𝐫𝐞𝐜𝐭𝐨𝐫𝐲");
      }

      // Check if the template image already exists and is valid (size and readability)
      if (fs.existsSync(baseImagePath)) {
        try {
          const stats = fs.statSync(baseImagePath);
          if (stats.size > 1000) { // Basic size check
            // Advanced check: Try to read with Jimp to ensure it's a valid image
            await Jimp.read(baseImagePath);
            console.log("✅ 𝐁𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐞𝐱𝐢𝐬𝐭𝐬 𝐚𝐧𝐝 𝐢𝐬 𝐯𝐚𝐥𝐢𝐝");
            return; // Template is good, no need to download
          } else {
            console.log("⚠️ 𝐄𝐱𝐢𝐬𝐭𝐢𝐧𝐠 𝐛𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐢𝐬 𝐭𝐨𝐨 𝐬𝐦𝐚𝐥𝐥, 𝐫𝐞-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠");
            fs.unlinkSync(baseImagePath); // Delete invalid file
          }
        } catch (error) {
          // Catch errors if Jimp.read fails (corrupted image)
          console.log("⚠️ 𝐄𝐱𝐢𝐬𝐭𝐢𝐧𝐠 𝐛𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐢𝐬 𝐜𝐨𝐫𝐫𝐮𝐩𝐭𝐞𝐝 𝐨𝐫 𝐮𝐧𝐫𝐞𝐚𝐝𝐚𝐛𝐥𝐞, 𝐫𝐞-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠");
          fs.unlinkSync(baseImagePath); // Delete corrupted file
        }
      }

      // If template doesn't exist or was invalid, download it
      console.log("📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐛𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞...");
      const response = await axios({
        method: "get",
        url: "https://drive.google.com/uc?export=download&id=1DYZWSDbcl8fD601uZxLglSuyPsxJzAZf", // Template download link, unchanged
        responseType: "arraybuffer",
        timeout: 60000, // Increased timeout to 60 seconds for robustness
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", // Standard User-Agent
          "Accept": "image/*,*/*" // Accept image formats
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept success codes and redirects
        }
      });

      if (response.data && response.data.length > 1000) { // Check for valid data size
        await fs.writeFile(baseImagePath, response.data);

        // Verify the newly downloaded image with Jimp
        try {
          await Jimp.read(baseImagePath);
          console.log("✅ 𝐁𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐚𝐧𝐝 𝐯𝐞𝐫𝐢𝐟𝐢𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");
        } catch (verifyError) {
          console.error("❌ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐢𝐬 𝐢𝐧𝐯𝐚𝐥𝐢𝐝 𝐨𝐫 𝐜𝐨𝐫𝐫𝐮𝐩𝐭𝐞𝐝:", verifyError.message);
          fs.unlinkSync(baseImagePath); // Delete corrupted download
          throw new Error("Invalid image data received after download verification.");
        }
      } else {
        throw new Error("Invalid base image data received during download (empty or too small).");
      }
    } catch (error) {
      console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐝𝐮𝐫𝐢𝐧𝐠 𝐨𝐧𝐋𝐨𝐚𝐝 (𝐜𝐫𝐢𝐭𝐢𝐜𝐚𝐥 𝐬𝐞𝐭𝐮𝐩 𝐟𝐚𝐢𝐥𝐮𝐫𝐞):", error.message);
      // It's crucial for onLoad errors to be noticeable as they prevent command execution.
    }
  },

  onStart: async function ({ event, message, usersData }) {
    let generatedImagePath = null; // Variable to hold the path of the generated image for cleanup

    try {
      const { senderID, mentions } = event;

      // Ensure a person is tagged
      if (Object.keys(mentions).length === 0) {
        return message.reply("📍 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝟏 𝐩𝐞𝐫𝐬𝐨𝐧 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐚 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞!");
      }

      const [mentionId] = Object.keys(mentions);
      const mentionName = mentions[mentionId].replace(/@/g, "").trim(); // Get tagged user's name

      // Display loading message
      const loadingMsg = await message.reply("💖 𝐂𝐫𝐞𝐚𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞...");

      try {
        // Attempt to generate the image
        generatedImagePath = await makeImage(senderID, mentionId);

        // Final verification of the generated image file
        if (!generatedImagePath || !fs.existsSync(generatedImagePath)) {
          throw new Error("Generated image file path is invalid or file does not exist.");
        }
        const stats = fs.statSync(generatedImagePath);
        if (stats.size === 0) {
          throw new Error("Generated image file is empty.");
        }

        // Get user names for personalized message, with robust fallbacks
        let userName = "𝐘𝐨𝐮";
        let targetName = mentionName || "𝐓𝐡𝐞𝐦"; // Fallback if mentionName is somehow empty

        try {
          const userInfo = await usersData.get(senderID);
          if (userInfo && userInfo.name) {
            userName = userInfo.name;
          }
        } catch (nameError) {
          console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐠𝐞𝐭 𝐬𝐞𝐧𝐝𝐞𝐫'𝐬 𝐧𝐚𝐦𝐞:", nameError.message);
        }

        const messageObj = {
          body: `💌 ${userName} & ${targetName}\n\n𝐈 𝐥𝐨𝐯𝐞 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡! 🥰`, // Personalized message
          mentions: [
            {
              tag: userName,
              id: senderID
            },
            {
              tag: targetName,
              id: mentionId
            }
          ],
          attachment: fs.createReadStream(generatedImagePath) // Attach the created image
        };

        // Unsend the loading message
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐮𝐧𝐬𝐞𝐧𝐝 𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞:", unsendError.message);
        }

        // Reply with the image and message
        await message.reply(messageObj);
        console.log("✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐞𝐧𝐭 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞");

      } catch (imageError) {
        console.error("❌ 𝐈𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 𝐞𝐫𝐫𝐨𝐫:", imageError.message);

        // Unsend loading message even if image generation failed
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐮𝐧𝐬𝐞𝐧𝐝 𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐚𝐟𝐭𝐞𝐫 𝐟𝐚𝐢𝐥𝐮𝐫𝐞:", unsendError.message);
        }

        return message.reply(`❌ 𝐄𝐫𝐫𝐨𝐫 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐭𝐡𝐞 𝐢𝐦𝐚𝐠𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫. (${imageError.message})`); // Include specific error for debugging
      }

    } catch (error) {
      console.error("💥 𝐋𝐨𝐯𝐞𝟑 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫 (𝐭𝐨𝐩-𝐥𝐞𝐯𝐞𝐥):", error.message);

      let errorMessage = "❌ 𝐀𝐧 𝐮𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";

      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        errorMessage = "❌ 𝐍𝐞𝐭𝐰𝐨𝐫𝐤 𝐞𝐫𝐫𝐨𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐢𝐧𝐭𝐞𝐫𝐧𝐞𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧.";
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = "❌ 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐭𝐢𝐦𝐞𝐝 𝐨𝐮𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.";
      } else if (error.message.includes('Jimp') || error.message.includes('image')) {
        errorMessage = "❌ 𝐈𝐦𝐚𝐠𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫. 𝐓𝐡𝐞 𝐢𝐦𝐚𝐠𝐞 𝐬𝐨𝐮𝐫𝐜𝐞 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐜𝐨𝐫𝐫𝐮𝐩𝐭𝐞𝐝.";
      } else if (error.message.includes('avatar') || error.message.includes('Facebook')) {
        errorMessage = "❌ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞𝐬. 𝐓𝐡𝐞𝐲 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐩𝐫𝐢𝐯𝐚𝐭𝐞 𝐨𝐫 𝐚𝐧 𝐢𝐬𝐬𝐮𝐞 𝐰𝐢𝐭𝐡 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤'𝐬 𝐀𝐏𝐈. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";
      }

      await message.reply(errorMessage);
    } finally {
      // Always attempt to clean up the generated image file
      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        try {
          fs.unlinkSync(generatedImagePath);
          console.log("🧹 𝐓𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐢𝐦𝐚𝐠𝐞 𝐜𝐥𝐞𝐚𝐧𝐞𝐝 𝐮𝐩:", generatedImagePath);
        } catch (cleanupError) {
          console.warn("⚠️ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐜𝐥𝐞𝐚𝐧 𝐮𝐩 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐦𝐚𝐠𝐞:", cleanupError.message);
        }
      }
    }
  }
};

// Helper function to create the composite image
async function makeImage(user1Id, user2Id) {
  const cacheDir = path.join(__dirname, "cache");
  const baseImagePath = path.join(cacheDir, "lpwft.png");

  // Re-check base image existence and validity before starting image composition
  if (!fs.existsSync(baseImagePath)) {
    throw new Error("𝐁𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 '𝐥𝐩𝐰𝐟𝐭.𝐩𝐧𝐠' 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 𝐜𝐚𝐜𝐡𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐬𝐮𝐫𝐞 𝐢𝐭 𝐰𝐚𝐬 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐥𝐲 𝐢𝐧 𝐨𝐧𝐋𝐨𝐚𝐝.");
  }

  let baseImage;
  try {
    baseImage = await Jimp.read(baseImagePath);
    console.log("✅ 𝐁𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐥𝐨𝐚𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");
  } catch (jimpReadError) {
    throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐫𝐞𝐚𝐝 𝐛𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞: " + jimpReadError.message);
  }

  // Generate a unique output path for the new image
  const outputPath = path.join(cacheDir, `love3_${user1Id}_${user2Id}_${Date.now()}.png`);

  console.log("📥 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫𝐬 𝐟𝐨𝐫 𝐜𝐨𝐦𝐩𝐨𝐬𝐢𝐭𝐢𝐨𝐧...");
  let avatar1, avatar2;
  try {
    avatar1 = await processAvatar(user1Id);
    avatar2 = await processAvatar(user2Id);
    console.log("✅ 𝐀𝐯𝐚𝐭𝐚𝐫𝐬 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐞𝐝");
  } catch (avatarProcessError) {
    throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐚𝐯𝐚𝐭𝐚𝐫𝐬: " + avatarProcessError.message);
  }

  const avatarSize = 250; // Defined size for the avatars
  avatar1.resize(avatarSize, avatarSize);
  avatar2.resize(avatarSize, avatarSize);

  // FIXED POSITIONING FOR THE NEW TEMPLATE (1278x720 pixels)
  // Left avatar top-left corner
  const x1 = 160; 
  const y1 = 220;
  // Right avatar top-left corner
  const x2 = 870;
  const y2 = 220;

  console.log(`🎨 𝐂𝐨𝐦𝐩𝐨𝐬𝐢𝐭𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞𝐬 𝐚𝐭 (${x1}, ${y1}) 𝐚𝐧𝐝 (${x2}, ${y2})...`);
  try {
    baseImage
      .composite(avatar1, x1, y1)
      .composite(avatar2, x2, y2);

    await baseImage.writeAsync(outputPath); // Write the final composite image
    console.log("✅ 𝐅𝐢𝐧𝐚𝐥 𝐜𝐨𝐦𝐩𝐨𝐬𝐢𝐭𝐞 𝐢𝐦𝐚𝐠𝐞 𝐜𝐫𝐞𝐚𝐭𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲:", outputPath);
    return outputPath; // Return the path to the generated image
  } catch (compositeError) {
    throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐜𝐨𝐦𝐩𝐨𝐬𝐢𝐭𝐞 𝐢𝐦𝐚𝐠𝐞 𝐨𝐫 𝐰𝐫𝐢𝐭𝐞 𝐭𝐨 𝐟𝐢𝐥𝐞: " + compositeError.message);
  }
}

// Helper function to download and process a user's avatar
async function processAvatar(userId) {
  // Array of Facebook Graph API URLs to try for avatar fetching
  const avatarOptions = [
    `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, // Primary, with access token for higher success rate
    `https://graph.facebook.com/${userId}/picture?width=512&height=512`, // High resolution without token
    `https://graph.facebook.com/${userId}/picture?type=large`, // Large type
    `https://graph.facebook.com/${userId}/picture`, // Default size
    `https://graph.facebook.com/v19.0/${userId}/picture?width=512&height=512` // Specific API version
  ];

  let avatarBuffer;
  let lastError; // To store the last error message if all options fail

  // Loop through avatar options until one succeeds
  for (const url of avatarOptions) {
    try {
      console.log(`🔗 𝐓𝐫𝐲𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫 𝐔𝐑𝐋 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}: ${url}`);
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 20000, // 20-second timeout for each avatar request
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "image/*"
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept success codes and redirects
        }
      });

      // Check if response data is valid (not empty or error page)
      if (response.data && response.data.length > 1000) {
        avatarBuffer = Buffer.from(response.data);
        console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}`);
        break; // Exit loop on successful download
      } else {
        throw new Error("Invalid avatar data received (empty or too small).");
      }
    } catch (error) {
      lastError = error;
      console.warn(`❌ 𝐀𝐯𝐚𝐭𝐚𝐫 𝐔𝐑𝐋 𝐟𝐚𝐢𝐥𝐞𝐝 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}: ${error.message}`);
      continue; // Try the next URL
    }
  }

  // If no avatar could be downloaded after all attempts
  if (!avatarBuffer) {
    throw new Error(`𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId} 𝐚𝐟𝐭𝐞𝐫 𝐚𝐥𝐥 𝐚𝐭𝐭𝐞𝐦𝐩𝐭𝐬. 𝐋𝐚𝐬𝐭 𝐞𝐫𝐫𝐨𝐫: ${lastError?.message || "Unknown error"}`);
  }

  // Process the downloaded avatar buffer with Jimp
  try {
    const avatar = await Jimp.read(avatarBuffer);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height); // Get smallest dimension for perfect square crop

    console.log(`⭕ 𝐂𝐫𝐞𝐚𝐭𝐢𝐧𝐠 𝐜𝐢𝐫𝐜𝐮𝐥𝐚𝐫 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}`);
    return avatar.crop(0, 0, size, size).circle(); // Crop to square and make circular
  } catch (jimpError) {
    throw new Error(`𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐚𝐯𝐚𝐭𝐚𝐫 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId} (𝐉𝐢𝐦𝐩 𝐞𝐫𝐫𝐨𝐫): ${jimpError.message}`);
  }
}
