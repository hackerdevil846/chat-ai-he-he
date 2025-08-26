module.exports.config = {
  name: "bestu",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒆𝒔𝒕𝒖 𝑷𝒂𝒊𝒓 𝑩𝒂𝒏𝒂𝒏𝒐𝒓 𝒋𝒐𝒏𝒏𝒐 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒆𝒏",
  category: "image",
  usages: "[@mention]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const path = require("path");
  const fs = require("fs-extra");
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const pathFile = path.resolve(__dirname, 'cache/canvas', 'bestu.png');
  if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
  if (!fs.existsSync(pathFile)) await downloadFile("https://i.imgur.com/RloX16v.jpg", pathFile);
};

async function makeImage({ one, two }) {
  const fs = require("fs-extra");
  const path = require("path");
  const axios = require("axios");
  const jimp = require("jimp");
  const __root = path.resolve(__dirname, "cache", "canvas");

  const baseImage = await jimp.read(__root + "/bestu.png");
  const pathImg = __root + `/bestu_${one}_${two}.png`;
  const avatarOnePath = __root + `/avt_${one}.png`;
  const avatarTwoPath = __root + `/avt_${two}.png`;

  // Download avatars
  const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne, 'utf-8'));

  const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo, 'utf-8'));

  // Create circular avatars
  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  // Composite avatars on base image
  baseImage.composite(circleOne.resize(191, 191), 93, 111).composite(circleTwo.resize(190, 190), 434, 107);

  // Save final image
  const buffer = await baseImage.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, buffer);

  // Cleanup
  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

function toMathBoldItalic(text) {
  const map = {
    'A':'𝑨','B':'𝑩','C':'𝑪','D':'𝑫','E':'𝑬','F':'𝑭','G':'𝑮','H':'𝑯','I':'𝑰','J':'𝑱',
    'K':'𝑲','L':'𝑳','M':'𝑴','N':'𝑵','O':'𝑶','P':'𝑷','Q':'𝑸','R':'𝑹','S':'𝑺','T':'𝑻',
    'U':'𝑼','V':'𝑽','W':'𝑾','X':'𝑿','Y':'𝒀','Z':'𝒁',
    'a':'𝒂','b':'𝒃','c':'𝒄','d':'𝒅','e':'𝒆','f':'𝒇','g':'𝒈','h':'𝒉','i':'𝒊','j':'𝒋',
    'k':'𝒌','l':'𝒍','m':'𝒎','n':'𝒏','o':'𝒐','p':'𝒑','q':'𝒒','r':'𝒓','s':'𝒔','t':'𝒕',
    'u':'𝒖','v':'𝒗','w':'𝒘','x':'𝒙','y':'𝒚','z':'𝒛'
  };
  return text.split('').map(char => map[char] || char).join('');
}

module.exports.onStart = async function ({ api, event, args }) {
  const fs = require("fs-extra");
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);

  if (!mention[0]) {
    const msg = toMathBoldItalic("𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒋𝒐𝒏𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏 😅");
    return api.sendMessage(msg, threadID, messageID);
  }

  const one = senderID, two = mention[0];
  return makeImage({ one, two }).then(path => {
    const bodyMsg = toMathBoldItalic(`✧•❁𝑩𝒂𝒏𝒅𝒉𝒖𝒕𝒕𝒐❁•✧

╔═══❖••° °••❖═══╗

   𝑺𝒐𝒇𝒐𝒍 𝑷𝒂𝒊𝒓𝒊𝒏𝒈

╚═══❖••° °••❖═══╝

   ✶⊶⊷⊷❍⊶⊷⊷✶

       👑𝑵𝒊𝒚𝒆 𝑵𝒂𝒐 𝑩𝒂𝒏𝒅𝒉𝒖 ❤

𝑻𝒐𝒎𝒂𝒓 𝑩𝒆𝒔𝒕𝒖 🩷

   ✶⊶⊷⊷❍⊶⊷⊷✶`);
    api.sendMessage({
      body: bodyMsg,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  });
};
