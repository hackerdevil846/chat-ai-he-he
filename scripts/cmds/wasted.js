module.exports.config = {
  name: "wasted",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙒𝘼𝙎𝙏𝙀𝘿 𝙗𝙖𝙣𝙣𝙚𝙧 𝙘𝙧𝙚𝙖𝙩𝙤𝙧",
  commandCategory: "𝙗𝙖𝙣𝙣𝙚𝙧",
  cooldowns: 2,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": "",
  },
};

module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/wasted.png";
  let pathAva = __dirname + "/cache/avt.png";
  
  // Determine user ID
  let uid;
  if (!args[0]) {
    uid = senderID;
  } else if (event.type == "message_reply") {
    uid = event.messageReply.senderID;
  } else if (args.join().indexOf('@') !== -1) {
    uid = Object.keys(event.mentions)[0];
  } else {
    uid = args[0];
  }

  // Get user avatar
  let Avatar = (
    await axios.get(
      `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
  
  // Get wasted overlay
  let getWanted = (
    await axios.get(`https://zenzapis.xyz/photoeditor/wasted?apikey=7990c7f07144`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
  
  // Create composition
  let baseImage = await loadImage(pathImg);
  let baseAva = await loadImage(pathAva);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseAva, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  
  // Save and send result
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAva);
  
  return api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
