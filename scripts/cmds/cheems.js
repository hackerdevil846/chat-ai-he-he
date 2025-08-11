module.exports.config = {
  name: "cheems",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑶𝒉 𝒊𝒔 𝒕𝒉𝒂𝒕 𝑪𝒉𝒆𝒆𝒎",
  commandCategory: "𝑬𝒅𝒊𝒕-𝑰𝑴𝑮",
  usages: "[𝒕𝒆𝒙𝒕 𝟏] | [𝒕𝒆𝒙𝒕 𝟐] | [𝒕𝒆𝒙𝒕 𝟑] | [𝒕𝒆𝒙𝒕 𝟒]",
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

module.exports.run = async function ({ api, event, args }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const Canvas = global.nodemodule["canvas"];
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  
  let pathImg = __dirname + `/cache/cheems.png`;
  const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
  
  let getImage = (
    await axios.get(encodeURI(`https://i.imgur.com/KkM47H9.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  
  fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));
  
  if(!fs.existsSync(__dirname+'/cache/SVN-Arial 2.ttf')) { 
    let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download`, { 
      responseType: "arraybuffer" 
    })).data;
    fs.writeFileSync(__dirname+"/cache/SVN-Arial 2.ttf", Buffer.from(getfont, "utf-8"));
  };
  
  function toMathBoldItalic(text) {
    const map = {
      'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
      'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
      'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
      'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
      ' ': ' ', '!': '!', '?': '?', '.': '.', ',': ',', "'": "'", '"': '"', ':': ':', ';': ';', '-': '-', '_': '_'
    };
    return text.split('').map(char => map[char] || char).join('');
  }

  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  
  Canvas.registerFont(__dirname + `/cache/SVN-Arial 2.ttf`, {
    family: "SVN-Arial 2"
  });
  
  ctx.font = "30px SVN-Arial 2";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  
  // Convert all text segments to Mathematical Bold Italic
  const convertedText = text.map(segment => toMathBoldItalic(segment));
  
  const line = await this.wrapText(ctx, convertedText[0] || "", 464);
  const lines = await this.wrapText(ctx, convertedText[1] || "", 464);
  const lines1 = await this.wrapText(ctx, convertedText[2] || "", 464);
  const lines2 = await this.wrapText(ctx, convertedText[3] || "", 464);
  
  ctx.fillText(line.join("\n"), 330, 90);
  ctx.fillText(lines.join("\n"), 330, 240);
  ctx.fillText(lines1.join("\n"), 330, 370);
  ctx.fillText(lines2.join("\n"), 330, 500);
  
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  
  return api.sendMessage(
    { 
      body: "🐶 𝑪𝒉𝒆𝒆𝒎𝒔 𝒊𝒎𝒂𝒈𝒆 𝒑𝒓𝒐𝒔𝒕𝒖𝒕 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!",
      attachment: fs.createReadStream(pathImg) 
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
