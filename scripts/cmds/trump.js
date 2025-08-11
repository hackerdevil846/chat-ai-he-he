const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "trump",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Asif",
    description: "Create realistic Trump-style tweets",
    category: "image",  // Correctly set to "image"
    usages: "trump [tweet text]",
    cooldowns: 15,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    api.sendMessage("🇺🇸 Trump Tweet command ready! Use 'trump [text]' to create presidential tweets", event.threadID);
  },

  wrapText: async function (ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width <= maxWidth) return resolve([text]);
      
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      
      lines.push(currentLine);
      return resolve(lines);
    });
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const text = args.join(" ");

    if (!text) {
      return api.sendMessage("✍️ Please enter text for Trump's tweet\nExample: trump Make America Great Again!", threadID, messageID);
    }

    try {
      const cacheDir = path.join(__dirname, 'cache', 'trump_tweets');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const processingMsg = await api.sendMessage("🔄 President Trump is typing your tweet...", threadID);
      const templateUrl = 'https://i.imgur.com/ZtWfHHx.png';
      const templatePath = path.join(cacheDir, 'template.png');
      
      const templateResponse = await axios.get(templateUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(templatePath, Buffer.from(templateResponse.data));

      const baseImage = await loadImage(templatePath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Set tweet text styling
      ctx.font = "bold 45px 'Helvetica Neue', Arial, sans-serif";
      ctx.fillStyle = "#14171a";
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      // Adjust font size to fit
      let fontSize = 45;
      const maxWidth = 1160;
      
      while (ctx.measureText(text).width > maxWidth && fontSize > 24) {
        fontSize -= 1;
        ctx.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
      }

      // Wrap text and position
      const lines = await this.wrapText(ctx, text, maxWidth);
      const lineHeight = fontSize * 1.4;
      const startY = 165;
      
      // Draw tweet text
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 60, startY + (i * lineHeight));
      }

      // Draw header
      ctx.fillStyle = "#1da1f2";
      ctx.font = "bold 32px Arial";
      ctx.fillText("Donald J. Trump", 60, 100);
      ctx.fillStyle = "#657786";
      ctx.font = "28px Arial";
      ctx.fillText("@realDonaldTrump · 1h", 250, 105);
      
      // Draw engagement metrics
      ctx.fillStyle = "#657786";
      ctx.font = "28px Arial";
      ctx.fillText("12.3K", 60, startY + (lines.length * lineHeight) + 50);
      ctx.fillText("Retweets", 120, startY + (lines.length * lineHeight) + 50);
      ctx.fillText("1.2K", 260, startY + (lines.length * lineHeight) + 50);
      ctx.fillText("Quote Tweets", 320, startY + (lines.length * lineHeight) + 50);
      ctx.fillText("5.6K", 480, startY + (lines.length * lineHeight) + 50);
      ctx.fillText("Likes", 540, startY + (lines.length * lineHeight) + 50);

      // Save and send result
      const outputPath = path.join(cacheDir, `trump_tweet_${Date.now()}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);

      await api.sendMessage({
        body: "🇺🇸 Presidential Tweet:",
        attachment: fs.createReadStream(outputPath)
      }, threadID, messageID);
      
      // Cleanup files
      fs.unlinkSync(templatePath);
      fs.unlinkSync(outputPath);
      api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("Trump Command Error:", error);
      api.sendMessage("❌ Failed to create tweet. Error: " + error.message, threadID, messageID);
    }
  }
};
