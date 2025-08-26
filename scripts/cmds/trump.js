const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "trumptweet",
    version: "1.1.0",
    hasPermission: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Create realistic Trump-style tweets",
    category: "image",
    usages: "trumptweet [tweet text]",
    cooldowns: 15,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    api.sendMessage(
      "🇺🇸 Trump Tweet command ready! Use 'trumptweet [text]' to create presidential tweets",
      event.threadID
    );
  },

  wrapText: async function (ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width <= maxWidth) return resolve([text]);
      
      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + " " + word;
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      
      lines.push(currentLine);
      resolve(lines);
    });
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const text = args.join(" ");

    if (!text) {
      return api.sendMessage(
        "✍️ Please enter text for Trump's tweet\nExample: trumptweet Make America Great Again!",
        threadID,
        messageID
      );
    }

    try {
      const cacheDir = path.join(__dirname, "cache", "trump_tweets");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const processingMsg = await api.sendMessage(
        "🔄 President Trump is typing your tweet...",
        threadID
      );

      const templateUrl = "https://i.imgur.com/ZtWfHHx.png";
      const templatePath = path.join(cacheDir, "template.png");
      const templateResponse = await axios.get(templateUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(templatePath, Buffer.from(templateResponse.data));

      const baseImage = await loadImage(templatePath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Tweet text styling
      let fontSize = 45;
      ctx.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
      ctx.fillStyle = "#14171a";
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      const maxWidth = 1160;
      while (ctx.measureText(text).width > maxWidth && fontSize > 24) {
        fontSize -= 1;
        ctx.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
      }

      const lines = await this.wrapText(ctx, text, maxWidth);
      const lineHeight = fontSize * 1.4;
      const startY = 165;

      lines.forEach((line, idx) => {
        ctx.fillText(line, 60, startY + idx * lineHeight);
      });

      // Header
      ctx.fillStyle = "#1da1f2";
      ctx.font = "bold 32px Arial";
      ctx.fillText("Donald J. Trump", 60, 100);
      ctx.fillStyle = "#657786";
      ctx.font = "28px Arial";
      ctx.fillText("@realDonaldTrump · 1h", 250, 105);

      // Engagement metrics
      const metricsY = startY + lines.length * lineHeight + 50;
      ctx.fillStyle = "#657786";
      ctx.font = "28px Arial";
      ctx.fillText("12.3K", 60, metricsY);
      ctx.fillText("Retweets", 120, metricsY);
      ctx.fillText("1.2K", 260, metricsY);
      ctx.fillText("Quote Tweets", 320, metricsY);
      ctx.fillText("5.6K", 480, metricsY);
      ctx.fillText("Likes", 540, metricsY);

      // Save and send
      const outputPath = path.join(cacheDir, `trump_tweet_${Date.now()}.png`);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, buffer);

      await api.sendMessage(
        { body: "🇺🇸 Presidential Tweet:", attachment: fs.createReadStream(outputPath) },
        threadID,
        messageID
      );

      // Cleanup
      fs.unlinkSync(templatePath);
      fs.unlinkSync(outputPath);
      api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("Trump Command Error:", error);
      api.sendMessage(
        "❌ Failed to create tweet. Error: " + error.message,
        threadID,
        messageID
      );
    }
  }
};
