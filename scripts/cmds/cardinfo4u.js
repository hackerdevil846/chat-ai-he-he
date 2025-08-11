const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";

module.exports = {
  config: {
    name: "cardinfo4u",
    version: "2.0.0",
    author: "Asif",
    category: "info",
    shortDescription: "Create stylish user info cards",
    longDescription: "Generate personalized information cards with user details and profile picture",
    guide: {
      en: "{p}cardinfo4u [reply to user or leave blank for self]"
    },
    cooldowns: 15,
    dependencies: {
      canvas: "",
      axios: "",
      "fs-extra": "",
      jimp: ""
    }
  },

  circleImage: async function (image) {
    const jimp = global.nodemodule["jimp"];
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
  },

  onStart: async function ({ api, event, args }) {
    try {
      const { createCanvas, loadImage, registerFont } = require("canvas");
      const fs = global.nodemodule["fs-extra"];
      const axios = global.nodemodule["axios"];
      const jimp = global.nodemodule["jimp"];
      
      // Determine target user ID
      let uid;
      if (event.messageReply && event.messageReply.senderID) {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args[0] && args[0].match(/\d+/)) {
        uid = args[0];
      } else {
        uid = event.senderID;
      }

      const pathImg = __dirname + `/cache/${uid}_card.png`;
      const pathAvata = __dirname + `/cache/${uid}_avt.png`;

      // Get user data
      const userData = await api.getUserInfo(uid);
      const user = userData[uid];
      const name = user.name;
      const gender = user.gender || "Not specified";
      const birthday = user.birthday || "Not available";
      const relationship = user.relationship_status || "Not specified";
      const location = user.location?.name || "Not specified";
      const hometown = user.hometown?.name || "Not specified";
      const link = user.link || `https://facebook.com/${uid}`;
      const follow = user.follow ? `${user.follow} followers` : "Not available";

      // Download assets in parallel
      const [avatarRes, bgRes] = await Promise.all([
        axios.get(`https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
          responseType: 'arraybuffer'
        }),
        axios.get("https://i.imgur.com/rqbC4ES.jpg", {
          responseType: "arraybuffer"
        })
      ]);

      fs.writeFileSync(pathAvata, avatarRes.data);
      fs.writeFileSync(pathImg, bgRes.data);

      // Process avatar
      const circledAvatar = await this.circleImage(pathAvata);
      fs.writeFileSync(pathAvata, circledAvatar);

      // Download font if missing
      if (!fs.existsSync(__dirname + fonts)) {
        try {
          const fontData = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + fonts, fontData);
        } catch (fontError) {
          console.error("Font download failed, using fallback", fontError);
        }
      }

      // Setup canvas
      const baseImage = await loadImage(pathImg);
      const avatar = await loadImage(pathAvata);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0);
      ctx.drawImage(avatar, 910, 465, 229, 229);

      // Register font
      if (fs.existsSync(__dirname + fonts)) {
        registerFont(__dirname + fonts, { family: "Play-Bold" });
        ctx.font = "35px 'Play-Bold'";
      } else {
        ctx.font = "35px Arial";
        console.warn("Custom font not found, using fallback");
      }

      // Text rendering
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

      infoLines.forEach(line => {
        // Truncate long text
        let displayText = line.text;
        if (ctx.measureText(displayText).width > 400) {
          while (ctx.measureText(displayText + "...").width > 400 && displayText.length > 10) {
            displayText = displayText.substring(0, displayText.length - 1);
          }
          displayText += "...";
        }
        ctx.fillText(displayText, line.x, line.y);
      });

      // Additional info
      if (fs.existsSync(__dirname + fonts)) {
        ctx.font = "28px 'Play-Bold'";
      } else {
        ctx.font = "28px Arial";
      }
      
      ctx.fillStyle = "#FFCC33";
      ctx.fillText(`UID: ${uid}`, 814, 728);
      
      ctx.fillStyle = "#00FF00";
      // Truncate profile link if too long
      let profileText = `Profile: ${link}`;
      if (ctx.measureText(profileText).width > 700) {
        profileText = `Profile: fb.com/${uid}`;
      }
      ctx.fillText(profileText, 32, 727);

      // Save image
      const out = fs.createWriteStream(pathImg);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      // Wait for image to finish processing
      await new Promise(resolve => out.on('finish', resolve));
      
      // Send result
      api.sendMessage({
        body: `🌟 ${name}'s Information Card\n🔗 Profile: ${link}`,
        attachment: fs.createReadStream(pathImg)
      }, event.threadID, event.messageID);
      
      // Cleanup temporary files
      fs.unlinkSync(pathImg);
      fs.unlinkSync(pathAvata);

    } catch (error) {
      console.error("Card generation error:", error);
      api.sendMessage("❌ Failed to generate information card. Please try again later.", event.threadID, event.messageID);
    }
  }
};
