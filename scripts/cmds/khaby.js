const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "khaby",
  version: "1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "😂 Make a Khaby Lame meme with your text!",
  commandCategory: "write",
  usages: "[text1] | [text2]",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs": ""
  }
};

module.exports.languages = {
  "en": {
    "errorFormat": "❌ Please enter the correct format like: !khaby Coke | Pepsi."
  },
  "bn": {
    "errorFormat": "❌ সঠিক ফরম্যাট ব্যবহার করুন: !khaby Coke | Pepsi."
  }
};

module.exports.run = async function({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  const text = args.join(" ");

  if (!text) return api.sendMessage(getText("errorFormat"), threadID, messageID);

  const text1 = text.split("|")[0]?.trim();
  const text2 = text.split("|")[1]?.trim();

  if (!text1 || !text2) return api.sendMessage(getText("errorFormat"), threadID, messageID);

  const pathToSave = __dirname + "/assets/any.png";
  const memeURL = `https://api.memegen.link/images/khaby-lame/${encodeURIComponent(text1)}/${encodeURIComponent(text2)}.png`;

  const callback = () => {
    api.sendMessage(
      { body: `✨ Here's your Khaby Meme!`, attachment: fs.createReadStream(pathToSave) },
      threadID,
      () => fs.unlinkSync(pathToSave),
      messageID
    );
  };

  request(encodeURI(memeURL))
    .pipe(fs.createWriteStream(pathToSave))
    .on("close", () => callback());
};
