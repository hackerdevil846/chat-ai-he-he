// toilet.js

module.exports.config = {
  name: "toilet",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙏𝙤𝙞𝙡𝙚𝙩 🚽",
  category: "𝙄𝙢𝙖𝙜𝙚",
  usages: "toilet @tag",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "canvas": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;

  const dirMaterial = __dirname + "/cache/";
  const templatePath = resolve(__dirname, "cache", "toilet.png");

  if (!existsSync(dirMaterial)) {
    mkdirSync(dirMaterial, { recursive: true });
  }
  if (!existsSync(templatePath)) {
    await downloadFile(
      "https://i.imgur.com/BtSlsSS.jpg",
      templatePath
    );
  }
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  const cacheDir = path.resolve(__dirname, "cache");
  const baseImg = await jimp.read(cacheDir + "/toilet.png");
  const outPath = cacheDir + `/toilet_${one}_${two}.png`;

  const avatarOnePath = cacheDir + `/avt_${one}.png`;
  const avatarTwoPath = cacheDir + `/avt_${two}.png`;

  // Download avatars
  const avatarOneData = (
    await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneData, "utf-8"));

  const avatarTwoData = (
    await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoData, "utf-8"));

  // Make circular avatars
  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  // Composite onto template
  baseImg
    .resize(292, 345)
    .composite(circleOne.resize(70, 70), 100, 200)
    .composite(circleTwo.resize(70, 70), 100, 200);

  // Save and cleanup
  const buffer = await baseImg.getBufferAsync("image/png");
  fs.writeFileSync(outPath, buffer);
  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return outPath;
}

async function circle(imagePath) {
  const jimp = require("jimp");
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.onStart = async function ({ event, api }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID, mentions } = event;
  const tagged = Object.keys(mentions);

  if (!tagged.length) return;
  const one = senderID;
  const two = tagged[0];

  makeImage({ one, two }).then((imgPath) => {
    api.sendMessage(
      { attachment: fs.createReadStream(imgPath) },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  });
};
