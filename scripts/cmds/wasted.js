const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "wasted",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Asif Developer",
    description: "Create GTA-style 'wasted' banners",
    category: "image",
    usages: "[@mention | reply | uid]",
    cooldowns: 5,
    dependencies: {
      "canvas": "",
      "axios": ""
    }
  },

  // Added the required onStart function
  onStart: function() {
    console.log("[!] Wasted command initialized");
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID, senderID, type, messageReply } = event;
    
    try {
      // Determine target user
      let targetID = senderID;
      if (type === "message_reply") {
        targetID = messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      } else if (args[0] && !isNaN(args[0])) {
        targetID = args[0];
      }

      // Send processing message
      api.sendMessage("⚠️ Creating your WASTED banner...", threadID, messageID);
      
      // Create canvas
      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext("2d");
      
      // Get avatar
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;
      const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      const avatar = await loadImage(Buffer.from(avatarResponse.data));
      
      // Draw avatar
      ctx.drawImage(avatar, 0, 0, 512, 512);
      
      // Apply red tint (GTA wasted effect)
      ctx.fillStyle = "rgba(200, 0, 0, 0.4)";
      ctx.fillRect(0, 0, 512, 512);
      
      // Add WASTED overlay
      const wastedOverlay = await loadImage('https://i.imgur.com/1fVK4nZ.png');
      ctx.drawImage(wastedOverlay, 0, 0, 512, 512);
      
      // Save final image
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      const outputPath = path.join(cacheDir, `wasted_${Date.now()}.png`);
      const buffer = canvas.toBuffer();
      fs.writeFileSync(outputPath, buffer);
      
      // Send result
      api.sendMessage({
        body: "⚠️ W A S T E D ⚠️",
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Cleanup
        try {
          fs.unlinkSync(outputPath);
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }, messageID);

    } catch (error) {
      console.error("Wasted command error:", error);
      api.sendMessage("❌ Failed to create wasted banner. Please try again later.", threadID, messageID);
    }
  }
};
