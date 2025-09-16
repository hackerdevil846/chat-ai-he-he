const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "pair6",
    aliases: ["pairing", "couple"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "✨ 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑚𝑜𝑛𝑜𝑟𝑜𝑗𝑜𝑛𝑒𝑟 𝑗𝑜𝑛𝑛𝑜 𝑒𝑘𝑡𝑎 𝑚𝑜𝑗𝑎-𝑓𝑢𝑙𝑙 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑔𝑎𝑚𝑒 ✨"
    },
    longDescription: {
      en: "𝐹𝑢𝑛 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑔𝑎𝑚𝑒 𝑡𝑜 𝑚𝑎𝑡𝑐ℎ 𝑢𝑠𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑝𝑒𝑟𝑐𝑒𝑛𝑡𝑎𝑔𝑒𝑠"
    },
    guide: {
      en: "{p}pair6"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const dirMaterial = __dirname + `/cache/canvas/`;
    const imagePath = path.resolve(__dirname, "cache/canvas", "pairing.png");

    if (!fs.existsSync(dirMaterial)) {
      fs.mkdirSync(dirMaterial, { recursive: true });
    }

    if (!fs.existsSync(imagePath)) {
      try {
        const response = await axios.get(
          "https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png",
          { responseType: 'arraybuffer' }
        );
        fs.writeFileSync(imagePath, response.data);
      } catch (error) {
        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", error);
      }
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const { threadID, messageID, senderID } = event;

      // Helper: make avatar circular
      const circle = async (image) => {
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
      };

      // Helper: make pairing image
      const makeImage = async ({ one, two }) => {
        const __root = path.resolve(__dirname, "cache", "canvas");
        const pairing_img = await jimp.read(__root + "/pairing.png");
        const pathImg = __root + `/pairing_${one}_${two}.png`;
        const avatarOne = __root + `/avt_${one}.png`;
        const avatarTwo = __root + `/avt_${two}.png`;

        const getAvatar = async (uid) => {
          const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
          const response = await axios.get(url, { responseType: "arraybuffer" });
          return response.data;
        };

        fs.writeFileSync(avatarOne, Buffer.from(await getAvatar(one), "utf-8"));
        fs.writeFileSync(avatarTwo, Buffer.from(await getAvatar(two), "utf-8"));

        const circleOne = await jimp.read(await circle(avatarOne));
        const circleTwo = await jimp.read(await circle(avatarTwo));

        pairing_img
          .composite(circleOne.resize(150, 150), 980, 200)
          .composite(circleTwo.resize(150, 150), 140, 200);

        const raw = await pairing_img.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);
        fs.unlinkSync(avatarOne);
        fs.unlinkSync(avatarTwo);

        return pathImg;
      };

      const tl = [
        "💘 21%", "💝 67%", "💔 19%", "❤️‍🔥 37%", "💖 17%",
        "💞 96%", "❣️ 52%", "💕 62%", "💓 76%", "💗 83%",
        "💯 100%", "💌 99%", "⚡ 0%", "💟 48%"
      ];
      const tle = tl[Math.floor(Math.random() * tl.length)];

      const userOneInfo = await api.getUserInfo(senderID);
      const namee = userOneInfo[senderID].name;

      const threadInfo = await api.getThreadInfo(threadID);
      const randomParticipant = threadInfo.participantIDs[Math.floor(Math.random() * threadInfo.participantIDs.length)];
      const userTwoInfo = await api.getUserInfo(randomParticipant);
      const name = userTwoInfo[randomParticipant].name;

      const pathImg = await makeImage({ one: senderID, two: randomParticipant });

      await message.reply({
        body: `🌸 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${namee} 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑒𝑐ℎ𝑒 ${name} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒\n💌 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑚𝑖𝑙𝑎𝑛𝑒𝑟 ℎ𝑎𝑟: 〚 ${tle} 〛`,
        mentions: [
          { id: senderID, tag: namee },
          { id: randomParticipant, tag: name }
        ],
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
      }

    } catch (error) {
      console.error("𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
