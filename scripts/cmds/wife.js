const fs = require('fs');
const request = require('request');

module.exports = {
  config: {
    name: "wife",
    version: "1.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: "auto reply to special message",
    longDescription: "Responds when someone says 'Asif's wifey' with a customized message.",
    category: "no prefix",
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "asif's wifey") {
      const filePath = `${__dirname}/tmp/wife.mp4`;
      const writer = fs.createWriteStream(filePath);

      const attachmentRequest = request("https://i.imgur.com/tPzzqVl.mp4");
      attachmentRequest.pipe(writer);

      writer.on('finish', () => {
        message.reply({
          body:
            "╭───────────────⊹⊱❖⊰⊹───────────────╮\n" +
            "         💞 𝐀𝐬𝐢𝐟'𝐬 𝐖𝐢𝐟𝐞𝐲 💞\n" +
            "╰───────────────⊹⊱❖⊰⊹───────────────╯\n\n" +
            "💫 Hey hey! Dekho ke aise cute cute ashe —\n" +
            "🦋 sundor little princess ✨\n\n" +
            "───────────────✧───────────────\n" +
            "🤖 Bot: Asif BOT 🔥",
          attachment: fs.createReadStream(filePath)
        }, () => fs.unlinkSync(filePath));
      });
    }
  }
};
