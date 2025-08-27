const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "anhdaden",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "𝑾𝒉𝒊𝒕𝒆 𝒃𝒓𝒐𝒕𝒉𝒆𝒓 𝒎𝒆𝒎𝒆 𝒄𝒓𝒆𝒂𝒕𝒐𝒓"
    },
    longDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆𝒔 𝒂 𝒘𝒉𝒊𝒕𝒆 𝒃𝒓𝒐𝒕𝒉𝒆𝒓 𝒎𝒆𝒎𝒆 𝒘𝒊𝒕𝒉 𝒄𝒖𝒔𝒕𝒐𝒎 𝒕𝒆𝒙𝒕"
    },
    guide: {
      en: "{p}anhdaden [text 1] | [text 2]"
    },
    cooldowns: 10
  },

  onStart: async function({ message, event, args }) {
    try {
      const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
      
      if (!text[0] || !text[1]) {
        return message.reply("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒘𝒐 𝒕𝒆𝒙𝒕𝒔 𝒔𝒆𝒑𝒂𝒓𝒂𝒕𝒆𝒅 𝒃𝒚 \"|\" 𝒔𝒚𝒎𝒃𝒐𝒍\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: !anhdaden 𝑻𝒆𝒙𝒕 1 | 𝑻𝒆𝒙𝒕 2");
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const pathImg = path.join(cacheDir, 'anhdaden.png');
      const fontPath = path.join(cacheDir, 'SVN-Arial 2.ttf');

      // Download the base image
      const imageResponse = await axios.get("https://i.imgur.com/2ggq8wM.png", {
        responseType: 'arraybuffer'
      });
      fs.writeFileSync(pathImg, Buffer.from(imageResponse.data));

      // Download the font if it doesn't exist
      if (!fs.existsSync(fontPath)) {
        try {
          const fontResponse = await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(fontPath, Buffer.from(fontResponse.data));
        } catch (fontError) {
          console.error("Failed to download font, using fallback:", fontError);
          // Use system font as fallback
        }
      }

      // Load and process the image
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Register and use the font
      try {
        if (fs.existsSync(fontPath)) {
          registerFont(fontPath, { family: "SVN-Arial 2" });
          ctx.font = "italic bold 35px 'SVN-Arial 2'";
        } else {
          ctx.font = "italic bold 35px Arial"; // Fallback font
        }
      } catch (fontError) {
        ctx.font = "italic bold 35px Arial"; // Fallback font
      }

      ctx.fillStyle = "#000077";
      ctx.textAlign = "center";

      // Text wrapping function
      const wrapText = (text, maxWidth) => {
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
      };

      // Draw the text
      const line1 = wrapText(text[0], 464);
      const line2 = wrapText(text[1], 464);

      ctx.fillText(line1.join("\n"), 170, 129);
      ctx.fillText(line2.join("\n"), 170, 440);

      // Save the modified image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      // Send the result
      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("Error in anhdaden command:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝒎𝒆𝒎𝒆.");
    }
  }
};
