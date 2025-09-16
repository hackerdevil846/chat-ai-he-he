const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "rankup",
    aliases: ["levelnotify", "ranknotify"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 1,
    category: "system",
    shortDescription: {
      en: "🌺 Group and user rankup notification system 🌺"
    },
    longDescription: {
      en: "🌺 Group and user rankup notification system with beautiful Bengali designs 🌺"
    },
    guide: {
      en: "{p}rankup [on/off]"
    },
    dependencies: {
      "fs-extra": "",
      "canvas": "",
      "axios": ""
    }
  },

  onStart: async function({ api, event, threadsData, getText }) {
    try {
      // Check dependencies
      try {
        if (!fs || !createCanvas || !loadImage || !axios) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install fs-extra, canvas, and axios.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;
      let data = (await threadsData.get(threadID)).data;
      
      data["rankup"] = typeof data["rankup"] === "undefined" || !data["rankup"];
      
      await threadsData.set(threadID, { data });
      global.data.threadData.set(threadID, data);
      
      api.sendMessage(
        `${data["rankup"] ? "✅ 𝑪𝒉𝒂𝒍𝒖" : "🚫 𝑩𝒂𝒏𝒅𝒉𝒐"} | ✨ 𝑹𝒂𝒏𝒌𝒖𝒑 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒔𝒆𝒕𝒕𝒊𝒏𝒈 𝒖𝒑𝒅𝒂𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!`,
        threadID,
        messageID
      );
    } catch (error) {
      console.error("Rankup Command Error:", error);
      api.sendMessage("❌ | Error in rankup command. Please try again later.", event.threadID, event.messageID);
    }
  },

  onChat: async function({ api, event, usersData, threadsData }) {
    try {
      const { threadID, senderID } = event;
      
      // Check if rankup is enabled for this thread
      const thread = await threadsData.get(threadID) || {};
      if (typeof thread.data?.rankup !== "undefined" && thread.data?.rankup === false) return;

      // Create directories if not exists
      const rankupDir = path.join(__dirname, "cache", "rankup");
      if (!fs.existsSync(rankupDir)) fs.mkdirSync(rankupDir, { recursive: true });
      
      const pathImg = path.join(rankupDir, `rankup_${threadID}_${senderID}.png`);
      const pathAvt = path.join(rankupDir, `avt_${senderID}.png`);

      let exp = (await usersData.get(senderID)).exp || 0;
      exp += 1; // Default reward

      const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
      const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

      if (level <= curLevel || level === 1) return;

      // Updated working background images
      const backgrounds = [
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1500&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1500&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1500&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1500&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1500&h=1000&fit=crop"
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
        ctx.font = "bold 120px 'Arial'";
        ctx.fillStyle = "#8B4513";
        ctx.textAlign = "center";
        ctx.fillText(`LEVEL ${level}`, 750, 650);

        // Add user name
        const userInfo = await api.getUserInfo(senderID);
        const userName = userInfo[senderID]?.name || "Unknown User";
        ctx.font = "bold 70px 'Arial'";
        ctx.fillStyle = "#4B0082";
        ctx.fillText(userName, 750, 750);

        // Add congratulatory message in Bengali
        ctx.font = "italic 50px 'Arial'";
        ctx.fillStyle = "#006400";
        ctx.fillText("অভিনন্দন! আপনি উন্নীত হয়েছেন", 750, 850);

        // Save and send
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        
        const messageBody = `🌸 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 ${userName}, 𝒕𝒖𝒎𝒊 𝒆𝒃𝒂𝒓 𝒍𝒆𝒗𝒆𝒍 𝒃𝒂𝒓𝒉𝒍𝒂𝒎𝒐 ${level} 🌸`;

        await api.sendMessage({
          body: messageBody,
          mentions: [{ tag: userName, id: senderID }],
          attachment: fs.createReadStream(pathImg)
        }, threadID);

        // Update user experience
        await usersData.set(senderID, { exp });

      } catch (error) {
        console.error("Rankup image processing error:", error);
      } finally {
        // Clean up temporary files
        if (fs.existsSync(pathAvt)) fs.unlinkSync(pathAvt);
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
      }

    } catch (error) {
      console.error("Rankup onChat error:", error);
    }
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
