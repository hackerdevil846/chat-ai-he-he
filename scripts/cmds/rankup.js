module.exports = {
  config: {
    name: "rankup",
    version: "7.3.1",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🌺 𝑮𝒓𝒐𝒖𝒑 𝒆𝒃𝒐𝒏𝒈 𝒖𝒔𝒆𝒓𝒅𝒆𝒓 𝒓𝒂𝒏𝒌𝒖𝒑 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 🌺",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    dependencies: {
      "fs-extra": "",
      "canvas": ""
    },
    cooldowns: 2,
    envConfig: {
      rewardExp: 1
    }
  },

  languages: {
    "vi": {
      "off": "🚫 𝑩𝒂𝒏𝒅𝒉𝒐",
      "on": "✅ 𝑪𝒉𝒂𝒍𝒖",
      "successText": "✨ 𝑹𝒂𝒏𝒌𝒖𝒑 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒔𝒆𝒕𝒕𝒊𝒏𝒈 𝒖𝒑𝒅𝒂𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!",
      "levelup": "🌸 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 {name}, 𝒕𝒖𝒎𝒊 𝒆𝒃𝒂𝒓 𝒍𝒆𝒗𝒆𝒍 𝒃𝒂𝒓𝒉𝒍𝒂𝒎𝒐 {level} 🌸"
    },
    "en": {
      "off": "🚫 𝑩𝒂𝒏𝒅𝒉𝒐",
      "on": "✅ 𝑪𝒉𝒂𝒍𝒖",
      "successText": "✨ 𝑹𝒂𝒏𝒌𝒖𝒑 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒔𝒆𝒕𝒕𝒊𝒏𝒈 𝒖𝒑𝒅𝒂𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!",
      "levelup": "🌸 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 {name}, 𝒕𝒖𝒎𝒊 𝒆𝒃𝒂𝒓 𝒍𝒆𝒗𝒆𝒍 𝒃𝒂𝒓𝒉𝒍𝒂𝒎𝒐 {level} 🌸"
    }
  },

  handleEvent: async function({ api, event, Currencies, Users, getText, envConfig }) {
    const { threadID, senderID } = event;
    const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { loadImage, createCanvas, registerFont } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const path = require("path");
    
    // Create directories if not exists
    const rankupDir = path.join(__dirname, "cache", "rankup");
    if (!existsSync(rankupDir)) mkdirSync(rankupDir, { recursive: true });
    
    const pathImg = path.join(rankupDir, `rankup_${threadID}_${senderID}.png`);
    const pathAvt = path.join(rankupDir, `avt_${senderID}.png`);
    
    const thread = global.data.threadData.get(threadID) || {};
    if (typeof thread["rankup"] !== "undefined" && thread["rankup"] === false) return;

    let exp = (await Currencies.getData(senderID)).exp || 0;
    exp += envConfig.rewardExp;

    const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
    const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

    if (level <= curLevel || level === 1) return;

    // Updated working background images
    const backgrounds = [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1500&h=1000&fit=crop",  // Floral design
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1500&h=1000&fit=crop",  // Traditional pattern
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1500&h=1000&fit=crop",  // Festive theme
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1500&h=1000&fit=crop",  // Nature scene
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1500&h=1000&fit=crop"   // Artistic pattern
    ];

    try {
      // Download profile picture
      const avtResponse = await axios.get(
        `https://graph.facebook.com/${senderID}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      );
      fs.writeFileSync(pathAvt, Buffer.from(avtResponse.data, "utf-8"));

      // Select random background
      const bgIndex = Math.floor(Math.random() * backgrounds.length);
      const bgResponse = await axios.get(backgrounds[bgIndex], { responseType: "arraybuffer" });
      fs.writeFileSync(pathImg, Buffer.from(bgResponse.data, "utf-8"));

      // Process images with canvas
      const baseImage = await loadImage(pathImg);
      const avatar = await loadImage(pathAvt);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw background
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Draw circular avatar frame
      ctx.save();
      ctx.beginPath();
      ctx.arc(750, 300, 200, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 550, 100, 400, 400);
      ctx.restore();

      // Add decorative frame around avatar
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(750, 300, 215, 0, Math.PI * 2);
      ctx.stroke();

      // Add Bengali floral decorations
      ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
      drawFloralPattern(ctx, 750, 300, 250, 8);

      // Add level text with Bengali style
      ctx.font = "bold 120px 'Arial Unicode MS'";
      ctx.fillStyle = "#8B4513";
      ctx.textAlign = "center";
      ctx.fillText(`LEVEL ${level}`, 750, 650);

      // Add user name
      const userName = await Users.getNameUser(senderID);
      ctx.font = "bold 70px 'Arial Unicode MS'";
      ctx.fillStyle = "#4B0082";
      ctx.fillText(userName, 750, 750);

      // Add congratulatory message in Bengali
      ctx.font = "italic 50px 'Arial Unicode MS'";
      ctx.fillStyle = "#006400";
      ctx.fillText("অভিনন্দন! আপনি উন্নীত হয়েছেন", 750, 850);

      // Save and send
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      
      const messageBody = getText("levelup")
        .replace(/\{name}/g, userName)
        .replace(/\{level}/g, level);

      api.sendMessage({
        body: messageBody,
        mentions: [{ tag: userName, id: senderID }],
        attachment: fs.createReadStream(pathImg)
      }, threadID);

    } catch (error) {
      console.error("Rankup error:", error);
    } finally {
      // Clean up temporary files
      if (existsSync(pathAvt)) fs.unlinkSync(pathAvt);
      if (existsSync(pathImg)) fs.unlinkSync(pathImg);
    }

    await Currencies.setData(senderID, { exp });
  },

  run: async function({ api, event, Threads, getText }) {
    const { threadID, messageID } = event;
    let data = (await Threads.getData(threadID)).data;
    
    data["rankup"] = typeof data["rankup"] === "undefined" || !data["rankup"];
    
    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);
    
    api.sendMessage(
      `${data["rankup"] ? getText("on") : getText("off")} ${getText("successText")}`,
      threadID,
      messageID
    );
  }
};

// Helper function to draw Bengali floral patterns
function drawFloralPattern(ctx, x, y, radius, petals) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < petals; i++) {
    ctx.rotate((Math.PI * 2) / petals);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      radius / 2, -radius / 3,
      radius, 0,
      0, radius
    );
    ctx.bezierCurveTo(
      -radius, 0,
      -radius / 2, -radius / 3,
      0, 0
    );
    ctx.fill();
  }
  ctx.restore();
}

