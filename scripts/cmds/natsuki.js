module.exports.config = {
  name: "natsuki",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎀 𝒏𝒂𝒕𝒔𝒖𝒌𝒊 𝒔𝒂𝒕𝒉𝒆 𝒄𝒖𝒔𝒕𝒐𝒎 𝒂𝒗𝒂𝒕𝒂𝒓 𝒃𝒂𝒏𝒂𝒐 (𝒄𝒂𝒏𝒗𝒂𝒔 𝒆𝒏𝒉𝒂𝒏𝒄𝒆𝒅)",
  commandCategory: "🎨 𝒊𝒎𝒂𝒈𝒆 𝒄𝒓𝒆𝒂𝒕𝒊𝒐𝒏",
  usages: "[text]",
  cooldowns: 7,
  dependencies: {
    "axios": "",
    "discord-image-generation": "",
    "fs-extra": "",
    "node-superfetch": "",
    "canvas": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { createCanvas, loadImage, registerFont } = require('canvas');
  const { threadID, messageID } = event;
  const fetch = global.nodemodule["node-superfetch"];
  const Discord = global.nodemodule["discord-image-generation"];
  
  if (!args[0]) {
    return api.sendMessage("⚡ 𝒌𝒊𝒄𝒉𝒖 𝒍𝒊𝒌𝒉𝒖𝒏 𝒏𝒂 𝒑𝒍𝒆𝒂𝒔𝒆!", threadID, messageID);
  }

  const text = args.join(" ");
  const backgrounds = ["bedroom", "class", "closet", "club", "corridor", "house", "kitchen", "residential", "sayori_bedroom"];
  const bodies = ["1b", "1", "2b", "2"];
  const faces = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1t", "2bt", "2bta", "2btb", "2btc", "2btd", "2bte", "2btf", "2btg", "2bth", "2bti", "2t", "2ta", "2tb", "2tc", "2td", "2te", "2tf", "2tg", "2th", "2ti"];
  
  try {
    // Step 1: Get base image from API
    const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const body = bodies[Math.floor(Math.random() * bodies.length)];
    const face = faces[Math.floor(Math.random() * faces.length)];
    
    const apiUrl = `https://nekobot.xyz/api/imagegen?type=ddlc&character=natsuki&background=${bg}&body=${body}&face=${face}&text=${encodeURIComponent(text)}`;
    const { body: data } = await fetch.get(apiUrl);
    
    if (!data.success) {
      return api.sendMessage("❌ 𝒂𝒑𝒊 𝒆𝒓𝒓𝒐𝒓: " + data.message, threadID, messageID);
    }
    
    // Step 2: Enhance with canvas
    const baseImage = await loadImage(data.message);
    
    // Create canvas
    const canvas = createCanvas(baseImage.width, baseImage.height + 100);
    const ctx = canvas.getContext('2d');
    
    // Add background
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(baseImage, 0, 50, baseImage.width, baseImage.height);
    
    // Add stylish text
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#FF69B4';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    
    // Text with outline
    ctx.strokeText(`🎀 ${text} 🎀`, canvas.width/2, 35);
    ctx.fillText(`🎀 ${text} 🎀`, canvas.width/2, 35);
    
    // Add decorations
    ctx.beginPath();
    ctx.arc(50, 35, 15, 0, Math.PI * 2);
    ctx.arc(canvas.width - 50, 35, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#FF69B4';
    ctx.fill();
    
    // Step 3: Convert to buffer
    const buffer = canvas.toBuffer('image/png');
    
    return api.sendMessage({
      body: `🎀 𝒏𝒂𝒕𝒔𝒖𝒌𝒊 𝒆𝒓 𝒄𝒉𝒐𝒃𝒊 𝒏𝒊𝒚𝒐 𝒏𝒊𝒋𝒆𝒓 𝒋𝒐𝒏𝒏𝒐\n"${text}"`,
      attachment: buffer
    }, threadID, messageID);
    
  } catch (error) {
    console.error("Natsuki Canvas Error:", error);
    return api.sendMessage(`❌ 𝒆𝒓𝒓𝒐𝒓: ${error.message}`, threadID, messageID);
  }
};
