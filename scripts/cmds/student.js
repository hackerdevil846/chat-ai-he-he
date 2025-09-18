const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "student",
    aliases: ["studentboard", "board"],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🎓 𝐵𝑜𝑎𝑟𝑑 𝑒 𝑠𝑡𝑢𝑑𝑒𝑛𝑡𝑒𝑟 𝑚𝑒𝑟𝑎 𝑘𝑜𝑚𝑒𝑛𝑡 𝑘𝑜𝑟𝑎"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑠𝑡𝑢𝑑𝑒𝑛𝑡 𝑏𝑜𝑎𝑟𝑑 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}student [𝑡𝑒𝑥𝑡]"
    },
    countDown: 5,
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

      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = '';
      }

      if (words.length === 0 && line) lines.push(line.trim());
    }

    return lines;
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      const pathImg = __dirname + '/cache/student.png';
      const text = args.join(" ");

      if (!text) {
        return message.reply("🎓 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑");
      }

      // Download base image
      const response = await axios.get("https://i.ibb.co/yf4yCVh/Picsart-22-08-14-01-57-26-461.jpg", {
        responseType: "arraybuffer"
      });
      
      await fs.writeFile(pathImg, Buffer.from(response.data, "utf-8"));

      // Load canvas
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw image
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Text settings
      let fontSize = 45;
      ctx.font = `400 ${fontSize}px Arial`;
      ctx.rotate(-11 * Math.PI / 180);
      ctx.fillStyle = "black";
      ctx.textAlign = "start";

      // Adjust font size to fit
      while (ctx.measureText(text).width > 2250) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
      }

      const lines = await this.wrapText(ctx, text, 420);
      ctx.fillText(lines.join('\n'), 50, 580);

      // Save final image
      const imageBuffer = canvas.toBuffer();
      await fs.writeFile(pathImg, imageBuffer);

      // Send the image
      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
      }

    } catch (error) {
      console.error("Student board error:", error);
      message.reply("⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
