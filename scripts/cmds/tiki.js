const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tiki",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Asif Developer",
    description: "Create custom Tiki bar signs with your text",
    category: "tools",
    usages: "tiki [text]",
    cooldowns: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  // Added required onStart function
  onStart: async function() {
    // Initialization if needed
  },

  wrapText: function(ctx, text, maxWidth) {
    if (ctx.measureText(text).width < maxWidth) return [text];
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      let wordToAdd = word;
      
      while (ctx.measureText(wordToAdd).width >= maxWidth) {
        const part = wordToAdd.slice(0, wordToAdd.length - 1);
        const remaining = wordToAdd.slice(wordToAdd.length - 1);
        
        if (currentLine) {
          lines.push(currentLine.trim());
          currentLine = '';
        }
        
        lines.push(part);
        wordToAdd = remaining;
      }
      
      const testLine = currentLine ? `${currentLine} ${wordToAdd}` : wordToAdd;
      if (ctx.measureText(testLine).width < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = wordToAdd;
      }
    }
    
    if (currentLine) lines.push(currentLine.trim());
    return lines;
  },

  run: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;
      const text = args.join(" ");
      
      if (!text) {
        return api.sendMessage(
          "🪧 TIKI SIGN CREATOR\n\n" +
          "Please enter text for your Tiki sign\n" +
          "Example: tiki Welcome to Paradise!\n" +
          "Example: tiki Happy Hour 5-7 PM\n" +
          "Example: tiki Mai Tais $5",
          threadID, 
          messageID
        );
      }

      // Send processing message
      api.sendMessage("🛠️ Creating your Tiki sign...", threadID, messageID);
      
      const outputPath = path.join(__dirname, 'cache', `tiki_sign_${Date.now()}.png`);
      
      // Download template image
      const boardUrl = "https://i.imgur.com/nqUIi2S.png";
      const { data: imageData } = await axios.get(boardUrl, { responseType: 'arraybuffer' });
      
      // Create canvas
      const baseImage = await loadImage(Buffer.from(imageData, 'binary'));
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Configure text styling
      ctx.fillStyle = "#FFCC33"; // Golden yellow color
      ctx.textAlign = "left";
      
      // Set initial font properties
      let fontSize = 50;
      let fontWeight = 200;
      ctx.font = `${fontWeight} ${fontSize}px Gabriele, Arial, sans-serif`;
      
      // Reduce font size if text is too long
      while (ctx.measureText(text).width > 2600 && fontSize > 20) {
        fontSize--;
        fontWeight = 400; // Switch to regular weight for smaller text
        ctx.font = `${fontWeight} ${fontSize}px Gabriele, Arial, sans-serif`;
      }
      
      // Wrap text to fit within sign width
      const wrappedText = this.wrapText(ctx, text, 900);
      
      // Calculate vertical centering
      const lineHeight = fontSize * 1.4;
      const totalHeight = wrappedText.length * lineHeight;
      const startY = 430 - (totalHeight / 2) + (fontSize * 0.7);
      
      // Draw text on sign
      wrappedText.forEach((line, index) => {
        ctx.fillText(line, 625, startY + (index * lineHeight));
      });
      
      // Save processed image
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
      
      // Send result
      api.sendMessage({
        body: `🪧 YOUR TIKI SIGN:\n"${text}"`,
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Clean up temporary file
        try {
          fs.unlinkSync(outputPath);
        } catch (cleanError) {
          console.error("Cleanup error:", cleanError);
        }
      }, messageID);
      
    } catch (error) {
      console.error("Tiki sign creation error:", error);
      api.sendMessage("❌ Error creating Tiki sign. Please try:\n- Shorter text\n- Different wording\n- Again later", threadID, messageID);
    }
  }
};
