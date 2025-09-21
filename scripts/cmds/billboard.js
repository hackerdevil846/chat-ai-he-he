const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "billboard",
    aliases: ["billb", "adboard"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "🌟 𝐵𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑 𝑡𝑒𝑥𝑡 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑏𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡 𝑎𝑛𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    guide: {
      en: "{p}billboard [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  wrapText: async function (ctx, text, maxWidth) {
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
        if (split) {
          words[1] = `${temp.slice(-1)}${words[1]}`;
        } else {
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
    return lines;
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const text = args.join(" ");
      if (!text) {
        return message.reply("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡!");
      }

      const avatarPath = __dirname + '/cache/avt.png';
      const outputPath = __dirname + '/cache/billboard_result.png';
      
      // Get user info
      const userInfo = await api.getUserInfo(event.senderID);
      const { name, thumbSrc } = userInfo[event.senderID];
      
      // Download images
      const [avatarBuffer, billboardBuffer] = await Promise.all([
        axios.get(thumbSrc, { responseType: 'arraybuffer' }),
        axios.get("https://imgur.com/uN7Sllp.png", { responseType: 'arraybuffer' })
      ]);

      await Promise.all([
        fs.writeFile(avatarPath, Buffer.from(avatarBuffer.data, 'utf-8')),
        fs.writeFile(outputPath, Buffer.from(billboardBuffer.data, 'utf-8'))
      ]);

      // Process images
      const canvas = createCanvas(700, 350);
      const ctx = canvas.getContext("2d");
      const [baseImage, avatarImage] = await Promise.all([
        loadImage(outputPath),
        loadImage(avatarPath)
      ]);
      
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(avatarImage, 148, 75, 110, 110);

      // Add text
      ctx.font = "800 23px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(name, 280, 110);

      ctx.font = "400 20px Arial";
      ctx.fillStyle = "#000000";
      
      const lines = await this.wrapText(ctx, text, 250);
      if (lines) {
        lines.forEach((line, i) => {
          ctx.fillText(line, 280, 145 + (i * 25));
        });
      }

      // Save and send
      const resultBuffer = canvas.toBuffer();
      await fs.writeFile(outputPath, resultBuffer);
      await fs.remove(avatarPath);

      await message.reply({
        body: "🎊 𝐵𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
        attachment: fs.createReadStream(outputPath)
      });

      await fs.remove(outputPath);

    } catch (error) {
      console.error("𝐵𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑏𝑖𝑙𝑙𝑏𝑜𝑎𝑟𝑑 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛");
    }
  }
};
