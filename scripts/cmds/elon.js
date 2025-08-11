const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "elon",
    version: "1.3.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Create Elon Musk-style whiteboard memes with custom text",
    category: "image",
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    // Get text input
    const text = args.join(" ");
    if (!text) {
      return api.sendMessage(
        "🚀 Elon Musk Whiteboard Generator 🚀\n\n" +
        "✏️ Usage: elon [text]\n" +
        "Example: elon We're going to Mars!\n\n" +
        "💡 Keep text under 100 characters for best results",
        threadID,
        messageID
      );
    }

    try {
      // Send processing notification
      const processingMsg = await api.sendMessage("🔄 Creating your Elon Musk whiteboard...", threadID, messageID);
      
      // Create cache directory
      const cacheDir = path.join(__dirname, 'cache', 'elon');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Define paths
      const templatePath = path.join(cacheDir, 'whiteboard.png');
      const outputPath = path.join(cacheDir, `elon_${Date.now()}.png`);

      // Download template if not cached
      if (!fs.existsSync(templatePath)) {
        try {
          const templateData = await axios.get('https://i.imgur.com/GGmRov3.png', { 
            responseType: 'arraybuffer',
            timeout: 30000
          });
          fs.writeFileSync(templatePath, Buffer.from(templateData.data));
        } catch (error) {
          console.error("Template download error:", error);
          await api.unsendMessage(processingMsg.messageID);
          return api.sendMessage("❌ Failed to download template. Please try again later.", threadID, messageID);
        }
      }

      // Load image
      const baseImage = await loadImage(templatePath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      
      // Draw background
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Configure text
      ctx.font = "bold 60px 'Arial', sans-serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      
      // Wrap text
      const maxWidth = canvas.width - 100; // 50px padding on each side
      const lines = this.wrapText(ctx, text, maxWidth);
      
      // Calculate vertical positioning
      const lineHeight = 70;
      const startY = 100;
      const maxLines = 3;
      
      // Draw text lines with shadow effect
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw only up to maxLines
      for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
        ctx.fillText(lines[i], 50, startY + (i * lineHeight));
      }
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      
      // Save image
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
      
      // Send result
      await api.unsendMessage(processingMsg.messageID);
      api.sendMessage({
        body: `🚀 Your Elon Musk Whiteboard Is Ready!\n━━━━━━━━━━━━━━\n✏️ Text: "${text}"`,
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Cleanup
        try {
          fs.unlinkSync(outputPath);
        } catch (e) {
          console.log("Cleanup error:", e);
        }
      }, messageID);
      
    } catch (error) {
      console.error("Elon command error:", error);
      api.sendMessage(
        "❌ Failed to create your whiteboard. Please try again with shorter text (max 100 characters).",
        threadID,
        messageID
      );
    }
  },
  
  wrapText: function(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width <= maxWidth) {
        currentLine = testLine;
      } else {
        // Word is too long to fit - split it
        if (ctx.measureText(words[i]).width > maxWidth) {
          const word = words[i];
          let splitIndex = 0;
          
          for (let j = 1; j <= word.length; j++) {
            const subWord = word.substring(0, j);
            if (ctx.measureText(subWord).width > maxWidth) {
              lines.push(word.substring(0, splitIndex));
              currentLine = word.substring(splitIndex);
              break;
            }
            splitIndex = j;
          }
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Trim to maximum 4 lines
    return lines.slice(0, 4);
  }
};
