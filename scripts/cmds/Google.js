const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "googlebar",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆𝒔 𝒂 𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒃𝒂𝒓 𝒊𝒎𝒂𝒈𝒆"
    },
    longDescription: {
      en: "𝑻𝒂𝒌𝒆𝒔 𝒕𝒆𝒙𝒕 𝒂𝒏𝒅 𝒓𝒆𝒏𝒅𝒆𝒓𝒔 𝒊𝒕 𝒐𝒏 𝒂 𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒃𝒂𝒓 𝒊𝒎𝒂𝒈𝒆"
    },
    guide: {
      en: "{p}googlebar [text]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const text = args.join(" ");
      
      if (!text) {
        return message.reply("❌ Please enter some text to put on the Google bar.");
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const pathImg = path.join(cacheDir, 'google.png');
      
      // Download the Google bar template
      const { data } = await axios.get("https://i.imgur.com/GXPQYtT.png", {
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
      ctx.font = "18px Arial";
      ctx.fillStyle = "#000000";
      
      // Calculate text positioning
      const maxWidth = 400;
      const x = 140;
      const y = 70;
      
      // Wrap text if needed
      const lines = this.wrapText(ctx, text, maxWidth);
      
      // Draw each line of text
      const lineHeight = 25;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + (i * lineHeight));
      }

      // Save the modified image
      const out = fs.createWriteStream(pathImg);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      
      out.on('finish', () => {
        // Send the image
        message.reply({
          body: "✅ Here's your Google search bar!",
          attachment: fs.createReadStream(pathImg)
        });
      });
      
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ Error generating Google bar image.");
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
