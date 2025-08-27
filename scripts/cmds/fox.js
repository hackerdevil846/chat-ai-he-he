const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "fox",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: { en: "🅕🅞🅧 🅟🅘🅒" },
    longDescription: { en: "🅡🅐🅝🅓🅞🅜 🅕🅞🅧 🅘🅜🅐🅖🅔" },
    category: "🅕🅤🅝",
    guide: { en: "+🅕🅞🅧" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://randomfox.ca/floof/");
      const img = res.data.image;
      const file = path.join(__dirname, "cache/fox.jpg");
      const f = fs.createWriteStream(file);

      https.get(img, (r) => {
        r.pipe(f);
        f.on('finish', () => {
          message.reply({
            body: "🦊 𝗥𝗮𝗻𝗱𝗼𝗺 𝗙𝗼𝘅:",
            attachment: fs.createReadStream(file)
          });
        });
      });
    } catch {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗳𝗼𝘅 𝗶𝗺𝗮𝗴𝗲.");
    }
  }
};
