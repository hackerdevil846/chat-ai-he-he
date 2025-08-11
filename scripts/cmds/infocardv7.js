const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download" 

module.exports.config = {
  name: "cardinfo7",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑰𝒏𝒇𝒐 𝒄𝒂𝒓𝒅 𝒃𝒂𝒏𝒂𝒐",
  commandCategory: "𝒊𝒏𝒇𝒐",
  cooldowns: 2,
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
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  
  let pathImg = __dirname + `/cache/${senderID}${threadID}_info.png`;
  let pathAvata = __dirname + `/cache/avtuser.png`;
  
  let uid;
  if (event.type == "message_reply") {
    uid = event.messageReply.senderID;
  } else {
    uid = event.senderID;
  }
  
  const res = await api.getUserInfoV2(uid);
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=1449557605494892|aaf0a865c8bafc314ced5b7f18f3caa6`, { 
    responseType: 'arraybuffer' 
  })).data;
  
  let bg = (await axios.get(`https://i.imgur.com/rqbC4ES.jpg`, {
    responseType: "arraybuffer",
  })).data;
  
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  let avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

  // Download font if missing
  if (!fs.existsSync(__dirname + fonts)) {
    let getfont = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + fonts, Buffer.from(getfont, "utf-8"));
  }

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 910, 465, 229, 229);
  
  // Process user data
  let gender = res.gender == 'male' ? "𝑴𝒂𝒍𝒆" : res.gender == 'female' ? "𝑭𝒆𝒎𝒂𝒍𝒆" : "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
  let birthday = res.birthday == "Không Có Dữ Liệu" ? "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅" : res.birthday;
  let love = res.relationship_status == "Không Có Dữ Liệu" ? "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅" : res.relationship_status;
  let fl = res.follow == "Không Có Dữ Liệu" ? "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅" : res.follow;
  let location = res.location?.name == "Không Có Dữ Liệu" ? "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅" : res.location?.name || "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
  let hometown = res.hometown?.name == "Không Có Dữ Liệu" ? "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅" : res.hometown?.name || "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";

  // Register and use font
  Canvas.registerFont(__dirname + fonts, { family: "Play-Bold" });
  
  // Draw info with Mathematical Bold Italic styling
  ctx.font = `35px Play-Bold`;
  ctx.fillStyle = "#00FFFF";
  
  ctx.fillText(`𝑵𝒂𝒎𝒆: ${res.name}`, 340, 560);
  ctx.fillText(`𝑮𝒆𝒏𝒅𝒆𝒓: ${gender}`, 1245, 448);
  ctx.fillText(`𝑭𝒐𝒍𝒍𝒐𝒘: ${fl}`, 1245, 505);
  ctx.fillText(`𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑: ${love}`, 1245, 559);
  ctx.fillText(`𝑩𝒊𝒓𝒕𝒉𝒅𝒂𝒚: ${birthday}`, 1245, 616);
  ctx.fillText(`𝑳𝒐𝒄𝒂𝒕𝒊𝒐𝒏: ${location}`, 1245, 668);
  ctx.fillText(`𝑯𝒐𝒎𝒆𝒕𝒐𝒘𝒏: ${hometown}`, 1245, 723);
  
  ctx.font = `28px Play-Bold`;
  ctx.fillStyle = "#FFCC33";
  ctx.fillText(`𝑼𝑰𝑫: ${uid}`, 814, 728);
  
  ctx.font = `28px Play-Bold`;
  ctx.fillStyle = "#00FF00";
  ctx.fillText(`𝑷𝒓𝒐𝒇𝒊𝒍𝒆: ${res.link}`, 32, 727);
  
  // Finalize image
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    { 
      body: "𝑵𝒊𝒋𝒆𝒓 𝑰𝒏𝒇𝒐 𝑪𝒂𝒓𝒅 𝑹𝒆𝒂𝒅𝒚! 🪪",
      attachment: fs.createReadStream(pathImg) 
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
