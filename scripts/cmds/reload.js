const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "reload",
    aliases: ["restart", "reboot"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "system",
    shortDescription: {
      en: "🔄 Bot command reload with stylish canvas"
    },
    longDescription: {
      en: "🔄 Bot command reload with stylish canvas message and timer"
    },
    guide: {
      en: "{p}reload [time]"
    },
    dependencies: {
      "canvas": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install canvas.", event.threadID, event.messageID);
      }

      const { threadID, messageID, senderID } = event;
      const GOD = global.config.GOD || [];

      if (!GOD.includes(senderID)) {
        return api.sendMessage("⚠️ Apnar ei command babohar sompotto nei!", threadID, messageID);
      }

      // Time calculation
      let time = args.join(" ");
      const rstime = time && !isNaN(time) ? parseInt(time) : 69;

      // Canvas setup
      const canvas = createCanvas(600, 250);
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stylish text
      ctx.fillStyle = "#00ffea";
      ctx.font = "bold 32px Sans";
      ctx.textAlign = "center";
      ctx.fillText("🤖 BOT RELOADING...", canvas.width / 2, 80);

      ctx.fillStyle = "#ffffff";
      ctx.font = "22px Sans";
      ctx.fillText(`Punararmbho hobe ${rstime} second por ⏳`, canvas.width / 2, 140);

      ctx.font = "18px Sans";
      ctx.fillText("⚡ Stay tuned!", canvas.width / 2, 200);

      const buffer = canvas.toBuffer();

      // Send stylish canvas image
      await api.sendMessage({ 
        body: `🔄 Bot reload scheduled for ${rstime} seconds...`,
        attachment: buffer 
      }, threadID);

      // Timeout for restart
      setTimeout(() => {
        api.sendMessage("✅ Bot punararmbho hocche...", threadID, () => process.exit(1));
      }, rstime * 1000);

    } catch (error) {
      console.error("Reload Command Error:", error);
      api.sendMessage("❌ | Error in reload command.", event.threadID, event.messageID);
    }
  }
};
