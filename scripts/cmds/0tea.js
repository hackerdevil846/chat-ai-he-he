const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tea",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "☕ | 𝑇𝑒𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑣𝑒𝑛𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟",
    category: "𝑛𝑜𝑝𝑟𝑒𝑓𝑖𝑥",
    usages: "𝑡𝑒𝑎/𝑇𝑒𝑎/𝐶ℎ𝑎𝑖/𝐶𝐻𝐴𝐼/𝐶ℎ𝑎/𝐶𝐻𝐴",
    cooldowns: 5
  },

  onStart: async function() {}, // Required empty function for loader

  onChat: async function({ api, event }) {
    try {
      const { threadID, messageID, body } = event;
      const triggers = ["tea", "Tea", "Chai", "CHAI", "Cha", "CHA"];
      
      if (body && triggers.some(trigger => body.toLowerCase().includes(trigger.toLowerCase()))) {
        const teaVideoPath = path.join(__dirname, "noprefix", "tea.mp4");
        
        if (fs.existsSync(teaVideoPath)) {
          const msg = {
            body: "☕ | 𝑎𝑖𝑖 𝑙𝑜 𝑏𝑎𝑏𝑦 ☕",
            attachment: fs.createReadStream(teaVideoPath)
          };
          await api.sendMessage(msg, threadID);
          await api.setMessageReaction("🫖", messageID, (err) => {}, true);
        } else {
          await api.sendMessage("☕ | 𝑎𝑖𝑖 𝑙𝑜 𝑏𝑎𝑏𝑦 ☕\n❌ 𝑉𝑖𝑑𝑒𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑!", threadID);
        }
      }
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑡𝑒𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
    }
  },

  handleEvent: async function({ api, event }) {
    const { threadID, messageID, body } = event;
    const triggers = ["tea", "Tea", "Chai", "CHAI", "Cha", "CHA"];
    
    if (body && triggers.some(trigger => body.toLowerCase().startsWith(trigger.toLowerCase()))) {
      try {
        const teaVideoPath = path.join(__dirname, "noprefix", "tea.mp4");
        
        if (fs.existsSync(teaVideoPath)) {
          const msg = {
            body: "☕ | 𝑎𝑖𝑖 𝑙𝑜 𝑏𝑎𝑏𝑦 ☕",
            attachment: fs.createReadStream(teaVideoPath)
          };
          await api.sendMessage(msg, threadID);
          await api.setMessageReaction("🫖", messageID, (err) => {}, true);
        } else {
          await api.sendMessage("☕ | 𝑎𝑖𝑖 𝑙𝑜 𝑏𝑎𝑏𝑦 ☕\n❌ 𝑉𝑖𝑑𝑒𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑!", threadID);
        }
      } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑡𝑒𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
      }
    }
  }
};
