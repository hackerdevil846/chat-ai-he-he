module.exports.config = {
  name: "mbbank",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "💰 𝑴𝒃𝒃𝒂𝒏𝒌 𝒆-𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓",
  category: "edit-img",
  usages: "[text]",
  cooldowns: 1,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.onStart = async function({ api, event, args }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  
  let pathImg = __dirname + '/cache/mbbank.png';
  let text = args.join(" ");
  const { threadID, messageID } = event;
  
  if (!text) return api.sendMessage("💸 | 𝑴𝒃𝒃𝒂𝒏𝒌 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒍𝒊𝒌𝒉𝒂 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏!", threadID, messageID);
  
  try {
    // Download template image
    const imgResponse = await axios.get(`https://i.imgur.com/VhBb8SR.png`, {
      responseType: 'arraybuffer'
    });
    fs.writeFileSync(pathImg, Buffer.from(imgResponse.data, 'utf-8'));

    // Process image
    const wrapText = (ctx, text, maxWidth) => {
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
          if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
            line += `${words.shift()} `;
          } else {
            lines.push(line.trim());
            line = '';
          }
          if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
      });
    };

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 100px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "start";
    
    // Auto-adjust font size
    let fontSize = 100;
    while (ctx.measureText(text).width > 1200) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial`;
    }
    
    // Render wrapped text
    const lines = await wrapText(ctx, text, 470);
    ctx.fillText(lines.join('\n'), 840, 540);
    
    // Save and send
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    
    return api.sendMessage({ 
      body: "✅ | 𝑴𝒃𝒃𝒂𝒏𝒌 𝒆-𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒓𝒆𝒂𝒅𝒚! 💰",
      attachment: fs.createReadStream(pathImg) 
    }, threadID, () => fs.unlinkSync(pathImg), messageID);
    
  } catch (error) {
    console.error("🚫 | 𝑬𝒓𝒓𝒐𝒓:", error);
    return api.sendMessage("😢 | 𝑪𝒐𝒎𝒎𝒆𝒏𝒕 𝒃𝒂𝒏𝒂𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏!", threadID, messageID);
  }
};
