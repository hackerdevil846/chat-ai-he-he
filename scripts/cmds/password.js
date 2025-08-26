module.exports.config = {
  name: "password",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🔑 Generate stylish password images with custom text",
  category: "🖼️ Image Creation",
  usages: "[text1] | [text2]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  try {
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    
    // Get user info
    const userInfo = await api.getUserInfo(event.senderID);
    const userName = userInfo[event.senderID].name;
    
    // Parse arguments
    const text = args.join(" ")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/(\s+\|)/g, "|")
      .replace(/\|\s+/g, "|")
      .split("|");
    
    if (!text[0] || !text[1]) {
      return api.sendMessage("✨ Usage: password [text1] | [text2]\n🔑 Example: password facebook | 123456", event.threadID);
    }

    // Paths and URLs
    const bgUrl = "https://i.imgur.com/QkddlpG.png";
    const fontUrl = "https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download";
    const imgPath = __dirname + `/cache/password_${event.senderID}.png`;
    const fontPath = __dirname + "/cache/SVN-Arial_2.ttf";

    // Download resources
    const [bgResponse, fontResponse] = await Promise.all([
      axios.get(bgUrl, { responseType: "arraybuffer" }),
      axios.get(fontUrl, { responseType: "arraybuffer" })
    ]);

    // Save files
    fs.writeFileSync(imgPath, Buffer.from(bgResponse.data));
    fs.writeFileSync(fontPath, Buffer.from(fontResponse.data));

    // Create canvas
    const baseImg = await loadImage(imgPath);
    const canvas = createCanvas(baseImg.width, baseImg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

    // Register font
    const Canvas = global.nodemodule["canvas"];
    Canvas.registerFont(fontPath, { family: "PasswordFont" });

    // Text styling functions
    const applyTextStyle = (text, x, y, maxWidth) => {
      ctx.font = "bold 36px PasswordFont";
      ctx.fillStyle = "#2c3e50";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Text wrapping
      const words = text.split(' ');
      let line = '';
      let lines = [];
      let testLine;
      let metrics;
      
      for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());
      
      // Draw lines
      const lineHeight = 40;
      const startY = y - (lines.length * lineHeight) / 2;
      
      lines.forEach((l, i) => {
        ctx.fillText(l, x, startY + (i * lineHeight));
      });
    };

    // Add texts with decoration
    ctx.beginPath();
    ctx.arc(320, 115, 90, 0, Math.PI * 2, true);
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    applyTextStyle(text[0], 320, 130, 300);
    applyTextStyle(text[1], 320, 380, 300);
    
    // Add decorative elements
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(540, 200);
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add user name
    ctx.font = "20px PasswordFont";
    ctx.fillStyle = "#8e44ad";
    ctx.textAlign = "right";
    ctx.fillText(`Generated for: ${userName}`, 600, 450);

    // Save and send
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imgPath, buffer);
    
    return api.sendMessage({
      body: `🔑 Your Password Generated Successfully!\n✨ First Text: ${text[0]}\n🔐 Second Text: ${text[1]}`,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath));
    
  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Error generating password image. Please try again later.", event.threadID);
  }
};
