const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const jimp = require('jimp');

const command = {
  config: {
    name: "gf",
    version: "7.3.2",
    role: 0,
    author: "Asif Developer",
    description: "Create couple pairing images",
    category: "image",
    usage: "[@mention]",
    example: "gf @friend",
    cooldown: 5
  },

  onLoad: async function () {
    const canvasDir = path.join(__dirname, 'cache', 'canvas');
    command.canvasPath = path.join(canvasDir, 'arr2.png');
    await fs.mkdirp(canvasDir);
    if (!await fs.pathExists(command.canvasPath)) {
      try {
        await command.downloadBaseImage(command.canvasPath);
      } catch (err) {
        console.error("⚠️ Failed to download base template:", err);
      }
    }
  },

  downloadBaseImage: async function (outputPath) {
    const url = "https://i.imgur.com/iaOiAXe.jpeg";
    const maxRetries = 5;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const { data } = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
          },
          timeout: 10000
        });
        await fs.writeFile(outputPath, data);
        console.log("✅ Base template downloaded");
        return;
      } catch (error) {
        const status = error.response?.status;
        if (status === 429) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '3', 10);
          console.warn(`429 Rate limited. Retrying in ${retryAfter}s…`);
          await new Promise(res => setTimeout(res, retryAfter * 1000));
          attempt++;
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed to download base image after ${maxRetries} attempts`);
  },

  onStart: async function ({ event, api }) {
    const { threadID, messageID, senderID, mentions = {} } = event;
    const mentionIds = Object.keys(mentions);

    if (!mentionIds.length) {
      return api.sendMessage("⚠️ Please mention someone to pair with!", threadID, messageID);
    }
    const partnerId = mentionIds[0];
    if (partnerId === senderID) {
      return api.sendMessage("😂 You can't pair with yourself!", threadID, messageID);
    }

    await api.sendMessage("💞 Creating your couple pairing…", threadID, messageID);

    try {
      const imagePath = await command.createPairImage(senderID, partnerId);
      const body =
        "✿┈┈┈┈┈┈༺♡༻┈┈┈┈┈┈✿\n" +
        " 💖 Pairing Complete! 💖\n" +
        "✿┈┈┈┈┈┈༺♡༻┈┈┈┈┈┈✿\n\n" +
        "You two look perfect together!";

      return api.sendMessage(
        { body, attachment: fs.createReadStream(imagePath) },
        threadID,
        () => command._cleanupFiles([imagePath, senderID, partnerId]),
        messageID
      );
    } catch (err) {
      console.error("❌ createPairImage error:", err);
      return api.sendMessage(
        "❌ Failed to create pairing image. Please try again later.",
        threadID,
        messageID
      );
    }
  },

  createCircularAvatarBuffer: async function (buffer) {
    const img = await jimp.read(buffer);
    img.circle();
    return img.getBufferAsync(jimp.MIME_PNG);
  },

  createPairImage: async function (oneId, twoId) {
    const cache = path.join(__dirname, 'cache', 'canvas');
    const outPath = path.join(cache, `pair_${oneId}_${twoId}.png`);
    const url1 = `https://graph.facebook.com/${oneId}/picture?width=512&height=512`;
    const url2 = `https://graph.facebook.com/${twoId}/picture?width=512&height=512`;

    const [res1, res2] = await Promise.all([
      axios.get(url1, { responseType: 'arraybuffer' }),
      axios.get(url2, { responseType: 'arraybuffer' })
    ]);

    const circ1 = await command.createCircularAvatarBuffer(res1.data);
    const circ2 = await command.createCircularAvatarBuffer(res2.data);

    const tmp1 = path.join(cache, `avt_${oneId}.png`);
    const tmp2 = path.join(cache, `avt_${twoId}.png`);
    await fs.writeFile(tmp1, circ1);
    await fs.writeFile(tmp2, circ2);

    const base = await jimp.read(command.canvasPath);
    const avatarOne = await jimp.read(tmp1);
    const avatarTwo = await jimp.read(tmp2);

    base.composite(avatarOne.resize(200, 200), 70, 110);
    base.composite(avatarTwo.resize(200, 200), 465, 110);
    await base.writeAsync(outPath);

    return outPath;
  },

  _cleanupFiles: function ([finalImg, oneId, twoId]) {
    try {
      fs.unlinkSync(finalImg);
      fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${oneId}.png`));
      fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${twoId}.png`));
    } catch (e) {
      // ignore
    }
  }
};

module.exports = command;
