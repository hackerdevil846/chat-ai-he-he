const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "birthday",
    version: "1.1.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Send beautiful birthday wishes with personalized images",
    category: "greetings",
    usages: "birthday [@mention]",
    cooldowns: 5,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  // Add required onStart function
  onStart: async function() {
    // Initialization logic can go here if needed
    // (Not required for this command but needed by the system)
  },

  run: async function ({ api, event, args, Users }) {
    try {
      const { threadID, messageID, senderID, type, messageReply, mentions } = event;
      
      // Determine target user
      let targetID = senderID;
      let targetName = "Friend";
      
      if (type === "message_reply") {
        targetID = messageReply.senderID;
        targetName = (await Users.getUser(targetID)).name || "Friend";
      } else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        targetName = event.mentions[targetID].replace("@", "");
      } else if (args[0] && !isNaN(args[0])) {
        targetID = args[0];
        targetName = (await Users.getUser(targetID)).name || "Friend";
      } else {
        targetName = (await Users.getUser(senderID)).name || "Friend";
      }

      // Create cache directory
      const cacheDir = path.join(__dirname, "cache", "birthday");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // File paths
      const avatarPath = path.join(cacheDir, `avatar_${targetID}.png`);
      const backgroundPath = path.join(cacheDir, "background.png");
      const outputPath = path.join(cacheDir, `birthday_${targetID}_${Date.now()}.png`);

      // Download avatar
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(avatarPath, Buffer.from(avatarResponse.data));

      // Download background
      const backgroundUrl = "https://i.imgur.com/8bI4uLb.jpg"; // Birthday-themed background
      const backgroundResponse = await axios.get(backgroundUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(backgroundPath, Buffer.from(backgroundResponse.data));

      // Create canvas
      const background = await loadImage(backgroundPath);
      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Draw avatar (circular)
      const avatar = await loadImage(avatarPath);
      const avatarSize = 300;
      const avatarX = (canvas.width - avatarSize) / 2;
      const avatarY = 150;
      
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      // Configure text
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#8B4513";
      ctx.textAlign = "center";
      ctx.font = "bold 40px 'Arial', sans-serif";
      ctx.lineWidth = 3;

      // Birthday messages
      const messages = [
        `🎉 Happy Birthday ${targetName}! 🎂`,
        "May your day be filled with joy and laughter,",
        "wonderful surprises, and cherished moments.",
        "Wishing you all the happiness in the world,",
        "good health, and prosperity!",
        "❤️🎈🎁"
      ];

      // Draw text with effects
      let yPosition = 600;
      for (const message of messages) {
        // Text shadow
        ctx.fillStyle = "#000000";
        ctx.fillText(message, canvas.width/2 + 2, yPosition + 2);
        
        // Main text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(message, canvas.width/2, yPosition);
        
        // Text outline
        ctx.strokeText(message, canvas.width/2, yPosition);
        
        yPosition += 60;
      }

      // Draw decorations (balloons)
      ctx.fillStyle = "#FF6B6B";
      this.drawBalloon(ctx, 200, 200, 30);
      ctx.fillStyle = "#4ECDC4";
      this.drawBalloon(ctx, 800, 250, 40);
      ctx.fillStyle = "#FFD700";
      this.drawBalloon(ctx, 150, 400, 35);
      ctx.fillStyle = "#FF9F68";
      this.drawBalloon(ctx, 850, 380, 45);

      // Save image
      const buffer = canvas.toBuffer();
      fs.writeFileSync(outputPath, buffer);

      // Birthday wish text
      const wishText = `🎂🎉 Happy Birthday ${targetName}! 🎁🎈\n` +
        "May your day be filled with joy, laughter and wonderful surprises!\n" +
        "Wishing you a year full of happiness and success! ❤️";

      // Send birthday card
      api.sendMessage({
        body: wishText,
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Cleanup files
        [avatarPath, backgroundPath, outputPath].forEach(filePath => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      }, messageID);

    } catch (error) {
      console.error("Birthday command error:", error);
      api.sendMessage("🎂 An error occurred while creating your birthday card. Please try again later!", threadID, messageID);
    }
  },

  drawBalloon: function(ctx, x, y, radius) {
    // Draw balloon
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw string
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x + (Math.random() > 0.5 ? 1 : -1) * 20, y + radius + 50);
    ctx.stroke();
  }
};
