const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "slapaction",
    aliases: ["hitslap"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Slap someone you tag"
    },
    longDescription: {
      en: "Slaps the person you mention with a GIF"
    },
    category: "fun",
    guide: {
      en: "{p}slapaction [tag]"
    }
  },

  onStart: async function({ api, event }) {
    // Check for dependencies
    try {
      if (!request) throw new Error("Missing request dependency");
      if (!fs) throw new Error("Missing fs dependency");
      if (!axios) throw new Error("Missing axios dependency");
    } catch (error) {
      api.sendMessage(`❌ ${error.message}`, event.threadID, event.messageID);
      return;
    }

    const link = [    
      "https://i.postimg.cc/9QLrR9G4/12334wrwd534wrdf-3.gif",
      "https://i.postimg.cc/pTFT6138/12334wrwd534wrdf-8.gif", 
      "https://i.postimg.cc/L5VHddDq/slap-anime.gif",
      "https://i.postimg.cc/K8jmWHMz/VW0cOyL.gif",
    ];
    
    const mention = Object.keys(event.mentions);
    
    if (mention.length === 0) {
      return api.sendMessage("Please tag 1 person to slap", event.threadID, event.messageID);
    }
    
    const tag = event.mentions[mention[0]].replace("@", "");
    
    const callback = () => api.sendMessage({
      body: `${tag}, take this slap! 😏`,
      mentions: [{tag: tag, id: Object.keys(event.mentions)[0]}],
      attachment: fs.createReadStream(__dirname + "/cache/slap.gif")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/slap.gif"));  
    
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/slap.gif")).on("close", () => callback());
  }
};
