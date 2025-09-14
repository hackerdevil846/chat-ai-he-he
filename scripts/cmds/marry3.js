const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "marry3",
    aliases: ["marriage3", "propose3"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "love",
    shortDescription: {
      en: "💍 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑝𝑟𝑜𝑝𝑜𝑠𝑎𝑙 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑠𝑜𝑚𝑒𝑜𝑛𝑒!"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑚𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑝𝑟𝑜𝑝𝑜𝑠𝑎𝑙 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑙𝑜𝑣𝑒𝑑 𝑜𝑛𝑒"
    },
    guide: {
      en: "{p}marry3 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
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
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑚𝑎𝑟𝑟𝑦!");
      }

      const userOne = event.senderID;
      const userTwo = mention[0];

      const imagePath = await generateMarriageImage(userOne, userTwo);

      await message.reply({
        body: "💍 𝐵𝑖𝑦𝑒 ℎ𝑜𝑦𝑒 𝑔𝑒𝑙𝑜! 𝑀𝑢𝑏𝑎𝑟𝑎𝑘 ℎ𝑜! 🥰",
        attachment: fs.createReadStream(imagePath)
      });

      // Clean up
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    } catch (error) {
      console.error("𝑀𝑎𝑟𝑟𝑦 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝑀𝑎𝑟𝑟𝑖𝑎𝑔𝑒 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔.");
    }
  }
};

// Function to generate the marriage image
async function generateMarriageImage(one, two) {
  const path = __dirname + "/cache/marryv4.png";

  const [avatarOne, avatarTwo, background] = await Promise.all([
    jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
    jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
    jimp.read("https://i.postimg.cc/XN1TcH3L/tumblr-mm9nfpt7w-H1s490t5o1-1280.jpg")
  ]);

  avatarOne.circle();
  avatarTwo.circle();

  background
    .resize(1024, 684)
    .composite(avatarOne.resize(85, 85), 204, 160)
    .composite(avatarTwo.resize(80, 80), 315, 105);

  await background.writeAsync(path);
  return path;
}
