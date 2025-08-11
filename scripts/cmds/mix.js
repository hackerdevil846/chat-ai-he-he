module.exports.config = {
  name: "mix",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Asif",
  description: "Combine two emojis into a single image",
  category: "image",
  usages: "[emoji1] [emoji2]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.onStart = async function() {
  // Initialization if needed
};

module.exports.run = async function({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  const { threadID, messageID } = event;
  const config = this.config;

  if (args.length < 2) {
    return api.sendMessage(
      `❌ Invalid usage! Format: ${global.config.PREFIX}${config.name} ${config.usages}\nExample: ${global.config.PREFIX}mix 😂 🥰`,
      threadID,
      messageID
    );
  }

  const emoji1 = encodeURIComponent(args[0]);
  const emoji2 = encodeURIComponent(args[1]);
  const savePath = __dirname + `/cache/mix_${emoji1}_${emoji2}.png`;

  try {
    const mixUrl = `https://www.api.vyturex.com/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`;

    request(mixUrl)
      .pipe(fs.createWriteStream(savePath))
      .on("close", () => {
        api.sendMessage(
          { 
            body: `✅ Mixed ${args[0]} + ${args[1]}:`,
            attachment: fs.createReadStream(savePath)
          },
          threadID,
          () => fs.unlinkSync(savePath),
          messageID
        );
      })
      .on("error", (err) => {
        console.error("Emoji mix error:", err);
        api.sendMessage(
          `❌ Couldn't combine ${args[0]} and ${args[1]}. Try different emojis!`,
          threadID,
          messageID
        );
        if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
      });

  } catch (error) {
    console.error("Unexpected error:", error);
    api.sendMessage(
      "⚠️ An error occurred while processing your request. Please try again later.",
      threadID,
      messageID
    );
    if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
  }
};
