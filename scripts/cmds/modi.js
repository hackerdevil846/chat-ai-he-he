const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "modi",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Generate Modi-themed memes with custom text",
  commandCategory: "edit-img",
  usages: "[text]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  },
  envConfig: {}
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  
  if (!args[0]) {
    return api.sendMessage("🌟 Please enter your caption text!\n💡 Example: modi India will become Vishwaguru", threadID, messageID);
  }
  
  const text = args.join(" ");
  const imgURL = "https://i.ibb.co/98GsJJM/image.jpg";
  const imgPath = __dirname + "/cache/modi_meme.png";
  
  try {
    // Download base image
    const { data } = await axios.get(imgURL, { responseType: "arraybuffer" });
    await fs.ensureDir(__dirname + "/cache");
    await fs.writeFile(imgPath, Buffer.from(data, 'binary'));
    
    // Create canvas
    const baseImage = await loadImage(imgPath);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    
    // Draw background
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    
    // Text styling
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    // Font configuration
    const applyTextStyle = (size) => {
      ctx.font = `bold ${size}px "Arial"`;
      return ctx.measureText(text).width;
    };
    
    // Dynamic font sizing
    let fontSize = 28;
    while (applyTextStyle(fontSize) > 600 && fontSize > 10) {
      fontSize--;
    }
    ctx.font = `bold ${fontSize}px Arial`;
    
    // Text wrapping
    const wrapText = (text, maxWidth) => {
      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const { width } = ctx.measureText(currentLine + " " + word);
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };
    
    // Apply text to image
    const lines = wrapText(text, 600);
    const lineHeight = fontSize + 10;
    const startY = 120;
    
    // Text shadow effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Render lines
    lines.forEach((line, i) => {
      ctx.fillText(line, 48, startY + (i * lineHeight));
    });
    
    // Save final image
    const outBuffer = canvas.toBuffer("image/png");
    await fs.writeFile(imgPath, outBuffer);
    
    // Send result
    api.sendMessage({
      body: "✅ Successfully generated!\n🗳️ Here's your Modi meme:",
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath), messageID);
    
  } catch (err) {
    console.error("Modi meme error:", err);
    api.sendMessage("❌ Failed to generate meme. Please try again later.", threadID, messageID);
  }
};
