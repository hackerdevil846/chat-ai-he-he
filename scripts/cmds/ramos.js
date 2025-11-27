const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "ramos",
    aliases: ["don", "sergio", "elcapitan"],
    version: "2.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "football",
    shortDescription: {
      en: "🏆 Send picture of football legend Sergio Ramos"
    },
    longDescription: {
      en: "🏆 Send picture of football legend Sergio Ramos with stylish high-quality canvas effects"
    },
    guide: {
      en: "{p}ramos"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": "",
      "path": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, "cache");
    const tempPath = path.join(cacheDir, `ramos_${Date.now()}.jpg`);

    try {
      // 1. Ensure Dependencies & Directory
      if (!fs.existsSync(cacheDir)) {
        fs.ensureDirSync(cacheDir);
      }

      // 2. Image Links (Kept exactly as requested)
      const links = [
        "https://i.imgur.com/BRuM5hi.jpg",
        "https://i.imgur.com/zB45Tjq.jpg",
        "https://i.imgur.com/23CvexD.jpg",
        "https://i.imgur.com/xyL8y6V.jpg",
        "https://i.imgur.com/3a5ZdSx.jpg",
        "https://i.imgur.com/KqOXCkN.jpg",
        "https://i.imgur.com/Ti0wDXc.jpg",
        "https://i.imgur.com/tbX8CxB.jpg",
        "https://i.imgur.com/KxAcDXQ.jpg",
        "https://i.imgur.com/zj4l1YD.jpg",
        "https://i.imgur.com/mj92wlj.jpg",
        "https://i.imgur.com/Cpb9LTe.jpg",
        "https://i.imgur.com/EmCCFDI.jpg",
        "https://i.imgur.com/ov6R5zE.jpg",
        "https://i.imgur.com/0yjhfIM.jpg",
        "https://i.imgur.com/JMhwt57.jpg",
        "https://i.imgur.com/WFKnSrZ.jpg",
        "https://i.imgur.com/ATiXOrS.jpg",
        "https://i.imgur.com/jZuG1I9.jpg",
        "https://i.imgur.com/YV3QQIi.jpg",
        "https://i.imgur.com/8bnxdc2.jpg",
        "https://i.imgur.com/jahexN4.jpg",
        "https://i.imgur.com/fjNkjZT.jpg"
      ];

      const selectedImg = links[Math.floor(Math.random() * links.length)];

      // 3. Download Image
      const response = await axios.get(selectedImg, { responseType: 'arraybuffer' });
      const image = await loadImage(response.data);

      // 4. Setup Canvas (Dynamic Size)
      // Adding extra height for the "Polaroid" style text area
      const canvasWidth = image.width;
      const canvasHeight = image.height + 140; 
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');

      // --- STYLISH EFFECTS START ---

      // Background (Dark Blue Theme)
      ctx.fillStyle = "#0a192f";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw the Image
      ctx.drawImage(image, 0, 0, canvasWidth, image.height);

      // Stylish Border (Gradient)
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
      gradient.addColorStop(0, "#FC6736"); // Orange
      gradient.addColorStop(0.5, "#FFD700"); // Gold
      gradient.addColorStop(1, "#FC6736"); // Orange
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 15;
      ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

      // Text Configuration
      ctx.textAlign = "center";
      
      // Main Title: "THE IMMORTAL WALL"
      ctx.font = "bold 55px sans-serif";
      ctx.fillStyle = "#FFD700"; // Gold color
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      
      // Draw Text Outline (Stroke)
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeText("⚔️ THE IMMORTAL WALL ⚔️", canvasWidth / 2, image.height + 65);
      // Draw Text Fill
      ctx.fillText("⚔️ THE IMMORTAL WALL ⚔️", canvasWidth / 2, image.height + 65);

      // Subtitle / Watermark
      ctx.font = "italic 30px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.shadowBlur = 0; // Reset shadow for small text
      ctx.fillText("𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 • 𝑆𝑒𝑟𝑔𝑖𝑜 𝑅𝑎𝑚𝑜𝑠", canvasWidth / 2, image.height + 110);

      // --- STYLISH EFFECTS END ---

      // 5. Save to File
      const buffer = canvas.toBuffer('image/jpeg');
      await fs.outputFile(tempPath, buffer);

      // 6. Send Message
      const msgBody = "🏆 | 𝗛𝗘𝗥𝗘 𝗖𝗢𝗠𝗘𝗦 𝗧𝗛𝗘 𝗟𝗘𝗚𝗘𝗡𝗗!\n\n⚡️ | 𝗦𝗲𝗿𝗴𝗶𝗼 𝗥𝗮𝗺𝗼𝘀 - 𝗧𝗵𝗲 𝗜𝗺𝗺𝗼𝗿𝘁𝗮𝗹 𝗪𝗮𝗹𝗹 𝗼𝗳 𝗙𝗼𝗼𝘁𝗯𝗮𝗹𝗹\n\n🐐 | 𝗧𝗵𝗲 𝗚𝗿𝗲𝗮𝘁𝗲𝘀𝘁 𝗗𝗲𝗳𝗲𝗻𝗱𝗲𝗿 𝗶𝗻 𝗵𝗶𝘀𝘁𝗼𝗿𝘆";
      
      await api.sendMessage({
        body: msgBody,
        attachment: fs.createReadStream(tempPath)
      }, threadID, messageID);

      // 7. Cleanup
      try {
        fs.unlinkSync(tempPath);
      } catch (e) {
        // Ignore unlink errors if file is somehow busy, temp files get cleaned up eventually
      }

    } catch (error) {
      console.error("Ramos command error:", error);
      api.sendMessage("❌ | 𝗘𝗿𝗿𝗼𝗿 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗥𝗮𝗺𝗼𝘀 𝗶𝗺𝗮𝗴𝗲. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝑟.", threadID, messageID);
    }
  }
};
