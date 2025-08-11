const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "boy",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Asif",
    description: "Send random Islamic boy profile pictures",
    category: "image",
    usages: "boy",
    cooldowns: 2,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  // Added required onStart function
  onStart: async function() {
    // Initialization if needed
  },

  run: async ({ api, event }) => {
    try {
      const imageLinks = [
        "https://i.imgur.com/QhlqGb1.jpg",
        "https://i.imgur.com/BQDcmQ7.jpg",
        "https://i.imgur.com/A2bkbNb.jpg",
        "https://i.imgur.com/ncg20xm.jpg",
        "https://i.imgur.com/jVxUXTK.jpg",
        "https://i.imgur.com/sJvWPWK.jpg",
        "https://i.imgur.com/ReJPvHq.jpg",
        "https://i.imgur.com/asKxDK8.jpg",
        "https://i.imgur.com/FJNdTMe.jpg",
        "https://i.imgur.com/dQg3YHi.jpg",
        "https://i.imgur.com/RiNrjIO.jpg",
        "https://i.imgur.com/olfWeCl.jpg",
        "https://i.imgur.com/2Hx0Bff.jpg",
        "https://i.imgur.com/xUVu8UA.jpg",
        "https://i.imgur.com/s3t1Aag.jpg",
        "https://i.imgur.com/koQjHE8.jpg",
        "https://i.imgur.com/7cYzLYP.jpg",
        "https://i.imgur.com/VHoGuJS.jpg",
        "https://i.imgur.com/D0Yk3cA.jpg",
        "https://i.imgur.com/gMoTt6l.jpg",
        "https://i.imgur.com/raUIgUZ.jpg",
        "https://i.imgur.com/wh5c2F8.jpg",
        "https://i.imgur.com/5lQBE5S.jpg",
        "https://i.imgur.com/ytlBQar.jpg",
        "https://i.imgur.com/IBY0JJ1.jpg",
        "https://i.imgur.com/SN9dO2X.jpg",
        "https://i.imgur.com/CURZ2xi.jpg",
        "https://i.imgur.com/pI2yFKW.jpg",
        "https://i.imgur.com/xZTrxXX.jpg",
        "https://i.imgur.com/hncJisT.jpg",
        "https://i.imgur.com/NdB4Jpv.jpg",
        "https://i.imgur.com/TFwWRzh.jpg",
        "https://i.imgur.com/qUQACV6.jpg",
        "https://i.imgur.com/WFSU1Fg.jpg",
        "https://i.imgur.com/0C6OMog.jpg",
        "https://i.imgur.com/XRNqQwD.jpg",
        "https://i.imgur.com/JMAQfKP.jpg",
        "https://i.imgur.com/Dm7H99b.jpg",
        "https://i.imgur.com/ljSjY66.jpg",
        "https://i.imgur.com/zgGE7XX.jpg",
        "https://i.imgur.com/wvIRzqH.jpg",
        "https://i.imgur.com/wCqcDtS.jpg",
        "https://i.imgur.com/7sefpqA.jpg",
        "https://i.imgur.com/gaNJLgU.jpg",
        "https://i.imgur.com/K5RfFYF.jpg",
        "https://i.imgur.com/BFuXq0I.jpg"
      ];

      const randomLink = imageLinks[Math.floor(Math.random() * imageLinks.length)];

      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath, { recursive: true });
      }

      const imagePath = path.join(cachePath, `boy_${Date.now()}.jpg`);
      const response = await axios.get(randomLink, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: "𝐈𝐒𝐋𝐀𝐌𝐈𝐂𝐊 𝐁𝐎𝐘 𝐅𝐁 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 𝐈𝐌𝐆",
          attachment: fs.createReadStream(imagePath)
        },
        event.threadID,
        () => {
          fs.unlinkSync(imagePath);
        }
      );
    } catch (err) {
      console.error("Error in boy command:", err);
      api.sendMessage("❌ Failed to send image. Please try again later.", event.threadID);
    }
  }
};
