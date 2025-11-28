const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const moment = require("moment-timezone");

// 1. Font Loading (Safe Mode) - Tries to load fonts, ignores if missing
const fontFiles = [
  { path: path.join(__dirname, 'fonts', 'ArialBlack.ttf'), family: 'Arial Black' },
  { path: path.join(__dirname, 'fonts', 'Montserrat-Bold.ttf'), family: 'Montserrat' }
];

fontFiles.forEach(font => {
  try {
    if (fs.existsSync(font.path)) {
      registerFont(font.path, { family: font.family });
    }
  } catch (e) {
    // Silently fall back to system fonts if custom ones aren't found
  }
});

module.exports = {
  config: {
    name: "pfp",
    aliases: [],
    version: "5.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "✨ 3D Neon Profile Card"
    },
    longDescription: {
      en: "Generates a 3D-render style neon profile card with volumetric lighting and HUD effects."
    },
    guide: {
      en: "{p}pfp [@mention | UID]"
    },
    countDown: 5,
    dependencies: {
      "canvas": "",
      "fs-extra": "",
      "axios": "",
      "moment-timezone": ""
    }
  },

  onLoad: async function() {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
  },

  onStart: async function({ api, event, args, message, usersData }) {
    const { senderID, mentions, type, messageReply } = event;
    const cacheDir = path.join(__dirname, "cache");
    
    // Unique filenames to prevent conflicts
    const timestamp = Date.now();
    const avatarPath = path.join(cacheDir, `avatar_${timestamp}.jpg`);
    const cardPath = path.join(cacheDir, `card_${timestamp}.png`);

    try {
      // --- 1. IDENTIFY TARGET USER ---
      let targetID = senderID;
      if (type === "message_reply") {
        targetID = messageReply.senderID;
      } else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
      } else if (args.length > 0) {
        const input = args.join("");
        if (!isNaN(input)) targetID = input;
      }

      // --- 2. SEND LOADING STATUS ---
      const processingMsg = await message.reply("🔮 | 𝑅𝑒𝑛𝑑𝑒𝑟𝑖𝑛𝑔 3𝐷 𝑃𝑟𝑜𝑓𝑖𝑙𝑒...");

      // --- 3. FETCH USER DATA ---
      const userInfo = await api.getUserInfo(targetID);
      const user = userInfo[targetID];

      // Safe Data Handling
      const name = user.name || "User";
      
      // Gender Map (Facebook API Standard: 1=Female, 2=Male)
      const genderMap = { 
        1: "♀️ Female", 
        2: "♂️ Male" 
      };
      const gender = genderMap[user.gender] || "⚧️ Not Specified";

      // Followers Logic (API + DB Fallback)
      let followersCount = user.subscribers?.total_count || user.follow || 0;
      
      // If API returns 0, try checking the bot's database
      if (followersCount === 0 && usersData) {
        try {
            const dbData = await usersData.getData(targetID);
            if (dbData && dbData.followers) {
                followersCount = dbData.followers;
            }
        } catch(e) {}
      }
      const followersDisplay = followersCount > 0 ? followersCount.toLocaleString() : "🔒 Hidden";

      // Join Date Logic
      let joinDate = "Recently";
      if (usersData) {
        try {
            const dbData = await usersData.getData(targetID);
            if (dbData && dbData.createdAt) {
                joinDate = moment(dbData.createdAt).format("DD MMM YYYY");
            }
        } catch(e) {}
      }

      // --- 4. DOWNLOAD AVATAR ---
      // Using the specific access token URL to get high-res image
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const imageResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(avatarPath, Buffer.from(imageResponse.data));

      // --- 5. CANVAS RENDER ENGINE ---
      const width = 1000;
      const height = 600;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // --- LAYER A: BACKGROUND & VOLUMETRIC LIGHTING ---
      ctx.fillStyle = "#050505"; // Deep black background
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Render Light Rays (The 3D Backlight Effect)
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        // Create rays radiating from center
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 800, (i * 30) * Math.PI / 180, (i * 30 + 15) * Math.PI / 180);
        ctx.lineTo(0, 0);
        
        // Gradient for depth (Green/Blue mix)
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 600);
        grad.addColorStop(0, "rgba(0, 255, 136, 0.0)"); // Transparent core
        grad.addColorStop(0.5, "rgba(0, 204, 255, 0.15)"); // Glowing mid-section
        grad.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fade out
        
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // --- LAYER B: THE GLASS CARD ---
      const cardW = 850;
      const cardH = 450;
      const cardX = (width - cardW) / 2;
      const cardY = (height - cardH) / 2;
      const radius = 40;

      ctx.save();
      // Draw Card Shape
      ctx.beginPath();
      // Custom rounded rect implementation for compatibility
      if (ctx.roundRect) {
        ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      } else {
        // Fallback for older canvas versions
        ctx.moveTo(cardX + radius, cardY);
        ctx.lineTo(cardX + cardW - radius, cardY);
        ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
        ctx.lineTo(cardX + cardW, cardY + cardH - radius);
        ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
        ctx.lineTo(cardX + radius, cardY + cardH);
        ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
        ctx.lineTo(cardX, cardY + radius);
        ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
        ctx.closePath();
      }
      
      // Glass Fill
      ctx.fillStyle = "rgba(10, 15, 20, 0.65)";
      ctx.fill();
      
      // Neon Border Stroke (Green to Blue Gradient)
      const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      borderGrad.addColorStop(0, "#00ff88"); 
      borderGrad.addColorStop(1, "#00ccff"); 
      
      ctx.lineWidth = 8;
      ctx.strokeStyle = borderGrad;
      ctx.shadowColor = "#00ff88"; // Neon Glow
      ctx.shadowBlur = 40; 
      ctx.stroke();
      
      // Inner White Highlight (For 3D Bevel effect)
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.stroke();
      ctx.restore();

      // --- LAYER C: AVATAR & HUD RING ---
      const avatarSize = 220;
      const avatarX = cardX + 80;
      const avatarY = centerY - (avatarSize / 2);

      ctx.save();
      // Clip Avatar to Circle
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
      ctx.clip();
      const avatarImg = await loadImage(avatarPath);
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      // Draw HUD Tech Ring
      const ringX = avatarX + avatarSize/2;
      const ringY = avatarY + avatarSize/2;
      const ringRadius = (avatarSize/2) + 15;

      ctx.shadowColor = "#00ccff";
      ctx.shadowBlur = 20;
      
      // Arc Segment 1 (Green)
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringRadius, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 6;
      ctx.stroke();

      // Arc Segment 2 (Blue)
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringRadius, 1.2 * Math.PI, 1.8 * Math.PI);
      ctx.strokeStyle = "#00ccff";
      ctx.stroke();
      
      // Thin decorative circle
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringRadius + 15, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();

      // --- LAYER D: TEXT INFORMATION ---
      const textX = avatarX + avatarSize + 60;
      const textYStart = cardY + 100;

      // Helper for data rows
      const drawField = (label, value, y) => {
        // Label
        ctx.font = "24px Arial"; // Simple font for label
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText(label, textX, y);

        // Value
        ctx.font = "bold 34px Arial"; // Bold font for value
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0, 255, 136, 0.5)"; // Slight glow text
        ctx.shadowBlur = 10;
        ctx.fillText(value, textX, y + 35);
        ctx.shadowBlur = 0;
      };

      // Header: Name
      ctx.font = "bold 50px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#00ccff";
      ctx.shadowBlur = 15;
      ctx.fillText(name, textX, textYStart - 10);
      ctx.shadowBlur = 0;

      // Divider Line
      ctx.fillStyle = borderGrad;
      ctx.fillRect(textX, textYStart + 10, 400, 3);

      // Info Rows
      drawField("UID", targetID, textYStart + 60);
      drawField("Followers", followersDisplay, textYStart + 150);
      drawField("Gender", gender, textYStart + 240);
      
      // Footer: Join Date
      ctx.font = "italic 20px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.textAlign = "right";
      ctx.fillText(`Joined: ${joinDate}`, cardX + cardW - 40, cardY + cardH - 30);

      // --- 6. SAVE & SEND ---
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(cardPath, buffer);

      const msgBody = `✨ 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 \n━━━━━━━━━━━━━━━━━━\n👤 𝗡𝗮𝗺𝗲: ${name}\n🆔 𝗨𝗜𝗗: ${targetID}\n━━━━━━━━━━━━━━━━━━`;

      await message.reply({
        body: msgBody,
        attachment: fs.createReadStream(cardPath)
      });

      // --- 7. CLEANUP ---
      api.unsendMessage(processingMsg.messageID);
      fs.unlinkSync(avatarPath);
      fs.unlinkSync(cardPath);

    } catch (error) {
      console.error("3D PFP Error:", error);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 3𝐷 𝑝𝑟𝑜𝑓𝑖𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
    }
  }
};
