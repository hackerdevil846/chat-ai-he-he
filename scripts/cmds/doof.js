const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "doof",
    aliases: ["doofboard", "doofcomment"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-image",
    shortDescription: {
      en: "𝐵𝑜𝑎𝑟𝑑 𝑎𝑛𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}doof [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  wrapText: async function(ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText('W').width > maxWidth) return resolve(null);
      
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
        
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID } = event;
      const text = args.join(" ");

      if (!text) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡");
      }

      const pathImg = __dirname + '/cache/doof.png';
      
      // Download the base image
      const imageResponse = await axios.get(`https://i.imgur.com/bMxrqTL.png`, { 
        responseType: 'arraybuffer' 
      });
      
      await fs.writeFile(pathImg, Buffer.from(imageResponse.data, 'utf-8'));
      
      // Load and process the image
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.font = "400 18px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";
      
      // Adjust font size to fit text
      let fontSize = 50;
      while (ctx.measureText(text).width > 1200) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial`;
      }
      
      // Wrap text and draw it
      const lines = await this.wrapText(ctx, text, 470);
      ctx.fillText(lines.join('\n'), 42, 79);
      
      // Save the processed image
      const imageBuffer = canvas.toBuffer();
      await fs.writeFile(pathImg, imageBuffer);
      
      // Send the result
      await message.reply({ 
        body: "✅ 𝐷𝑜𝑛𝑒! 𝑌𝑜𝑢𝑟 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑖𝑠 𝑟𝑒𝑎𝑑𝑦",
        attachment: fs.createReadStream(pathImg) 
      });
      
      // Clean up
      await fs.unlink(pathImg);
      
    } catch (error) {
      console.error("𝐷𝑜𝑜𝑓 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒");
    }
  }
};
