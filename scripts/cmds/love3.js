const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "love3",
    aliases: ["romantic3", "couple3"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "💖 𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠' 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
      en: "{p}love3 @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
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
      const baseImagePath = path.join(cacheDir, "lpwft.png");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      if (!fs.existsSync(baseImagePath)) {
        const response = await axios({
          method: "get",
          url: "https://drive.google.com/uc?export=download&id=1DYZWSDbcl8fD601uZxLglSuyPsxJzAZf",
          responseType: "arraybuffer",
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });
        fs.writeFileSync(baseImagePath, response.data);
        console.log("✅ 𝐵𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
      }
    } catch (error) {
      console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑢𝑟𝑖𝑛𝑔 𝑜𝑛𝐿𝑜𝑎𝑑:", error);
    }
  },

  onStart: async function ({ event, message, usersData, args }) {
    const { senderID, mentions } = event;

    if (Object.keys(mentions).length === 0) {
      return message.reply("📍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒!");
    }

    const [mentionId] = Object.keys(mentions);
    const mentionName = mentions[mentionId].replace(/@/g, "");

    try {
      await message.reply("💖 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒...");

      const imagePath = await makeImage(senderID, mentionId);

      await message.reply({
        body: `💌 ${mentionName}, 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ! 🥰`,
        mentions: [
          {
            tag: mentionName,
            id: mentionId
          }
        ],
        attachment: fs.createReadStream(imagePath)
      });

      try {
        fs.unlinkSync(imagePath);
        console.log("🧹 𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑖𝑚𝑎𝑔𝑒 𝑐𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝");
      } catch (e) {
        console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e);
      }

    } catch (error) {
      console.error("❌ 𝐿𝑜𝑣𝑒3 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      return message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};

async function makeImage(user1Id, user2Id) {
  const cacheDir = path.join(__dirname, "cache");
  const baseImagePath = path.join(cacheDir, "lpwft.png");

  const baseImage = await Jimp.read(baseImagePath);
  baseImage.resize(1278, 720);

  const outputPath = path.join(cacheDir, `love3_${user1Id}_${user2Id}_${Date.now()}.png`);

  const avatar1 = await processAvatar(user1Id);
  const avatar2 = await processAvatar(user2Id);

  avatar1.resize(250, 250);
  avatar2.resize(250, 250);

  baseImage
    .composite(avatar1, 159, 220)
    .composite(avatar2, 849, 220);

  await baseImage.writeAsync(outputPath);
  return outputPath;
}

async function processAvatar(userId) {
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
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" }
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
    throw new Error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 ${userId}`);
  }

  const avatar = await Jimp.read(avatarBuffer);
  const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

  return avatar.crop(0, 0, size, size).circle();
}
