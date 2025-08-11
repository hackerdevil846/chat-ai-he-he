const fs = require("fs");
const axios = require("axios");
module.exports = {
  config: {
    name: "anigif",
    aliases: ["aigif"],
    author: "asif",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Generate an anime GIF based on a prompt"
    },
    longDescription: {
      en: "Generate an anime GIF based on a text prompt"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "[userprompt]"
    }
  },
  onStart: async function({ api, event, args }) {
    let path = __dirname + "/cache/anime.gif";
    let userPrompt;
    if (args.length === 0) {
      return api.sendMessage("Please provide a prompt for generating an anime GIF.", event.threadID, event.messageID);
    } else {
      userPrompt = args.join(" ");
    }
    let tid = event.threadID;
    let mid = event.messageID;
    try {
      api.sendMessage("⏳ Generating anime GIF... please wait, it will take time.", tid, mid);
      let enctxt = encodeURIComponent(userPrompt);
      let url = `https://t2i.onrender.com/kshitiz?prompt=${enctxt}`;

      let response = await axios.get(url);
      if (response.data.imageUrl) {
        let imageUrl = response.data.imageUrl;
        let imageResponse = await axios.get(imageUrl, { responseType: "stream" });
        imageResponse.data.pipe(fs.createWriteStream(path));
        imageResponse.data.on("end", () => {
          api.sendMessage(
            { attachment: fs.createReadStream(path) },
            tid,
            () => fs.unlinkSync(path),
            mid
          );
        });
      } else {
        return api.sendMessage("Failed to fetch anime GIF. Please try again.", tid, mid);
      }
    } catch (e) {
      return api.sendMessage(`Error: ${e.message}`, tid, mid);
    }
  }
};
