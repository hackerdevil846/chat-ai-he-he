const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "studentv3",
    aliases: ["board3", "chalkboard3"],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "📝 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑐ℎ𝑎𝑙𝑘𝑏𝑜𝑎𝑟𝑑 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑐ℎ𝑎𝑙𝑘𝑏𝑜𝑎𝑟𝑑-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}studentv3 [𝑡𝑒𝑥𝑡]"
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
      const text = args.join(" ");
      let pathImg = __dirname + '/cache/studentv3.png';

      if (!text) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑠𝑜𝑚𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑.");
      }

      // Download background image
      const getImage = (await axios.get(
        `https://i.ibb.co/64jTRkM/Picsart-22-08-14-10-22-50-196.jpg`, 
        { responseType: 'arraybuffer' }
      )).data;
      fs.writeFileSync(pathImg, Buffer.from(getImage, 'utf-8'));

      // Load and draw canvas
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Font settings
      let fontSize = 45;
      ctx.fillStyle = "black";
      ctx.textAlign = "start";
      ctx.font = `400 ${fontSize}px Arial`;

      // Auto adjust font size
      while (ctx.measureText(text).width > 2250) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
      }

      // Wrap text
      const lines = await this.wrapText(ctx, text, 320);
      let startY = 500;
      lines.forEach(line => {
        ctx.fillText(line, 150, startY);
        startY += fontSize + 10;
      });

      // Save and send
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      
      await message.reply({
        body: `✨ 𝐵𝑜𝑎𝑟𝑑 𝑟𝑒𝑎𝑑𝑦!`,
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);

    } catch (err) {
      console.error(err);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒.");
    }
  }
};
