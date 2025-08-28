const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "award",
    version: "3.1.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆 𝒂 𝒄𝒖𝒔𝒕𝒐𝒎 𝒂𝒘𝒂𝒓𝒅 𝒄𝒆𝒓𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒆"
    },
    longDescription: {
      en: "𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂 𝒑𝒆𝒓𝒔𝒐𝒏𝒂𝒍𝒊𝒛𝒆𝒅 𝒂𝒘𝒂𝒓𝒅 𝒄𝒆𝒓𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒆 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒏𝒂𝒎𝒆 𝒂𝒏𝒅 𝒕𝒆𝒙𝒕"
    },
    guide: {
      en: "{p}award [𝒏𝒂𝒎𝒆] | [𝒕𝒆𝒙𝒕]"
    },
    cooldowns: 10
  },

  onStart: async function({ message, event, args }) {
    try {
      // Check if user provided text
      if (!args[0]) {
        return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓: 𝒏𝒂𝒎𝒆 | 𝒕𝒆𝒙𝒕\n💡 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: 𝑨𝒔𝒊𝒇 | 𝑩𝒆𝒔𝒕 𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓");
      }

      const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
      
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const pathImg = path.join(cacheDir, `award_${Date.now()}.png`);
      const fontPath = path.join(cacheDir, 'SVN-Arial 2.ttf');

      // Download award template
      const getImage = await axios.get("https://i.ibb.co/QC0hdpJ/Picsart-22-08-15-17-00-15-867.jpg", {
        responseType: 'arraybuffer'
      });
      fs.writeFileSync(pathImg, Buffer.from(getImage.data));

      // Download font if it doesn't exist
      if (!fs.existsSync(fontPath)) {
        try {
          const getfont = await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(fontPath, Buffer.from(getfont.data));
        } catch (fontError) {
          console.log("Font download failed, using system font:", fontError);
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
          ctx.font = "bold 30px 'SVN-Arial 2'";
        } else {
          ctx.font = "bold 30px Arial"; // Fallback font
        }
      } catch (fontError) {
        ctx.font = "bold 30px Arial"; // Fallback font
      }

      ctx.fillStyle = "#000000";
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
      const nameLine = wrapText(text[0], 464);
      const awardText = text[1] || "𝑨𝒘𝒂𝒓𝒅";
      const textLine = wrapText(awardText, 464);

      ctx.fillText(nameLine.join("\n"), 325, 250);
      ctx.fillText(textLine.join("\n"), 325, 280);

      // Save the modified image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      // Send the result
      await message.reply({
        body: "✨ 𝑨𝒑𝒏𝒂𝒓 𝒂𝒘𝒂𝒓𝒅 𝒓𝒆𝒂𝒅𝒚!",
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("Award command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒂𝒘𝒂𝒓𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
