const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "love2",
    aliases: ["lovemerge2", "couple2"], // CHANGED: Made unique
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠 ❤️"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠' 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
      en: "{p}love2 @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
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
      const baseImagePath = path.join(cacheDir, "frtwb.png");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      if (!fs.existsSync(baseImagePath)) {
        const response = await axios({
          method: "get",
          url: "https://drive.google.com/uc?export=download&id=1WLOoR7M6jfRRmSEOSePbzUwrLqb2fqWm",
          responseType: "arraybuffer",
        });
        fs.writeFileSync(baseImagePath, response.data);
      }
    } catch (error) {
      console.error("𝑜𝑛𝐿𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
    }
  },

  onStart: async function ({ message, event, api }) {
    const { threadID, messageID, senderID, mentions } = event;

    if (!Object.keys(mentions).length) {
      return message.reply("📍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛!");
    }

    const [mentionId] = Object.keys(mentions);
    const mentionName = mentions[mentionId].replace(/@/g, "");

    try {
      await message.reply("💖 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑙𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒...");

      const imagePath = await createLoveImage(senderID, mentionId);

      const msg = {
        body: `🫄 ${mentionName} 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ 🤗🥀`,
        mentions: [{ tag: mentionName, id: mentionId }],
        attachment: fs.createReadStream(imagePath)
      };

      message.reply(msg, () => {
        try { fs.unlinkSync(imagePath); } catch (e) {}
      });

    } catch (error) {
      console.error("𝐿𝑜𝑣𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒.");
    }
  }
};

async function createLoveImage(user1Id, user2Id) {
  const cacheDir = path.join(__dirname, "cache");
  const baseImagePath = path.join(cacheDir, "frtwb.png");

  const baseImage = await Jimp.read(baseImagePath);
  const [avatar1, avatar2] = await Promise.all([
    downloadAndProcessAvatar(user1Id),
    downloadAndProcessAvatar(user2Id)
  ]);

  const outputPath = path.join(cacheDir, `love_${user1Id}_${user2Id}.png`);
  const resizedBase = baseImage.resize(800, 800);

  const yPos = resizedBase.bitmap.height / 3;
  const pos1X = (resizedBase.bitmap.width / 2) - (avatar1.bitmap.width / 2);
  const pos2X = resizedBase.bitmap.width - (avatar2.bitmap.width / 2) - 30;

  resizedBase
    .composite(avatar1, pos1X, yPos)
    .composite(avatar2, pos2X, yPos);

  await resizedBase.writeAsync(outputPath);
  return outputPath;
}

async function downloadAndProcessAvatar(userId) {
  const avatarOptions = [
    `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
    `https://graph.facebook.com/${userId}/picture?type=large`
  ];

  let avatarBuffer;
  for (const url of avatarOptions) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      if (response.data) {
        avatarBuffer = Buffer.from(response.data);
        break;
      }
    } catch (error) {
      continue;
    }
  }

  if (!avatarBuffer) {
    throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 ${userId}`);
  }

  let avatar = await Jimp.read(avatarBuffer);
  const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

  return avatar
    .crop(0, 0, size, size)
    .resize(200, 200, Jimp.RESIZE_BEZIER)
    .circle();
}
