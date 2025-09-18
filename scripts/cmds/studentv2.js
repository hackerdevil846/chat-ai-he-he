const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "studentv2",
    aliases: ["student2", "board2"],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🎓 𝐵𝑜𝑎𝑟𝑑 𝑎𝑛𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑚𝑒𝑚𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑠𝑡𝑢𝑑𝑒𝑛𝑡 𝑏𝑜𝑎𝑟𝑑 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}studentv2 [𝑡𝑒𝑥𝑡]"
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
      const { threadID, messageID, senderID } = event;
      const pathImg = __dirname + '/cache/studentv2_' + senderID + '.png';
      const text = args.join(" ");

      if (!text) {
        return message.reply("🎓 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑝𝑢𝑡 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑!\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: .𝑠𝑡𝑢𝑑𝑒𝑛𝑡𝑣2 𝐻𝑒𝑙𝑙𝑜 𝑊𝑜𝑟𝑙𝑑");
      }

      // Load default image
      const imageResponse = await axios.get('https://i.ibb.co/FK8DTp1/Picsart-22-08-14-02-13-31-581.jpg', {
        responseType: 'arraybuffer'
      });
      
      await fs.writeFile(pathImg, Buffer.from(imageResponse.data, 'utf-8'));

      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Text settings
      let fontSize = 45;
      ctx.font = `400 ${fontSize}px Arial`;
      ctx.rotate(-3 * Math.PI / 180);
      ctx.fillStyle = "black";
      ctx.textAlign = "start";

      while (ctx.measureText(text).width > 2250) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
      }

      const lines = await this.wrapText(ctx, text, 440);
      ctx.fillText(lines.join('\n'), 90, 500);

      const imageBuffer = canvas.toBuffer();
      await fs.writeFile(pathImg, imageBuffer);

      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
      }

    } catch (error) {
      console.error("StudentV2 Error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
