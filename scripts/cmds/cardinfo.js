const sendWaiting = true; // enable or disable sending "images in progress, please wait...";
const textWaiting = "Image initialization, please wait a moment";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 20
const fontsInfo = 28
const colorName = "#00FFFF"

module.exports.config = {
  name: "cardinfo",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝐂𝐫𝐞𝐚𝐭𝐞 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐮𝐬𝐞𝐫 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 𝐜𝐚𝐫𝐝",
  commandCategory: "𝑮𝒓𝒐𝒖𝒑",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
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
  if ((this.config.credits) != "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") { 
    return api.sendMessage(`⚠️ 𝑫𝒆𝒕𝒆𝒄𝒕𝒆𝒅: 𝑪𝒓𝒆𝒅𝒊𝒕𝒔 𝒉𝒂𝒗𝒆 𝒃𝒆𝒆𝒏 𝒄𝒉𝒂𝒏𝒈𝒆𝒅!`, event.threadID, event.messageID)
  }
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
    const res = await api.getUserInfoV2(uid); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/tW6nSDm.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 80, 73, 285, 285);
  if (!res.location || res.location === "Không Có Dữ Liệu") res.location = "𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅";
  if (!res.birthday || res.birthday === "Không Có Dữ Liệu") res.birthday = "𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅";
if (!res.relationship_status || res.relationship_status === "Không Có Dữ Liệu") res.relationship_status = "𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅";
  if (!res.follow || res.follow === "Không Có Dữ Liệu") res.follow = "𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅";
    var gender = res.gender == 'male' ? "𝑴𝒂𝒍𝒆" : res.gender == 'female' ? "𝑭𝒆𝒎𝒂𝒍𝒆" : "𝑵𝒐𝒕 𝒑𝒖𝒃𝒍𝒊𝒄";
    var birthday = res.birthday ? `${res.birthday}` : "𝑵𝒐 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏";
    var love = res.relationship_status ? `${res.relationship_status}` : "𝑵𝒐 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏"
    var location = res.location ? `${res.location}` : "𝑵𝒐 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`${res.name}`, 480, 172);
  ctx.fillText(`${gender}`, 550, 208);
  ctx.fillText(`${res.follow}`, 550, 244);
  ctx.fillText(`${love}`, 550, 281);
  ctx.fillText(`${birthday}`, 550, 320);
  ctx.fillText(`${location}`, 550, 357);
  ctx.fillText(`${uid}`, 550, 399);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#0000FF";
  ctx.textAlign = "start";
  fontSize = 20;  
  ctx.fillText(`${res.link}`, 180, 475);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
