module.exports.config = {
  name: "rankup",
  version: "7.3.1",
  hasPermssion: 1,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑷𝒓𝒐𝒕𝒊𝒕𝒚 𝒈𝒓𝒐𝒖𝒑 𝒆𝒃𝒐𝒏𝒈 𝒖𝒔𝒆𝒓 𝒅𝒆𝒓 𝒓𝒂𝒏𝒌𝒖𝒑 𝒆𝒓 𝒔𝒐𝒎𝒃𝒐𝒓𝒅𝒉𝒐𝒏𝒂",
  commandCategory: "𝑰𝑴𝑮-𝑬𝒅𝒊𝒕",
  dependencies: {
    "fs-extra": ""
  },
  cooldowns: 2,
};

module.exports.handleEvent = async function({ api, event, Currencies, Users, getText }) {
  var {threadID, senderID } = event;
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/noprefix/rankup/rankup.png";
  let pathAvt1 = __dirname + "/cache/avtmot.png";
  var id1 = event.senderID;
  
  threadID = String(threadID);
  senderID = String(senderID);

  const thread = global.data.threadData.get(threadID) || {};

  let exp = (await Currencies.getData(senderID)).exp;
  exp = exp += 1;

  if (isNaN(exp)) return;

  if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
    await Currencies.setData(senderID, { exp });
    return;
  };

  const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
  const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

  if (level > curLevel && level != 1) {
    const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
    var messsage = (typeof thread.customRankup == "undefined") ? msg = getText("levelup") : msg = thread.customRankup, 
      arrayContent;

    messsage = messsage
      .replace(/\{name}/g, name)
      .replace(/\{level}/g, level);

    const moduleName = this.config.name;

    var background = [
      "https://i.imgur.com/tVCXB0q.jpeg",
      "https://i.imgur.com/JBYox72.jpeg",
      "https://i.imgur.com/SRRuSRk.jpeg",
      "https://i.imgur.com/qhx5HLz.jpeg",
      "https://i.imgur.com/kbB4AfZ.jpeg",
      "https://i.imgur.com/9oxlszW.jpeg",
      "https://i.imgur.com/cJj8LTu.jpeg",
      "https://i.imgur.com/LHb5eJt.jpeg",
    ];
    
    var rd = background[Math.floor(Math.random() * background.length)];
    let getAvtmot = (
      await axios.get(
        `https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));
  
    let getbackground = (
      await axios.get(`${rd}`, {
        responseType: "arraybuffer",
      })
    ).data;
    
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));
  
    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(pathAvt1);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.rotate(-25 * Math.PI / 180);
    ctx.drawImage(baseAvt1, 40, 710, 630, 700);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
    
    api.sendMessage({
      body: messsage, 
      mentions: [{ tag: name, id: senderID }], 
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg));
  }

  await Currencies.setData(senderID, { exp });
  return;
}

module.exports.languages = {
  "vi": {
    "off": "𝑩𝒂𝒏𝒅𝒉𝒐",
    "on": "𝑪𝒉𝒂𝒍𝒖",
    "successText": "𝒓𝒂𝒏𝒌𝒖𝒑 𝒆𝒓 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒔𝒐𝒎𝒃𝒐𝒓𝒅𝒉𝒐𝒏𝒂 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 ✨",
    "levelup": "🌸 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 {name}, 𝒕𝒖𝒎𝒊 𝒆𝒃𝒂𝒓 𝒍𝒆𝒗𝒆𝒍 𝒃𝒂𝒓𝒉𝒍𝒂𝒎𝒐 {level} 🌸"
  },
  "en": {
    "off": "𝑩𝒂𝒏𝒅𝒉𝒐",
    "on": "𝑪𝒉𝒂𝒍𝒖",
    "successText": "𝒓𝒂𝒏𝒌𝒖𝒑 𝒆𝒓 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒔𝒐𝒎𝒃𝒐𝒓𝒅𝒉𝒐𝒏𝒂 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 ✨",
    "levelup": "🌸 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 {name}, 𝒕𝒖𝒎𝒊 𝒆𝒃𝒂𝒓 𝒍𝒆𝒗𝒆𝒍 𝒃𝒂𝒓𝒉𝒍𝒂𝒎𝒐 {level} 🌸"
  }
}

module.exports.run = async function({ api, event, Threads, getText }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  
  if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
  else data["rankup"] = false;
  
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  
  return api.sendMessage(
    `${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`,
    threadID,
    messageID
  );
}
