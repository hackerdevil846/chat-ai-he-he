const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tea",
    version: "1.0.2",
    hasPermission: 0,
    credits: "Asif",
    description: "Sends a tea video when triggered",
    category: "no prefix",
    usages: "",
    cooldowns: 5,
  },

  onStart: function() {
    // Empty onStart to prevent initialization errors
  },

  handleEvent: async function({ api, event }) {
    const { threadID, messageID, body } = event;
    
    const triggers = ["tea", "Tea", "Cha", "চা"];
    const trimmedBody = body.trim().toLowerCase();
    const shouldTrigger = triggers.some(trigger => 
      trimmedBody.startsWith(trigger.toLowerCase())
    );
    
    if (!shouldTrigger) return;

    try {
      const videoPath = path.join(__dirname, "noprefix", "tea.mp4");
      
      if (!fs.existsSync(videoPath)) {
        return api.sendMessage("❌ Tea video file is missing. Please contact the admin.", threadID, messageID);
      }

      api.setMessageReaction("🫖", event.messageID, (err) => {
        if (err) console.error("Reaction error:", err);
      }, true);
      
      api.sendMessage({
        body: "🥤 Ai Lo Bby ☕",
        attachment: fs.createReadStream(videoPath)
      }, threadID, messageID);

    } catch (error) {
      console.error("Tea Command Error:", error);
      api.sendMessage("❌ An error occurred while sending the tea video. Please try again later.", threadID, messageID);
    }
  },

  run: function({}) {
    // Not needed for event-based commands
  }
};
