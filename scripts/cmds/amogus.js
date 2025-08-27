const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sus",
    aliases: [],
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝒉𝒊𝒉𝒊𝒉𝒊𝒉𝒊"
    },
    longDescription: {
      en: "𝑺𝒖𝒔 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒕𝒉𝒂𝒕 𝒓𝒆𝒔𝒑𝒐𝒏𝒅𝒔 𝒕𝒐 𝒔𝒖𝒔𝒑𝒊𝒄𝒊𝒐𝒖𝒔 𝒘𝒐𝒓𝒅𝒔"
    },
    category: "𝒇𝒖𝒏",
    guide: {
      en: "{p}sus"
    }
  },

  onStart: async function ({ api, event }) {
    // This function can remain empty if not needed
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    
    // List of trigger words (case-sensitive)
    const triggers = [
      "amogus", "Amogus", 
      "sus", "Sus", 
      "sussy", "Sussy",
      "ඞ"
    ];
    
    // Check if message contains any trigger word
    if (triggers.some(trigger => body && body.includes(trigger))) {
      try {
        const audioPath = path.join(__dirname, "assets", "sus.mp3");
        
        // Check if file exists
        if (!fs.existsSync(audioPath)) {
          console.error("Audio file not found:", audioPath);
          return;
        }
        
        const msg = {
          body: "ඞ 𝑺𝑼𝑺𝑺𝒀 𝑩𝑨𝑲𝑨! 😱",
          attachment: fs.createReadStream(audioPath)
        };
        
        // Send SUS response
        api.sendMessage(msg, threadID, messageID);
        
        // Add reaction
        api.setMessageReaction("😱", messageID, (err) => {
          if (err) console.error("Failed to set reaction:", err);
        }, true);
      } catch (error) {
        console.error("Error in sus command:", error);
      }
    }
  }
};
