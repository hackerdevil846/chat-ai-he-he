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
  description: "📊 View your group's information with beautiful graphics",
  category: "group",
  usages: "infobox",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": "",
    "jimp": "",
    "path": ""
  },
  envConfig: {
    // You can add API keys or other config here if needed
  }
};

module.exports.languages = {
  "en": {
    "missingThreadInfo": "❌ Could not retrieve group information. Please try again later.",
    "errorProcessing": "❌ An error occurred while processing the command.",
    "successResult": "📊 %1 Group Information"
  }
  // Add other languages if needed
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async function ({ api, event, args, models, Users, Threads, Currencies }) {
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const path = global.nodemodule["path"];
  
  try {
    let { senderID, threadID, messageID, threadType } = event;
    
    // Check if it's a group chat
    if (threadType !== "2") {
      return api.sendMessage("❌ This command can only be used in group chats.", threadID, messageID);
    }

    // Define file paths
    let pathImg = __dirname + `/cache/${senderID}_${threadID}_infobox.png`;
    let pathAva = __dirname + `/cache/${senderID}_${threadID}_groupavt.png`;
    let pathAvata = __dirname + `/cache/${senderID}_${threadID}_adminavt.png`;
    let pathAvata2 = __dirname + `/cache/${senderID}_${threadID}_memavt1.png`;
    let pathAvata3 = __dirname + `/cache/${senderID}_${threadID}_memavt2.png`;

    // Get thread information
    var threadInfo = await api.getThreadInfo(threadID);
    if (!threadInfo) {
      return api.sendMessage(this.languages.en.missingThreadInfo, threadID, messageID);
    }
    
    let threadName = threadInfo.threadName || "Unnamed Group";

    // Gender counts
    var nam = 0, nu = 0;
    for (let user of threadInfo.userInfo) {
      if (user.gender === 'MALE') nam++;
      else if (user.gender === 'FEMALE') nu++;
    }

    // Group statistics
    let qtv = threadInfo.adminIDs.length;
    let sl = threadInfo.messageCount || 0;
    let threadMem = threadInfo.participantIDs.length;

    // Random admin and members
    var idad = threadInfo.adminIDs[Math.floor(Math.random() * qtv)]?.id;
    var idmemrd = threadInfo.participantIDs[Math.floor(Math.random() * threadMem)];
    var idmemrd1 = threadInfo.participantIDs[Math.floor(Math.random() * threadMem)];

    // Download images
    let avatarData = await Promise.allSettled([
      axios.get(encodeURI(threadInfo.imageSrc || `https://graph.facebook.com/${threadID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), { responseType: "arraybuffer" }),
      idad ? axios.get(`https://graph.facebook.com/${idad}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }) : Promise.resolve(null),
      axios.get(`https://graph.facebook.com/${idmemrd}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
      axios.get(`https://graph.facebook.com/${idmemrd1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
      axios.get("https://i.imgur.com/hHKQMW8.jpg", { responseType: "arraybuffer" })
    ]);

    // Save files
    fs.writeFileSync(pathAva, Buffer.from(avatarData[0].value?.data || avatarData[0].value));
    if (avatarData[1].value) fs.writeFileSync(pathAvata, Buffer.from(avatarData[1].value.data));
    fs.writeFileSync(pathAvata2, Buffer.from(avatarData[2].value.data));
    fs.writeFileSync(pathAvata3, Buffer.from(avatarData[3].value.data));
    fs.writeFileSync(pathImg, Buffer.from(avatarData[4].value.data));

    // Download font if missing
    if (!fs.existsSync(__dirname + fonts)) {
      try {
        let fontData = await axios.get(downfonts, { responseType: "arraybuffer" });
        fs.writeFileSync(__dirname + fonts, Buffer.from(fontData.data));
      } catch (fontError) {
        console.error("Failed to download font:", fontError);
      }
    }

    // Process images
    let [avatar, avataruser, avataruser2, avataruser3] = await Promise.all([
      this.circle(pathAva),
      fs.existsSync(pathAvata) ? this.circle(pathAvata) : null,
      this.circle(pathAvata2),
      this.circle(pathAvata3)
    ]);

    // Load images
    let imageLoaders = [
      loadImage(pathImg),
      loadImage(avatar),
      avataruser ? loadImage(avataruser) : Promise.resolve(null),
      loadImage(avataruser2),
      loadImage(avataruser3)
    ];
    
    let [baseImage, baseAva, baseAvata, baseAvata2, baseAvata3] = await Promise.all(imageLoaders);

    // Create canvas
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    
    // Draw background
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    
    // Draw group avatar
    ctx.drawImage(baseAva, 80, 73, 285, 285);
    
    // Draw member avatars
    if (baseAvata) ctx.drawImage(baseAvata, 450, 422, 43, 43);
    ctx.drawImage(baseAvata2, baseAvata ? 500 : 450, 422, 43, 43);
    ctx.drawImage(baseAvata3, baseAvata ? 550 : 500, 422, 43, 43);

    // Register and use custom font
    try {
      registerFont(__dirname + fonts, { family: "Lobster" });
    } catch (e) {
      console.log("Using default font due to registration error:", e);
    }

    // Draw group name
    ctx.font = `700 ${fontsName}px ${fs.existsSync(__dirname + fonts) ? "Lobster" : "Arial"}`;
    ctx.fillStyle = colorName;
    // Ensure text doesn't overflow
    let displayName = threadName;
    if (ctx.measureText(displayName).width > 300) {
      while (ctx.measureText(displayName + "...").width > 300 && displayName.length > 10) {
        displayName = displayName.substring(0, displayName.length - 1);
      }
      displayName += "...";
    }
    ctx.fillText(displayName, 435, 125);

    // Draw group info
    ctx.font = `${fontsInfo}px ${fs.existsSync(__dirname + fonts) ? "Lobster" : "Arial"}`;
    ctx.fillStyle = "#00FF00";
    
    const infoData = [
      { emoji: "👥", text: `Members: ${threadMem}` },
      { emoji: "🛡️", text: `Admins: ${qtv}` },
      { emoji: "♂️", text: `Male: ${nam}` },
      { emoji: "♀️", text: `Female: ${nu}` },
      { emoji: "💬", text: `Messages: ${sl}` }
    ];

    infoData.forEach((item, i) => {
      ctx.fillText(`${item.emoji} ${item.text}`, 439, 199 + i * 44);
    });

    // Draw footer
    ctx.font = `${fontsOthers}px ${fs.existsSync(__dirname + fonts) ? "Lobster" : "Arial"}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`🔖 Group ID: ${threadInfo.threadID}`, 18, 470);
    ctx.fillText(`✨ And ${threadMem - 3} other members...`, 607, 453);

    // Save and send
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // Create info text
    const infoText = `📊 ${threadName} Group Information!\n` +
      `👥 Members: ${threadMem} | 🛡️ Admins: ${qtv}\n` +
      `♂️ Male: ${nam} | ♀️ Female: ${nu}\n` +
      `💬 Total Messages: ${sl}\n` +
      `🔖 Group ID: ${threadInfo.threadID}`;

    api.sendMessage({
      body: infoText,
      attachment: fs.createReadStream(pathImg)
    }, threadID, (err) => {
      if (err) console.error(err);
      // Cleanup temporary files
      const filesToDelete = [pathAva, pathAvata, pathAvata2, pathAvata3, pathImg];
      filesToDelete.forEach(file => {
        if (fs.existsSync(file)) {
          try {
            fs.unlinkSync(file);
          } catch (e) {
            console.error("Error deleting file:", e);
          }
        }
      });
    }, messageID);

  } catch (error) {
    console.error("Error in infobox command:", error);
    api.sendMessage(this.languages.en.errorProcessing, event.threadID, event.messageID);
  }
};
