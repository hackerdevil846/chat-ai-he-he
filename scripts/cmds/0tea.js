const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tea",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "☕ | 𝑻𝒆𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒗𝒆𝒏𝒕 𝒉𝒂𝒏𝒅𝒍𝒆𝒓",
    category: "noprefix",
    usages: "tea/Tea/Chai/CHAI/Cha/CHA",
    cooldowns: 5
  },

  onStart: async function() {}, // Required empty function for loader

  onChat: async function({ api, event, message }) {
    try {
      const { threadID, messageID } = event;
      const triggers = ["tea", "Tea", "Chai", "CHAI", "Cha", "CHA"];
      
      if (triggers.some(trigger => event.body && event.body.toLowerCase().includes(trigger.toLowerCase()))) {
        const teaVideoPath = path.join(__dirname, "noprefix", "tea.mp4");
        
        if (fs.existsSync(teaVideoPath)) {
          const msg = {
            body: "☕ | 𝒂𝒊𝒊 𝒍𝒐 𝒃𝒂𝒃𝒚 ☕",
            attachment: fs.createReadStream(teaVideoPath)
          };
          await message.reply(msg);
          await api.setMessageReaction("🫖", messageID, (err) => {}, true);
        } else {
          await message.reply("☕ | 𝒂𝒊𝒊 𝒍𝒐 𝒃𝒂𝒃𝒚 ☕\n❌ 𝑽𝒊𝒅𝒆𝒐 𝒇𝒊𝒍𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅!");
        }
      }
    } catch (error) {
      console.error("𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒕𝒆𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:", error);
    }
  },

  handleEvent: async function({ api, event }) {
    const { threadID, messageID } = event;
    const triggers = ["tea", "Tea", "Chai", "CHAI", "Cha", "CHA"];
    
    if (triggers.some(trigger => event.body && event.body.indexOf(trigger) === 0)) {
      try {
        const teaVideoPath = path.join(__dirname, "noprefix", "tea.mp4");
        
        if (fs.existsSync(teaVideoPath)) {
          const msg = {
            body: "☕ | 𝒂𝒊𝒊 𝒍𝒐 𝒃𝒂𝒃𝒚 ☕",
            attachment: fs.createReadStream(teaVideoPath)
          };
          await api.sendMessage(msg, threadID, messageID);
          await api.setMessageReaction("🫖", messageID, (err) => {}, true);
        } else {
          await api.sendMessage("☕ | 𝒂𝒊𝒊 𝒍𝒐 𝒃𝒂𝒃𝒚 ☕\n❌ 𝑽𝒊𝒅𝒆𝒐 𝒇𝒊𝒍𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅!", threadID, messageID);
        }
      } catch (error) {
        console.error("𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒕𝒆𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:", error);
      }
    }
  },

  run: async function({ api, event, message }) {
    try {
      await message.reply("☕ | 𝑻𝒆𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒊𝒔 𝒂𝒄𝒕𝒊𝒗𝒆! 𝑻𝒚𝒑𝒆 '𝒕𝒆𝒂' 𝒕𝒐 𝒈𝒆𝒕 𝒂 𝒘𝒂𝒓𝒎 𝒄𝒖𝒑! 🫖");
    } catch (error) {
      console.error("𝑬𝒓𝒓𝒐𝒓:", error);
    }
  }
};
