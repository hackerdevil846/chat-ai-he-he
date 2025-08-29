const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "binz",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "𝑃𝑙𝑎𝑦𝑠 𝐵𝐼𝐺𝐶𝐼𝑇𝑌𝐵𝑂𝐼 𝑎𝑢𝑑𝑖𝑜 𝑤ℎ𝑒𝑛 𝑢𝑠𝑒𝑟 𝑡𝑦𝑝𝑒𝑠 '𝑏𝑖𝑛𝑧'",
    commandCategory: "𝑛𝑜 𝑝𝑟𝑒𝑓𝑖𝑥",
    usages: "𝑛𝑜 𝑝𝑟𝑒𝑓𝑖𝑥 𝑛𝑒𝑒𝑑𝑒𝑑",
    cooldowns: 5,
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, client, __GLOBAL }) {
    // This function can be empty for event-based commands
  },

  handleEvent: async function({ api, event }) {
    const { threadID, messageID, body } = event;
    
    // Check if message contains "binz" (case insensitive)
    if (body && (body.toLowerCase().includes("binz"))) {
      try {
        // Define path to audio file
        const audioPath = path.join(__dirname, 'noprefix', 'binz.mp3');
        
        // Check if audio file exists
        if (!fs.existsSync(audioPath)) {
          console.error("Audio file not found:", audioPath);
          return api.sendMessage({
            body: "❌ 𝐴𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛."
          }, threadID, messageID);
        }

        // Send message with audio attachment
        const msg = {
          body: "𝐵𝐼𝐺𝐶𝐼𝑇𝑌𝐵𝑂𝐼 🎵",
          attachment: fs.createReadStream(audioPath)
        };
        
        return api.sendMessage(msg, threadID, messageID);
        
      } catch (error) {
        console.error("Error in binz command:", error);
        api.sendMessage({
          body: "❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑙𝑎𝑦𝑖𝑛𝑔 𝑎𝑢𝑑𝑖𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
        }, threadID, messageID);
      }
    }
  }
};
