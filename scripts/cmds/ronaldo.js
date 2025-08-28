const axios = require("axios");

module.exports = {
  config: {
    name: "ronaldo",
    aliases: ["cr7"],
    version: "1.2",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "football",
    shortDescription: {
      en: "𝑺𝒆𝒏𝒅 𝒓𝒂𝒏𝒅𝒐𝒎 𝑪𝒓𝒊𝒔𝒕𝒊𝒂𝒏𝒐 𝑹𝒐𝒏𝒂𝒍𝒅𝒐 𝒑𝒉𝒐𝒕𝒐𝒔 ⚽🐐"
    },
    longDescription: {
      en: "𝑺𝒆𝒏𝒅𝒔 𝒉𝒊𝒈𝒉-𝒒𝒖𝒂𝒍𝒊𝒕𝒚 𝒓𝒂𝒏𝒅𝒐𝒎 𝒊𝒎𝒂𝒈𝒆𝒔 𝒐𝒇 𝑪𝒓𝒊𝒔𝒕𝒊𝒂𝒏𝒐 𝑹𝒐𝒏𝒂𝒍𝒅𝒐"
    },
    guide: {
      en: "{p}ronaldo"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, Users }) {
    try {
      // Ronaldo image links
      const allLinks = [
        "https://i.imgur.com/gwAuLMT.jpg",
        "https://i.imgur.com/MuuhaJ4.jpg",
        "https://i.imgur.com/6t0R8fs.jpg",
        "https://i.imgur.com/7RTC4W5.jpg",
        "https://i.imgur.com/VTi2dTP.jpg",
        "https://i.imgur.com/gdXJaK9.jpg",
        "https://i.imgur.com/VqZp7IU.jpg",
        "https://i.imgur.com/9pio8Lb.jpg",
        "https://i.imgur.com/iw714Ym.jpg",
        "https://i.imgur.com/zFbcrjs.jpg",
        "https://i.imgur.com/e0td0K9.jpg",
        "https://i.imgur.com/gsJWOmA.jpg",
        "https://i.imgur.com/lU8CaT0.jpg",
        "https://i.imgur.com/mmZXEYl.jpg",
        "https://i.imgur.com/d2Ot9pW.jpg",
        "https://i.imgur.com/iJ1ZGwZ.jpg",
        "https://i.imgur.com/isqQhNQ.jpg",
        "https://i.imgur.com/GoKEy4g.jpg",
        "https://i.imgur.com/TjxTUsl.jpg",
        "https://i.imgur.com/VwPPL03.jpg",
        "https://i.imgur.com/45zAhI7.jpg",
        "https://i.imgur.com/n3agkNi.jpg",
        "https://i.imgur.com/F2mynhI.jpg",
        "https://i.imgur.com/XekHaDO.jpg"
      ];

      // Get random image
      const randomImage = allLinks[Math.floor(Math.random() * allLinks.length)];

      // Get sender name
      let senderName = "Friend";
      try {
        if (event && event.senderID) {
          const userInfo = await Users.getData(event.senderID);
          senderName = userInfo.name || "Friend";
        }
      } catch (error) {
        console.log("Could not get user name:", error);
      }

      // Send the image
      await message.reply({
        body: `🌟 𝐇𝐞𝐫𝐞 𝐂𝐨𝐦𝐞𝐬 𝐓𝐡𝐞 𝐆𝐎𝐀𝐓 — Cristiano Ronaldo! 🐐⚽\n\n𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝 𝐛𝐲: ${senderName}\n\n— 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
        attachment: await global.utils.getStreamFromURL(randomImage)
      });

    } catch (error) {
      console.error("Ronaldo command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
