const axios = require("axios");

module.exports = {
  config: {
    name: "techjoke",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Get programming-related jokes" },
    longDescription: { en: "Sends a random programming/tech-themed joke" },
    category: "fun",
    guide: { en: "+techjoke" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://geek-jokes.sameerkumar.website/api");
      const formattedText = `𝘈𝘴𝘪𝘧 𝘔𝘢𝘩𝘮𝘶𝘥 presents:\n\n👨‍💻 𝗧𝗲𝗰𝗵 𝗝𝗼𝗸𝗲:\n"${res.data}"`;
      message.reply(formattedText);
    } catch {
      message.reply("❌ 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗲𝗰𝗵 𝗷𝗼𝗸𝗲.");
    }
  }
};
