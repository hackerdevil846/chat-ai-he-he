const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "altar",
    version: "1.1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "𝑨𝒍𝒕𝒂𝒓 𝒊𝒎𝒂𝒈𝒆 𝒄𝒓𝒆𝒂𝒕𝒊𝒐𝒏"
    },
    longDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆𝒔 𝒂𝒏 𝒂𝒍𝒕𝒂𝒓 𝒊𝒎𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒎𝒆𝒏𝒕𝒊𝒐𝒏𝒆𝒅 𝒖𝒔𝒆𝒓'𝒔 𝒂𝒗𝒂𝒕𝒂𝒓"
    },
    guide: {
      en: "{p}altar [@𝒕𝒂𝒈]"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const outputPath = path.join(cacheDir, 'altar.png');
      
      // Get user ID from mention or use sender's ID
      const targetID = Object.keys(event.mentions)[0] || event.senderID;
      
      // Create canvas
      const canvas = createCanvas(960, 634);
      const ctx = canvas.getContext('2d');

      // Load background image
      try {
        const background = await loadImage('https://i.imgur.com/brK0Hbb.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      } catch (error) {
        console.error("Failed to load background image:", error);
        return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒊𝒎𝒂𝒈𝒆");
      }

      // Get user avatar
      try {
        const avatarResponse = await axios.get(`https://graph.facebook.com/${targetID}/picture?width=512&height=512`, {
          responseType: 'arraybuffer'
        });
        
        // Create circular avatar
        const avatarImage = await loadImage(Buffer.from(avatarResponse.data));
        
        // Draw circular avatar (manual circle cropping)
        ctx.save();
        ctx.beginPath();
        ctx.arc(353 + 102.5, 158 + 102.5, 102.5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, 353, 158, 205, 205);
        ctx.restore();

      } catch (error) {
        console.error("Failed to load avatar:", error);
        return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒖𝒔𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓");
      }

      // Save the image
      const buffer = canvas.toBuffer();
      fs.writeFileSync(outputPath, buffer);

      // Send the result
      await message.reply({
        body: "𝑯𝒆𝒚, 𝒉𝒐𝒘 𝒂𝒓𝒆 𝒚𝒐𝒖? :))",
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up
      fs.unlinkSync(outputPath);

    } catch (error) {
      console.error("Altar command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒕𝒉𝒆 𝒊𝒎𝒂𝒈𝒆");
    }
  }
};
