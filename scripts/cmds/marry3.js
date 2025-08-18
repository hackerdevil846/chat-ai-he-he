const axios = require('axios');
const jimp = require('jimp');
const fs = require('fs-extra');

module.exports.config = {
  name: "marry3",
  aliases: ["marryfour"],
  version: "2.0",
  author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  countDown: 5,
  role: 0,
  shortDescription: "Create marriage proposal image",
  longDescription: "Generate wedding image with mentioned person",
  category: "love",
  guide: "{pn} @mention",
  dependencies: {
    "axios": "",
    "jimp": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ event, message, args, usersData }) {
  try {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) {
      return message.reply("❌ | Please mention someone to marry!");
    }

    const one = event.senderID;
    const two = mention[0];

    const path = await generateMarriageImage(one, two);
    
    message.reply({
      body: "💍 | Biye hoye gelo! Mubarak ho! 🥰",
      attachment: fs.createReadStream(path)
    }, () => fs.unlinkSync(path));

  } catch (err) {
    console.error(err);
    message.reply("❌ | Marriage failed! Something went wrong.");
  }
};

async function generateMarriageImage(one, two) {
  const path = __dirname + "/cache/marryv4.png";
  
  const [avatarOne, avatarTwo, background] = await Promise.all([
    jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
    jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
    jimp.read("https://i.postimg.cc/XN1TcH3L/tumblr-mm9nfpt7w-H1s490t5o1-1280.jpg")
  ]);

  avatarOne.circle();
  avatarTwo.circle();

  background.resize(1024, 684)
    .composite(avatarOne.resize(85, 85), 204, 160)
    .composite(avatarTwo.resize(80, 80), 315, 105);

  await background.writeAsync(path);
  return path;
}
