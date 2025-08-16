const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

module.exports.config = {
  name: "profile",
  aliases: ["pp"],
  version: "1.2",
  author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  countDown: 10,
  role: 0,
  shortDescription: "Stylish profile picture",
  longDescription: "Get user's profile picture with stylish circular frame",
  category: "image",
  guide: {
    en: "{pn} [@tag|reply]"
  },
  dependencies: {
    "canvas": "",
    "axios": ""
  }
};

module.exports.languages = {
  "vi": {
    "noTag": "𝗩𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝘁𝗮𝗴 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗯𝗮̣𝗻 𝗺𝘂𝗼̂́𝗻 𝗹𝗮̂́𝘆 𝗮̉𝗻𝗵"
  },
  "en": {
    "noTag": "𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝘀𝗼𝗺𝗲𝗼𝗻𝗲 𝘁𝗼 𝗴𝗲𝘁 𝘁𝗵𝗲𝗶𝗿 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝘁𝘂𝗿𝗲"
  }
};

module.exports.run = async function({ api, event, args, Users, utils, getLang }) {
  try {
    let uid;
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      uid = event.senderID;
    }
    
    const userData = await Users.getData(uid);
    const name = userData.name || "User";
    const avt = userData.avatarUrl || "https://i.imgur.com/l0H2Z2y.png";
    
    // Create stylish profile image
    const canvas = createCanvas(600, 600);
    const ctx = canvas.getContext("2d");
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 600, 600);
    gradient.addColorStop(0, "#8E2DE2");
    gradient.addColorStop(1, "#4A00E0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 600);
    
    // Draw profile frame
    ctx.beginPath();
    ctx.arc(300, 250, 150, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.closePath();
    ctx.save();
    ctx.clip();
    
    // Load and draw profile picture
    try {
      const profileImage = await loadImage(avt);
      ctx.drawImage(profileImage, 150, 100, 300, 300);
    } catch (e) {
      console.error("Error loading profile image:", e);
      const defaultImg = await loadImage("https://i.imgur.com/l0H2Z2y.png");
      ctx.drawImage(defaultImg, 150, 100, 300, 300);
    }
    
    ctx.restore();
    
    // Draw decorations
    ctx.beginPath();
    ctx.arc(300, 250, 165, 0, Math.PI * 2);
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Draw user name
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 10;
    ctx.fillText(name, 300, 500);
    
    // Add watermark
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 300, 550);
    
    // Add emoji decorations
    const emojis = ["✨", "🌟", "💫", "⭐️"];
    ctx.font = "40px Segoe UI Emoji";
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * (2 * Math.PI);
      const x = 300 + Math.cos(angle) * 200;
      const y = 250 + Math.sin(angle) * 200;
      ctx.fillText(emojis[i % emojis.length], x, y);
    }
    
    // Convert to buffer and send
    const buffer = canvas.toBuffer("image/png");
    
    api.sendMessage({
      body: `🌸 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗣𝗶𝗰𝘁𝘂𝗿𝗲 𝗳𝗼𝗿 ${name}\n✨ 𝗦𝘁𝘆𝗹𝗶𝘀𝗵 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗯𝘆: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
      attachment: buffer
    }, event.threadID);
    
  } catch (err) {
    console.error(err);
    api.sendMessage(getLang("noTag"), event.threadID, event.messageID);
  }
};
