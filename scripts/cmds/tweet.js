module.exports.config = {
  name: "tweet",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🐦 𝑻𝒘𝒊𝒕𝒕𝒆𝒓 𝒔𝒕𝒚𝒍𝒆 𝒕𝒆𝒙𝒕 𝒄𝒓𝒆𝒂𝒕𝒐𝒓 𝒘𝒊𝒕𝒉 𝒊𝒎𝒂𝒈𝒆 🖼️",
  category: "edit-img",
  usages: "[text]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
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
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.onStart = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");

  try {
    // Ensure cache directory exists
    const pathImg = `${__dirname}/cache/tweet.png`;
    fs.ensureDirSync(`${__dirname}/cache`);
    
    const text = args.join(" ");
    if (!text) return api.sendMessage("❓ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒕𝒆𝒙𝒕 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒕𝒘𝒆𝒆𝒕", threadID, messageID);

    // Download template image
    const imageResponse = await axios.get("https://imgur.com/FcbMto5.jpeg", {
      responseType: "arraybuffer"
    });
    fs.writeFileSync(pathImg, Buffer.from(imageResponse.data, "utf-8"));

    // Process image
    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Configure text styling
    ctx.font = "600 70px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    // Adjust font size to fit
    let fontSize = 70;
    while (ctx.measureText(text).width > 2600) {
      fontSize--;
      ctx.font = `350 ${fontSize}px Arial, sans-serif`;
    }

    // Wrap and draw text
    const lines = await this.wrapText(ctx, text, 1160);
    const lineHeight = fontSize + 15;
    
    if (lines && lines.length) {
      lines.forEach((line, index) => {
        ctx.fillText(line, 200, 400 + index * lineHeight);
      });
    } else {
      ctx.fillText(text, 200, 400);
    }

    // Save and send result
    const outputBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, outputBuffer);

    return api.sendMessage({
      body: "✅ 𝑻𝒘𝒆𝒆𝒕 𝒄𝒓𝒆𝒂𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚! 🐦",
      attachment: fs.createReadStream(pathImg)
    }, threadID, () => fs.unlinkSync(pathImg), messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆", threadID, messageID);
  }
};
