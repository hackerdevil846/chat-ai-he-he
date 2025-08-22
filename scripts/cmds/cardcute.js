const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FF00";

module.exports.config = {
  name: "cardcute",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "✨ 𝑪𝒓𝒆𝒂𝒕𝒆 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒄𝒂𝒓𝒅𝒔 𝒊𝒏 𝒄𝒖𝒕𝒆 𝒔𝒕𝒚𝒍𝒆",
  commandCategory: "𝗜𝗡𝗙𝗢",
  usages: "",
  cooldowns: 5,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": ""
  }
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async function({ api, event, args, Users }) {
  if (this.config.credits !== "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") {
    return api.sendMessage(`⚠️ 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱 𝗰𝗿𝗲𝗱𝗶𝘁𝘀 𝗰𝗵𝗮𝗻𝗴𝗲! 𝗣𝗹𝗲𝗮𝘀𝗲 𝘂𝘀𝗲 𝗼𝗿𝗶𝗴𝗶𝗻𝗮𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.`, event.threadID, event.messageID);
  }

  try {
    const { loadImage, createCanvas } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const Canvas = global.nodemodule["canvas"];
    let uid = event.senderID;

    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    }

    const res = await api.getUserInfoV2(uid);
    const pathImg = __dirname + `/cache/${uid}_card.png`;
    const pathAvata = __dirname + `/cache/${uid}_avt.png`;

    // Download user avatar
    const getAvatarOne = (await axios.get(
      `https://graph.facebook.com/${uid}/picture?height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    
    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
    const avataruser = await this.circle(pathAvata);

    // Download template background
    const bg = (await axios.get(encodeURI(`https://imgur.com/kSfS1wX.png`), {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

    // Download font if not exists
    if (!fs.existsSync(__dirname + `${fonts}`)) {
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
    }

    // Process image
    let baseImage = await loadImage(pathImg);
    let baseAvata = await loadImage(avataruser);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvata, 50, 130, 270, 270);

    // Process user information
    const genderMap = {
      'male': "👨 𝗠𝗮𝗹𝗲",
      'female': "👩 𝗙𝗲𝗺𝗮𝗹𝗆𝗲",
      'unknown': "❓ 𝗡𝗼𝘁 𝗽𝘂𝗯𝗹𝗶𝗰"
    };

    const userInfo = {
      name: res.name || "𝗡𝗼𝘁 𝗳𝗼𝘂𝗻𝗱",
      gender: genderMap[res.gender] || genderMap['unknown'],
      follow: res.follow ? `${res.follow} 𝗳𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀` : "𝗡𝗼𝘁 𝗳𝗼𝘂𝗻𝗱",
      relationship: res.relationship_status || "𝗡𝗼𝘁 𝗽𝘂𝗯𝗹𝗶𝗰",
      birthday: res.birthday || "𝗡𝗼𝘁 𝗳𝗼𝘂𝗻𝗱",
      location: res.location || "𝗡𝗼𝘁 𝗳𝗼𝘂𝗻𝗱",
      link: res.link || "𝗡𝗼𝘁 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲"
    };

    // Register and use custom font
    Canvas.registerFont(__dirname + `${fonts}`, { family: "Play-Bold" });

    // Draw user information
    const infoConfig = [
      { text: `👤 𝗡𝗮𝗺𝗲: ${userInfo.name}`, y: 172, color: "#D3D3D3" },
      { text: `⚤ 𝗚𝗲𝗻𝗱𝗲𝗿: ${userInfo.gender}`, y: 208, color: "#99CCFF" },
      { text: `📊 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${userInfo.follow}`, y: 244, color: "#FFFFE0" },
      { text: `💕 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽: ${userInfo.relationship}`, y: 281, color: "#FFE4E1" },
      { text: `🎂 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆: ${userInfo.birthday}`, y: 320, color: "#9AFF9A" },
      { text: `📍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: ${userInfo.location}`, y: 357, color: "#FF6A6A" },
      { text: `🆔 𝗨𝗜𝗗: ${uid}`, y: 397, color: "#EEC591" }
    ];

    infoConfig.forEach(item => {
      ctx.font = `${fontsInfo}px Play-Bold`;
      ctx.fillStyle = item.color;
      ctx.textAlign = "start";
      ctx.fillText(item.text, 410, item.y);
    });

    // Draw Facebook link
    ctx.font = `${fontsLink}px Play-Bold`;
    ctx.fillStyle = "#FFBBFF";
    ctx.fillText(`🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${userInfo.link}`, 30, 450);

    // Save and send image
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvata);

    return api.sendMessage({
      body: "✅ 𝗨𝘀𝗲𝗿 𝗶𝗻𝗳𝗼 𝗰𝗮𝗿𝗱 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!",
      attachment: fs.createReadStream(pathImg)
    }, threadID, () => fs.unlinkSync(pathImg), messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ 𝗘𝗿𝗿𝗼𝗿 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲", threadID, messageID);
  }
};
