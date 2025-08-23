const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "noprefix",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "💬 Automatically responds to specific trigger words",
  category: "noprefix",
  usages: "Trigger words: fuck, pak yu, paku, etc.",
  cooldowns: 5
};

module.exports.onLoad = function () {
  // Create directory if it doesn't exist during bot startup
  const gifDir = path.join(__dirname, 'noprefix');
  if (!fs.existsSync(gifDir)) {
    fs.mkdirSync(gifDir, { recursive: true });
    console.log('📁 Created noprefix directory');
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;

  if (!body || senderID === api.getCurrentUserID()) return;

  const triggers = [
    "fuck", "pak yu", "pak you", "pakyu", "pak u", "fyoutoo",
    "f u", "fuck you", "f*ck", "paku", "pack you", "fak you",
    "fock", "fack", "fak", "fuk", "fock you", "fack you"
  ];

  const messageText = body.toLowerCase().trim();
  const isTriggered = triggers.some(trigger =>
    messageText.includes(trigger.toLowerCase())
  );

  if (isTriggered) {
    try {
      const gifPath = path.join(__dirname, 'noprefix', 'fuck.gif');
      const responseMessage = `💢 𝗩𝗮𝗶𝘆𝗮 𝗼𝗿 𝗔𝗽𝗽𝗶 😏
𝗔𝗽𝗻𝗮𝗿𝗲 𝗮𝗸𝘁𝗼 𝗹𝗼𝗷𝗷𝗮 𝗸𝗼𝗿𝗲𝗻...
𝗔𝗺𝗮𝗸𝗲 𝗲𝗶𝗿𝗼𝗸𝗼𝗺 𝘄𝗼𝗿𝗱 𝗴𝗼𝗹𝗮 𝗯𝗼𝗹𝗯𝗲𝗻 𝗻𝗮𝗵 𝗽𝗹𝗲𝗮𝘀𝗲... 😏`;

      if (fs.existsSync(gifPath)) {
        api.sendMessage({
          body: responseMessage,
          attachment: fs.createReadStream(gifPath)
        }, threadID, messageID);
      } else {
        api.sendMessage(responseMessage, threadID, messageID);
        console.warn(`⚠️ Missing GIF at: ${gifPath}`);
      }
    } catch (error) {
      console.error("❌ Error in noprefix command:", error);
      api.sendMessage("⚠️ Please mind your language! 😏", threadID, messageID);
    }
  }
};

// Required empty function for GoatBot structure
module.exports.run = function ({ api, event, args }) {
  api.sendMessage("✅ Noprefix system is active!", event.threadID, event.messageID);
};
