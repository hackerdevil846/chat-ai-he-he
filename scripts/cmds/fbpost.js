const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
  name: "fbpost",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Asif",
  description: "Create Facebook-style post images",
  commandCategory: "Edit-img",
  usages: "[text]",
  cooldowns: 10,
  dependencies: {
    canvas: "",
    axios: "",
    jimp: "",
    "fs-extra": ""
  }
};

module.exports.circle = async (imagePath) => {
  try {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
  } catch (error) {
    console.error("Circle avatar error:", error);
    throw error;
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise((resolve) => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText("W").width > maxWidth) return resolve(null);

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

      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = "";
      }

      if (words.length === 0) lines.push(line.trim());
    }

    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (!args[0]) {
    return api.sendMessage(
      `📝 Please provide text for your Facebook post\nExample: ${global.config.PREFIX}fbpost Feeling excited about the weekend!`,
      threadID,
      messageID
    );
  }

  const text = args.join(" ");
  const cacheID = `${Date.now()}_${senderID}`;
  const avatarPath = __dirname + `/cache/fb_avatar_${cacheID}.png`;
  const outputPath = __dirname + `/cache/fb_post_${cacheID}.png`;

  try {
    const processingMsg = await api.sendMessage("🖌️ Creating your Facebook post...", threadID);

    // Get user info
    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID]?.name || "Facebook User";
    const avatarUrl = userInfo[senderID]?.avatar || `https://graph.facebook.com/${senderID}/picture?width=1500&height=1500`;

    // Download avatar and background in parallel
    const [avatarData, bgData] = await Promise.all([
      axios.get(avatarUrl, { responseType: "arraybuffer" }),
      axios.get("https://i.imgur.com/VrcriZF.jpg", { responseType: "arraybuffer" }),
    ]);

    fs.writeFileSync(avatarPath, Buffer.from(avatarData.data));
    fs.writeFileSync(outputPath, Buffer.from(bgData.data));

    // Process avatar to circle
    const circularAvatar = await this.circle(avatarPath);
    fs.writeFileSync(avatarPath, circularAvatar);

    // Load images
    const [avatarImage, baseImage] = await Promise.all([loadImage(avatarPath), loadImage(outputPath)]);

    // Create canvas
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background and avatar
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatarImage, 17, 17, 104, 104);

    // Draw username
    ctx.font = "bold 32px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillStyle = "#000000";
    ctx.fillText(userName, 130, 55);

    // Draw post text with font size adjustment
    let fontSize = 45;
    ctx.font = `400 ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
    ctx.fillStyle = "#000000";

    let measuredWidth = ctx.measureText(text).width;
    while (measuredWidth > 2600 && fontSize > 20) {
      fontSize--;
      ctx.font = `400 ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
      measuredWidth = ctx.measureText(text).width;
    }

    const lines = await this.wrapText(ctx, text, 650);
    let yPosition = 180;
    for (const line of lines) {
      ctx.fillText(line, 17, yPosition);
      yPosition += fontSize + 5;
    }

    // Save final image
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(outputPath, imageBuffer);

    // Send the image with message
    await api.sendMessage(
      {
        body: `📱 ${userName}'s Facebook Post:\n\n"${text}"`,
        attachment: fs.createReadStream(outputPath),
      },
      threadID
    );

    // Cleanup temp files and processing message
    api.unsendMessage(processingMsg.messageID);
    fs.unlinkSync(avatarPath);
    fs.unlinkSync(outputPath);
  } catch (error) {
    console.error("FBPost Command Error:", error);
    api.sendMessage("❌ Failed to create Facebook post. Please try again later.", threadID, messageID);
    if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
};
