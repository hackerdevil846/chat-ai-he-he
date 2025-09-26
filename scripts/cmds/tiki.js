const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "tiki",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🎨 𝑊𝑟𝑖𝑡𝑒 𝑡𝑒𝑥𝑡 𝑜𝑛 𝑎 𝑏𝑙𝑎𝑐𝑘𝑏𝑜𝑎𝑟𝑑"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑏𝑙𝑎𝑐𝑘𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}tiki [𝑡𝑒𝑥𝑡]"
    },
    countDown: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  wrapText: async function(ctx, text, maxWidth) {
    if (ctx.measureText(text).width < maxWidth) return [text];
    if (ctx.measureText('W').width > maxWidth) return null;

    const words = text.split(' ');
    const lines = [];
    let line = '';

    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return lines;
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const { threadID, messageID } = event;
      const pathImg = __dirname + '/cache/tiki.png';
      const text = args.join(" ");

      if (!text) {
        return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑠𝑜𝑚𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑤𝑟𝑖𝑡𝑒 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑");
      }

      // Download base image
      const imgData = (await axios.get(`https://imgur.com/nqUIi2S.png`, { 
        responseType: 'arraybuffer' 
      })).data;
      
      fs.writeFileSync(pathImg, Buffer.from(imgData));

      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw base
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Text styling
      let fontSize = 50;
      ctx.fillStyle = "#FFCC33";
      ctx.textAlign = "start";
      ctx.font = `bold ${fontSize}px Gabriele`;

      // Reduce font size if text too long
      while (ctx.measureText(text).width > 2600 && fontSize > 10) {
        fontSize--;
        ctx.font = `bold ${fontSize}px Gabriele, sans-serif`;
      }

      // Wrap text within 900px width
      const lines = await this.wrapText(ctx, text, 900) || [text];

      // Render text beautifully with line spacing
      lines.forEach((line, i) => {
        ctx.fillText(line, 625, 430 + i * (fontSize + 10));
      });

      // Output image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("Tiki Error:", error);
      try { 
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); 
      } catch (cleanupError) {}
      
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
