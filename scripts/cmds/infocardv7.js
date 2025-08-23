const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";

module.exports.config = {
  name: "cardinfo7",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑰𝒏𝒇𝒐 𝒄𝒂𝒓𝒅 𝒃𝒂𝒏𝒂𝒐",
  category: "𝒊𝒏𝒇𝒐",
  usages: "[reply | none]",
  cooldowns: 2,
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

module.exports.run = async function ({ api, event, args, Users, Threads, Currencies, permssion }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = global.nodemodule["canvas"];
  const { loadImage, createCanvas } = Canvas;

  const { senderID, threadID, messageID } = event;
  const tmpDir = __dirname + "/cache";
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const pathImg = __dirname + `/cache/${senderID}${threadID}_info.png`;
  const pathAvata = __dirname + `/cache/avtuser.png`;

  try {
    // determine target uid (reply -> replied user, else sender)
    let uid;
    if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID) {
      uid = event.messageReply.senderID;
    } else {
      uid = senderID;
    }

    // fetch user info (use existing api method)
    let res = {};
    try {
      res = await api.getUserInfoV2(uid) || {};
    } catch (e) {
      // fallback minimal info
      res = { name: "Unknown", link: `https://facebook.com/${uid}`, gender: null };
    }

    // download avatar (use axios arraybuffer -> Buffer)
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=1449557605494892|aaf0a865c8bafc314ced5b7f18f3caa6`;
    const avatarResp = await axios.get(avatarUrl, { responseType: "arraybuffer" });
    const avatarBuffer = Buffer.from(avatarResp.data);
    fs.writeFileSync(pathAvata, avatarBuffer);

    // download background (kept same link)
    const bgResp = await axios.get(`https://i.imgur.com/rqbC4ES.jpg`, { responseType: "arraybuffer" });
    const bgBuffer = Buffer.from(bgResp.data);
    fs.writeFileSync(pathImg, bgBuffer);

    // ensure font exists, otherwise download it (kept same downfonts link & path)
    const fontPath = __dirname + fonts; // __dirname + "/cache/Play-Bold.ttf"
    if (!fs.existsSync(fontPath)) {
      try {
        const fontResp = await axios.get(downfonts, { responseType: "arraybuffer" });
        fs.writeFileSync(fontPath, Buffer.from(fontResp.data));
      } catch (err) {
        // If font download fails, continue — default system font will be used
        console.warn("Font download failed, continuing without custom font:", err?.message || err);
      }
    }

    // create circular avatar with jimp
    const avatarCircleBuffer = await this.circle(pathAvata);

    // load images into canvas
    const baseImage = await loadImage(pathImg);
    const baseAvata = await loadImage(avatarCircleBuffer);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // draw background and avatar
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvata, 910, 465, 229, 229);

    // Register font if available
    try {
      if (fs.existsSync(fontPath)) {
        Canvas.registerFont(fontPath, { family: "Play-Bold" });
      }
    } catch (err) {
      // ignore font registration errors
      console.warn("Font register warning:", err?.message || err);
    }

    // helper to normalize fields that may be "Không Có Dữ Liệu" or empty/undefined
    const norm = (val) => {
      if (!val) return "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
      if (typeof val === "string" && val.trim() === "") return "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
      if (String(val).includes("Không Có Dữ Liệu")) return "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
      return val;
    };

    // prepare data (respect original variable names/logic but safer)
    const gender = res.gender === "male" ? "𝑴𝒂𝒍𝒆" : res.gender === "female" ? "𝑭𝒆𝒎𝒂𝒍𝒆" : "𝑵𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
    const birthday = norm(res.birthday);
    const love = norm(res.relationship_status || res.relationship || res.relationshipStatus);
    const fl = norm(res.follow || res.followers || res.following);
    const location = norm(res.location?.name || res.location);
    const hometown = norm(res.hometown?.name || res.hometown);
    const displayName = norm(res.name || (await Users.getNameEvent?.(uid)) || "Unknown");
    const profileLink = norm(res.link || res.profileUrl || `https://facebook.com/${uid}`);

    // draw text — keep style and positions as original but safer
    ctx.textBaseline = "top";

    // Title / Name
    ctx.font = `35px "Play-Bold", sans-serif`;
    ctx.fillStyle = "#00FFFF";
    ctx.fillText(`𝑵𝒂𝒎𝒆: ${displayName}`, 340, 560);

    // Right column info
    ctx.fillText(`𝑮𝒆𝒏𝒅𝒆𝒓: ${gender}`, 1245, 448);
    ctx.fillText(`𝑭𝒐𝒍𝒍𝒐𝒘: ${fl}`, 1245, 505);
    ctx.fillText(`𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑: ${love}`, 1245, 559);
    ctx.fillText(`𝑩𝒊𝒓𝒕𝒉𝒅𝒂𝒚: ${birthday}`, 1245, 616);
    ctx.fillText(`𝑳𝒐𝒄𝒂𝒕𝒊𝒐𝒏: ${location}`, 1245, 668);
    ctx.fillText(`𝑯𝒐𝒎𝒆𝒕𝒐𝒘𝒏: ${hometown}`, 1245, 723);

    // UID and profile
    ctx.font = `28px "Play-Bold", sans-serif`;
    ctx.fillStyle = "#FFCC33";
    ctx.fillText(`𝑼𝑰𝑫: ${uid}`, 814, 728);

    ctx.fillStyle = "#00FF00";
    ctx.fillText(`𝑷𝒓𝒐𝒇𝒊𝒍𝒆: ${profileLink}`, 32, 727);

    // finalize image bytes
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // send message (with emojis and formatted body)
    const messageBody = `✅ *Nijer Info Card Ready!* 🪪\n\n✨ 𝑵𝒂𝒎𝒆: ${displayName}\n🆔 𝑼𝑰𝑫: ${uid}\n🔗 Profile: ${profileLink}\n\n🔔 Use wisely — no changes to links or paths were made.`;

    // send and cleanup
    await api.sendMessage(
      {
        body: messageBody,
        attachment: fs.createReadStream(pathImg)
      },
      threadID,
      () => {
        try { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); } catch (e) { /* ignore */ }
        try { if (fs.existsSync(pathAvata)) fs.unlinkSync(pathAvata); } catch (e) { /* ignore */ }
      },
      messageID
    );

  } catch (error) {
    // In case of error, try to cleanup and reply an error message
    try { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); } catch (e) { }
    try { if (fs.existsSync(pathAvata)) fs.unlinkSync(pathAvata); } catch (e) { }

    console.error("cardinfo7 error:", error);
    return api.sendMessage(`⚠️ Error creating info card: ${error.message || error}`, threadID, messageID);
  }
};
