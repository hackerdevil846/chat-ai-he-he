module.exports.config = {
  name: "award",
  version: "3.1.1",
  hasPermssion: 0,
  credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
  description: "𝑨𝒑𝒏𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒂𝒘𝒂𝒓𝒅",
  category: "𝑬𝒅𝒊𝒕-𝑰𝑴𝑮",
  usages: "[ 𝒏𝒂𝒎𝒆 ] | [ 𝒕𝒆𝒙𝒕 ]",
  cooldowns: 10
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

module.exports.run = async function ({ api, event, args }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const Canvas = global.nodemodule["canvas"];
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  
  let pathImg = __dirname + `/cache/award.png`;
  
  // 𝑪𝒉𝒆𝒄𝒌 𝒊𝒇 𝒖𝒔𝒆𝒓 𝒑𝒓𝒐𝒗𝒊𝒅𝒆𝒅 𝒕𝒆𝒙𝒕
  if (!args[0]) {
    return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓: 𝒏𝒂𝒎𝒆 | 𝒕𝒆𝒙𝒕", threadID, messageID);
  }
  
  const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
  
  // 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒂𝒘𝒂𝒓𝒅 𝒕𝒆𝒎𝒑𝒍𝒂𝒕𝒆
  let getImage = (
    await axios.get(encodeURI(`https://i.ibb.co/QC0hdpJ/Picsart-22-08-15-17-00-15-867.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));
  
  // 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒇𝒐𝒏𝒕 𝒊𝒇 𝒏𝒐𝒕 𝒆𝒙𝒊𝒔𝒕𝒔
  if(!fs.existsSync(__dirname+'/cache/SVN-Arial 2.ttf')) { 
    let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download`, { 
      responseType: "arraybuffer" 
    })).data;
    fs.writeFileSync(__dirname+"/cache/SVN-Arial 2.ttf", Buffer.from(getfont, "utf-8"));
  };
  
  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  
  // 𝑹𝒆𝒈𝒊𝒔𝒕𝒆𝒓 𝒇𝒐𝒏𝒕
  Canvas.registerFont(__dirname+`/cache/SVN-Arial 2.ttf`, {
    family: "SVN-Arial 2"
  });
  
  // 𝑺𝒆𝒕 𝒕𝒆𝒙𝒕 𝒔𝒕𝒚𝒍𝒆
  ctx.font = "bold 30px SVN-Arial 2";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  
  // 𝑾𝒓𝒂𝒑 𝒂𝒏𝒅 𝒅𝒓𝒂𝒘 𝒕𝒆𝒙𝒕
  const nameLine = await this.wrapText(ctx, text[0], 464);
  const textLine = await this.wrapText(ctx, text[1] || "𝑨𝒘𝒂𝒓𝒅", 464);
  
  ctx.fillText(nameLine.join("\n"), 325, 250);
  ctx.fillText(textLine.join("\n"), 325, 280);
  
  // 𝑺𝒂𝒗𝒆 𝒂𝒏𝒅 𝒔𝒆𝒏𝒅 𝒊𝒎𝒂𝒈𝒆
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  
  return api.sendMessage(
    { 
      body: "✨ 𝑨𝒑𝒏𝒂𝒓 𝒂𝒘𝒂𝒓𝒅 𝒓𝒆𝒂𝒅𝒚!",
      attachment: fs.createReadStream(pathImg) 
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
