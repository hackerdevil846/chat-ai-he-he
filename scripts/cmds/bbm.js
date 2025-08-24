const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");

module.exports.config = {
  name: "bbm",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎭 𝑫𝒓𝒂𝒌𝒆 𝒎𝒆𝒎𝒆 𝒄𝒓𝒆𝒂𝒕𝒐𝒓",
  category: "🖼️ 𝒎𝒆𝒎𝒆𝒔",
  usages: "𝒕𝒆𝒙𝒕 1 | 𝒕𝒆𝒙𝒕 2",
  cooldowns: 1,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.wrapText = async function (ctx, text, maxWidth) {
  if (ctx.measureText(text).width < maxWidth) return [text];
  if (ctx.measureText("W").width > maxWidth) return null;

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
    if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
    else {
      lines.push(line.trim());
      line = "";
    }
    if (words.length === 0) lines.push(line.trim());
  }

  return lines;
};

module.exports.onStart = async function ({ api, event, args }) {
  const { senderID, threadID, messageID } = event;
  const pathImg = __dirname + `/cache/drake_${senderID}.png`;

  // Validate input
  if (!args.join(" ").includes("|")) {
    return api.sendMessage(
      `🎭 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒇𝒐𝒓𝒎𝒂𝒕!\n𝑼𝒔𝒆:\n${global.config.PREFIX}${this.config.name} 𝒕𝒆𝒙𝒕 1 | 𝒕𝒆𝒙𝒕 2\n\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆:\n${global.config.PREFIX}${this.config.name} 𝑰'𝒎 𝒄𝒐𝒅𝒊𝒏𝒈 | 𝑰'𝒎 𝒅𝒆𝒃𝒖𝒈𝒈𝒊𝒏𝒈`,
      threadID,
      messageID
    );
  }

  const text = args.join(" ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|");

  // Download Drake meme template
  const getImage = (await axios.get("https://i.imgur.com/qmXfxUx.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

  // Download font if missing
  const fontPath = __dirname + "/cache/SVN-Arial 2.ttf";
  if (!fs.existsSync(fontPath)) {
    const getFont = (await axios.get(
      "https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download",
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(fontPath, Buffer.from(getFont, "utf-8"));
  }

  const baseImage = await Canvas.loadImage(pathImg);
  const canvas = Canvas.createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  // Register custom font
  Canvas.registerFont(fontPath, { family: "SVN-Arial 2" });

  // Style text
  ctx.font = "bold 30px SVN-Arial 2";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Wrap text
  const line1 = await this.wrapText(ctx, text[0], 464);
  const line2 = await this.wrapText(ctx, text[1], 464);

  // Draw text
  ctx.fillText(line1.join("\n"), 464, 129);
  ctx.fillText(line2.join("\n"), 464, 339);

  // Save final image
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);

  // Send result
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
