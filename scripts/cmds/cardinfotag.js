const sendWaiting = true; // bật hoặc tắt gửi tin nhắn "đang tạo hình ảnh, vui lòng chờ đợi...";
const textWaiting = "🖼️ Image create hocche, apni ekto wait korun...";

const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports.config = {
  name: "cardinfo-tag",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Create facebook user information card",
  category: "group",
  usages: "[tag/reply/uid]",
  cooldowns: 5,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": "",
    jimp: ""
  }
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.onStart = async function ({ api, event, args, Users }) {
  if ((this.config.credits) !== "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") {
    return api.sendMessage(
      `⚠️ Credits change kora hoyeche!\nAbar change korle ami block korbo!`,
      event.threadID,
      event.messageID
    );
  }

  let { threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];

  let pathImg = __dirname + `/cache/1.png`;
  let pathAvata = __dirname + `/cache/2.png`;

  // === Detect user ===
  var uid;
  var mention = Object.keys(event.mentions)[0];
  if (event.type == "message_reply") {
    uid = event.messageReply.senderID;
  } else {
    uid = mention || event.senderID;
  }

  if (sendWaiting) {
    api.sendMessage(textWaiting, threadID, messageID);
  }

  const res = await api.getUserInfoV2(uid);

  // === Avatar + background ===
  let getAvatarOne = (
    await axios.get(
      `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;

  let bg = (
    await axios.get(encodeURI(`https://i.imgur.com/tW6nSDm.png`), {
      responseType: "arraybuffer"
    })
  ).data;

  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, "utf-8"));
  let avataruser = await this.circle(pathAvata);
  fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

  // === Font download ===
  if (!fs.existsSync(__dirname + `${fonts}`)) {
    let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
  }

  // === Fix missing info ===
  if (!res.location || res.location === "Không Có Dữ Liệu") res.location = "Pawa jay nai";
  if (!res.birthday || res.birthday === "Không Có Dữ Liệu") res.birthday = "Pawa jay nai";
  if (!res.relationship_status || res.relationship_status === "Không Có Dữ Liệu") res.relationship_status = "Pawa jay nai";
  if (!res.follow || res.follow === "Không Có Dữ Liệu") res.follow = "Pawa jay nai";

  var gender = res.gender == "male" ? "👦 Chele" : res.gender == "female" ? "👧 Meye" : "❓ Public na";
  var birthday = res.birthday;
  var love = res.relationship_status;
  var location = res.location;

  // === Canvas draw ===
  let baseImage = await loadImage(pathImg);
  let baseAvata = await loadImage(avataruser);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 80, 73, 285, 285);

  Canvas.registerFont(__dirname + `${fonts}`, {
    family: "Play-Bold"
  });

  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";

  ctx.fillText(`${res.name}`, 480, 172);
  ctx.fillText(`${gender}`, 550, 208);
  ctx.fillText(`${res.follow}`, 550, 244);
  ctx.fillText(`${love}`, 550, 281);
  ctx.fillText(`${birthday}`, 550, 320);
  ctx.fillText(`${location}`, 550, 357);
  ctx.fillText(`${uid}`, 550, 399);

  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#0000FF";
  ctx.fillText(`${res.link}`, 180, 475);

  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);

  // === Send result ===
  return api.sendMessage(
    {
      body: `✅ Successfully Created User Card!\n👤 Name: ${res.name}\n🆔 UID: ${uid}\n🌐 Link: ${res.link}`,
      attachment: fs.createReadStream(pathImg)
    },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
