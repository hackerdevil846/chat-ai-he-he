const fs = require("fs");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "women",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "Asif Developer",
    description: "Automated response to women-related keywords",
    category: "no prefix",
    usages: "women",
    cooldowns: 5,
  },

  // Added onStart function
  onStart: function() {
    console.log("[!] Women response module initialized");
  },

  handleEvent: async function({ api, event }) {
    try {
      const { threadID, messageID, body } = event;
      
      // Define trigger keywords with variations
      const triggers = [
        "women", "woman", "female", "females", "ladies", "girls", "☕",
        "Women", "Woman", "Female", "Females", "Ladies", "Girls"
      ];
      
      // Check if message contains any trigger
      const isTriggered = body && triggers.some(trigger => 
        body.toLowerCase().includes(trigger.toLowerCase())
      );

      if (isTriggered) {
        // Video file path
        const assetsDir = path.join(__dirname, "assets");
        const videoPath = path.join(assetsDir, "women.mp4");
        
        // Create assets directory if missing
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true });
        }
        
        // Verify video exists or download it
        if (!fs.existsSync(videoPath)) {
          // Send setup message
          api.sendMessage("☕ Setting up women response system...", threadID, messageID);
          
          // Download video from reliable source
          const file = fs.createWriteStream(videoPath);
          const request = https.get("https://drive.usercontent.google.com/download?id=1yF7cZ4yQw4S3q7o7XfY6X8Jt0gZ9XZ0g&export=download", (response) => {
            response.pipe(file);
            
            file.on("finish", () => {
              file.close();
              // Send the video after download completes
              this.sendWomenResponse(api, threadID, messageID, videoPath);
            });
          });
        } else {
          // Video exists, send immediately
          this.sendWomenResponse(api, threadID, messageID, videoPath);
        }
      }
    } catch (error) {
      console.error("Women command error:", error);
    }
  },
  
  sendWomenResponse: function(api, threadID, messageID, videoPath) {
    try {
      // Send response
      api.sendMessage({
        body: "☕ Women moment! 🤣",
        attachment: fs.createReadStream(videoPath)
      }, threadID, messageID);

      // Add reaction
      api.setMessageReaction("☕", messageID, (err) => {
        if (err) console.error("Reaction error:", err);
      }, true);
    } catch (error) {
      console.error("Response sending error:", error);
      api.sendMessage("❌ Failed to send women response. Video might be missing.", threadID, messageID);
    }
  },

  run: function({ api, event }) {
    api.sendMessage(
      "This command responds automatically to keywords like:\n" +
      "• women\n• woman\n• female\n• ☕\n• girls\n\n" +
      "Just mention any of these in your message to trigger the response!",
      event.threadID,
      event.messageID
    );
  }
};
