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
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    const dirMaterial = __dirname + `/cache/canvas/`;
    const imagePath = path.resolve(__dirname, 'cache/canvas', 'arr2.png');
    
    if (!fs.existsSync(dirMaterial)) {
      fs.mkdirSync(dirMaterial, { recursive: true });
    }
    
    if (!fs.existsSync(imagePath)) {
      try {
        const response = await axios.get("https://i.imgur.com/iaOiAXe.jpeg", {
          responseType: 'arraybuffer'
        });
        fs.writeFileSync(imagePath, Buffer.from(response.data, 'utf-8'));
      } catch (error) {
        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑖𝑚𝑎𝑔𝑒:", error);
      }
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID, messageID, senderID } = event;
      const mention = Object.keys(event.mentions);
      
      if (!mention[0]) {
        return message.reply("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑝𝑎𝑖𝑟! 💝");
      }
      
      async function circle(image) {
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
      }

      const one = senderID;
      const two = mention[0];
      const __root = path.resolve(__dirname, "cache", "canvas");

      let avatarOne = __root + `/avt_${one}.png`;
      let avatarTwo = __root + `/avt_${two}.png`;
      let background = __root + `/arr2.png`;
      
      // Download and process avatars
      let getAvatar = async (id, path) => {
        try {
          let response = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(path, Buffer.from(response.data, 'utf-8'));
        } catch (error) {
          console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 ${id}:`, error);
          throw error;
        }
      };

      await Promise.all([
        getAvatar(one, avatarOne),
        getAvatar(two, avatarTwo)
      ]);

      // Create circular avatars
      let [circleOne, circleTwo, bg] = await Promise.all([
        circle(avatarOne),
        circle(avatarTwo),
        jimp.read(background)
      ]);

      circleOne = await jimp.read(circleOne);
      circleTwo = await jimp.read(circleTwo);

      // Composite images
      bg.composite(circleOne.resize(200, 200), 70, 110)
        .composite(circleTwo.resize(200, 200), 465, 110);

      const outputPath = __root + `/paired_${one}_${two}.png`;
      await bg.writeAsync(outputPath);

      // Send message with attachment
      await message.reply({
        body: `╔═══════❖•💘•❖═══════╗\n\n       𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙 𝑃𝑎𝑖𝑟𝑖𝑛𝐺 💞\n\n╚═══════❖•💘•❖═══════╝\n\n╔═══════❖•💘•❖═══════╗\n\n   𝑀𝑎𝑑𝑒 𝑓𝑜𝑟 𝑌𝑜𝑢 💌\n\n╚═══════❖•💘•❖═══════╝\n\n💖 𝑌𝑜𝑢𝑟 𝑅𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑃𝑎𝑖𝑟 💖`,
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up files
      [avatarOne, avatarTwo, outputPath].forEach(filePath => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

    } catch (error) {
      console.error("𝐺𝐹 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
    }
  }
};
