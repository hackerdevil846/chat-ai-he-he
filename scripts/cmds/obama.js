const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "obama",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Asif",
    description: "Create Obama-style tweet images",
    category: "image",
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    api.sendMessage("🇺🇸 Obama Tweet command ready! Type 'obama [text]' to create your presidential tweet", event.threadID);
  },

  wrapText: async function (ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width <= maxWidth) {
        return resolve([text]);
      }
      
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
        
        if (i === words.length - 1 && currentLine) {
          lines.push(currentLine);
        }
      }
      
      return resolve(lines);
    });
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const text = args.join(" ");

    if (!text) {
      return api.sendMessage("✍️ Please provide text for Obama's tweet\nExample: obama Yes we can! Change is coming.", threadID, messageID);
    }

    try {
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const processingMsg = await api.sendMessage("🔄 President Obama is composing your tweet...", threadID);
      const templateUrl = 'https://i.imgur.com/6fOxdex.png';
      const templatePath = path.join(cacheDir, 'obama_template.png');
      
      const templateResponse = await axios.get(templateUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(templatePath, Buffer.from(templateResponse.data));

      const baseImage = await loadImage(templatePath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      ctx.font = "500 45px 'Helvetica Neue', Arial, sans-serif";
      ctx.fillStyle = "#14171a";
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      let fontSize = 45;
      while (ctx.measureText(text).width > 1160 && fontSize > 24) {
        fontSize -= 1;
        ctx.font = `500 ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
      }

      const lines = await this.wrapText(ctx, text, 1160);
      const lineHeight = fontSize * 1.4;
      const startY = 165;
      
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 60, startY + (i * lineHeight));
      }

      ctx.fillStyle = "#1da1f2";
      ctx.beginPath();
      ctx.arc(60 + ctx.measureText(lines[0]).width + 30, startY + 10, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial";
      ctx.fillText("✓", 60 + ctx.measureText(lines[0]).width + 22, startY + 15);

      const outputPath = path.join(cacheDir, `obama_${Date.now()}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);

      await api.sendMessage({
        body: "🇺🇸 Presidential Tweet:",
        attachment: fs.createReadStream(outputPath)
      }, threadID, messageID);
      
      fs.unlinkSync(templatePath);
      fs.unlinkSync(outputPath);
      api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("Obama Command Error:", error);
      api.sendMessage("❌ Failed to create tweet. Error: " + error.message, threadID, messageID);
    }
  }
};
