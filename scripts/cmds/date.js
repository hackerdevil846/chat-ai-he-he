const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "date",
    aliases: ["romance", "lovemerge"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "💑 𝑀𝑒𝑟𝑔𝑒 𝑝𝑟𝑜𝑓𝑖𝑙𝑒𝑠 𝑓𝑜𝑟 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑚𝑒𝑟𝑔𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}date [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const { resolve } = path;
    const { existsSync, mkdirSync } = fs;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const pathToImg = resolve(__dirname, 'cache/canvas', 'josh.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(pathToImg)) {
      try {
        const imageData = await axios.get("https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", { 
          responseType: 'arraybuffer' 
        });
        await fs.writeFileSync(pathToImg, Buffer.from(imageData.data));
      } catch (error) {
        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒:", error);
      }
    }
  },

  onStart: async function ({ event, api, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      const mention = Object.keys(event.mentions)[0];
      
      if (!mention) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ!");
      }
      
      const one = senderID;
      const two = mention;
      const tag = event.mentions[mention].replace("@", "");
      
      await message.reply("⏳ 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒...");
      
      const imagePath = await makeImage({ one, two });
      
      await message.reply({
        body: `💖 𝑅𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑! 💑\n\n✨ 𝑀𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑: @${tag}`,
        mentions: [{
          tag: tag,
          id: mention
        }],
        attachment: fs.createReadStream(imagePath)
      });

      // Clean up the generated image after sending
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    } catch (error) {
      console.error("𝐷𝑎𝑡𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");
  const pathImg = __root + `/ship_${one}_${two}.png`;
  const avatarOne = __root + `/avt_${one}.png`;
  const avatarTwo = __root + `/avt_${two}.png`;

  try {
    const [getAvatarOne, getAvatarTwo] = await Promise.all([
      axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: 'arraybuffer' 
      }),
      axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: 'arraybuffer' 
      })
    ]);

    await fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'utf-8'));
    await fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'utf-8'));

    const baseImage = await jimp.read(__root + "/josh.png");
    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));

    baseImage.composite(circleOne.resize(85, 85), 355, 100)
             .composite(circleTwo.resize(75, 75), 250, 140);

    const imageBuffer = await baseImage.getBufferAsync("image/png");
    await fs.writeFileSync(pathImg, imageBuffer);
    
    // Clean up temporary avatar files
    if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
    if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
    
    return pathImg;
  } catch (error) {
    console.error("𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", error);
    throw error;
  }
}

async function circle(imagePath) {
  try {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
  } catch (error) {
    console.error("𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑖𝑚𝑎𝑔𝑒:", error);
    throw error;
  }
}
