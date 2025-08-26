const axios = require("axios");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "numinfo",
  version: "3.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Get detailed phone number information with stylish visual presentation",
  category: "information",
  usages: "numinfo [international phone number]",
  cooldowns: 15,
  dependencies: {
    "axios": "",
    "canvas": ""
  },
  envConfig: {
    API_KEY: "78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb"
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      "📱 Please provide an international phone number!\nExample: numinfo +12124567890",
      threadID,
      messageID
    );
  }

  try {
    api.setMessageReaction("⌛", messageID, () => {}, true);

    let number = args[0].trim().replace(/[^\d+]/g, "");

    if (!number.startsWith("+") || number.length < 8) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(
        "❌ Invalid format! Please use international format:\nExample: numinfo +12124567890",
        threadID,
        messageID
      );
    }

    const apiUrl = `https://telephone-number-info.p.rapidapi.com/rapidapi/telephone-number-info/index.php?phoneNumber=${encodeURIComponent(
      number
    )}`;
    const response = await axios.get(apiUrl, {
      headers: {
        "x-rapidapi-key": this.config.envConfig.API_KEY,
        "x-rapidapi-host": "telephone-number-info.p.rapidapi.com",
      },
      timeout: 20000,
    });

    const data = response.data;

    // Create styled image
    const imgPath = await createNumberInfoImage(data, number);

    api.setMessageReaction("✅", messageID, () => {}, true);

    const message = {
      body: `📱 Phone Number Information for ${number}\n━━━━━━━━━━━━━━━━━━`,
      attachment: fs.createReadStream(imgPath),
    };

    return api.sendMessage(message, threadID, messageID);
  } catch (error) {
    console.error("Numinfo Error:", error);
    api.setMessageReaction("❌", messageID, () => {}, true);

    let errorMsg = "❌ Failed to fetch number information\n\n";

    if (error.response) {
      errorMsg += `🔧 Server Error: ${error.response.status}\n`;
      errorMsg += `📄 Response: ${
        error.response.data
          ? JSON.stringify(error.response.data).substring(0, 100)
          : "No data"
      }`;
    } else if (error.request) {
      errorMsg += "⏱️ Request timed out. Please try again later.";
    } else {
      errorMsg += `⚠️ Error: ${error.message}`;
    }

    return api.sendMessage(errorMsg, threadID, messageID);
  }
};

// ------------------ Helper Functions ------------------

async function createNumberInfoImage(data, number) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Add roundRect method safely
  if (!ctx.roundRect) {
    ctx.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };
  }

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0f2027");
  gradient.addColorStop(0.5, "#203a43");
  gradient.addColorStop(1, "#2c5364");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Pattern
  drawPattern(ctx, width, height);

  // Header
  ctx.fillStyle = "#ffffff";
  ctx.font = 'bold 40px "Segoe UI"';
  ctx.fillText("📱 PHONE NUMBER INFORMATION", 50, 70);

  // Number
  ctx.fillStyle = "#4ecdc4";
  ctx.font = 'bold 36px "Segoe UI"';
  ctx.fillText(number, 50, 120);

  // Divider
  ctx.beginPath();
  ctx.moveTo(40, 150);
  ctx.lineTo(width - 40, 150);
  ctx.strokeStyle = "#4ecdc4";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Cards
  const cardData = [
    { icon: "🌎", title: "Country", key: "country" },
    { icon: "🏙️", title: "Location", key: "location" },
    { icon: "📶", title: "Carrier", key: "carrier" },
    { icon: "🕒", title: "Timezone", key: "timezone" },
    { icon: "🔍", title: "Valid", key: "is_valid" },
    { icon: "📡", title: "Line Type", key: "line_type" },
  ];

  let yPos = 190;
  const cardWidth = 700;
  const cardHeight = 60;

  for (const card of cardData) {
    if (data[card.key]) {
      drawInfoCard(
        ctx,
        card.icon,
        card.title,
        String(data[card.key]),
        yPos,
        cardWidth,
        cardHeight
      );
      yPos += cardHeight + 15;
    }
  }

  // Footer
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = 'italic 16px "Segoe UI"';
  ctx.fillText(
    "Information provided by Telephone Number Info API • 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    100,
    height - 20
  );

  // Border
  ctx.strokeStyle = "#4ecdc4";
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Save image
  const imgPath = path.join(__dirname, "cache", `numinfo_${Date.now()}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(imgPath, buffer);

  return imgPath;
}

function drawPattern(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;

  // Grid
  for (let x = 0; x < width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Circles
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 5 + Math.random() * 30;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawInfoCard(ctx, icon, title, value, y, width, height) {
  const x = 50;

  // Background
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.roundRect(x, y, width, height, 15).fill();

  // Border
  ctx.strokeStyle = "rgba(78, 205, 196, 0.5)";
  ctx.lineWidth = 1;
  ctx.roundRect(x, y, width, height, 15).stroke();

  // Icon
  ctx.fillStyle = "#4ecdc4";
  ctx.font = '28px "Segoe UI"';
  ctx.fillText(icon, x + 20, y + 40);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = 'bold 22px "Segoe UI"';
  ctx.fillText(title, x + 60, y + 40);

  // Value
  ctx.fillStyle = "#ff6b6b";
  ctx.font = '22px "Segoe UI"';
  const valueX = x + width - 30 - ctx.measureText(value).width;
  ctx.fillText(value, valueX, y + 40);
}
