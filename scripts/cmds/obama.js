const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "obamatweet",
    aliases: ["obamatw", "presidentialtweet"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "image",
    shortDescription: {
      en: "🇺🇸 𝐶𝑟𝑒𝑎𝑡𝑒 𝑝𝑟𝑒𝑠𝑖𝑑𝑒𝑛𝑡𝑖𝑎𝑙 𝑂𝑏𝑎𝑚𝑎-𝑠𝑡𝑦𝑙𝑒 𝑡𝑤𝑒𝑒𝑡 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
      en: "🇺🇸 𝐶𝑟𝑒𝑎𝑡𝑒 𝑝𝑟𝑒𝑠𝑖𝑑𝑒𝑛𝑡𝑖𝑎𝑙 𝑂𝑏𝑎𝑚𝑎-𝑠𝑡𝑦𝑙𝑒 𝑡𝑤𝑒𝑒𝑡 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}obamatweet [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
      "axios": "",
      "jimp": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID } = event;

      if (args.length === 0) {
        return message.reply(
          "🇺🇸 𝑂𝑏𝑎𝑚𝑎 𝑇𝑤𝑒𝑒𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑟𝑒𝑎𝑑𝑦! 𝑇𝑦𝑝𝑒 '{p}obamatweet [𝑡𝑒𝑥𝑡]' 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑦𝑜𝑢𝑟 𝑝𝑟𝑒𝑠𝑖𝑑𝑒𝑛𝑡𝑖𝑎𝑙 𝑡𝑤𝑒𝑒𝑡"
        );
      }

      const text = args.join(" ");
      if (!text.trim()) {
        return message.reply(
          "✍️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑂𝑏𝑎𝑚𝑎'𝑠 𝑡𝑤𝑒𝑒𝑡\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}obamatweet 𝑌𝑒𝑠 𝑤𝑒 𝑐𝑎𝑛! 𝐶ℎ𝑎𝑛𝑔𝑒 𝑖𝑠 𝑐𝑜𝑚𝑖𝑛𝑔."
        );
      }

      const processingMsg = await message.reply(
        "🔄 𝑃𝑟𝑒𝑠𝑖𝑑𝑒𝑛𝑡 𝑂𝑏𝑎𝑚𝑎 𝑖𝑠 𝑐𝑜𝑚𝑝𝑜𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑡𝑤𝑒𝑒𝑡..."
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
        await message.unsendMessage(processingMsg.messageID);
        return message.reply(
          "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
        );
      }
      
      // Load template image
      const image = await jimp.read(templatePath);
      const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

      // Simple text wrapping function
      function wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = jimp.measureText(font, currentLine + " " + word);
          if (width < maxWidth) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      }

      // Add text to image
      const lines = wrapText(text, 1160);
      const startY = 165;
      const lineHeight = 40;
      
      lines.forEach((line, index) => {
        const textWidth = jimp.measureText(font, line);
        image.print(font, 60, startY + (index * lineHeight), line);
      });

      // Save the modified image
      const outputPath = path.join(cacheDir, `obama_${Date.now()}.png`);
      await image.writeAsync(outputPath);
      
      // Send result
      await message.reply({
        body: "🇺🇸 𝑃𝑟𝑒𝑠𝑖𝑑𝑒𝑛𝑡𝑖𝑎𝑙 𝑇𝑤𝑒𝑒𝑡:",
        attachment: fs.createReadStream(outputPath)
      });
      
      // Cleanup
      await fs.unlink(templatePath);
      await fs.unlink(outputPath);
      await message.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("𝑂𝑏𝑎𝑚𝑎 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      // Don't send error message to avoid spam
    }
  }
};
