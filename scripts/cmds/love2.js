const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "love2",
    aliases: [], 
    version: "1.0.1",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "Create a romantic love image with two users ❤️"
    },
    longDescription: {
      en: "Generates a romantic image with two users' profile pictures"
    },
    guide: {
      en: "{p}love2 @mention"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    try {
      console.log("🔄 Initializing love2 command...");

      const cacheDir = path.join(__dirname, "cache");
      const baseImagePath = path.join(cacheDir, "frtwb.png");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log("✅ Created cache directory");
      }

      // Check if the template image already exists and is valid
      if (fs.existsSync(baseImagePath)) {
        try {
          const stats = fs.statSync(baseImagePath);
          if (stats.size > 1000) {
            // Test if image is readable by Jimp
            await Jimp.read(baseImagePath);
            console.log("✅ Base image template already exists and is valid");
            return;
          } else {
            console.log("⚠️ Existing base image template is invalid, re-downloading");
            fs.unlinkSync(baseImagePath);
          }
        } catch (readError) {
          console.log("⚠️ Corrupted base image, re-downloading");
          fs.unlinkSync(baseImagePath);
        }
      }

      console.log("📥 Downloading base image template...");
      const response = await axios({
        method: "get",
        url: "https://drive.google.com/uc?export=download&id=1WLOoR7M6jfRRmSEOSePbzUwrLqb2fqWm",
        responseType: "arraybuffer",
        timeout: 45000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "image/*,*/*"
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });

      if (response.data && response.data.length > 1000) {
        await fs.writeFile(baseImagePath, response.data);
        
        // Verify the downloaded image
        try {
          await Jimp.read(baseImagePath);
          console.log("✅ Base image downloaded and verified successfully");
        } catch (verifyError) {
          console.error("❌ Downloaded image is corrupted");
          fs.unlinkSync(baseImagePath);
          throw new Error("Downloaded image is corrupted");
        }
      } else {
        throw new Error("Invalid base image data received during download");
      }
    } catch (error) {
      console.error("❌ Error during onLoad:", error.message);
    }
  },

  onStart: async function ({ message, event, usersData }) {
    let generatedImagePath = null;

    try {
      const { senderID, mentions } = event;

      if (!Object.keys(mentions).length) {
        return message.reply("📍 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝟏 𝐩𝐞𝐫𝐬𝐨𝐧!");
      }

      const [mentionId] = Object.keys(mentions);
      const mentionName = mentions[mentionId].replace(/@/g, "").trim();

      if (mentionId === senderID) {
        return message.reply("❌ 𝐘𝐨𝐮 𝐜𝐚𝐧'𝐭 𝐜𝐫𝐞𝐚𝐭𝐞 𝐚 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟!");
      }

      const loadingMsg = await message.reply("💖 𝐂𝐫𝐞𝐚𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞...");

      try {
        generatedImagePath = await createLoveImage(senderID, mentionId);

        if (!generatedImagePath || !fs.existsSync(generatedImagePath)) {
          throw new Error("Failed to generate image file");
        }

        // Get user names with fallbacks
        let userName = "You";
        let targetName = mentionName || "Them";

        try {
          const userInfo = await usersData.get(senderID);
          if (userInfo && userInfo.name) {
            userName = userInfo.name;
          }
        } catch (nameError) {
          console.warn("Could not get sender's name:", nameError.message);
        }

        const messageObj = {
          body: `❤️ ${userName} & ${targetName}\n\n𝐈 𝐥𝐨𝐯𝐞 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡! 🤗🥀`,
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
          attachment: fs.createReadStream(generatedImagePath)
        };

        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("Could not unsend loading message:", unsendError.message);
        }

        await message.reply(messageObj);
        console.log("✅ Successfully sent love image");

      } catch (imageError) {
        console.error("❌ Love image generation error:", imageError.message);

        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("Could not unsend loading message:", unsendError.message);
        }

        return message.reply("❌ 𝐄𝐫𝐫𝐨𝐫 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐭𝐡𝐞 𝐢𝐦𝐚𝐠𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.");
      }

    } catch (error) {
      console.error("💥 Love2 command error:", error.message);

      let errorMessage = "❌ 𝐀𝐧 𝐮𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";

      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        errorMessage = "❌ 𝐍𝐞𝐭𝐰𝐨𝐫𝐤 𝐞𝐫𝐫𝐨𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐢𝐧𝐭𝐞𝐫𝐧𝐞𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧.";
      } else if (error.message.includes('Jimp') || error.message.includes('image')) {
        errorMessage = "❌ 𝐈𝐦𝐚𝐠𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫. 𝐓𝐡𝐞 𝐢𝐦𝐚𝐠𝐞 𝐬𝐨𝐮𝐫𝐜𝐞 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐜𝐨𝐫𝐫𝐮𝐩𝐭𝐞𝐝.";
      } else if (error.message.includes('avatar')) {
        errorMessage = "❌ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞𝐬. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";
      }

      await message.reply(errorMessage);
    } finally {
      // Clean up generated image file
      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        try {
          fs.unlinkSync(generatedImagePath);
          console.log("🧹 Temporary image cleaned up");
        } catch (cleanupError) {
          console.warn("⚠️ Failed to clean up generated image:", cleanupError.message);
        }
      }
    }
  }
};

