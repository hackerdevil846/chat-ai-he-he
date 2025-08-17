const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "numinfo",
  version: "3.0.0",
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

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  
  if (!args[0]) {
    return api.sendMessage("📱 Please provide an international phone number!\nExample: numinfo +12124567890", threadID, messageID);
  }

  try {
    api.setMessageReaction("⌛", messageID, (err) => {}, true);
    
    let number = args[0].trim().replace(/[^\d+]/g, '');
    
    if (!number.startsWith('+') || number.length < 8) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("❌ Invalid format! Please use international format:\nExample: numinfo +12124567890", threadID, messageID);
    }

    const apiUrl = `https://telephone-number-info.p.rapidapi.com/rapidapi/telephone-number-info/index.php?phoneNumber=${encodeURIComponent(number)}`;
    const response = await axios.get(apiUrl, {
      headers: {
        'x-rapidapi-key': this.config.envConfig.API_KEY,
        'x-rapidapi-host': 'telephone-number-info.p.rapidapi.com'
      },
      timeout: 20000
    });

    const data = response.data;
    
    // Create beautiful image
    const imgPath = await createNumberInfoImage(data, number);
    
    api.setMessageReaction("✅", messageID, () => {}, true);
    
    const message = {
      body: `📱 Phone Number Information for ${number}\n━━━━━━━━━━━━━━━━━━`,
      attachment: fs.createReadStream(imgPath)
    };
    
    return api.sendMessage(message, threadID, messageID);
  } 
  catch (error) {
    console.error("Numinfo Error:", error);
    api.setMessageReaction("❌", messageID, () => {}, true);
    
    let errorMsg = "❌ Failed to fetch number information\n\n";
    
    if (error.response) {
      errorMsg += `🔧 Server Error: ${error.response.status}\n`;
      errorMsg += `📄 Response: ${error.response.data ? JSON.stringify(error.response.data).substring(0, 100) : 'No data'}`;
    } else if (error.request) {
      errorMsg += "⏱️ Request timed out. Please try again later.";
    } else {
      errorMsg += `⚠️ Error: ${error.message}`;
    }
    
    return api.sendMessage(errorMsg, threadID, messageID);
  }
};

async function createNumberInfoImage(data, number) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f2027');
  gradient.addColorStop(0.5, '#203a43');
  gradient.addColorStop(1, '#2c5364');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw decorative elements
  drawPattern(ctx, width, height);
  
  // Draw header with phone icon
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px "Segoe UI"';
  ctx.fillText('📱 PHONE NUMBER INFORMATION', 50, 70);
  
  // Draw number display
  ctx.fillStyle = '#4ecdc4';
  ctx.font = 'bold 36px "Segoe UI"';
  ctx.fillText(number, 50, 120);
  
  // Draw divider
  ctx.beginPath();
  ctx.moveTo(40, 150);
  ctx.lineTo(width - 40, 150);
  ctx.strokeStyle = '#4ecdc4';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw info cards
  const cardData = [
    { icon: '🌎', title: 'Country', key: 'country' },
    { icon: '🏙️', title: 'Location', key: 'location' },
    { icon: '📶', title: 'Carrier', key: 'carrier' },
    { icon: '🕒', title: 'Timezone', key: 'timezone' },
    { icon: '🔍', title: 'Valid', key: 'is_valid' },
    { icon: '📡', title: 'Line Type', key: 'line_type' }
  ];
  
  let yPos = 190;
  const cardWidth = 700;
  const cardHeight = 60;
  
  for (const card of cardData) {
    if (data[card.key]) {
      drawInfoCard(ctx, card.icon, card.title, data[card.key], yPos, cardWidth, cardHeight);
      yPos += cardHeight + 15;
    }
  }
  
  // Add decorative footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.font = 'italic 16px "Segoe UI"';
  ctx.fillText('Information provided by Telephone Number Info API • Asif Mahmud', 150, height - 20);
  
  // Draw border
  ctx.strokeStyle = '#4ecdc4';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  // Save image
  const imgPath = path.join(__dirname, 'cache', `numinfo_${Date.now()}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(imgPath, buffer);
  
  return imgPath;
}

function drawPattern(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  
  // Draw grid pattern
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
  
  // Draw circles
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 5 + Math.random() * 30;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawInfoCard(ctx, icon, title, value, y, width, height) {
  const x = 50;
  
  // Draw card background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 15);
  ctx.fill();
  
  // Draw card border
  ctx.strokeStyle = 'rgba(78, 205, 196, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 15);
  ctx.stroke();
  
  // Draw icon
  ctx.fillStyle = '#4ecdc4';
  ctx.font = '28px "Segoe UI"';
  ctx.fillText(icon, x + 20, y + 40);
  
  // Draw title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Segoe UI"';
  ctx.fillText(title, x + 60, y + 40);
  
  // Draw value
  ctx.fillStyle = '#ff6b6b';
  ctx.font = '22px "Segoe UI"';
  const valueX = x + width - 30 - ctx.measureText(value).width;
  ctx.fillText(value, valueX, y + 40);
}

// Add rounded rectangle function to Canvas
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  return this;
};
