module.exports.config = {
  name: "ping",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🌟 𝑺𝒐𝒃𝒂𝒊𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒂 𝒘𝒊𝒕𝒉 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝒅𝒆𝒔𝒊𝒈𝒏",
  commandCategory: "system",
  usages: "[Text]",
  cooldowns: 80,
  dependencies: {
    "canvas": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  try {
    const { createCanvas } = require("canvas");
    const fs = require("fs-extra");
    const botID = api.getCurrentUserID();
    
    // Get AFK users
    const listAFK = global.moduleData?.["afk"]?.afkList 
      ? Object.keys(global.moduleData["afk"].afkList) 
      : [];

    // Filter participants
    const allUsers = event.participantIDs.filter(id => 
      id !== botID && 
      id !== event.senderID &&
      !listAFK.includes(id)
    );

    // Canvas setup
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 600);
    gradient.addColorStop(0, "#8A2BE2");
    gradient.addColorStop(1, "#1E90FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 600);

    // Decorative elements
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(600, 300, 250, 0, Math.PI * 2);
    ctx.stroke();

    // Main text
    ctx.font = "bold 80px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("💫 𝑷𝑰𝑵𝑮 𝑪𝑶𝑴𝑴𝑨𝑵𝑫 💫", 600, 180);

    // User count display
    ctx.font = "bold 60px Arial";
    ctx.fillText(`👥 𝑻𝑶𝑻𝑨𝑳 𝑼𝑺𝑬𝑹𝑺: ${allUsers.length}`, 600, 300);

    // Decorative emojis
    ctx.font = "bold 90px Arial";
    ctx.fillText("✨🌟⚡🎯", 600, 420);

    // Save image
    const path = __dirname + `/cache/ping_${event.threadID}.png`;
    const buffer = canvas.toBuffer();
    fs.writeFileSync(path, buffer);

    // Prepare message
    const body = args.join(" ") || "💖 𝑺𝑼𝑺𝑯𝑰 𝑫𝑨𝑹𝑼𝑵 𝑨𝑴𝑨𝑰𝑲𝑬 𝑻𝑨𝑮 𝑲𝑶𝑹𝑨 💖";
    const mentions = allUsers.map(id => ({
      id,
      tag: "‎",
      fromIndex: 0
    }));

    // Send message with attachment and mentions
    return api.sendMessage({
      body: `🎯 ${body}\n\n` + 
             "=".repeat(20) + "\n" +
             `🔔 𝑵𝑶𝑻𝑰𝑭𝑬: ${allUsers.length} 𝒖𝒔𝒆𝒓𝒔 𝒕𝒂𝒈𝒈𝒆𝒅!\n` +
             "=".repeat(20),
      attachment: fs.createReadStream(path),
      mentions
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);
  }
  catch (e) {
    console.error("✨ 𝑬𝒓𝒓𝒐𝒓:", e);
    const botID = api.getCurrentUserID();
    const allUsers = event.participantIDs.filter(id => 
      id !== botID && id !== event.senderID
    );
    
    const body = args.join(" ") || "💫 𝑺𝒐𝒃𝒂𝒊𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!";
    const mentions = allUsers.map(id => ({
      id,
      tag: "‎",
      fromIndex: 0
    }));

    return api.sendMessage({
      body: `⚠️ 𝑪𝒂𝒏𝒗𝒂𝒔 𝒆𝒓𝒓𝒐𝒓! 𝑼𝒔𝒊𝒏𝒈 𝒕𝒆𝒙𝒕-𝒐𝒏𝒍𝒚 𝒗𝒆𝒓𝒔𝒊𝒐𝒏:\n\n${body}`,
      mentions
    }, event.threadID, event.messageID);
  }
};
