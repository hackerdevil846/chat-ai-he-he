const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 20
const fontsInfo = 28
const colorName = "#000000"

module.exports.config = {
  name: "cardinfov2",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒄𝒂𝒓𝒅 𝒕𝒖𝒎𝒊 𝒌𝒂𝒋 𝒌𝒐𝒓𝒃𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
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

function toMathBoldItalic(text) {
  const map = {
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
    'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
    'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
    ' ': ' ', ':': ':', '>': '>', '-': '-', '_': '_', '/': '/', '.': '.', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}'
  };
  return text.split('').map(char => map[char] || char).join('');
}

module.exports.run = async function ({ api, event, args, Users }) {
  if ((this.config.credits) != "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") { 
    return api.sendMessage(`⚠️ 𝑪𝒓𝒆𝒅𝒊𝒕 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒂𝒋 𝒌𝒐𝒓𝒃𝒆 𝒏𝒂!`, event.threadID, event.messageID)
  }
  
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
  let pathAvata = __dirname + `/cache/avtuserrd.png`;
  
  if(event.type == "message_reply") { 
    uid = event.messageReply.senderID 
  } else { 
    uid = event.senderID; 
  }
  
  const res = await api.getUserInfoV2(uid); 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/C8yIgMZ.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

  if(!fs.existsSync(__dirname+`${fonts}`)) { 
    let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
  };

  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 610, 83, 255, 255);
  
  // Convert text to Mathematical Bold Italic
  const notFoundText = toMathBoldItalic("𝑷𝒂𝒘𝒂 𝒋𝒂𝒚𝒏𝒊");
  const maleText = toMathBoldItalic("𝑷𝒖𝒓𝒖𝒔𝒉");
  const femaleText = toMathBoldItalic("𝑴𝒐𝒉𝒊𝒍𝒂");
  const secretText = toMathBoldItalic("𝑮𝒐𝒑𝒐𝒏 𝒓𝒂𝒌𝒉𝒔𝒆");
  const unknownText = toMathBoldItalic("𝑱𝒂𝒏𝒆𝒏 𝒏𝒂");
  
  if (!res.location || res.location === "Không Có Dữ Liệu") res.location = notFoundText;
  if (!res.birthday || res.birthday === "Không Có Dữ Liệu") res.birthday = notFoundText;
  if (!res.relationship_status || res.relationship_status === "Không Có Dữ Liệu") res.relationship_status = notFoundText;
  if (!res.follow || res.follow === "Không Có Dữ Liệu") res.follow = notFoundText;

  var gender = res.gender == 'male' ? maleText : 
               res.gender == 'female' ? femaleText : 
               secretText;
               
  var birthday = res.birthday ? toMathBoldItalic(res.birthday) : unknownText;
  var love = res.relationship_status ? toMathBoldItalic(res.relationship_status) : unknownText;
  var location = res.location ? toMathBoldItalic(res.location) : unknownText;
  const nameText = toMathBoldItalic(res.name);
  const uidText = toMathBoldItalic(uid.toString());
  const linkText = toMathBoldItalic(res.link);

  Canvas.registerFont(__dirname+`${fonts}`, {
    family: "Play-Bold"
  });
  
  // Create labels in Mathematical Bold Italic
  const nameLabel = toMathBoldItalic("» 𝑵𝒂𝒎:");
  const genderLabel = toMathBoldItalic("» 𝑳𝒊𝒏𝒈𝒈𝒐:");
  const followLabel = toMathBoldItalic("» 𝑭𝒐𝒍𝒐𝒘𝒆𝒓𝒔:");
  const loveLabel = toMathBoldItalic("» 𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑:");
  const bdayLabel = toMathBoldItalic("» 𝑱𝒐𝒏𝒎𝒐𝒅𝒊𝒏:");
  const locationLabel = toMathBoldItalic("» 𝑱𝒂𝒈𝒂:");

  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  
  // Draw text with labels and values
  ctx.fillText(`${nameLabel} ${nameText}`, 111, 160);
  ctx.fillText(`${genderLabel} ${gender}`, 111, 200);
  ctx.fillText(`${followLabel} ${res.follow}`, 111, 240);
  ctx.fillText(`${loveLabel} ${love}`, 111, 280);
  ctx.fillText(`${bdayLabel} ${birthday}`, 111, 320);
  ctx.fillText(`${locationLabel} ${location}`, 111, 360);
  ctx.fillText(uidText, 1010, 466);
  
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillText(linkText, 145, 47);
  
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);
  
  return api.sendMessage(
    { 
      body: toMathBoldItalic("✅ 𝑨𝒑𝒏𝒂𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒄𝒂𝒓𝒅 𝒑𝒓𝒐𝒔𝒕𝒖𝒕 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!"),
      attachment: fs.createReadStream(pathImg) 
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
