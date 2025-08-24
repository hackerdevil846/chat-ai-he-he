const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "yaar",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Mention kore bondhutto themed image create korbe",
  category: "edit-img",
  usages: "@mention",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async function () {
  const dirMaterial = path.join(__dirname, "cache", "canvas");
  const imgPath = path.join(dirMaterial, "Bbro.png");

  if (!fs.existsSync(dirMaterial)) {
    fs.mkdirSync(dirMaterial, { recursive: true });
  }

  if (!fs.existsSync(imgPath)) {
    const { data } = await axios.get("https://i.imgur.com/2bY5bSV.jpg", { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(data, "utf-8"));
  }
};

module.exports.onStart = async function ({ api, event }) {
  const mention = Object.keys(event.mentions);
  if (!mention[0]) {
    return api.sendMessage("❔ | Doya kore kauke mention korun...", event.threadID, event.messageID);
  }

  const one = event.senderID;
  const two = mention[0];

  const imgPath = await makeImage({ one, two });
  return api.sendMessage({
    body: "✧•❁ 𝐁𝐨𝐧𝐝𝐡𝐮 ❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   👬 𝗦𝗮𝗳𝗮𝗹 𝗝𝗼𝗱𝗶 👬\n\n╚═══❖••° °••❖═══╝\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶\n\n       👑 𝗘𝗶 𝗻𝗮𝗼, 𝗽𝗲𝘆𝗲 𝗴𝗲𝗰𝗵𝗼 ❤\n\n💖 𝗧𝗼𝗺𝗮𝗿 𝗝𝗶𝗴𝗿𝗶 𝗗𝗼𝘀𝘁 🩷\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶",
    attachment: fs.createReadStream(imgPath)
  }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
};

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");

  let baseImg = await jimp.read(path.join(__root, "Bbro.png"));
  let outputPath = path.join(__root, `batman${one}_${two}.png`);
  let avatarOnePath = path.join(__root, `avt_${one}.png`);
  let avatarTwoPath = path.join(__root, `avt_${two}.png`);

  // Download avatars
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo, 'utf-8'));

  // Circle crop
  let circleOne = await jimp.read(await circle(avatarOnePath));
  let circleTwo = await jimp.read(await circle(avatarTwoPath));

  baseImg.composite(circleOne.resize(191, 191), 93, 111).composite(circleTwo.resize(190, 190), 434, 107);

  let raw = await baseImg.getBufferAsync("image/png");
  fs.writeFileSync(outputPath, raw);

  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return outputPath;
}

async function circle(image) {
  let img = await jimp.read(image);
  img.circle();
  return await img.getBufferAsync("image/png");
}
