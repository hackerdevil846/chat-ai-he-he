const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "love6",
    aliases: ["romanticpic6", "loverframe6"], // ✅ Fixed aliases
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "love",
    shortDescription: {
      en: "💕 𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟𝑠"
    },
    guide: {
      en: "{p}love6 [@𝑡𝑎𝑔]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    try {
      const cacheDir = path.join(__dirname, "cache");
      const baseImagePath = path.join(cacheDir, "love_template.png");
      
      if (!fs.existsSync(cacheDir)) {
        await fs.mkdir(cacheDir, { recursive: true });
      }

      if (!fs.existsSync(baseImagePath)) {
        const url = 'https://drive.google.com/uc?export=download&id=1BZu-1GS5DMiuQHtcdZNmY4-ayiOwVyI3';
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        await fs.writeFile(baseImagePath, response.data);
        console.log("🌸 𝐵𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
      }
    } catch (error) {
      console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑛𝐿𝑜𝑎𝑑:", error);
    }
  },

  onStart: async function ({ event, api, args, message }) {
    const { threadID, messageID, senderID, mentions } = event;

    if (Object.keys(mentions).length === 0) {
      return message.reply('💝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒');
    }

    const mentionedUserID = Object.keys(mentions)[0];
    const mentionedName = mentions[mentionedUserID].replace(/@/g, '');

    try {
      await message.reply("🔄 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒...");
      
      const imageBuffer = await generateLoveImage(senderID, mentionedUserID);
      
      const messageObj = {
        body: `💞 ${mentionedName} 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ! 💑\n\n- 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
        mentions: [{
          tag: mentionedName,
          id: mentionedUserID
        }],
        attachment: fs.createReadStream(imageBuffer)
      };

      await message.reply(messageObj, () => {
        if (fs.existsSync(imageBuffer)) {
          fs.unlinkSync(imageBuffer);
        }
      });

    } catch (error) {
      console.error("❌ 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};

async function generateLoveImage(user1ID, user2ID) {
  const cacheDir = path.join(__dirname, 'cache');
  const baseImagePath = path.join(cacheDir, 'love_template.png');

  const downloadAvatar = async (userID) => {
    const avatarPath = path.join(cacheDir, `avatar_${userID}.png`);
    const sources = [
      `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      `https://graph.facebook.com/${userID}/picture?width=512&height=512`,
      `https://graph.facebook.com/v19.0/${userID}/picture?width=512&height=512`
    ];

    for (const source of sources) {
      try {
        const response = await axios.get(source, { responseType: 'arraybuffer' });
        await fs.writeFile(avatarPath, response.data);
        return await jimp.read(avatarPath);
      } catch (error) {
        continue;
      }
    }
    throw new Error("𝐶𝑎𝑛𝑛𝑜𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟");
  };

  try {
    const baseImage = await jimp.read(baseImagePath);
    const [avatar1, avatar2] = await Promise.all([
      downloadAvatar(user1ID),
      downloadAvatar(user2ID)
    ]);

    const processAvatar = (avatar) => {
      const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);
      return avatar
        .crop(0, 0, size, size)
        .resize(200, 200)
        .circle();
    };

    const processedAvatar1 = processAvatar(avatar1);
    const processedAvatar2 = processAvatar(avatar2);

    baseImage
      .resize(1200, 800)
      .composite(processedAvatar1, 300, 350)
      .composite(processedAvatar2, 800, 350);

    const outputPath = path.join(cacheDir, `love_${user1ID}_${user2ID}_${Date.now()}.png`);
    await baseImage.writeAsync(outputPath);

    // 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟𝑠
    [user1ID, user2ID].forEach(id => {
      const avatarPath = path.join(cacheDir, `avatar_${id}.png`);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    });

    return outputPath;
  } catch (error) {
    console.error("❌ 𝐼𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
    throw error;
  }
}
