const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "facialhair",
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Random beard style avatar"
    },
    longDescription: {
      en: "Sends a randomly generated masculine facial hair image"
    },
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://placebeard.it/400x400";
    const filePath = path.join(__dirname, "cache/beard.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🧔 𝗥𝗮𝗻𝗱𝗼𝗺 𝗙𝗮𝗰𝗶𝗮𝗹 𝗛𝗮𝗶𝗿 𝗔𝘃𝗮𝘁𝗮𝗿",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗳𝗮𝗰𝗶𝗮𝗹 𝗵𝗮𝗶𝗿 𝗮𝘃𝗮𝘁𝗮𝗿.");
    });
  }
};
