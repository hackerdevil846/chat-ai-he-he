const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "ham",
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random ham image" },
    longDescription: { en: "Sends a random ham placeholder image" },
    category: "fun",
    guide: { en: "+ham" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://baconmockup.com/600/400";
    const filePath = path.join(__dirname, "cache/ham.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🍖 𝗛𝗮𝗺 𝗣𝗹𝗮𝗰𝗲𝗵𝗼𝗹𝗱𝗲𝗿 𝗜𝗺𝗮𝗴𝗲",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗵𝗮𝗺 𝗶𝗺𝗮𝗴𝗲.");
    });
  }
};
