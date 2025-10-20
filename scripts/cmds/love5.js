const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "love5",
    aliases: [],
    version: "1.0.1",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "💖 𝐂𝐫𝐞𝐚𝐭𝐞 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐰𝐨 𝐅𝐁 𝐚𝐯𝐚𝐭𝐚𝐫𝐬"
    },
    longDescription: {
      en: "𝐂𝐫𝐞𝐚𝐭𝐞𝐬 𝐚 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐮𝐬𝐢𝐧𝐠 𝐭𝐰𝐨 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐚𝐯𝐚𝐭𝐚𝐫𝐬"
    },
    guide: {
      en: "{p}love5 [@𝐭𝐚𝐠]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    try {
      const cacheDir = path.join(__dirname, "cache");
      const baseImagePath = path.join(cacheDir, "love_template_5.png");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log("✅ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐜𝐚𝐜𝐡𝐞 𝐝𝐢𝐫𝐞𝐜𝐭𝐨𝐫𝐲 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓");
      }

      if (!fs.existsSync(baseImagePath)) {
        console.log("📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐥𝐨𝐯𝐞𝟓 𝐛𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞...");
        const response = await axios({
          method: "get",
          url: "https://drive.google.com/uc?export=download&id=1BCgJhPm4EITz0vqjYtYJkhfP7UCTSmXv",
          responseType: "arraybuffer",
          timeout: 30000,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        });
        
        fs.writeFileSync(baseImagePath, Buffer.from(response.data, 'binary'));
        console.log("🌸 𝐁𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓");
      } else {
        console.log("✅ 𝐁𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐞𝐱𝐢𝐬𝐭𝐬 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓");
      }
    } catch (error) {
      console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐝𝐮𝐫𝐢𝐧𝐠 𝐨𝐧𝐋𝐨𝐚𝐝 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓:", error.message);
    }
  },

  onStart: async function ({ event, message }) {
    const { senderID, mentions } = event;
    let tempFiles = [];

    try {
      if (Object.keys(mentions).length === 0) {
        return message.reply("📍 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝟏 𝐩𝐞𝐫𝐬𝐨𝐧 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐚 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞!");
      }

      const [mentionId] = Object.keys(mentions);
      const mentionName = mentions[mentionId].replace(/@/g, "");

      const processingMsg = await message.reply("💖 𝐂𝐫𝐞𝐚𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞...");

      const imagePath = await generateLoveImage(senderID, mentionId, tempFiles);

      if (!imagePath || !fs.existsSync(imagePath) || fs.statSync(imagePath).size === 0) {
        throw new Error("𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐢𝐬 𝐦𝐢𝐬𝐬𝐢𝐧𝐠 𝐨𝐫 𝐞𝐦𝐩𝐭𝐲.");
      }
      tempFiles.push(imagePath);

      const msg = {
        body: `💌 ${mentionName}, 𝐥𝐨𝐯𝐞 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡! 🥰`,
        mentions: [
          {
            tag: mentionName,
            id: mentionId
          }
        ],
        attachment: fs.createReadStream(imagePath)
      };

      await message.reply(msg);
      console.log("✅ 𝐋𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐬𝐞𝐧𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓");

      if (processingMsg && processingMsg.messageID) {
        try {
          await message.unsendMessage(processingMsg.messageID);
        } catch (unsendError) {
          console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐮𝐧𝐬𝐞𝐧𝐝 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞:", unsendError.message);
        }
      }

    } catch (error) {
      console.error("❌ 𝐋𝐨𝐯𝐞𝟓 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error.message);
      await message.reply("⚠️ 𝐄𝐫𝐫𝐨𝐫 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐭𝐡𝐞 𝐢𝐦𝐚𝐠𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.");
    } finally {
      setTimeout(() => {
        cleanupTempFiles(tempFiles);
      }, 30000);
    }
  }
};

