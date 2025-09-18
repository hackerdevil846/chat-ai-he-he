const fs = require("fs-extra");

module.exports = {
  config: {
    name: "sub",
    aliases: ["subscribe", "priyansh"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "no prefix",
    shortDescription: {
      en: "🔔 𝙎𝙪𝙗𝙨𝙘𝙧𝙞𝙗𝙚 𝙨𝙖𝙢𝙥𝙖𝙧𝙠𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"
    },
    longDescription: {
      en: "𝘈𝘶𝘵𝘰-𝘳𝘦𝘴𝘱𝘰𝘯𝘥 𝘸𝘪𝘵𝘩 𝘴𝘶𝘣𝘴𝘤𝘳𝘪𝘱𝘵𝘪𝘰𝘯 𝘮𝘦𝘴𝘴𝘢𝘨𝘦 𝘸𝘩𝘦𝘯 𝘵𝘳𝘪𝘨𝘨𝘦𝘳 𝘸𝘰𝘳𝘥𝘴 𝘢𝘳𝘦 𝘥𝘦𝘵𝘦𝘤𝘵𝘦𝘥"
    },
    guide: {
      en: ""
    },
    countDown: 5,
    dependencies: {
      "fs-extra": ""
    }
  },

  onChat: async function({ api, event, message }) {
    try {
      const { threadID, messageID, body } = event;

      const triggerWords = [
        "priyansh rajput",
        "sub", 
        "subscribe",
        "priyansh"
      ];

      const lowerBody = body.toLowerCase();
      
      if (triggerWords.some(word => lowerBody.includes(word.toLowerCase()))) {
        const msg = {
          body: "👋 𝙆𝙤𝙣𝙤 𝙨𝙖𝙝𝙖𝙮𝙮𝙖 𝙡𝙖𝙜𝙡𝙚 @𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝙪𝒅 𝙠𝙚 𝙘𝙤𝙣𝙩𝙖𝙘𝙩 𝙠𝙤𝙧𝙪𝙣 😇",
          attachment: fs.createReadStream(__dirname + `/noprefix/sub.mp3`)
        };
        
        await message.reply(msg);
        api.setMessageReaction("🔔", messageID, (err) => {}, true);
      }
    } catch (error) {
      console.error("Sub command error:", error);
    }
  },

  onStart: async function({ api, event, message }) {
    // No additional functionality needed for start command
    // This is primarily a no-prefix/onChat command
  }
};
