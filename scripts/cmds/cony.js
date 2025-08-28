const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cony",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "Predict love probability"
    },
    longDescription: {
      en: "Predicts your chance of having a boyfriend/girlfriend this year"
    },
    guide: {
      en: "{p}cony"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    try {
      const tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%", "1%", "10%", "99,9%"];
      const tle = tl[Math.floor(Math.random() * tl.length)];
      
      // Get user data
      const userData = await usersData.get(event.senderID);
      const name = userData.name;

      // Path to the GIF file
      const imagePath = path.join(__dirname, "cache", "chucmung.gif");
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        return message.reply("❌ Image file not found in cache folder!");
      }

      // Send message with attachment
      await message.reply({
        body: `🌸 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘂𝗹𝗮𝘁𝗶𝗼𝗻𝘀 ${name}!\n𝗬𝗼𝘂𝗿 𝗹𝗼𝘃𝗲 𝗽𝗿𝗼𝗯𝗮𝗯𝗶𝗹𝗶𝘁𝘆 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝘆𝗲𝗮𝗿 𝗶𝘀: ${tle} ❤️`,
        attachment: fs.createReadStream(imagePath)
      });

    } catch (error) {
      console.error("Cony Command Error:", error);
      await message.reply("❌ An error occurred while processing the command.");
    }
  }
};
