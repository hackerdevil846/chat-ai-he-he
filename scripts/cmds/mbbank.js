const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: "mbbank",
    version: "2.0.1",
    hasPermssion: 0,
    credits: "Asif",
    description: "Create professional bank transaction receipts",
    category: "edit-img",
    usages: "[text]",
    cooldowns: 5,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    },
    envConfig: {
      backgroundUrl: "https://i.imgur.com/VhBb8SR.png"
    }
  },

  wrapText: function(ctx, text, maxWidth) {
    try {
      if (ctx.measureText(text).width <= maxWidth) return [text];
      
      const words = text.split(' ');
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
      const { threadID, messageID } = event;
      const text = args.join(" ");
      
      // Check if user provided text
      if (!text) {
        return api.sendMessage("🏦 Please enter transaction details\nExample: !mbbank Transfer $500 to John Doe", threadID, messageID);
      }

      api.sendMessage("💳 Processing your MB Bank receipt...", threadID, messageID);

      // Create cache directory
      const cacheDir = path.join(__dirname, 'cache', 'mbbank');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const outputPath = path.join(cacheDir, `mbbank_${Date.now()}.png`);
      const { backgroundUrl } = config.envConfig;

      // Download background image
      const response = await axios.get(backgroundUrl, { 
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
      });
      fs.writeFileSync(outputPath, response.data);

      // Load image and create canvas
      const baseImage = await loadImage(outputPath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Text styling
      ctx.fillStyle = "#ffffff";  // White text
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Font settings
      const maxWidth = 470;
      let fontSize = 100;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;

      // Dynamic font sizing
      while (ctx.measureText(text).width > 1200 && fontSize > 40) {
        fontSize -= 5;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      }

      // Wrap text
      const lines = this.wrapText(ctx, text, maxWidth);
      const lineHeight = fontSize * 1.2;
      const startX = 840;  // Horizontal position
      const startY = 540;  // Vertical position

      // Draw text lines
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], startX, startY + (i * lineHeight));
      }

      // Save image
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, buffer);

      // Send result
      await api.sendMessage({
        body: "✅ Your MB Bank transaction receipt is ready!",
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        try {
          fs.unlinkSync(outputPath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }, messageID);

    } catch (error) {
      console.error("MB Bank command error:", error);
      api.sendMessage("❌ Failed to create bank receipt. Please try again later.", threadID, messageID);
    }
  }
};
