module.exports.config = {
  name: "drip",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑫𝒓𝒊𝒑 𝒆𝒇𝒇𝒆𝒄𝒕 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒃𝒂𝒏𝒂𝒐",
  commandCategory: "𝑰𝒎𝒂𝒈𝒆",
  cooldowns: 3,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": "",
  },
};

module.exports.circle = async (image) => {
    const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + `/cache/${event.threadID}_${event.senderID}.png`;
  let pathAva = __dirname + `/cache/a${event.senderID}.png`;
  
  // Get user's avatar
  let Avatar = (
    await axios.get(
      `https://graph.facebook.com/${event.senderID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
  
  // Process avatar to circle
  let avatar = await this.circle(pathAva);
  
  // Get drip effect image
  let getWanted = (
    await axios.get(`https://api.popcat.xyz/drip?image=https://i.imgur.com/e3YvQWP.jpg`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
  
  // Create canvas composition
  let baseImage = await loadImage(pathImg);
  let baseAva = await loadImage(avatar);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAva, 320, 80, 239, 239);
  
  // Finalize image
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAva);
  
  return api.sendMessage(
    { 
      body: "𝑵𝒊𝒋𝒆𝒓 𝑫𝒓𝒊𝒑 𝑬𝒇𝒇𝒆𝒄𝒕 𝑰𝒎𝒂𝒈𝒆 ⚡",
      attachment: fs.createReadStream(pathImg) 
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
