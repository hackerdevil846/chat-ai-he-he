const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
  name: "playstore", // Command name
  version: "1.0.0", // Version
  hasPermssion: 0, // Everyone can use
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Author
  description: "📱 Playstore style er user info card generate kore", // Description
  category: "user", // Category
  usages: "[mention/reply/none]", // Usage
  cooldowns: 3, // Cooldown
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

// 🔹 Text wrap function
async function wrapText(ctx, name, maxWidth) {
  if (ctx.measureText(name).width < maxWidth) return [name];
  if (ctx.measureText('W').width > maxWidth) return null;
  const words = name.split(' ');
  const lines = [];
  let line = '';
  while (words.length > 0) {
    let split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      const temp = words[0];
      words[0] = temp.slice(0, -1);
      if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
      else {
        split = true;
        words.splice(1, 0, temp.slice(-1));
      }
    }
    if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
    else {
      lines.push(line.trim());
      line = '';
    }
    if (words.length === 0) lines.push(line.trim());
  }
  return lines;
}

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    let pathImg = __dirname + "/cache/playstore_card.png";
    let pathAvt = __dirname + "/cache/user_avatar.png";

    // ✅ Target user (mention / reply / self)
    var id = Object.keys(event.mentions)[0] || (event.type === "message_reply" ? event.messageReply.senderID : event.senderID);
    var name = await Users.getNameUser(id);

    // ✅ Background
    var backgrounds = [
      "https://i.imgur.com/KDKgqvq.png"
    ];
    var rd = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    // ✅ Get Avatar
    let getAvatar = (
      await axios.get(
        `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(pathAvt, Buffer.from(getAvatar, "utf-8"));

    // ✅ Get Background
    let getBackground = (
      await axios.get(`${rd}`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getBackground, "utf-8"));

    let baseImage = await loadImage(pathImg);
    let userAvatar = await loadImage(pathAvt);

    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");

    // 🔹 Draw background
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // 🔹 Username text
    ctx.font = "bold 36px sans-serif";
    ctx.fillStyle = "#202124";
    ctx.textAlign = "left";

    const displayText = `👤 User: ${name}`;
    const lines = await wrapText(ctx, displayText, 1160);
    ctx.fillText(lines.join('\n'), 200, 150);

    // 🔹 User avatar circle
    ctx.beginPath();
    ctx.arc(100, 177, 35, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(userAvatar, 65, 142, 70, 70);

    // 🔹 Play Store icon
    ctx.font = "bold 28px sans-serif";
    ctx.fillStyle = "#4285F4";
    ctx.fillText("▶️", 50, 50);

    // 🔹 Profile visited
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#5F6368";
    ctx.fillText("📂 Profile Visited", 200, 190);

    // 🔹 View Profile button
    ctx.fillStyle = "#1A73E8";
    ctx.fillRect(200, 220, 180, 45);
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("🔎 View Profile", 220, 250);

    // ✅ Finalize
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    fs.removeSync(pathAvt);

    return api.sendMessage(
      {
        body: `📱 𝗣𝗹𝗮𝘆𝘀𝘁𝗼𝗿𝗲 𝗦𝘁𝘆𝗹𝗲 𝗨𝘀𝗲𝗿 𝗖𝗮𝗿𝗱\n━━━━━━━━━━━━━━━━\n👤 User: ${name}\n🆔 ID: ${id}`,
        attachment: fs.createReadStream(pathImg),
      },
      event.threadID,
      () => fs.unlinkSync(pathImg),
      event.messageID
    );
  } catch (err) {
    return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
  }
};