async function generateLoveImage(user1ID, user2ID, tempFiles) {
  const cacheDir = path.join(__dirname, "cache");
  const baseImagePath = path.join(cacheDir, "love_template_5.png");

  if (!fs.existsSync(baseImagePath)) {
    throw new Error("𝐁𝐚𝐬𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝. 𝐂𝐡𝐞𝐜𝐤 𝐨𝐧𝐋𝐨𝐚𝐝 𝐟𝐮𝐧𝐜𝐭𝐢𝐨𝐧.");
  }

  console.log("📖 𝐑𝐞𝐚𝐝𝐢𝐧𝐠 𝐛𝐚𝐬𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓...");
  const baseImage = await jimp.read(baseImagePath);

  console.log("📥 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫𝐬 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓...");
  const [avatar1, avatar2] = await Promise.all([
    processAndDownloadAvatar(user1ID, tempFiles),
    processAndDownloadAvatar(user2ID, tempFiles)
  ]);

  const outputPath = path.join(cacheDir, `love5_result_${user1ID}_${user2ID}_${Date.now()}.png`);

  console.log("🎨 𝐂𝐨𝐦𝐩𝐨𝐬𝐢𝐭𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫𝐬 𝐨𝐧𝐭𝐨 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞...");
  
  // Fixed positions for avatars on the template
  // Left avatar position
  baseImage.composite(avatar1, 150, 165);
  // Right avatar position  
  baseImage.composite(avatar2, 675, 165);

  console.log("💾 𝐒𝐚𝐯𝐢𝐧𝐠 𝐟𝐢𝐧𝐚𝐥 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟓...");
  await baseImage.writeAsync(outputPath);

  if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
    throw new Error("𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐥𝐨𝐯𝐞𝟓 𝐢𝐦𝐚𝐠𝐞 𝐢𝐬 𝐦𝐢𝐬𝐬𝐢𝐧𝐠 𝐨𝐫 𝐞𝐦𝐩𝐭𝐲.");
  }

  console.log(`✅ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐥𝐨𝐯𝐞𝟓 𝐢𝐦𝐚𝐠𝐞: ${outputPath}`);
  return outputPath;
}

async function processAndDownloadAvatar(userId, tempFiles) {
  const cacheDir = path.join(__dirname, "cache");
  const avatarPath = path.join(cacheDir, `avatar_${userId}_${Date.now()}.png`);
  tempFiles.push(avatarPath);

  const avatarOptions = [
    `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
    `https://graph.facebook.com/${userId}/picture?type=large`,
    `https://graph.facebook.com/v12.0/${userId}/picture?width=512&height=512`
  ];

  for (const url of avatarOptions) {
    try {
      console.log(`📥 𝐓𝐫𝐲𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫 𝐬𝐨𝐮𝐫𝐜𝐞 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}`);
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      
      if (response.data && response.data.length > 0) {
        await fs.writeFile(avatarPath, Buffer.from(response.data));
        const avatarImage = await jimp.read(avatarPath);
        
        if (avatarImage.bitmap.width > 10 && avatarImage.bitmap.height > 10) {
          console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}`);
          
          const size = Math.min(avatarImage.bitmap.width, avatarImage.bitmap.height);
          const cropX = Math.floor((avatarImage.bitmap.width - size) / 2);
          const cropY = Math.floor((avatarImage.bitmap.height - size) / 2);
          
          return avatarImage
            .crop(cropX, cropY, size, size)
            .resize(200, 200)
            .circle();
        }
      }
    } catch (error) {
      console.warn(`⚠️ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐚𝐯𝐚𝐭𝐚𝐫 𝐬𝐨𝐮𝐫𝐜𝐞 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}: ${error.message}`);
      continue;
    }
  }

  console.warn(`⚠️ 𝐀𝐥𝐥 𝐚𝐯𝐚𝐭𝐚𝐫 𝐬𝐨𝐮𝐫𝐜𝐞𝐬 𝐟𝐚𝐢𝐥𝐞𝐝 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}. 𝐔𝐬𝐢𝐧𝐠 𝐟𝐚𝐥𝐥𝐛𝐚𝐜𝐤 𝐠𝐫𝐚𝐲 𝐜𝐢𝐫𝐜𝐥𝐞.`);
  const fallbackImage = new jimp(200, 200, 0x808080FF);
  fallbackImage.circle();
  return fallbackImage;
}

function cleanupTempFiles(filesToCleanup) {
  filesToCleanup.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`🧹 𝐂𝐥𝐞𝐚𝐧𝐞𝐝 𝐮𝐩 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐟𝐢𝐥𝐞: ${path.basename(file)}`);
      }
    } catch (cleanupError) {
      console.warn(`⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐝𝐞𝐥𝐞𝐭𝐞 ${path.basename(file)}:`, cleanupError.message);
    }
  });
}
