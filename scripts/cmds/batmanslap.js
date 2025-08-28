const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

// Define the toBI function for bold italic text
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "batslap",
    version: "2.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    category: "fun",
    shortDescription: {
      en: toBI("🦇 Batslap meme creator")
    },
    longDescription: {
      en: toBI("Create a Batman slapping meme with tagged user")
    },
    guide: {
      en: toBI("{p}batslap [tag]")
    }
  },

  onStart: async function ({ event, message, args }) {
    try {
      const { threadID, messageID, senderID, mentions } = event;

      if (!mentions || Object.keys(mentions).length === 0) {
        return message.reply(toBI("❌ দয়া করে ১ জনকে ট্যাগ করো!"));
      }

      const mentionID = Object.keys(mentions)[0];
      const tagName = mentions[mentionID].replace("@", "");
      const one = senderID;
      const two = mentionID;

      // Create cache directory
      const cacheDir = path.join(__dirname, 'cache', 'batslap');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Use the local template file
      const templatePath = path.join(__dirname, 'cache', 'canvas', 'batmanslap.jpg');
      
      // Check if template exists
      if (!fs.existsSync(templatePath)) {
        return message.reply(toBI("❌ Batman slap template not found! Please make sure the file exists"));
      }

      // Circle function
      async function circle(imagePath) {
        const image = await jimp.read(imagePath);
        image.circle();
        return await image.getBufferAsync("image/png");
      }

      // Make the image
      const pathImg = path.join(cacheDir, `batslap_${one}_${two}.png`);
      const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
      const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);

      try {
        // Download avatars
        const avatarOneBuffer = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { 
          responseType: 'arraybuffer' 
        })).data;
        fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneBuffer));

        const avatarTwoBuffer = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { 
          responseType: 'arraybuffer' 
        })).data;
        fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoBuffer));

        // Make circular avatars
        const circleOneBuffer = await circle(avatarOnePath);
        const circleTwoBuffer = await circle(avatarTwoPath);

        // Load template and avatars
        const template = await jimp.read(templatePath);
        const avatarOne = await jimp.read(circleOneBuffer);
        const avatarTwo = await jimp.read(circleTwoBuffer);

        // Composite avatars onto template - adjusted coordinates
        template
          .composite(avatarOne.resize(160, 160), 370, 70)   // Batman's face position
          .composite(avatarTwo.resize(230, 230), 140, 150); // Person being slapped position

        // Save final image
        const finalBuffer = await template.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, finalBuffer);

        // Send the result
        return message.reply({
          body: toBI(`🦇 চুপ রে, বাল! @${tagName}`),
          mentions: [{
            tag: `@${tagName}`,
            id: mentionID
          }],
          attachment: fs.createReadStream(pathImg)
        }, async () => {
          // Cleanup files
          try {
            if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
            if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
            if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
          }
        });

      } catch (error) {
        console.error("Image creation error:", error);
        // Cleanup on error
        try {
          if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
          if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
          if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
        return message.reply(toBI("❌ Error creating batslap image. Please try again."));
      }

    } catch (error) {
      console.error("Batslap error:", error);
      return message.reply(toBI("❌ An error occurred. Please try again later."));
    }
  }
};
