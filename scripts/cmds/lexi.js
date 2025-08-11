const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "lexi",
    version: "2.1.1",
    hasPermssion: 0, // Corrected spelling (two 's')
    credits: "Asif",
    description: "Create custom text on a professional signature board",
    category: "edit-img", // Fixed category
    usages: "lexi [text]",
    cooldowns: 15,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    },
    envConfig: {
      backgroundUrl: "https://i.imgur.com/hTU9zhX.png" // Signature board template
    }
  },

  wrapText: function (ctx, text, maxWidth) {
    try {
      if (ctx.measureText(text).width <= maxWidth) return [text];
      
      const words = text.split(/\s+/);
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        if (ctx.measureText(testLine).width <= maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);
      return lines;
    } catch (error) {
      console.error("Text wrapping error:", error);
      return [text];
    }
  },

  onStart: async function({ api, event, args, config }) {
    try {
      const { threadID, messageID, senderID } = event;
      const { backgroundUrl } = config.envConfig;

      // Validate input
      const text = args.join(" ");
      if (!text) {
        return api.sendMessage("✏️ Please enter the text you want to display on the signature board.\nExample: !lexi Official Signature", threadID, messageID);
      }

      // Create cache directory
      const cacheDir = path.join(__dirname, 'cache', 'lexi');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const outputPath = path.join(cacheDir, `signature_${senderID}_${Date.now()}.png`);
      
      api.sendMessage("🖌️ Creating your signature board...", threadID, messageID);
      
      // Download background image
      const response = await axios.get(backgroundUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(outputPath, response.data);

      // Load image and create canvas
      const baseImage = await loadImage(outputPath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      
      // Draw background
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Text styling
      ctx.fillStyle = "#000000"; // Black text
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Font settings
      const maxWidth = 490; // Max width for text
      let fontSize = 42; // Starting font size
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;

      // Dynamic font sizing
      while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
        fontSize -= 1;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      }

      // Wrap text
      const lines = this.wrapText(ctx, text, maxWidth);
      const lineHeight = fontSize * 1.3; // Line height calculation
      const startY = 60; // Starting Y position

      // Text shadow effect
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Draw text lines
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 25, startY + (i * lineHeight));
      }

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Save image
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, buffer);

      // Send result
      await api.sendMessage({
        body: "✅ Your professional signature board is ready!",
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => fs.unlinkSync(outputPath), messageID);

    } catch (error) {
      console.error("Lexi command error:", error);
      api.sendMessage("❌ An error occurred while creating your signature board. Please try again with shorter text.", threadID, messageID);
    }
  }
};
