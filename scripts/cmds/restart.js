const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: "restart",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "system",
    shortDescription: {
      en: "🔄 Restart the bot"
    },
    longDescription: {
      en: "🔄 Restart the bot with stylish canvas message"
    },
    guide: {
      en: "{p}restart"
    },
    dependencies: {
      "canvas": ""
    }
  },

  onLoad: function () {
    console.log("✅ Restart command loaded successfully.");
  },

  onStart: async function ({ api, event }) {
    try {
      // Check dependencies
      try {
        if (!createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install canvas.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;

      // Create canvas
      const canvas = createCanvas(600, 200);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text styling
      ctx.font = "bold 30px Sans";
      ctx.fillStyle = "#00ffea";
      ctx.textAlign = "center";
      ctx.fillText("🔄 Bot is Restarting...", canvas.width / 2, canvas.height / 2 - 10);

      ctx.font = "20px Sans";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`See you soon!`, canvas.width / 2, canvas.height / 2 + 30);

      const buffer = canvas.toBuffer();

      // Send canvas image before restarting
      await api.sendMessage({ 
        body: `💡 [ ${global.config.BOTNAME || "Bot"} ] Bot punarabar suru hocche...\n👑 By: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
        attachment: buffer 
      }, threadID);

      // Restart the bot
      setTimeout(() => {
        process.exit(1);
      }, 2000);

    } catch (error) {
      console.error("Restart Command Error:", error);
      api.sendMessage("❌ | Error restarting the bot.", event.threadID, event.messageID);
    }
  }
};