async function createLoveImage(user1Id, user2Id) {
  const cacheDir = path.join(__dirname, "cache");
  const baseImagePath = path.join(cacheDir, "frtwb.png");

  if (!fs.existsSync(baseImagePath)) {
    throw new Error("Base image template 'frtwb.png' not found in cache");
  }

  let baseImage;
  try {
    baseImage = await Jimp.read(baseImagePath);
  } catch (jimpReadError) {
    throw new Error("Failed to read base image: " + jimpReadError.message);
  }

  // Keep original size for better quality
  const targetBaseWidth = 800;
  const targetBaseHeight = 800;
  const resizedBase = baseImage.resize(targetBaseWidth, targetBaseHeight);

  const outputPath = path.join(cacheDir, `love_${user1Id}_${user2Id}_${Date.now()}.png`);

  let avatar1, avatar2;
  try {
    [avatar1, avatar2] = await Promise.all([
      downloadAndProcessAvatar(user1Id),
      downloadAndProcessAvatar(user2Id)
    ]);
  } catch (avatarProcessError) {
    throw new Error("Failed to process avatars: " + avatarProcessError.message);
  }

  const avatarSize = 200;

  // Fixed positions for the template
  const x1 = 190; 
  const y1 = 290;
  const x2 = 445; 
  const y2 = 290;

  try {
    resizedBase
      .composite(avatar1, x1, y1)
      .composite(avatar2, x2, y2);

    await resizedBase.writeAsync(outputPath);
    
    // Verify the output image
    if (!fs.existsSync(outputPath)) {
      throw new Error("Output image was not created");
    }
    
    const stats = fs.statSync(outputPath);
    if (stats.size === 0) {
      throw new Error("Output image is empty");
    }
    
    return outputPath;
  } catch (compositeError) {
    throw new Error("Failed to composite image: " + compositeError.message);
  }
}

async function downloadAndProcessAvatar(userId) {
  const avatarOptions = [
    `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
    `https://graph.facebook.com/${userId}/picture?type=large`,
    `https://graph.facebook.com/${userId}/picture`,
    `https://graph.facebook.com/v19.0/${userId}/picture?width=512&height=512`
  ];

  let avatarBuffer;
  let lastError;
  
  for (const url of avatarOptions) {
    try {
      console.log(`📥 Trying avatar URL: ${url}`);
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 20000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "image/*"
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      
      if (response.data && response.data.length > 1000) {
        avatarBuffer = Buffer.from(response.data);
        console.log(`✅ Successfully downloaded avatar for user ${userId}`);
        break;
      } else {
        throw new Error("Invalid avatar data received (too small)");
      }
    } catch (error) {
      lastError = error;
      console.warn(`❌ Avatar download failed for ${url}:`, error.message);
      continue;
    }
  }

  if (!avatarBuffer) {
    throw new Error(`Failed to download avatar for user ${userId} after multiple attempts`);
  }

  try {
    let avatar = await Jimp.read(avatarBuffer);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

    return avatar
      .crop(0, 0, size, size)
      .resize(200, 200, Jimp.RESIZE_BEZIER)
      .circle();
  } catch (jimpError) {
    throw new Error(`Failed to process avatar image: ${jimpError.message}`);
  }
}
