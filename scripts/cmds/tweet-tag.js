"use strict";

const sendWaiting = true;
const textWaiting = "🖼️ Creating your tweet image, please wait...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const colorName = "#3A3B3C";

// Function to wrap text for canvas
async function wrapText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width < maxWidth) return [text];
  if (ctx.measureText("W").width > maxWidth) return null;

  const words = text.split(" ");
  const lines = [];
  let line = "";

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
      line = "";
    }
    if (words.length === 0) lines.push(line.trim());
  }
  return lines;
}

// Function to make avatar circular
async function circle(image) {
  const jimp = global.nodemodule["jimp"];
  const img = await jimp.read(image);
  img.circle();
  return await img.getBufferAsync("image/png");
}

module.exports.config = {
  name: "tweetmaker",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Create tweet-style images with your profile",
  category: "edit-img",
  usages: "[text]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const { loadImage, createCanvas, registerFont } = global.nodemodule["canvas"];
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  if (!args[0]) {
    return api.sendMessage(
      `📝 Please enter text for your tweet\n\nExample: ${global.config?.PREFIX || ""}tweetmaker Hello Twitter world!`,
      threadID,
      messageID
    );
  }

  try {
    const text = args.join(" ");
    const pathImg = __dirname + `/cache/tweet_${Date.now()}.png`;
    const pathAvata = __dirname + `/cache/avatar_${Date.now()}.png`;

    if (sendWaiting) {
      await api.sendMessage(textWaiting, threadID, messageID);
    }

    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID]?.name || "Twitter User";

    // Download font if not exists
    if (!fs.existsSync(__dirname + fonts)) {
      try {
        const fontData = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + fonts, Buffer.from(fontData));
      } catch (fontError) {
        console.error("Font download error:", fontError);
      }
    }

    // Download avatar
    const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarData = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvata, Buffer.from(avatarData));

    // Download background
    const bgUrl = "https://i.ibb.co/xq3jLQm/Picsart-22-08-15-23-51-29-721.jpg";
    const bgData = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(bgData));

    // Make avatar circular
    const circularAvatar = await circle(pathAvata);
    fs.writeFileSync(pathAvata, circularAvatar);

    // Draw canvas
    const baseImage = await loadImage(pathImg);
    const baseAvatar = await loadImage(pathAvata);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvatar, 53, 35, 85, 85);

    try {
      registerFont(__dirname + fonts, { family: "Play-Bold" });
      ctx.font = "bold 14px 'Play-Bold', Arial, sans-serif";
    } catch {
      ctx.font = "bold 14px Arial, sans-serif";
    }

    // Draw user name
    ctx.fillStyle = colorName;
    ctx.fillText(userName, 153, 99);

    // Draw tweet text
    let fontSize = 18;
    ctx.font = `400 ${fontSize}px Arial`;
    ctx.fillStyle = "#000000";

    while (ctx.measureText(text).width > 1600 && fontSize > 10) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial`;
    }

    const maxWidth = 650;
    const lines = await wrapText(ctx, text, maxWidth) || [text];
    const lineHeight = Math.round(fontSize * 1.4);
    const startX = 56;
    const startY = 180;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], startX, startY + i * lineHeight);
    }

    // Save and send final image
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    await api.sendMessage(
      {
        body: `🐦 ${userName}'s Tweet:\n\n"${text}"`,
        attachment: fs.createReadStream(pathImg)
      },
      threadID
    );

    fs.unlinkSync(pathImg);
    fs.unlinkSync(pathAvata);
  } catch (error) {
    console.error("Tweet Tag Error:", error);
    api.sendMessage("❌ Failed to create tweet image. Please try again later.", threadID, messageID);
  }
};

// Export helpers
module.exports.wrapText = wrapText;
module.exports.circle = circle;
