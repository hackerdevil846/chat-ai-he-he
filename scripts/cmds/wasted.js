module.exports.config = {
  name: "wasted",
  version: "1.0.1",
  Permssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙒𝘼𝙎𝙏𝙀𝘿 𝙗𝙖𝙣𝙣𝙚𝙧 𝙘𝙧𝙚𝙖𝙩𝙤𝙧",
  category: "𝙗𝙖𝙣𝙣𝙚𝙧",
  cooldowns: 2,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": "",
  },
};

module.exports.onStart = async function ({ api, event, args, Users }) {
  const { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const path = __dirname + "/cache";
  const pathImg = __dirname + "/cache/wasted.png";
  const pathAva = __dirname + "/cache/avt.png";

  try {
    // ensure cache dir exists
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

    // Determine user ID (reply -> mention -> arg -> sender)
    let uid;
    if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID) {
      uid = event.messageReply.senderID;
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else if (args && args[0]) {
      uid = args[0];
    } else {
      uid = senderID;
    }

    // Fetch user avatar (keep original FB graph URL & token as requested)
    const avatarRes = await axios.get(
      `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    );
    const avatarBuffer = Buffer.from(avatarRes.data);
    fs.writeFileSync(pathAva, avatarBuffer);

    // Fetch wasted overlay (keep original zenzapis link & apikey)
    const wastedRes = await axios.get(
      `https://zenzapis.xyz/photoeditor/wasted?apikey=7990c7f07144`,
      { responseType: "arraybuffer" }
    );
    const wastedBuffer = Buffer.from(wastedRes.data);
    fs.writeFileSync(pathImg, wastedBuffer);

    // Compose images
    const baseImage = await loadImage(pathImg);
    const baseAva = await loadImage(pathAva);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // draw avatar then overlay
    ctx.drawImage(baseAva, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // save final image
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // cleanup avatar
    try { fs.removeSync(pathAva); } catch (e) {}

    // send result
    return api.sendMessage(
      { attachment: fs.createReadStream(pathImg) },
      threadID,
      () => {
        try { fs.unlinkSync(pathImg); } catch (e) {}
      },
      messageID
    );
  } catch (err) {
    // On error, try to cleanup and notify user (keeps behavior safe)
    try { if (fs.existsSync(pathAva)) fs.removeSync(pathAva); } catch (e) {}
    try { if (fs.existsSync(pathImg)) fs.removeSync(pathImg); } catch (e) {}
    return api.sendMessage("Error while creating image. Please try again later.", threadID, messageID);
  }
};
