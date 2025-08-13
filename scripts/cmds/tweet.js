module.exports.config = {
  name: "tweet",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑻𝒘𝒊𝒕𝒕𝒆𝒓 𝒆 𝒕𝒖𝒊 𝒕𝒖𝒊 𝒍𝒊𝒌𝒉𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒆𝒌𝒕𝒊 𝒊𝒎𝒂𝒈𝒆 𝒃𝒂𝒏𝒂𝒏𝒐",
  commandCategory: "edit-img",
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
}

module.exports.run = async function({ api, event, args }) {
  let { threadID, messageID } = event;
  const { loadImage, createCanvas } = global.nodemodule["canvas"];
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  try {
    fs.ensureDirSync(__dirname + '/cache');
    let pathImg = __dirname + '/cache/tweet.png';
    var text = args.join(" ");

    if (!text) return api.sendMessage("𝑨𝒑𝒏𝒊 𝒌𝒊 𝒍𝒊𝒌𝒉𝒕𝒆 𝒄𝒉𝒂𝒏? 𝑺𝒐𝒎𝒆 𝒕𝒆𝒙𝒕 𝒕𝒐 𝒅𝒂𝒐 𝒋𝒐𝒌𝒉𝒐𝒏", threadID, messageID);

    let getPorn = (await axios.get(`https://imgur.com/FcbMto5.jpeg`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));

    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    ctx.font = "600 70px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    let fontSize = 70;
    while (ctx.measureText(text).width > 2600) {
      fontSize--;
      ctx.font = `350 ${fontSize}px Arial, sans-serif`;
    }

    const lines = await module.exports.wrapText(ctx, text, 1160);
    const lineHeight = fontSize + 15;

    if (lines && lines.length) {
      lines.forEach((line, i) => {
        ctx.fillText(line, 200, 400 + i * lineHeight);
      });
    } else {
      ctx.fillText(text, 200, 400);
    }

    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage({
      body: "𝑵𝒊𝒋𝒆𝒓 𝑻𝒘𝒆𝒆𝒕 𝑻𝒊 𝒓𝒆𝒂𝒅𝒚 𝒌𝒐𝒓𝒆 𝒅𝒊𝒍𝒂𝒎 😘",
      attachment: fs.createReadStream(pathImg)
    }, threadID, () => fs.unlinkSync(pathImg), messageID);

  } catch (e) {
    return api.sendMessage("কিছু একটা সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", threadID, messageID);
  }
}
```
