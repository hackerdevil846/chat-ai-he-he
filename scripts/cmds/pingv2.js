module.exports.config = {
  name: "pingv2",
  version: "0.0.3",
  hasPermssion: 1,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑺𝒐𝒃𝒂𝒊𝒌𝒆 𝑻𝒂𝒈 𝑲𝒐𝒓𝒂",
  commandCategory: "system",
  usages: "[𝑻𝒆𝒙𝒕]",
  cooldowns: 80,
  dependencies: {
    "canvas": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args, Threads }) {
  try {
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    
    // Get participant IDs
    const threadInfo = await Threads.getInfo(event.threadID);
    let all = threadInfo.participantIDs;
    all = all.filter(id => id !== api.getCurrentUserID() && id !== event.senderID);
    
    // Create beautiful canvas header
    const width = 1000;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#8A2BE2");
    gradient.addColorStop(1, "#1E90FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add decorative elements
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 30 + 10,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Styled text
    ctx.font = "bold 60px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillText("📢 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐓𝐈𝐎𝐍 📢", width / 2, height / 2);

    // Save image
    const pathImg = __dirname + '/cache/pingv2_header.png';
    const buffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, buffer);

    // Prepare message body
    const defaultMsg = "✨ 𝑨𝒅𝒎𝒊𝒏 𝒕𝒖𝒎𝒂𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒆𝒄𝒉𝒆 ✨";
    const customMsg = args.join(" ");
    const body = customMsg || defaultMsg;
    
    // Generate mentions
    const mentions = [];
    for (let i = 0; i < all.length; i++) {
      if (i === body.length) body += body.charAt(body.length - 1);
      mentions.push({
        tag: body[i],
        id: all[i],
        fromIndex: i
      });
    }

    // Send message with styled header
    return api.sendMessage({
      body: `🎯 ${body}\n\n${all.length} জন মেম্বার কে ট্যাগ করা হলো! 💫`,
      attachment: fs.createReadStream(pathImg),
      mentions
    }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage(`❌ ট্যাগ করতে সমস্যা হয়েছে:\n${e.message}`, event.threadID);
  }
};
