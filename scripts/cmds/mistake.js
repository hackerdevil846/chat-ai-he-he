const jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "mistake",
    aliases: [],
    version: "3.5.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Fixed & Optimized
    countDown: 10,
    role: 0,
    shortDescription: "Tag someone to show them as a mistake",
    longDescription: "Create a funny meme showing the tagged person as life's biggest mistake using high-quality processing.",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ event, message, args }) {
    // 1. Check for mentions
    const mention = Object.keys(event.mentions);
    if (!mention || mention.length === 0) {
      return message.reply("❓ | Please tag the person who is the mistake!");
    }

    try {
      // 2. Setup IDs and Paths
      const targetUserID = mention[0];
      const cacheDir = path.join(__dirname, "cache");
      const outputPath = path.join(cacheDir, `mistake_${targetUserID}_${Date.now()}.png`);

      // 3. Ensure cache directory exists to prevent errors
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // 4. FIX: Use this specific URL format with access token to get the REAL image
      // Without this token, FB often sends a blank silhouette to bots
      const avatarURL = `https://graph.facebook.com/${targetUserID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const baseImageURL = "https://i.postimg.cc/2ST7x1Dw/received-6010166635719509.jpg";

      // 5. Send loading message
      const processingMsg = await message.reply("🔄 | 𝗟𝗼𝗮𝗱𝗶𝗻𝗴 𝘁𝗵𝗲 𝗺𝗶𝘀𝘁𝗮𝗸𝗲...");

      // 6. Process Image with JIMP
      const base = await jimp.read(baseImageURL);
      const avatar = await jimp.read(avatarURL);

      // Resize base to standard size to ensure coordinates work correctly
      base.resize(512, 512);

      // Resize avatar to fit the frame perfectly (Coordinates adjusted for best fit)
      avatar.resize(220, 203);

      // Composite the avatar onto the base (x: 145, y: 305)
      base.composite(avatar, 145, 305);

      // 7. Write to file
      await base.writeAsync(outputPath);

      // 8. Send the result
      await message.reply({
        body: `💔 | 𝗧𝗵𝗲 𝗕𝗶𝗴𝗴𝗲𝘀𝘁 𝗠𝗶𝘀𝘁𝗮𝗸𝗲 𝗼𝗳 𝗠𝘆 𝗟𝗶𝗳𝗲...`,
        attachment: fs.createReadStream(outputPath)
      });

      // 9. Cleanup
      message.unsend(processingMsg.messageID);
      fs.unlinkSync(outputPath);

    } catch (error) {
      console.error("Mistake Command Error:", error);
      message.reply("❌ | Failed to process the image. The user's profile picture might be private.");
    }
  }
};
