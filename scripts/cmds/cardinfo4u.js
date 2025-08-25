const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";

module.exports.config = {
  name: "cardinfo4u",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Create stylish user info cards",
  category: "info",
  usages: "[reply to user or leave blank for self]",
  cooldowns: 15,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": "",
    jimp: ""
  }
};

module.exports.languages = {
  "en": {
    "fail": "❌ Failed to generate information card. Please try again later."
  },
  "bn": {
    "fail": "❌ ইনফো কার্ড তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।"
  }
};

module.exports.onLoad = async function() {
  const fs = global.nodemodule["fs-extra"];
  try {
    // Ensure cache folder exists
    const cacheDir = __dirname + "/cache";
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  } catch (e) {
    // silently fail - onLoad should not crash the bot
    console.error("onLoad warning (cardinfo4u):", e);
  }
};

module.exports.circleImage = async function(imagePath) {
  const jimp = global.nodemodule["jimp"];
  const img = await jimp.read(imagePath);
  img.circle();
  return await img.getBufferAsync("image/png");
};

// === CHANGED: Export name fixed from `run` to `onStart` ===
module.exports.onStart = async function({ api, event, args, Threads, Users, Currencies, models }) {
  const { createCanvas, loadImage, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  try {
    // Resolve target UID: reply -> mention -> arg numeric -> sender
    let uid;
    if (event.messageReply && event.messageReply.senderID) {
      uid = event.messageReply.senderID;
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else if (args[0] && args[0].match(/\d+/)) {
      uid = args[0].match(/\d+/)[0];
    } else {
      uid = event.senderID;
    }

    const pathImg = __dirname + `/cache/${uid}_card.png`;
    const pathAvata = __dirname + `/cache/${uid}_avt.png`;

    // Fetch user data (keep same method as original)
    const userData = await api.getUserInfo(uid);
    const user = userData[uid] || {};
    const name = user.name || "Unknown";
    const gender = user.gender || "Not specified";
    const birthday = user.birthday || "Not available";
    // Some FB Graph keys might differ; keep original fields and fallback
    const relationship = user.relationship_status || user.relationship || "Not specified";
    const location = (user.location && user.location.name) || user.location || "Not specified";
    const hometown = (user.hometown && user.hometown.name) || user.hometown || "Not specified";
    const link = user.link || `https://facebook.com/${uid}`;
    const follow = user.follow ? `${user.follow} followers` : "Not available";

    // Download avatar and background in parallel (keep the same links)
    const [avatarRes, bgRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
        responseType: 'arraybuffer'
      }),
      axios.get("https://i.imgur.com/rqbC4ES.jpg", {
        responseType: "arraybuffer"
      })
    ]);

    fs.writeFileSync(pathAvata, Buffer.from(avatarRes.data, "binary"));
    fs.writeFileSync(pathImg, Buffer.from(bgRes.data, "binary"));

    // Make avatar circular
    const circledAvatar = await this.circleImage(pathAvata);
    fs.writeFileSync(pathAvata, circledAvatar);

    // Download font if missing (preserve original path & link)
    try {
      if (!fs.existsSync(__dirname + fonts)) {
        const fontData = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + fonts, Buffer.from(fontData, "binary"));
      }
    } catch (fontError) {
      // fallback silently, will use Arial if custom font not available
      console.warn("Font download failed, using fallback font.", fontError);
    }

    // Load base image and avatar into canvas
    const baseImage = await loadImage(pathImg);
    const avatar = await loadImage(pathAvata);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background and avatar (positions preserved)
    ctx.drawImage(baseImage, 0, 0);
    // Avatar placement as original
    ctx.drawImage(avatar, 910, 465, 229, 229);

    // Register and set font
    if (fs.existsSync(__dirname + fonts)) {
      try {
        registerFont(__dirname + fonts, { family: "Play-Bold" });
        ctx.font = "35px 'Play-Bold'";
      } catch (e) {
        ctx.font = "35px Arial";
        console.warn("registerFont failed, fallback to Arial.", e);
      }
    } else {
      ctx.font = "35px Arial";
      console.warn("Custom font not found, using fallback Arial.");
    }

    // Render text: kept positions and structure as original, with color accents
    // Main accent
    ctx.fillStyle = "#00FFFF";

    const infoLines = [
      { text: `Name: ${name}`, x: 340, y: 560 },
      { text: `Gender: ${gender}`, x: 1245, y: 448 },
      { text: `Followers: ${follow}`, x: 1245, y: 505 },
      { text: `Relationship: ${relationship}`, x: 1245, y: 559 },
      { text: `Birthday: ${birthday}`, x: 1245, y: 616 },
      { text: `Location: ${location}`, x: 1245, y: 668 },
      { text: `Hometown: ${hometown}`, x: 1245, y: 723 }
    ];

    // Helper to safely truncate text to width
    const truncateToWidth = (context, text, maxWidth) => {
      let displayText = text;
      if (context.measureText(displayText).width > maxWidth) {
        while (context.measureText(displayText + "...").width > maxWidth && displayText.length > 10) {
          displayText = displayText.substring(0, displayText.length - 1);
        }
        displayText += "...";
      }
      return displayText;
    };

    infoLines.forEach(line => {
      const displayText = truncateToWidth(ctx, line.text, 400);
      ctx.fillText(displayText, line.x, line.y);
    });

    // Additional info: UID and Profile link
    if (fs.existsSync(__dirname + fonts)) {
      ctx.font = "28px 'Play-Bold'";
    } else {
      ctx.font = "28px Arial";
    }

    ctx.fillStyle = "#FFCC33";
    ctx.fillText(`UID: ${uid}`, 814, 728);

    ctx.fillStyle = "#00FF00";
    let profileText = `Profile: ${link}`;
    if (ctx.measureText(profileText).width > 700) {
      profileText = `Profile: fb.com/${uid}`;
    }
    ctx.fillText(profileText, 32, 727);

    // Save canvas to file (overwrite background file pathImg)
    const out = fs.createWriteStream(pathImg);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    await new Promise(resolve => out.on('finish', resolve));

    // Send message with nice emojis and formatted body
    const bodyText =
      `🌟  •  *Information Card*  •  🌟\n\n` +
      `👤 Name: ${name}\n` +
      `🔗 Profile: ${link}\n\n` +
      `✨ Generated by: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;

    // Ensure sending as attachment stream
    api.sendMessage({
      body: bodyText,
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, event.messageID);

    // Cleanup temp files if exist
    try { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); } catch (e) { /* ignore */ }
    try { if (fs.existsSync(pathAvata)) fs.unlinkSync(pathAvata); } catch (e) { /* ignore */ }

  } catch (error) {
    console.error("Card generation error:", error);
    // Friendly failure message in user's language fallback to English
    const lang = (global.config && global.config.language) || "en";
    const failMsg = (this.languages && this.languages[lang] && this.languages[lang].fail) || module.exports.languages["en"].fail;
    api.sendMessage(failMsg, event.threadID, event.messageID);
  }
};
