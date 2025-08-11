const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const { mergeImages, loadImage, Canvas } = require("canvas-wrapper");

module.exports = {
  config: {
    name: "clown",
    version: "1.0",
    author: "asif",
    countDown: 1,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "meme",
    guide: "{pn}",
    envConfig: {
      deltaNext: 5,
    },
  },

  langs: {
    vi: {
      noTag: "Bạn phải tag người bạn muốn tát",
    },
    en: {
      noTag: "You must tag the person you want to",
    },
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    let mention = Object.keys(event.mentions);
    let uid;

    if (event.type == "message_reply") {
      uid = event.messageReply.senderID;
    } else {
      if (mention[0]) {
        uid = mention[0];
      } else {
        uid = event.senderID;
      }
    }

    let url = await usersData.getAvatarUrl(uid);
    let baseImage = await new DIG.Triggered().getImage(url);
    const clownImage = await loadImage("./clownImage.jpg");

    const canvas = new Canvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(clownImage, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    const clownBuffer = canvas.toBuffer();
    const pathSave = `${__dirname}/tmp/clown.png`;

    fs.writeFileSync(pathSave, clownBuffer);

    let body;
    if (mention[0]) {
      body = `{userName} added some clownish vibes!`;
    } else {
      body = "You're the clown, looking at yourself!\nReply or mention someone else";
    }
    message.reply(
      {
        body: body.replace("{userName}", event.senderName),
        attachment: fs.createReadStream(pathSave),
      },
      () => fs.unlinkSync(pathSave)
    );
  },
};
