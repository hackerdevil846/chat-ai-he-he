module.exports.config = {
  name: "crush",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑮𝒆𝒕 𝒂 𝒍𝒐𝒗𝒆 𝒑𝒂𝒊𝒓 𝒇𝒓𝒐𝒎 𝒎𝒆𝒏𝒕𝒊𝒐𝒏",
  commandCategory: "𝑳𝒐𝒗𝒆",
  usages: "[@𝒎𝒆𝒏𝒕𝒊𝒐𝒏]",
  cooldowns: 5, 
  dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
  }
};

module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'crush.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/PlVBaM1.jpg", path); 
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let batgiam_img = await jimp.read(__root + "/crush.png");
  let pathImg = __root + `/crush_${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));
  batgiam_img.composite(circleOne.resize(191, 191), 93, 111).composite(circleTwo.resize(190, 190), 434, 107);

  let raw = await batgiam_img.getBufferAsync("image/png");

  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {    
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);
  
  if (!mention[0]) {
    return api.sendMessage("💖 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒂 𝒍𝒐𝒗𝒆 𝒑𝒂𝒊𝒓!", threadID, messageID);
  }
  else {
      const one = senderID, two = mention[0];
      const userName = (await global.utils.getUserInfo(two))[two].name;
      
      return makeImage({ one, two }).then(path => 
        api.sendMessage({ 
          body: `💘 𝑳𝒐𝒗𝒆 𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒊𝒐𝒏 💘\n\n╔═════❖•❁❖═════╗\n\n   🫶 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍 𝑷𝒂𝒊𝒓𝒊𝒏𝒈 🫶\n\n╚═════❖•❁❖═════╝\n\n✨ 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒄𝒓𝒖𝒔𝒉 𝒘𝒊𝒕𝒉 ${userName}!\n💌 𝑮𝒓𝒂𝒃 𝒕𝒉𝒆𝒎 𝒂𝒏𝒅 𝒎𝒂𝒌𝒆 𝒊𝒕 𝒐𝒇𝒇𝒊𝒄𝒊𝒂𝒍! 💕\n\n🔮 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
          attachment: fs.createReadStream(path) 
        }, threadID, () => fs.unlinkSync(path), messageID)
      );
  }
}
