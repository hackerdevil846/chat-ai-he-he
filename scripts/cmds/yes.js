const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "yes",
    version: "3.2.0",
    hasPermssion: 0,
    credits: "Asif Developer",
    description: "Create custom comment board images",
    category: "image",
    usages: "[text]",
    cooldowns: 5,
    dependencies: {
      "canvas": "",
      "axios": ""
    }
  },

  // Added onStart function
  onStart: function() {
    console.log("[!] YES Board command initialized");
  },

  wrapText: function(ctx, text, maxWidth) {
    if (ctx.measureText(text).width < maxWidth) return [text];
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        lines.push(currentLine.trim());
        currentLine = words[i] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    return lines;
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    try {
      // Handle no text input
      if (!args.length) {
        return api.sendMessage(
          "📝 YES BOARD COMMAND\n\n" +
          "Create custom comment board images\n\n" +
          "Usage: yes [text]\n" +
          "Example: yes Hello world!\n" +
          "Example: yes Welcome to our group!",
          threadID, 
          messageID
        );
      }
      
      const text = args.join(" ");
      
      // Send processing message
      const processingMsg = await api.sendMessage("🛠️ Creating your comment board...", threadID, messageID);
      
      // Create cache directory
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const outputPath = path.join(cacheDir, `yes_board_${Date.now()}.png`);
      
      // Download template image
      const templateUrl = "https://i.imgur.com/1fVK4nZ.png";
      const templateResponse = await axios.get(templateUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      });
      
      // Load image and create canvas
      const baseImage = await loadImage(Buffer.from(templateResponse.data));
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      
      // Draw background
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Configure text
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      
      // Adjust font size to fit
      let fontSize = 45;
      ctx.font = `bold ${fontSize}px Arial`;
      
      // Reduce font size for long text
      while (ctx.measureText(text).width > 2250 && fontSize > 15) {
        fontSize--;
        ctx.font = `bold ${fontSize}px Arial`;
      }
      
      // Wrap text
      const lines = this.wrapText(ctx, text, 350);
      
      // Calculate vertical position (centered)
      const lineHeight = fontSize + 5;
      const totalHeight = lines.length * lineHeight;
      const startY = (canvas.height - totalHeight) / 2;
      
      // Draw text lines
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 280, startY + (i * lineHeight));
      }
      
      // Save final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(outputPath, imageBuffer);
      
      // Send result
      await api.unsendMessage(processingMsg.messageID);
      api.sendMessage({
        body: "✅ Your comment board is ready!",
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Clean up
        try {
          fs.unlinkSync(outputPath);
        } catch (cleanError) {
          console.error("Cleanup error:", cleanError);
        }
      }, messageID);
      
    } catch (error) {
      console.error("Yes command error:", error);
      api.sendMessage("❌ Failed to create comment board. Please try again later.", threadID, messageID);
    }
  }
};
