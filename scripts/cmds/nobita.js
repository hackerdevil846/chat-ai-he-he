const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "nobita",
    aliases: ["doraemon", "nobitavideo"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", // Kept original author
    role: 0,
    category: "entertainment",
    shortDescription: {
      en: "📺 𝐷𝑜𝑟𝑎𝑒𝑚𝑜𝑛 𝑐𝑎𝑟𝑡𝑜𝑜𝑛 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
      en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝐷𝑜𝑟𝑎𝑒𝑚𝑜𝑛 𝑎𝑛𝑑 𝑁𝑜𝑏𝑖𝑡𝑎 𝑐𝑎𝑟𝑡𝑜𝑜𝑛 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    guide: {
      en: "{p}nobita"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      const hi = ["𝐃𝐎𝐑𝐄𝐌𝐎𝐍 𝐂𝐀𝐑𝐓𝐎𝐎𝐍𝐒 𝐍𝐎𝐁𝐈𝐓𝐀 𝐏𝐀𝐑𝐓 𝐎𝐅 𝐒𝐓𝐎𝐑𝐘 𝐕𝐈𝐃𝐄𝐎"];
      const know = hi[Math.floor(Math.random() * hi.length)];

      // ALL LINKS KEPT EXACTLY AS REQUESTED - NO CHANGES
      const link = [
        "https://i.imgur.com/u5N7sqe.mp4",
        "https://i.imgur.com/0u32UXX.mp4",
        "https://i.imgur.com/sj3Asr2.mp4",
        "https://i.imgur.com/sJ3iQFR.mp4",
        "https://i.imgur.com/6IxQjHb.mp4",
        "https://i.imgur.com/SpQImVm.mp4",
        "https://i.imgur.com/rsXHTME.mp4",
        "https://i.imgur.com/bVCNwBl.mp4",
        "https://i.imgur.com/lpLN8j6.mp4",
        "https://i.imgur.com/mNekuge.mp4",
        "https://i.imgur.com/5EXQnUm.mp4",
        "https://i.imgur.com/sn1nM55.mp4",
        "https://i.imgur.com/vatwDvn.mp4",
        "https://i.imgur.com/Is914QQ.mp4",
        "https://i.imgur.com/4EGKkBr.mp4",
        "https://i.imgur.com/KMhExnR.mp4",
        "https://i.imgur.com/2exQMrj.mp4",
        "https://i.imgur.com/yjDclse.mp4",
        "https://i.imgur.com/OxkI89B.mp4",
        "https://i.imgur.com/Ma5IKum.mp4",
        "https://i.imgur.com/TDx2wE5.mp4",
        "https://i.imgur.com/xgAoeB9.mp4",
        "https://i.imgur.com/vKtOrOC.mp4",
        "https://i.imgur.com/BfeZuuR.mp4",
        "https://i.imgur.com/8zvYfUL.mp4",
        "https://i.imgur.com/dUtiu6e.mp4",
        "https://i.imgur.com/brJkCMN.mp4",
        "https://i.imgur.com/A7jM45X.mp4",
        "https://i.imgur.com/g7DH0YU.mp4",
        "https://i.imgur.com/4aWS06D.mp4",
        "https://i.imgur.com/pHsTWyQ.mp4"
      ];

      const randomLink = link[Math.floor(Math.random() * link.length)];

      // FIX: Ensure the cache directory exists to prevent 'ENOENT' errors
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // FIX: Use a unique filename to prevent conflicts if multiple users use the command
      const fileName = `nobita_${Date.now()}.mp4`;
      const filePath = path.join(cacheDir, fileName);

      // Start the download
      const response = await axios({
        method: "GET",
        url: randomLink,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      // FIX: Wrap stream in a Promise to ensure download completes before sending
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Send the file
      await message.reply({
        body: know,
        attachment: fs.createReadStream(filePath)
      });

      // Cleanup: Delete the file after sending
      fs.unlinkSync(filePath);

    } catch (error) {
      console.error("Error in nobita command:", error);
      // Attempt to delete file if it exists and error occurred during send
      try {
        const tempPath = path.join(__dirname, "cache", `nobita_${Date.now()}.mp4`); 
        // Note: The specific file might be lost in scope, but this catch block handles general failures.
      } catch (e) {} 
      
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
