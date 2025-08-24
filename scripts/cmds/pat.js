module.exports.config = {
  name: "pat",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝐏𝐚𝐭 𝐤𝐚𝐫𝐮𝐧 𝐞𝐤𝐣𝐨𝐧 𝐛𝐚𝐧𝐝𝐡𝐮𝐤𝐞 ❤️",
  category: "anime",
  usages: "𝐩𝐚𝐭 [𝐓𝐚𝐠 𝐤𝐚𝐫𝐮𝐧 𝐭𝐮𝐦𝐢 𝐲𝐚𝐫 𝐩𝐚𝐭 𝐤𝐚𝐫𝐭𝐞 𝐜𝐚𝐨]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "canvas": "",
    "discord-image-generation": "1.0.8",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args, Users }) {
  try {
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    const path = require("path");
    const Discord = require("discord-image-generation");
    
    const targetID = Object.keys(event.mentions)[0];
    if (!targetID) return api.sendMessage("🌸 | 𝐃𝐚𝐲𝐚 𝐤𝐨𝐫𝐞 𝐤𝐚𝐫𝐮𝐧 𝐞𝐤𝐣𝐨𝐧𝐤𝐞 𝐭𝐚𝐠 𝐤𝐚𝐫𝐮𝐧! 😢", event.threadID, event.messageID);

    const name = (await Users.getData(targetID)).name;
    const patUrl = "https://api.satou-chan.xyz/api/endpoint/pat";
    
    // Create canvas-based image
    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarImg = await loadImage(avatarUrl);
    const patImg = await loadImage("https://i.imgur.com/fm49srQ.gif"); // Sample pat image
    
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext("2d");
    
    // Draw background
    ctx.fillStyle = "#FFECF6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw user avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 200, 80, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, 70, 120, 160, 160);
    ctx.restore();
    
    // Draw pat hand
    ctx.drawImage(patImg, 250, 100, 300, 300);
    
    // Add text
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "#E91E63";
    ctx.textAlign = "center";
    ctx.fillText(`${name} got patted! 💖`, 300, 50);
    
    ctx.font = "20px Arial";
    ctx.fillStyle = "#9C27B0";
    ctx.fillText("𝐀𝐫𝐞 𝐚𝐫𝐞 𝐛𝐡𝐚𝐥𝐨 𝐚𝐜𝐡𝐨! 🌸", 300, 350);
    
    // Save image
    const imagePath = path.join(__dirname, 'cache', `pat_${event.senderID}.png`);
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    out.on('finish', async () => {
      // Send the canvas image
      api.sendMessage({
        body: `💕 | ${name}, 𝐭𝐮𝐦𝐢 𝐞𝐤𝐭𝐚 𝐩𝐚𝐭 𝐩𝐚𝐢𝐜𝐡𝐨! 😊\n╭─────────────────╮\n│   ✨ 𝐏𝐚𝐭𝐞𝐝 𝐛𝐲: ${(await Users.getData(event.senderID)).name}   │\n╰─────────────────╯`,
        attachment: fs.createReadStream(imagePath),
        mentions: [{
          tag: name,
          id: targetID
        }]
      }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
    });
    
  } catch (error) {
    console.error(error);
    api.sendMessage("🌸 | 𝐀𝐫𝐞 𝐛𝐚𝐛𝐚! 𝐆𝐢𝐟 𝐭𝐨𝐢𝐫𝐢 𝐤𝐚𝐫𝐭𝐞 𝐩𝐚𝐫𝐜𝐡𝐢 𝐧𝐚, 𝐞𝐤𝐣𝐨𝐧𝐤𝐞 𝐭𝐚𝐠 𝐤𝐚𝐫𝐞𝐧 𝐧𝐢𝐬𝐜𝐢𝐭𝐚 𝐤𝐨𝐫𝐮𝐧! 😢", event.threadID);
  }
};
