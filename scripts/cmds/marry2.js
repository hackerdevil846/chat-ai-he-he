const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "marry2",
    aliases: ["marriage", "propose"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "love",
    shortDescription: {
      en: "💍 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑝𝑟𝑜𝑝𝑜𝑠𝑎𝑙 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
      en: "𝑇𝑎𝑔 𝑦𝑜𝑢𝑟 𝑙𝑜𝑣𝑒𝑑 𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑝𝑟𝑜𝑝𝑜𝑠𝑎𝑙 𝑖𝑚𝑎𝑔𝑒𝑠 💖"
    },
    guide: {
      en: "{p}marry2 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "jimp": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const mention = Object.keys(event.mentions);
      if (mention.length === 0) {
        return message.reply("💌 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡ℎ𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒! 💝");
      }

      const one = event.senderID;
      const two = mention[0];

      const outputPath = await generateImage(one, two);

      await message.reply({
        body: "💖 𝑂𝑛𝑒 𝑑𝑎𝑦 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢 𝑓𝑜𝑟 𝑠𝑢𝑟𝑒... 💑\n\n- 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

    } catch (error) {
      console.error("❌ 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("😢 𝑆𝑜𝑟𝑟𝑦! 𝐶𝑜𝑢𝑙𝑑𝑛'𝑡 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡ℎ𝑒 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!");
    }
  }
};

async function generateImage(uid1, uid2) {
  const cachePath = path.join(__dirname, "cache");
  const outputFile = path.join(cachePath, "marry2.png");
  
  await fs.ensureDir(cachePath);

  const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

  try {
    const [avatar1, avatar2, background] = await Promise.all([
      jimp.read(`https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=${fbToken}`),
      jimp.read(`https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=${fbToken}`),
      jimp.read("https://i.ibb.co/9ZZCSzR/ba6abadae46b5bdaa29cf6a64d762874.jpg")
    ]);

    avatar1.circle();
    avatar2.circle();

    background.resize(640, 535)
      .composite(avatar1.resize(130, 130), 200, 70)
      .composite(avatar2.resize(130, 130), 350, 150);

    await background.writeAsync(outputFile);
    return outputFile;

  } catch (error) {
    console.error("𝐼𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
    throw error;
  }
}
