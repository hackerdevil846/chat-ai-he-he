module.exports.config = {
  name: "phub",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Asif",
  description: "Comment trên pỏnhub",
  category: "Edit-img",
  usages: "phub [text]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

// Added required onStart function
module.exports.onStart = async function({}) {
  // Initialization if needed
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
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

module.exports.run = async ({ api, event, args, __dirname }) => {
  const { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");
  const avatarPath = __dirname + '/cache/avt.png';
  const imagePath = __dirname + '/cache/phub.png';
  
  const text = args.join(" ");
  const name = (await api.getUserInfo(senderID))[senderID].name;
  const linkAvatar = (await api.getUserInfo(senderID))[senderID].thumbSrc;

  if (!text) return api.sendMessage("Post the content of the comment on ponhub", threadID, messageID);

  try {
    const getAvatar = (await axios.get(linkAvatar, { responseType: 'arraybuffer' })).data;
    const getImage = (await axios.get(`https://raw.githubusercontent.com/ProCoderMew/Module-Miraiv2/main/data/phub.png`, { responseType: 'arraybuffer' })).data;

    fs.writeFileSync(avatarPath, Buffer.from(getAvatar, 'utf-8'));
    fs.writeFileSync(imagePath, Buffer.from(getImage, 'utf-8'));

    const avatarImage = await loadImage(avatarPath);
    const baseImage = await loadImage(imagePath);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatarImage, 30, 310, 70, 70);

    ctx.font = "700 23px Arial";
    ctx.fillStyle = "#FF9900";
    ctx.textAlign = "start";
    ctx.fillText(name, 115, 350);

    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#ffff";
    ctx.textAlign = "start";

    let fontSize = 23;
    while (ctx.measureText(text).width > 1160) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial`;
    }

    const lines = await this.wrapText(ctx, text, 1160);
    ctx.fillText(lines.join('\n'), 30, 430);

    const buffer = canvas.toBuffer();
    fs.writeFileSync(imagePath, buffer);
    fs.removeSync(avatarPath);

    return api.sendMessage({ attachment: fs.createReadStream(imagePath) }, threadID, () => fs.unlinkSync(imagePath), messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("An error occurred while processing your request.", threadID, messageID);
  }
};
