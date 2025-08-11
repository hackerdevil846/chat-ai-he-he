module.exports.config = {
  name: "playstore",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑷𝒍𝒂𝒚𝒔𝒕𝒐𝒓𝒆 𝒔𝒕𝒚𝒍𝒆 𝒆𝒓 𝒖𝒔𝒆𝒓 𝒊𝒏𝒇𝒐 𝒄𝒂𝒓𝒅",
  commandCategory: "𝑼𝒔𝒆𝒓",
  usages: "",
  dependencies: {
    "axios": "",
    "fs-extra": ""
  },
  cooldowns: 0
};

module.exports.wrapText = (ctx, name, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(name).width < maxWidth) return resolve([name]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = name.split(' ');
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

module.exports.run = async function ({ args, Users, Threads, api, event, Currencies }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/playstore_card.png";
  let pathAvt = __dirname + "/cache/user_avatar.png";

  var id = Object.keys(event.mentions)[0] || event.senderID;
  var name = await Users.getNameUser(id);
  var ThreadInfo = await api.getThreadInfo(event.threadID);

  // Play Store style background
  var backgrounds = [
    "https://i.imgur.com/KDKgqvq.png"
  ];
  var rd = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  // Get user avatar
  let getAvatar = (
    await axios.get(
      `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt, Buffer.from(getAvatar, "utf-8"));

  // Get background image
  let getBackground = (
    await axios.get(`${rd}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getBackground, "utf-8"));

  let baseImage = await loadImage(pathImg);
  let userAvatar = await loadImage(pathAvt);

  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  
  // Draw background
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  
  // Draw Play Store style text
  ctx.font = "bold 36px 'Google Sans', sans-serif";
  ctx.fillStyle = "#202124";
  ctx.textAlign = "left";
  
  // Wrap and draw username
  const displayText = `𝑼𝒔𝒆𝒓: ${name}`;
  const lines = await this.wrapText(ctx, displayText, 1160);
  ctx.fillText(lines.join('\n'), 200, 150);
  
  // Draw user avatar in Play Store style frame
  ctx.beginPath();
  ctx.arc(100, 177, 35, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(userAvatar, 65, 142, 70, 70);
  
  // Add Play Store icon
  ctx.font = "bold 24px 'Material Icons'";
  ctx.fillStyle = "#4285F4";
  ctx.fillText("", 50, 50); // Play Store icon

  // Add additional info
  ctx.font = "18px 'Google Sans', sans-serif";
  ctx.fillStyle = "#5F6368";
  ctx.fillText("𝑷𝒓𝒐𝒇𝒊𝒍𝒆 𝑽𝒊𝒔𝒊𝒕𝒆𝒅", 200, 190);
  
  // Draw download button
  ctx.fillStyle = "#1A73E8";
  ctx.fillRect(200, 220, 150, 40);
  ctx.font = "bold 18px 'Google Sans', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("𝑽𝒊𝒆𝒘 𝑷𝒓𝒐𝒇𝒊𝒍𝒆", 220, 245);

  // Finalize image
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  
  // Clean up temporary files
  fs.removeSync(pathAvt);
  
  return api.sendMessage({ 
    body: `📱 𝑷𝒍𝒂𝒚𝒔𝒕𝒐𝒓𝒆 𝑺𝒕𝒚𝒍𝒆 𝑼𝒔𝒆𝒓 𝑪𝒂𝒓𝒅\n━━━━━━━━━━━━━━━━\n𝑼𝒔𝒆𝒓: ${name}\n𝑰𝑫: ${id}`,
    attachment: fs.createReadStream(pathImg) 
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
}
