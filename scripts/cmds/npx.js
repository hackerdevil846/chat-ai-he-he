const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "emojireact",
    aliases: ["er", "emoji"],
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "💖 𝑅𝑒𝑎𝑐𝑡𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑝𝑒𝑐𝑖𝑎𝑙 𝑣𝑖𝑑𝑒𝑜 𝑓𝑜𝑟 𝑒𝑚𝑜𝑗𝑖 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑠 💖"
    },
    longDescription: {
      en: "💖 𝑅𝑒𝑎𝑐𝑡𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑝𝑒𝑐𝑖𝑎𝑙 𝑣𝑖𝑑𝑒𝑜 𝑤ℎ𝑒𝑛 𝑑𝑒𝑡𝑒𝑐𝑡𝑖𝑛𝑔 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑒𝑚𝑜𝑗𝑖𝑠 💖"
    },
    category: "𝑒𝑛𝑡𝑒𝑟𝑡𝑎𝑖𝑛𝑚𝑒𝑛𝑡",
    guide: {
      en: "😍 | 🤩 | 🥰"
    },
    dependencies: {
      "request": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    // Dependency check
    try {
      if (!request) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
    } catch (error) {
      return api.sendMessage(`❌ ${error.message}`, event.threadID, event.messageID);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    const content = body ? body.toLowerCase() : "";

    if (!content) return;

    const triggerEmojis = ["🥰", "🤩", "😍"];
    const shouldReact = triggerEmojis.some(emoji => content.startsWith(emoji));

    if (shouldReact) {
      try {
        const videoLinks = [
          "https://i.imgur.com/LLucP15.mp4",
          "https://i.imgur.com/DEBRSER.mp4"
        ];
        const rndm = videoLinks[Math.floor(Math.random() * videoLinks.length)];

        const media = await new Promise((resolve, reject) => {
          request.get({ url: rndm, encoding: null }, (error, response, body) => {
            error ? reject(error) : resolve(body);
          });
        });

        const path = __dirname + "/tmp_emojireact.mp4";
        fs.writeFileSync(path, media);
        
        api.sendMessage(
          {
            body: "🖤🥀 𝐻𝑒𝑟𝑒'𝑠 𝑎 𝑠𝑝𝑒𝑐𝑖𝑎𝑙 𝑐𝑙𝑖𝑝 𝑓𝑜𝑟 𝑦𝑜𝑢! 💫",
            attachment: fs.createReadStream(path)
          },
          threadID,
          messageID,
          () => {
            setTimeout(() => {
              try {
                fs.unlinkSync(path);
              } catch (e) {}
            }, 5000);
          }
        );

        api.setMessageReaction("🖤", messageID, () => {}, true);
      } catch (error) {
        console.error("✨ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑒𝑚𝑜𝑗𝑖𝑅𝑒𝑎𝑐𝑡:", error);
      }
    }
  }
};
