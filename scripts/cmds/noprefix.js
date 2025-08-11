const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "noprefix",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Asif",
  description: "Automatically responds to specific trigger words",
  category: "noprefix",
  usages: "Trigger words: fuck, pak yu, paku, etc.",
  cooldowns: 5
};

// Added the required onStart function
module.exports.onStart = function() {
  // This function is required but doesn't need to do anything for this command
  // You could add initialization logic here if needed
};

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  
  // Ignore messages from the bot itself
  if (senderID === api.getCurrentUserID()) return;
  
  // List of trigger words (case-insensitive)
  const triggers = [
    "fuck", "pak yu", "pak you", "pakyu", "pak u", "fyoutoo",
    "Fuck", "Pak yu", "Pak you", "Pakyu", "Pak u", "F you too",
    "f u", "fuck you", "f*ck", "paku", "pack you", "fak you",
    "fock", "fack", "fak", "fuk", "fock you", "fack you"
  ];

  // Check if message contains any trigger word
  const messageText = body.toLowerCase().trim();
  const isTriggered = triggers.some(trigger => 
    messageText.includes(trigger.toLowerCase())
  );

  if (isTriggered) {
    try {
      // Path to GIF file
      const gifDir = path.join(__dirname, 'noprefix');
      const gifPath = path.join(gifDir, 'fuck.gif');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(gifDir)) {
        fs.mkdirSync(gifDir, { recursive: true });
      }
      
      // Playful Bengali response message
      const responseMessage = "𝘃𝗮𝗶𝘆𝗮 𝗼𝗿 𝗮𝗽𝗽𝗶 😏\n" +
        "𝗮𝗽𝗻𝗮𝗿𝗲 𝗮𝗸𝘁𝗼 𝗹𝗼𝗷𝗷𝗮 𝗸𝗼𝗿𝗲𝗻...\n" +
        "𝗮𝗺𝗮𝗸𝗲 𝗲𝗶𝗿𝗼𝗸𝗼𝗺 𝘄𝗼𝗿𝗱 𝗴𝗼𝗹𝗮 𝗯𝗼𝗹𝗯𝗲𝗻 𝗻𝗮𝗵 𝗽𝗹𝗲𝗮𝘀𝗲... 😏";

      // Check if GIF exists
      if (fs.existsSync(gifPath)) {
        // Send response with GIF
        api.sendMessage({
          body: responseMessage,
          attachment: fs.createReadStream(gifPath)
        }, threadID, messageID);
      } else {
        // Send text-only response if GIF missing
        api.sendMessage(responseMessage, threadID, messageID);
        
        // Log that the GIF is missing
        console.warn(`GIF file missing at: ${gifPath}`);
      }
    } catch (error) {
      console.error("Error in noprefix command:", error);
      // Fallback text-only response
      api.sendMessage("Please mind your language! 😏", threadID, messageID);
    }
  }
};

// Optional run function for manual testing
module.exports.run = function() {};
