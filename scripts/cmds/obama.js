const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "obamatweet",
    aliases: ["obamatw", "presidentialtweet"],
    version: "1.1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 10,
    role: 0,
    category: "𝒊𝒎𝒂𝒈𝒆",
    shortDescription: {
      en: "🇺🇸 𝑪𝒓𝒆𝒂𝒕𝒆 𝒑𝒓𝒆𝒔𝒊𝒅𝒆𝒏𝒕𝒊𝒂𝒍 𝑶𝒃𝒂𝒎𝒂-𝒔𝒕𝒚𝒍𝒆 𝒕𝒘𝒆𝒆𝒕 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    longDescription: {
      en: "🇺🇸 𝑪𝒓𝒆𝒂𝒕𝒆 𝒑𝒓𝒆𝒔𝒊𝒅𝒆𝒏𝒕𝒊𝒂𝒍 𝑶𝒃𝒂𝒎𝒂-𝒔𝒕𝒚𝒍𝒆 𝒕𝒘𝒆𝒆𝒕 𝒊𝒎𝒂𝒈𝒆𝒔 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒄𝒖𝒔𝒕𝒐𝒎 𝒕𝒆𝒙𝒕"
    },
    guide: {
      en: "{𝑝}obamatweet [𝒕𝒆𝒙𝒕]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Dependency check
      if (!createCanvas || !loadImage) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑐𝑎𝑛𝑣𝑎𝑠");
      if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");

      const { threadID, messageID } = event;

      if (args.length === 0) {
        return api.sendMessage(
          "🇺🇸 𝑶𝒃𝒂𝒎𝒂 𝑻𝒘𝒆𝒆𝒕 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒓𝒆𝒂𝒅𝒚! 𝑻𝒚𝒑𝒆 'obamatweet [𝒕𝒆𝒙𝒕]' 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒚𝒐𝒖𝒓 𝒑𝒓𝒆𝒔𝒊𝒅𝒆𝒏𝒕𝒊𝒂𝒍 𝒕𝒘𝒆𝒆𝒕",
          threadID,
          messageID
        );
      }

      const text = args.join(" ");
      if (!text.trim()) {
        return api.sendMessage(
          "✍️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒕𝒆𝒙𝒕 𝒇𝒐𝒓 𝑶𝒃𝒂𝒎𝒂'𝒔 𝒕𝒘𝒆𝒆𝒕\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: obamatweet 𝒀𝒆𝒔 𝒘𝒆 𝒄𝒂𝒏! 𝑪𝒉𝒂𝒏𝒈𝒆 𝒊𝒔 𝒄𝒐𝒎𝒊𝒏𝒈.",
          threadID,
          messageID
        );
      }

      const processingMsg = await api.sendMessage(
        "🔄 𝑷𝒓𝒆𝒔𝒊𝒅𝒆𝒏𝒕 𝑶𝒃𝒂𝒎𝒂 𝒊𝒔 𝒄𝒐𝒎𝒑𝒐𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒕𝒘𝒆𝒆𝒕...",
        threadID,
        messageID
      );

      const cacheDir = path.join(__dirname, 'cache');
      await fs.ensureDir(cacheDir);
      
      // Download template
      const templateUrl = 'https://i.imgur.com/6fOxdex.png';
      const templatePath = path.join(cacheDir, 'obama_template.png');
      
      try {
        const { data } = await axios.get(templateUrl, { responseType: 'arraybuffer' });
        await fs.writeFile(templatePath, Buffer.from(data, 'binary'));
      } catch (error) {
        await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage(
          "❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒕𝒆𝒎𝒑𝒍𝒂𝒕𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.",
          threadID,
          messageID
        );
      }
      
      // Create canvas
      const baseImage = await loadImage(templatePath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      
      // Draw template
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Text styling
      ctx.font = "500 45px 'Helvetica Neue', Arial, sans-serif";
      ctx.fillStyle = "#14171a";
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      // Dynamic font sizing
      let fontSize = 45;
      while (ctx.measureText(text).width > 1160 && fontSize > 24) {
        fontSize -= 1;
        ctx.font = `500 ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
      }

      // Multi-line text rendering
      const wrapText = async (ctx, text, maxWidth) => {
        return new Promise(resolve => {
          if (ctx.measureText(text).width <= maxWidth) return resolve([text]);
          
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
      };

      const lines = await wrapText(ctx, text, 1160);
      const lineHeight = fontSize * 1.4;
      const startY = 165;
      
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 60, startY + (i * lineHeight));
      }

      // Add verification badge
      ctx.fillStyle = "#1da1f2";
      ctx.beginPath();
      ctx.arc(60 + ctx.measureText(lines[0]).width + 30, startY + 10, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial";
      ctx.fillText("✓", 60 + ctx.measureText(lines[0]).width + 22, startY + 15);

      // Save image
      const outputPath = path.join(cacheDir, `obama_${Date.now()}.png`);
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(outputPath, buffer);
      
      // Send result
      await api.sendMessage({
        body: "🇺🇸 𝑷𝒓𝒆𝒔𝒊𝒅𝒆𝒏𝒕𝒊𝒂𝒍 𝑻𝒘𝒆𝒆𝒕:",
        attachment: fs.createReadStream(outputPath)
      }, threadID, messageID);
      
      // Cleanup
      await fs.unlink(templatePath);
      await fs.unlink(outputPath);
      await api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("𝑶𝒃𝒂𝒎𝒂 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑬𝒓𝒓𝒐𝒓:", error);
      api.sendMessage(
        `❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒕𝒘𝒆𝒆𝒕. 𝑬𝒓𝒓𝒐𝒓: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
