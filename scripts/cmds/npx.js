const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "npx",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "💖 Reacts with a special video for emoji triggers 💖",
  category: "noprefix",
  usages: "😍 | 🤩 | 🥰",
  cooldowns: 5,
  dependencies: {
    "request": ""
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  const content = body ? body.toLowerCase() : "";

  if (!content) return;

  // Trigger Emojis
  const triggerEmojis = ["🥰", "🤩", "😍"];
  const shouldReact = triggerEmojis.some(emoji => content.startsWith(emoji));

  if (shouldReact) {
    try {
      const NAYAN = [
        "https://i.imgur.com/LLucP15.mp4",
        "https://i.imgur.com/DEBRSER.mp4"
      ];
      const rndm = NAYAN[Math.floor(Math.random() * NAYAN.length)];

      const media = await new Promise((resolve, reject) => {
        request.get({ url: rndm, encoding: null }, (error, response, body) => {
          error ? reject(error) : resolve(body);
        });
      });

      api.sendMessage(
        {
          body: "🖤🥀 Here’s a special clip for you! 💫",
          attachment: fs.createReadStream(
            (() => {
              const path = __dirname + "/tmp_npx.mp4";
              fs.writeFileSync(path, media);
              setTimeout(() => fs.unlinkSync(path), 60 * 1000); // auto delete
              return path;
            })()
          )
        },
        threadID,
        messageID
      );

      api.setMessageReaction("🖤", messageID, () => {}, true);
    } catch (error) {
      console.error("✨ Error in npx.js:", error);
    }
  }
};

module.exports.run = async function () {
  // No prefix command - nothing to run here
};
