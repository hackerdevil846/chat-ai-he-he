const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 20
const fontsInfo = 28
const colorName = "#00FF00"
module.exports.config = {
  name: "cardcute",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑪𝒓𝒆𝒂𝒕𝒆 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒄𝒂𝒓𝒅𝒔 𝒊𝒏 𝒄𝒖𝒕𝒆 𝒔𝒕𝒚𝒍𝒆",
  commandCategory: "𝒊𝒏𝒇𝒐",
  usages: "",
  cooldowns: 5,
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
  if ((this.config.credits) != "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") { return api.sendMessage(`⚡️𝑫𝒆𝒕𝒆𝒄𝒕𝒆𝒅 𝒄𝒓𝒆𝒅𝒊𝒕𝒔 𝒉𝒂𝒗𝒆 𝒃𝒆𝒆𝒏 𝒄𝒉𝒂𝒏𝒈𝒆𝒅`, event.threadID, event.messageID)}
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
  let pathAvata = __dirname + `/cache/avtuserrd.png`;
  /*                 */
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
const res = await api.getUserInfoV2(uid);
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://imgur.com/kSfS1wX.png`), {
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
  ctx.drawImage(baseAvata, 50, 130, 270, 270);
if (!res.location || res.location === "𝑵𝒐 𝒅𝒂𝒕𝒂 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆") res.location = "𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅";
  if (!res.birthday || res.birthday === "𝑵𝒐 𝒅𝒂𝒕𝒂 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆") res.birthday = "𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅";
if (!res.relationship_status || res.relationship_status === "𝑵𝒐 𝒅𝒂𝒕𝒂 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆") res.relationship_status = "𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅";
  if (!res.follow || res.follow === "𝑵𝒐 𝒅𝒂𝒕𝒂 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆") res.follow = "𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅";
    var gender = res.gender == 'male' ? "𝑴𝒂𝒍𝒆" : res.gender == 'female' ? "𝑭𝒆𝒎𝒂𝒍𝒆" : "𝑵𝒐𝒕 𝒑𝒖𝒃𝒍𝒊𝒄";
    var birthday = res.birthday ? `${res.birthday}` : "𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝑯𝒊𝒅𝒅𝒆𝒏"
  var love = res.relationship_status ? `${res.relationship_status}` : "𝑵𝒐𝒕 𝒑𝒖𝒃𝒍𝒊𝒄"
    var location = res.location ? `${res.location}` : "𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝑯𝒊𝒅𝒅𝒆𝒏"
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#D3D3D3";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`𝑭𝒖𝒍𝒍 𝑵𝒂𝒎𝒆 : ${res.name}`, 410, 172);
  ctx.fillStyle = "#99CCFF";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`𝑺𝒆𝒙: ${gender}`, 410, 208);
ctx.fillStyle = "#FFFFE0";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`𝑭𝒐𝒍𝒍𝒐𝒘𝒆𝒓𝒔: ${res.follow} 𝒇𝒐𝒍𝒍𝒐𝒘𝒆𝒓𝒔`, 410, 244);
  ctx.fillStyle = "#FFE4E1";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑: ${love}`, 410, 281);
  ctx.fillStyle = "#9AFF9A";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`𝑩𝒊𝒓𝒕𝒉𝒅𝒂𝒚: ${birthday}`, 410, 320);
  ctx.fillStyle = "#FF6A6A";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`𝑳𝒐𝒄𝒂𝒕𝒊𝒐𝒏: ${location}`, 410, 357);
ctx.fillStyle = "#EEC591";
  ctx.textAlign = "start";
  fontSize = 22;
  ctx.fillText(`𝑼𝑰𝑫: ${uid}`, 410, 397);
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#FFBBFF";
  ctx.textAlign = "start";
  fontSize = 23;  
  ctx.fillText(`𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑳𝒊𝒏𝒌: ${res.link}`, 30, 450);
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
