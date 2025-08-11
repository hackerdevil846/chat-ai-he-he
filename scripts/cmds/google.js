const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "google",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Create Google search bar images with custom text",
    category: "edit-img", // Ensure this category is recognized by your bot
    usages: "googlebar [text]",
    cooldowns: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    api.sendMessage("🔍 Google Bar command is ready! Type 'googlebar [text]' to create your custom Google search image", event.threadID);
  },

  wrapText: async (ctx, text, maxWidth) => {
    return new Promise(resolve => {
      // If text fits in single line
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      
      // If even a single character is too wide
      if (ctx.measureText('W').width > maxWidth) return resolve(null);
      
      const words = text.split(' ');
      const lines = [];
      let line = '';
      
      while (words.length > 0) {
        let split = false;
        
        // Break words that are too long
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) {
            words[1] = `${temp.slice(-1)}${words[1]}`;
          } else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        
        // Add words to line if they fit
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `;
        } else {
          lines.push(line.trim());
          line = '';
        }
        
        // Push last line
        if (words.length === 0) lines.push(line.trim());
      }
      
      return resolve(lines);
    });
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const text = args.join(" ");

    // Validate input
    if (!text) {
      return api.sendMessage("🔍 Please enter text for the Google search bar\nExample: googlebar how to code", threadID, messageID);
    }

    try {
      // Send processing message
      const processingMsg = await api.sendMessage("🔄 Creating your Google search bar...", threadID);

      // Download template image
      const templateUrl = 'https://i.imgur.com/GXPQYtT.png';
      const templatePath = __dirname + '/cache/google_template.png';
      
      const response = await axios.get(templateUrl, { 
        responseType: 'arraybuffer' 
      });
      
      fs.writeFileSync(templatePath, Buffer.from(response.data));

      // Setup canvas
      const baseImage = await loadImage(templatePath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      
      // Draw background
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Text styling
      ctx.font = "500 52px Arial, sans-serif";
      ctx.fillStyle = "#000000";
      ctx.textBaseline = "middle";

      // Adjust font size to fit
      let fontSize = 52;
      while (ctx.measureText(text).width > 1200 && fontSize > 24) {
        fontSize -= 2;
        ctx.font = `500 ${fontSize}px Arial, sans-serif`;
      }

      // Wrap text
      const lines = await this.wrapText(ctx, text, 470);
      const lineHeight = fontSize * 1.4;
      const startY = 646 - ((lines.length - 1) * lineHeight / 2);

      // Draw text lines
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 580, startY + (i * lineHeight));
      }

      // Save result
      const outputPath = __dirname + '/cache/google_result.png';
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);

      // Send result
      await api.sendMessage({
        body: "🔎 Here's your Google search:",
        attachment: fs.createReadStream(outputPath)
      }, threadID, messageID);
      
      // Cleanup
      fs.unlinkSync(templatePath);
      fs.unlinkSync(outputPath);
      api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("Google Bar Error:", error);
      api.sendMessage("❌ Failed to create image. Error: " + error.message, threadID, messageID);
    }
  }
};
