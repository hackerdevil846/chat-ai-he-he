module.exports.config = {
  name: "tiki",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝘽𝙤𝙧𝙙𝙚 𝙠𝙖𝙟 𝙡𝙞𝙠𝙝𝙤 \_(ツ)_/¯",
  commandCategory: "𝙎𝙮𝙨𝙩𝙚𝙢",
  usages: "tiki [𝙩𝙚𝙭𝙩]",
  cooldowns: 10,
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

module.exports.run = async function({ api, event, args }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const { threadID, messageID } = event;
  const pathImg = __dirname + '/cache/tiki.png';
  const text = args.join(" ");

  if (!text) {
    return api.sendMessage("𝙆𝙞𝙘𝙝𝙪 𝙡𝙞𝙠𝙝𝙚𝙣 𝙣𝙖", threadID, messageID);
  }

  try {
    const imgData = (await axios.get(`https://imgur.com/nqUIi2S.png`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathImg, Buffer.from(imgData));

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw base
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Text styling
    ctx.font = "200 50px Gabriele";
    ctx.fillStyle = "#FFCC33";
    ctx.textAlign = "start";

    // Dynamic font sizing to fit very long strings
    let fontSize = 45;
    while (ctx.measureText(text).width > 2600 && fontSize > 5) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Gabriele, sans-serif`;
    }

    // Wrap text within 900px
    const lines = await module.exports.wrapText(ctx, text, 900) || [text];

    // Render text
    ctx.fillText(lines.join('\n'), 625, 430);

    // Output
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );
  } catch (e) {
    // Ensure cache file is cleaned up if created
    try { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); } catch {}
    return api.sendMessage("বস, কিছু একটা সমস্যা হয়েছে। একটু পর ট্রাই করেন।", threadID, messageID);
  }
};
```
