const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const fs = require('fs');
const request = require('request');

module.exports.config = {
  name: "punch",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑬𝒊 𝒋𝒐𝒏𝒏𝒆𝒓 𝒏𝒂𝒎𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒆 𝒕𝒂𝒌𝒆 𝒎𝒂𝒓𝒂",
  commandCategory: "fun",
  usages: "𝒑𝒖𝒏𝒄𝒉 [@𝒕𝒂𝒈]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "request": ""
  }
};

module.exports.run = async function({ api, event, args, Users }) {
  try {
    const { threadID, messageID, mentions } = event;
    
    if (!mentions || !Object.keys(mentions).length) {
      return api.sendMessage("❌ 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒌𝒂𝒖𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒖𝒏!", threadID, messageID);
    }

    const targetID = Object.keys(mentions)[0];
    const targetName = mentions[targetID].replace(/@/g, '');
    const attackerName = await Users.getNameUser(event.senderID);
    
    // Create stylish canvas banner
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 700, 0);
    gradient.addColorStop(0, '#ff9966');
    gradient.addColorStop(1, '#ff5e62');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 700, 250);
    
    // Punch text styling
    ctx.font = 'bold 60px "Arial"';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('🥊 PUNCH IMPACT 🥊', 350, 80);
    
    // User text styling
    ctx.font = '30px "Segoe UI"';
    ctx.fillText(`${attackerName} punched ${targetName}!`, 350, 150);
    
    // Add decorative elements
    ctx.beginPath();
    ctx.arc(100, 125, 40, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(600, 125, 40, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Save canvas
    const bannerPath = __dirname + '/cache/punch_banner.png';
    const out = fs.createWriteStream(bannerPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    await new Promise((resolve) => out.on('finish', resolve));

    // Get punch GIF
    api.sendMessage("🔄 𝑷𝒖𝒏𝒄𝒉 𝒊𝒎𝒑𝒂𝒄𝒕 𝒍𝒐𝒂𝒅𝒊𝒏𝒈...", threadID, messageID);
    const gifRes = await axios.get('https://api.satou-chan.xyz/api/endpoint/punch');
    const gifUrl = gifRes.data.url;
    const ext = gifUrl.split('.').pop();
    const gifPath = __dirname + `/cache/punch.${ext}`;
    
    await new Promise((resolve, reject) => {
      request(gifUrl)
        .pipe(fs.createWriteStream(gifPath))
        .on('close', resolve)
        .on('error', reject);
    });

    // Send combined result
    api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.sendMessage({
      body: `🥊 𝑶𝑹𝑨 𝑶𝑹𝑨 𝑶𝑹𝑨! ${targetName}, 𝒀𝑶𝑼 𝑮𝑶𝑻 𝑷𝑼𝑵𝑪𝑯𝑬𝑫! 💥\n𝑩𝒚: ${attackerName}`,
      mentions: [{
        tag: targetName,
        id: targetID
      }],
      attachment: [
        fs.createReadStream(bannerPath),
        fs.createReadStream(gifPath)
      ]
    }, threadID, () => {
      fs.unlinkSync(bannerPath);
      fs.unlinkSync(gifPath);
    }, messageID);

  } catch (error) {
    console.error(error);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    api.sendMessage("😢 𝑮𝑰𝑭 𝒃𝒂𝒏𝒂𝒏𝒐𝒓 𝒌𝒉𝒂𝒎𝒂𝒓 𝒉𝒐𝒍𝒆𝒏𝒊! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID, event.messageID);
  }
};
