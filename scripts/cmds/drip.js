module.exports.config = {
  name: "drip",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "✨ 𝑫𝒓𝒊𝒑 𝒆𝒇𝒇𝒆𝒄𝒕 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒃𝒂𝒏𝒂𝒐",
  category: "🖼️ 𝑰𝒎𝒂𝒈𝒆",
  usages: "",
  cooldowns: 3,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function({ api, event, args, Users, Threads, Currencies }) {
  try {
    const { createCanvas, loadImage } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    
    let pathImg = __dirname + `/cache/${event.threadID}_${event.senderID}.png`;
    let pathAva = __dirname + `/cache/avt${event.senderID}.png`;

    // Get user's avatar
    let Avatar = (await axios.get(
      `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(pathAva, Buffer.from(Avatar, 'utf-8'));

    // Process avatar
    let avatar = await this.circle(pathAva);
    
    // Get drip template
    let dripTemplate = await axios.get("https://i.imgur.com/e3YvQWP.jpg", {
      responseType: "arraybuffer"
    });
    fs.writeFileSync(pathImg, Buffer.from(dripTemplate.data, "utf-8"));

    // Compose image
    let template = await loadImage(pathImg);
    let ava = await loadImage(avatar);
    let canvas = createCanvas(template.width, template.height);
    let ctx = canvas.getContext("2d");
    
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(ava, 320, 80, 239, 239); // Adjust position as needed

    // Save and send
    let result = canvas.toBuffer();
    fs.writeFileSync(pathImg, result);
    fs.unlinkSync(pathAva);

    return api.sendMessage({
      body: `✨ 𝑫𝒓𝒊𝒑 𝑬𝒇𝒇𝒆𝒄𝒕 𝑰𝒎𝒂𝒈𝒆 𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!⚡`,
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

  } catch (error) {
    console.log(error);
    return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆", event.threadID, event.messageID);
  }
};
