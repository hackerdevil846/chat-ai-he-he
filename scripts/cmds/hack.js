const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports.config = {
  name: "hack",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🔓 𝑯𝒂𝒄𝒌𝒊𝒏𝒈 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒊𝒐𝒏 𝒘𝒊𝒕𝒉 𝒗𝒊𝒔𝒖𝒂𝒍 𝒆𝒇𝒇𝒆𝒄𝒕𝒔 🔍",
  commandCategory: "fun",
  usages: "[@mention]",
  dependencies: {
    "axios": "",
    "canvas": "",
    "fs-extra": ""
  },
  cooldowns: 15,
  envConfig: {
    // Add any API keys or configs here if needed
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const targetID = Object.keys(event.mentions)[0] || event.senderID;
    const targetName = await Users.getNameUser(targetID);
    
    // Send initial message
    const initMsg = await api.sendMessage(`🔍 𝑰𝒏𝒊𝒕𝒊𝒂𝒕𝒊𝒏𝒈 𝒉𝒂𝒄𝒌𝒊𝒏𝒈 𝒔𝒆𝒒𝒖𝒆𝒏𝒄𝒆 𝒇𝒐𝒓 ${targetName}...\n⏳ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕, 𝒕𝒉𝒊𝒔 𝒎𝒂𝒚 𝒕𝒂𝒌𝒆 𝒂 𝒎𝒐𝒎𝒆𝒏𝒕...`, event.threadID);
    
    // Get user's profile picture
    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
    const avatarBuffer = Buffer.from(avatarResponse.data, 'binary');
    
    // Create hacking simulation
    const canvas = createCanvas(800, 500);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add matrix code effect
    ctx.font = '14px "Courier New"';
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < 50; i++) {
      ctx.fillText(
        Math.random().toString(36).substring(2, 15),
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
    }
    
    // Draw terminal window
    ctx.fillStyle = 'rgba(0, 30, 0, 0.8)';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Add terminal text
    ctx.font = 'bold 16px "Courier New"';
    ctx.fillStyle = '#00ff00';
    ctx.fillText('> INITIATING HACKING SEQUENCE...', 70, 80);
    ctx.fillText('> TARGET: ' + targetName, 70, 105);
    ctx.fillText('> BYPASSING SECURITY PROTOCOLS...', 70, 130);
    
    // Add progress bar
    ctx.fillStyle = '#003300';
    ctx.fillRect(70, 160, 600, 25);
    ctx.fillStyle = '#00cc00';
    ctx.fillRect(70, 160, 600 * 0.75, 25);
    ctx.fillStyle = '#00ff00';
    ctx.fillText('75% COMPLETE', 300, 178);
    
    // Add more terminal output
    ctx.fillText('> EXTRACTING PERSONAL DATA...', 70, 220);
    ctx.fillText('> FOUND: Email - ' + generateFakeEmail(targetName), 90, 245);
    ctx.fillText('> FOUND: Password - ' + generatePassword(12), 90, 270);
    ctx.fillText('> ACCESSING PRIVATE MESSAGES...', 70, 295);
    ctx.fillText('> ENCRYPTION BYPASSED SUCCESSFULLY!', 70, 320);
    
    // Draw user avatar
    try {
      const avatar = await loadImage(avatarBuffer);
      // Draw circular avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(650, 350, 40, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 610, 310, 80, 80);
      ctx.restore();
      
      // Draw border around avatar
      ctx.beginPath();
      ctx.arc(650, 350, 40, 0, Math.PI * 2, true);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();
    } catch (e) {
      console.error("Error loading avatar:", e);
    }
    
    // Add hack complete message
    ctx.font = 'bold 20px "Courier New"';
    ctx.fillStyle = '#00ff00';
    ctx.fillText('>>> HACK COMPLETE - ALL DATA EXTRACTED <<<', 150, 370);
    
    // Add target info
    ctx.font = '16px "Courier New"';
    ctx.fillText('Target: ' + targetName, 70, 410);
    ctx.fillText('Status: COMPROMISED', 70, 435);
    ctx.fillText('Data Security: BREACHED', 70, 460);
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    const imagePath = path.join(__dirname, 'cache', 'hack_result.png');
    await fs.outputFile(imagePath, buffer);
    
    // Send the result
    api.sendMessage({
      body: `🔓 𝑯𝒂𝒄𝒌𝒊𝒏𝒈 𝒄𝒐𝒎𝒑𝒍𝒆𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!\n👨‍💻 𝑻𝒂𝒓𝒈𝒆𝒕: ${targetName}\n📂 𝑫𝒂𝒕𝒂 𝒆𝒙𝒕𝒓𝒂𝒄𝒕𝒆𝒅 𝒂𝒏𝒅 𝒔𝒆𝒏𝒕 𝒕𝒐 𝒔𝒆𝒄𝒖𝒓𝒆 𝒔𝒆𝒓𝒗𝒆𝒓`,
      attachment: fs.createReadStream(imagePath)
    }, event.threadID, () => {
      // Clean up
      fs.unlinkSync(imagePath);
      api.unsendMessage(initMsg.messageID);
    }, event.messageID);
    
  } catch (error) {
    console.error(error);
    api.sendMessage('❌ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒉𝒂𝒄𝒌𝒊𝒏𝒈 𝒑𝒓𝒐𝒄𝒆𝒅𝒖𝒓𝒆: ' + error.message, event.threadID, event.messageID);
  }
};

// Helper function to generate fake email
function generateFakeEmail(name) {
  const domains = ['gmail.com', 'yahoo.com', 'protonmail.com', 'hushmail.com'];
  const namePart = name.replace(/\s+/g, '').toLowerCase();
  const randomNum = Math.floor(Math.random() * 1000);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${namePart}${randomNum}@${domain}`;
}

// Helper function to generate random password
function generatePassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
