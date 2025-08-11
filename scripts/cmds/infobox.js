const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsName = 45;
const fontsInfo = 33;
const fontsOthers = 27;
const colorName = "#00FFFF";

module.exports.config = {
  name: "infobox",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒅𝒆𝒌𝒉𝒖𝒏",
  commandCategory: "𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏",
  usages: "𝒊𝒏𝒇𝒐𝒃𝒐𝒙",
  cooldowns: 10,
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
};

module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  
  // Define file paths
  let pathImg = __dirname + `/cache/${senderID}123.png`;
  let pathAva = __dirname + `/cache/avtuserthread.png`;
  let pathAvata = __dirname + `/cache/avtuserrd.png`;
  let pathAvata2 = __dirname + `/cache/avtuserrd2.png`;
  let pathAvata3 = __dirname + `/cache/avtuserrd3.png`;
  
  // Get thread information
  var threadInfo = await api.getThreadInfo(threadID);
  let threadName = threadInfo.threadName;
  
  // Gender counts
  var nameMen = [];
  var gendernam = [];
  var gendernu = [];
  var nope = [];

  for (let z in threadInfo.userInfo) {
    var gioitinhone = threadInfo.userInfo[z].gender;
    var nName = threadInfo.userInfo[z].name;

    if (gioitinhone == 'MALE') {
      gendernam.push(z + gioitinhone);
    } else if (gioitinhone == 'FEMALE') {
      gendernu.push(gioitinhone);
    } else {
      nope.push(nName);
    }
  }

  var nam = gendernam.length;
  var nu = gendernu.length;
  
  // Group statistics
  let qtv = threadInfo.adminIDs.length;
  let sl = threadInfo.messageCount;
  let threadMem = threadInfo.participantIDs.length;
  
  const path = global.nodemodule["path"];
  const Canvas = global.nodemodule["canvas"];
  const __root = path.resolve(__dirname, "cache");
  
  // Random admin and members
  var qtv2 = threadInfo.adminIDs;
  var idad = qtv2[Math.floor(Math.random() * qtv)];
  let idmem = threadInfo.participantIDs;
  var idmemrd = idmem[Math.floor(Math.random() * threadMem)];
  var idmemrd1 = idmem[Math.floor(Math.random() * threadMem)];
  
  // Download avatars
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${idad.id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let getAvatarOne2 = (await axios.get(`https://graph.facebook.com/${idmemrd}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let getAvatarOne3 = (await axios.get(`https://graph.facebook.com/${idmemrd1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let Avatar = (await axios.get(encodeURI(`${threadInfo.imageSrc}`), { responseType: "arraybuffer" })).data;
  let getWanted = (await axios.get(encodeURI(`https://i.imgur.com/hHKQMW8.jpg`), { responseType: "arraybuffer" })).data;
  
  // Save files
  fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  fs.writeFileSync(pathAvata2, Buffer.from(getAvatarOne2, 'utf-8'));
  fs.writeFileSync(pathAvata3, Buffer.from(getAvatarOne3, 'utf-8'));
  
  // Process images
  avatar = await this.circle(pathAva);
  avataruser = await this.circle(pathAvata);
  avataruser2 = await this.circle(pathAvata2);
  avataruser3 = await this.circle(pathAvata3);
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

  // Download font if not exists
  if(!fs.existsSync(__dirname+`${fonts}`)) { 
    let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
  };

  // Load images
  let baseImage = await loadImage(pathImg);
  let baseAva = await loadImage(avatar);
  let baseAvata = await loadImage(avataruser);
  let baseAvata2 = await loadImage(avataruser2);
  let baseAvata3 = await loadImage(avataruser3);
  
  // Create canvas
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  let text = args.join(" ") || threadName;
  let id = threadInfo.threadID;
  
  // Draw images
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAva, 80, 73, 285, 285);
  ctx.drawImage(baseAvata, 450, 422, 43, 43);
  ctx.drawImage(baseAvata2, 500, 422, 43, 43);
  ctx.drawImage(baseAvata3, 550, 422, 43, 43);
  
  // Draw text with Mathematical Bold Italic styling
  ctx.font = `700 ${fontsName}px Arial`;
  ctx.fillStyle = `${colorName}`;
  ctx.textAlign = "start";
  ctx.fillText(text, 435, 125);
  
  // Register and use custom font
  Canvas.registerFont(__dirname+`${fonts}`, { family: "Lobster" });
  
  // Draw group information
  ctx.font = `${fontsInfo}px Lobster`;
  ctx.fillStyle = "#00FF00";
  ctx.fillText(`⊶ 𝑴𝒆𝒎𝒃𝒆𝒓𝒔: ${threadMem}`, 439, 199);
  ctx.fillText(`⊶ 𝑨𝒅𝒎𝒊𝒏𝒔: ${qtv}`, 439, 243);
  ctx.fillText(`⊶ 𝑴𝒂𝒍𝒆: ${nam}`, 439, 287);
  ctx.fillText(`⊶ 𝑭𝒆𝒎𝒂𝒍𝒆: ${nu}`, 439, 331);
  ctx.fillText(`⊶ 𝑴𝒆𝒔𝒔𝒂𝒈𝒆𝒔: ${sl}`, 439, 379);
  
  // Draw footer information
  ctx.font = `${fontsOthers}px Lobster`;
  ctx.fillText(`𝑮𝒓𝒐𝒖𝒑 𝑰𝑫: ${id}`, 18, 470);
  ctx.fillText(`• 𝑨𝒓 𝒃𝒂𝒌𝒊 𝒂𝒄𝒉𝒆 ${parseInt(threadMem)-3} 𝒎𝒆𝒎𝒃𝒆𝒓𝒔...`, 607, 453);
  
  // Finalize and send image
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  
  // Clean up temporary files
  fs.removeSync(pathAva);
  fs.removeSync(pathAvata);
  fs.removeSync(pathAvata2);
  fs.removeSync(pathAvata3);
  
  return api.sendMessage(
    { 
      body: `📊 ${threadName} 𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏!`,
      attachment: fs.createReadStream(pathImg) 
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
