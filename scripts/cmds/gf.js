const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "gf",
    aliases: [],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
      en: "💞 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑝𝑎𝑖𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑝𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}gf [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    }
  },

  onLoad: async function() {
    try {
      const dirMaterial = __dirname + `/cache/canvas/`;
      const imagePath = path.join(__dirname, 'cache/canvas', 'arr2.png');
      
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
      }
      
      if (!fs.existsSync(imagePath)) {
        const response = await axios.get("https://i.imgur.com/iaOiAXe.jpeg", {
          responseType: 'arraybuffer'
        });
        fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
      }
    } catch (error) {
      console.error("Failed to download background image:", error);
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID, messageID, senderID } = event;
      const mention = Object.keys(event.mentions);
      
      if (mention.length === 0) {
        return message.reply("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑝𝑎𝑖𝑟! 💝");
      }
      
      async function createCircle(imagePath) {
        const image = await jimp.read(imagePath);
        image.circle();
        return await image.getBufferAsync("image/png");
      }

      const one = senderID;
      const two = mention[0];
      const __root = path.join(__dirname, "cache", "canvas");

      let avatarOne = path.join(__root, `avt_${one}.png`);
      let avatarTwo = path.join(__root, `avt_${two}.png`);
      let background = path.join(__root, `arr2.png`);
      
      // Download avatars
      let downloadAvatar = async (userId, filePath) => {
        try {
          const response = await axios.get(`https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
        } catch (error) {
          console.error(`Failed to get avatar for ${userId}:`, error);
          throw error;
        }
      };

      // Download both avatars
      await Promise.all([
        downloadAvatar(one, avatarOne),
        downloadAvatar(two, avatarTwo)
      ]);

      // Create circular avatars
      const [circleOneBuffer, circleTwoBuffer] = await Promise.all([
        createCircle(avatarOne),
        createCircle(avatarTwo)
      ]);

      const circleOne = await jimp.read(circleOneBuffer);
      const circleTwo = await jimp.read(circleTwoBuffer);
      const bg = await jimp.read(background);

      // Resize and position avatars
      circleOne.resize(200, 200);
      circleTwo.resize(200, 200);

      // Composite images
      bg.composite(circleOne, 70, 110);
      bg.composite(circleTwo, 465, 110);

      const outputPath = path.join(__root, `paired_${one}_${two}.png`);
      await bg.writeAsync(outputPath);

      // Send message with attachment
      await message.reply({
        body: `╔═══════❖•💘•❖═══════╗\n\n       𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙 𝑃𝑎𝑖𝑟𝑖𝑛𝐺 💞\n\n╚═══════❖•💘•❖═══════╝\n\n╔═══════❖•💘•❖═══════╗\n\n   𝑀𝑎𝑑𝑒 𝑓𝑜𝑟 𝑌𝑜𝑢 💌\n\n╚═══════❖•💘•❖═══════╝\n\n💖 𝑌𝑜𝑢𝑟 𝑅𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑃𝑎𝑖𝑟 💖`,
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up temporary files
      try {
        if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
        if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }

    } catch (error) {
      console.error("GF Command Error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
