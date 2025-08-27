const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "trump",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒌𝒐𝒓𝒂𝒏 ( ͡° ͜ʖ ͡°)",
    category: "edit-img",
    usages: "trump [text]",
    cooldowns: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    },
    // Adding shortDescription, longDescription, and guide for better bot integration
    shortDescription: {
      en: "Generate a Trump tweet image with your custom text."
    },
    longDescription: {
      en: "This command takes your input text and generates an image of a Trump tweet using that text. Perfect for memes and jokes!"
    },
    guide: {
      en: "{p}trump [your text here]"
    }
  },

  wrapText: function(ctx, text, maxWidth) {
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
          if (split) words[1] = `${temp.slice(-1)}${words[1] || ''}`;
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
      return resolve(lines);
    });
  },

  onStart: async function({ message, event, args }) { // Added 'message' parameter
    let { senderID, threadID, messageID } = event;
    let pathImg = __dirname + '/cache/trump.png';
    let text = args.join(" ");
    if (!text) return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒇𝒐𝒓 𝑻𝒓𝒖𝒎𝒑'𝒔 𝒕𝒘𝒆𝒆𝒕 📝"); // Changed api.sendMessage to message.reply
    try {
      const imageData = (await axios.get(`https://i.imgur.com/ZtWfHHx.png`, { responseType: 'arraybuffer' })).data;
      await fs.writeFile(pathImg, Buffer.from(imageData, 'utf-8')); // Used await for fs.writeFile
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      let fontSize = 250;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";
      do {
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
        fontSize--;
      } while (ctx.measureText(text).width > 2600 && fontSize > 0);
      const lines = await this.wrapText(ctx, text, 1160);
      let y = 165;
      for (const line of lines) {
        ctx.fillText(line, 60, y);
        y += 55;
      }
      const imageBuffer = canvas.toBuffer();
      await fs.writeFile(pathImg, imageBuffer); // Used await for fs.writeFile
      
      await message.reply( // Changed api.sendMessage to message.reply
        { body: "✅ 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝑻𝒓𝒖𝒎𝒑 𝒎𝒆𝒔𝒔𝒂𝒈𝒆! 🇺🇸", attachment: fs.createReadStream(pathImg) }
      );
      // Removed the callback function from message.reply as it's not needed here and can cause issues with async/await structure.
      // The unlinkSync will happen after the message is sent.
      fs.unlinkSync(pathImg);

    } catch (err) {
      console.error("Error in trump command:", err); // Added specific error logging
      await message.reply("❌ 𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏!"); // Changed api.sendMessage to message.reply
    }
  }
};
