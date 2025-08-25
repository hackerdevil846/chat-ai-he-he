const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");

module.exports.config = {
  name: "marry3",
  version: "2.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "💍 Create a marriage proposal image with someone!",
  category: "love",
  usages: "@mention",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "jimp": "",
    "fs-extra": ""
  }
};

module.exports.languages = {
  "en": {
    noMention: "❌ | Please mention someone to marry!",
    marrySuccess: "💍 | Biye hoye gelo! Mubarak ho! 🥰",
    marryFail: "❌ | Marriage failed! Something went wrong."
  }
};

module.exports.onLoad = function () {
  // No special setup needed
};

module.exports.onStart = async function ({ api, event, args, Users, Threads, message }) {
  try {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) return message.reply(global.getText("noMention"));

    const userOne = event.senderID;
    const userTwo = mention[0];

    const imagePath = await generateMarriageImage(userOne, userTwo);

    return message.reply({
      body: global.getText("marrySuccess"),
      attachment: fs.createReadStream(imagePath)
    }, () => fs.unlinkSync(imagePath));

  } catch (err) {
    console.error(err);
    return message.reply(global.getText("marryFail"));
  }
};

// Function to generate the marriage image
async function generateMarriageImage(one, two) {
  const path = __dirname + "/cache/marryv4.png";

  const [avatarOne, avatarTwo, background] = await Promise.all([
    jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
    jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
    jimp.read("https://i.postimg.cc/XN1TcH3L/tumblr-mm9nfpt7w-H1s490t5o1-1280.jpg")
  ]);

  avatarOne.circle();
  avatarTwo.circle();

  background
    .resize(1024, 684)
    .composite(avatarOne.resize(85, 85), 204, 160)
    .composite(avatarTwo.resize(80, 80), 315, 105);

  await background.writeAsync(path);
  return path;
}
