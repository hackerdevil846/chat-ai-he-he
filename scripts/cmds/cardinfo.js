const sendWaiting = true; // enable or disable sending "images in progress, please wait...";
const textWaiting = "🖼️ | Image initialization, please wait a moment...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports = {
  config: {
    name: "cardinfo",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ Create Facebook user information card",
    commandCategory: "group",
    usages: "[reply/mention]",
    cooldowns: 5,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    },
    envConfig: {}
  },

  languages: {
    "en": {
      "missing_reply": "❌ Please reply to a message to get user info!"
    }
  },

  circle: async function (image) {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
  },

  onLoad: function ({ configValue }) {
    if (!global.nodemodule["canvas"]) {
      console.error("Please install canvas module");
    }
  },

  run: async function ({ api, event, args, Users }) {
    const { loadImage, createCanvas } = require("canvas");
    const request = require('request');
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const Canvas = global.nodemodule["canvas"];
    
    let { senderID, threadID, messageID } = event;
    
    if ((this.config.credits) !== "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅") { 
      return api.sendMessage(`⚠️ Detected: Credits have been changed!`, event.threadID, event.messageID);
    }

    if (sendWaiting) {
      api.sendMessage(textWaiting, threadID, messageID);
    }

    let uid;
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      uid = event.senderID;
    }

    try {
      const res = await api.getUserInfoV2(uid); 
      let pathImg = __dirname + `/cache/1.png`;
      let pathAvata = __dirname + `/cache/2.png`;

      let getAvatarOne = (await axios.get(
        `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: 'arraybuffer' }
      )).data;

      let bg = (await axios.get(encodeURI(`https://i.imgur.com/tW6nSDm.png`), {
        responseType: "arraybuffer",
      })).data;

      fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
      let avataruser = await this.circle(pathAvata);
      fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

      if (!fs.existsSync(__dirname + `${fonts}`)) { 
        let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
      }

      let baseImage = await loadImage(pathImg);
      let baseAvata = await loadImage(avataruser);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");
      
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvata, 80, 73, 285, 285);
      
      // Process user data
      const userData = {
        name: res.name || "Not Found",
        gender: res.gender === 'male' ? "♂️ Male" : res.gender === 'female' ? "♀️ Female" : "Not public",
        follow: res.follow || "Not Found",
        relationship: res.relationship_status || "Not Found",
        birthday: res.birthday || "Not Found",
        location: res.location || "Not Found",
        link: res.link || "Not Found"
      };

      Canvas.registerFont(__dirname + `${fonts}`, {
        family: "Play-Bold"
      });

      // Draw user information
      ctx.font = `${fontsInfo}px Play-Bold`;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";
      
      ctx.fillText(`👤 ${userData.name}`, 480, 172);
      ctx.fillText(`⚥ ${userData.gender}`, 550, 208);
      ctx.fillText(`👥 ${userData.follow}`, 550, 244);
      ctx.fillText(`💞 ${userData.relationship}`, 550, 281);
      ctx.fillText(`🎂 ${userData.birthday}`, 550, 320);
      ctx.fillText(`📍 ${userData.location}`, 550, 357);
      ctx.fillText(`🆔 ${uid}`, 550, 399);
      
      ctx.font = `${fontsLink}px Play-Bold`;
      ctx.fillStyle = "#0000FF";
      ctx.fillText(`🔗 ${userData.link}`, 180, 475);

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      fs.removeSync(pathAvata);

      return api.sendMessage(
        { attachment: fs.createReadStream(pathImg) },
        threadID,
        () => fs.unlinkSync(pathImg),
        messageID
      );

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ An error occurred while processing the command.", threadID, messageID);
    }
  }
};
