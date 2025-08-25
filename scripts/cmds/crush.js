module.exports.config = {
  name: "crush",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "💖 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂 𝒍𝒐𝒗𝒆 𝒑𝒂𝒊𝒓 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒄𝒓𝒖𝒔𝒉",
  category: "💝 𝑳𝒐𝒗𝒆",
  usages: "[@𝒎𝒆𝒏𝒕𝒊𝒐𝒏]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'crush.png');
  
  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/PlVBaM1.jpg", path);
};

module.exports.onStart = async function({ event, api, args }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);
  
  if (!mention[0]) return api.sendMessage("💖 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒂 𝒍𝒐𝒗𝒆 𝒑𝒂𝒊𝒓!", threadID, messageID);

  try {
    const one = senderID;
    const two = mention[0];
    const userName = (await global.utils.getUserInfo(two))[two].name;
    
    const makeImage = async ({ one, two }) => {
      const jimp = global.nodemodule["jimp"];
      const axios = global.nodemodule["axios"];
      const __root = path.resolve(__dirname, "cache", "canvas");
      
      const crushImg = await jimp.read(__root + "/crush.png");
      const pathImg = __root + `/crush_${one}_${two}.png`;
      const avatarOne = __root + `/avt_${one}.png`;
      const avatarTwo = __root + `/avt_${two}.png`;

      const getAvatar = async (uid, path) => {
        const data = (await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(data, 'utf-8'));
      };

      await getAvatar(one, avatarOne);
      await getAvatar(two, avatarTwo);

      const circle = async (imagePath) => {
        const image = await jimp.read(imagePath);
        image.circle();
        return await image.getBufferAsync("image/png");
      };

      const circleOne = await jimp.read(await circle(avatarOne));
      const circleTwo = await jimp.read(await circle(avatarTwo));
      
      crushImg.composite(circleOne.resize(191, 191), 93, 111)
              .composite(circleTwo.resize(190, 190), 434, 107);

      const raw = await crushImg.getBufferAsync("image/png");
      fs.writeFileSync(pathImg, raw);
      
      [avatarOne, avatarTwo].forEach(path => fs.unlinkSync(path));
      return pathImg;
    };

    const resultPath = await makeImage({ one, two });
    
    return api.sendMessage({
      body: `💘 𝑳𝒐𝒗𝒆 𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒊𝒐𝒏 💘\n\n╔═════❖•❁❖═════╗\n\n   🫶 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍 𝑷𝒂𝒊𝒓𝒊𝒏𝒈 🫶\n\n╚═════❖•❁❖═════╝\n\n✨ 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒄𝒓𝒖𝒔𝒉 𝒘𝒊𝒕𝒉 ${userName}!\n💌 𝑮𝒓𝒂𝒃 𝒕𝒉𝒆𝒎 𝒂𝒏𝒅 𝒎𝒂𝒌𝒆 𝒊𝒕 𝒐𝒇𝒇𝒊𝒄𝒊𝒂𝒍! 💕\n\n🔮 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
      attachment: fs.createReadStream(resultPath)
    }, threadID, () => fs.unlinkSync(resultPath), messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆", threadID, messageID);
  }
};
