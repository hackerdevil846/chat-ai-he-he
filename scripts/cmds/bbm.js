module.exports.config = {
  name: "bbm",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎭 𝑫𝒓𝒂𝒌𝒆 𝒎𝒆𝒎𝒆 𝒄𝒓𝒆𝒂𝒕𝒐𝒓",
  commandCategory: "🖼️ 𝒎𝒆𝒎𝒆𝒔",
  usages: "𝒕𝒆𝒙𝒕 1 | 𝒕𝒆𝒙𝒕 2",
  cooldowns: 1
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise((resolve) => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText("W").width > maxWidth) return resolve(null);
    const words = text.split(" ");
    const lines = [];
    let line = "";
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
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
        line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const Canvas = global.nodemodule["canvas"];
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  
  // Check valid input
  if (!args.join(" ").includes("|")) {
    return api.sendMessage(
      `🎭 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒇𝒐𝒓𝒎𝒂𝒕! 𝑼𝒔𝒆:\n${global.config.PREFIX}${this.config.name} 𝒕𝒆𝒙𝒕 1 | 𝒕𝒆𝒙𝒕 2\n\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: ${global.config.PREFIX}${this.config.name} 𝑰'𝒎 𝒄𝒐𝒅𝒊𝒏𝒈 | 𝑰'𝒎 𝒅𝒆𝒃𝒖𝒈𝒈𝒊𝒏𝒈`,
      threadID,
      messageID
    );
  }

  let pathImg = __dirname + `/cache/drake_${event.senderID}.png`;
  const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
  
  // Download meme template
  let getImage = (
    await axios.get(encodeURI(`https://i.imgur.com/qmXfxUx.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));
  
  // Download font if missing
  if (!fs.existsSync(__dirname + '/cache/SVN-Arial 2.ttf')) { 
    let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download`, {
      responseType: "arraybuffer"
    })).data;
    fs.writeFileSync(__dirname + "/cache/SVN-Arial 2.ttf", Buffer.from(getfont, "utf-8"));
  };
  
  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  
  // Register custom font
  Canvas.registerFont(__dirname + `/cache/SVN-Arial 2.ttf`, {
    family: "SVN-Arial 2"
  });
  
  // Style text
  ctx.font = "bold 30px SVN-Arial 2";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Format text
  const line = await this.wrapText(ctx, text[0], 464);
  const lines = await this.wrapText(ctx, text[1], 464);
  
  // Position text
  ctx.fillText(line.join("\n"), 464, 129);
  ctx.fillText(lines.join("\n"), 464, 339);
  ctx.beginPath();
  
  // Save image
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  
  // Send result with beautiful formatting
  return api.sendMessage(
    {
      body: `🎭 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝑫𝒓𝒂𝒌𝒆 𝒎𝒆𝒎𝒆:\n\n"${text[0]}"\n🆚\n"${text[1]}"\n\n✨ 𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚 ${global.config.BOTNAME} 𝒃𝒐𝒕`,
      attachment: fs.createReadStream(pathImg)
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
