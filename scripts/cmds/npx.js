const fs = require("fs");
const request = require("request");

module.exports = {
  config: {
    name: "npx",
    version: "1.0.1",
    prefix: false,
    permission: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💖 𝙍𝙚𝙖𝙘𝙩𝙨 𝙬𝙞𝙩𝙝 𝙖 𝙨𝙥𝙚𝙘𝙞𝙖𝙡 𝙫𝙞𝙙𝙚𝙤 𝙛𝙤𝙧 𝙚𝙢𝙤𝙟𝙞 𝙩𝙧𝙞𝙜𝙜𝙚𝙧𝙨 💖",
    category: "no prefix",
    usages: "😍 | 🤩 | 🥰",
    cooldowns: 5,
    dependencies: {
      "request": ""
    }
  },

  handleEvent: async function({ api, event }) {
    const { threadID, messageID, body } = event;
    const content = body ? body.toLowerCase() : '';
    
    if (!content) return;
    
    const triggerEmojis = ["🥰", "🤩", "😍", " "];
    const shouldReact = triggerEmojis.some(emoji => content.startsWith(emoji));
    
    if (shouldReact) {
      try {
        const NAYAN = [
          "https://i.imgur.com/LLucP15.mp4",
          "https://i.imgur.com/DEBRSER.mp4"
        ];
        const rndm = NAYAN[Math.floor(Math.random() * NAYAN.length)];
        
        const media = await new Promise((resolve, reject) => {
          request.get(
            { url: rndm, encoding: null },
            (error, response, body) => {
              error ? reject(error) : resolve(body);
            }
          );
        });

        api.sendMessage({
          body: "🖤🥀",
          attachment: media
        }, threadID, messageID);
        
        api.setMessageReaction("🖤", messageID, (err) => {}, true);
      } catch (error) {
        console.error("✨ 𝙀𝙧𝙧𝙤𝙧:", error);
      }
    }
  }
};
