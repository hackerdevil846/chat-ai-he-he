const sendWaiting = true;
const textWaiting = "🖼️ Creating your tweet image, please wait...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const colorName = "#3A3B3C";

module.exports.config = {
  name: "tweet-tag",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "Asif",
  description: "Create tweet-style images with your profile",
  category: "Edit-Img",
  usages: "[text]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

module.exports.onStart = async function() {
  // Initialization if needed
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
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
    return resolve(lines);
  });
}

module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  const img = await jimp.read(image);
  img.circle();
  return await img.getBufferAsync("image/png");
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const { loadImage, createCanvas, registerFont } = global.nodemodule["canvas"];
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  
  // Validate input
  if (!args[0]) {
    return api.sendMessage(
      `📝 Please enter text for your tweet\nExample: ${global.config.PREFIX}tweet-tag Hello Twitter world!`,
      threadID,
      messageID
    );
  }

  try {
    const text = args.join(" ");
    const pathImg = __dirname + `/cache/tweet_${Date.now()}.png`;
    const pathAvata = __dirname + `/cache/avatar_${Date.now()}.png`;

    // Send processing message
    if (sendWaiting) {
      await api.sendMessage(textWaiting, threadID, messageID);
    }

    // Get user info
    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID]?.name || "Twitter User";

    // Download fonts if needed
    if (!fs.existsSync(__dirname + fonts)) {
      try {
        const fontData = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + fonts, Buffer.from(fontData, "utf-8"));
      } catch (fontError) {
        console.error("Font download error:", fontError);
      }
    }

    // Download avatar
    const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarData = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvata, Buffer.from(avatarData, 'utf-8'));

    // Download background
    const bgUrl = "https://i.ibb.co/xq3jLQm/Picsart-22-08-15-23-51-29-721.jpg";
    const bgData = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(bgData, "utf-8"));

    // Process avatar to circle
    const circularAvatar = await this.circle(pathAvata);
    fs.writeFileSync(pathAvata, circularAvatar);

    // Create canvas
    const baseImage = await loadImage(pathImg);
    const baseAvatar = await loadImage(pathAvata);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvatar, 53, 35, 85, 85);

    // Register and use custom font
    try {
      registerFont(__dirname + fonts, { family: "Play-Bold" });
      ctx.font = "bold 14px 'Play-Bold', Arial, sans-serif";
    } catch {
      ctx.font = "bold 14px Arial, sans-serif";
    }
    
    // Draw username
    ctx.fillStyle = colorName;
    ctx.fillText(userName, 153, 99);

    // Draw tweet text
    ctx.font = "400 18px Arial";
    ctx.fillStyle = "#000000";
    let fontSize = 18;
    while (ctx.measureText(text).width > 1600) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial`;
    }
    const lines = await this.wrapText(ctx, text, 650);
    ctx.fillText(lines.join('\n'), 56, 180);

    // Save final image
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // Send result
    await api.sendMessage({
      body: `🐦 ${userName}'s Tweet:\n\n"${text}"`,
      attachment: fs.createReadStream(pathImg)
    }, threadID);

    // Cleanup
    fs.unlinkSync(pathImg);
    fs.unlinkSync(pathAvata);

  } catch (error) {
    console.error('Tweet Tag Error:', error);
    api.sendMessage("❌ Failed to create tweet image. Please try again later.", threadID, messageID);
  }
};
