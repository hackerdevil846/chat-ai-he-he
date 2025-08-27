const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "trump",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂 𝑻𝒓𝒖𝒎𝒑 𝒕𝒘𝒆𝒆𝒕 𝒊𝒎𝒂𝒈𝒆"
    },
    longDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆𝒔 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒐𝒇 𝒂 𝑻𝒓𝒖𝒎𝒑 𝒕𝒘𝒆𝒆𝒕 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒄𝒖𝒔𝒕𝒐𝒎 𝒕𝒆𝒙𝒕"
    },
    guide: {
      en: "{p}trump [text]"
    },
    cooldowns: 10
  },

  onStart: async function({ message, event, args }) {
    try {
      const text = args.join(" ");
      
      if (!text) {
        return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒇𝒐𝒓 𝑻𝒓𝒖𝒎𝒑'𝒔 𝒕𝒘𝒆𝒆𝒕 📝");
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const pathImg = path.join(cacheDir, 'trump.png');
      
      // Download the Trump tweet template
      const { data } = await axios.get("https://i.imgur.com/ZtWfHHx.png", {
        responseType: 'arraybuffer'
      });
      fs.writeFileSync(pathImg, Buffer.from(data, 'binary'));

      // Load the image and create canvas
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw the base image
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Set font properties
      ctx.font = "bold 28px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      
      // Calculate text positioning
      const maxWidth = 500;
      const x = 60;
      const y = 165;
      
      // Wrap text if needed
      const lines = this.wrapText(ctx, text, maxWidth);
      
      // Draw each line of text
      const lineHeight = 35;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + (i * lineHeight));
      }

      // Save the modified image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      // Send the image
      await message.reply({
        body: "✅ 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝑻𝒓𝒖𝒎𝒑 𝒎𝒆𝒔𝒔𝒂𝒈𝒆! 🇺🇸",
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);
      
    } catch (error) {
      console.error("Error in trump command:", error);
      await message.reply("❌ 𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏!");
    }
  },

  wrapText: function(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
};
