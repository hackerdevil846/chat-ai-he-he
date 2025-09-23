const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";

module.exports = {
  config: {
    name: "cardinfo7",
    aliases: ["infocard7", "profilecard7"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "info",
    shortDescription: {
      en: "🪪 𝐼𝑛𝑓𝑜 𝑐𝑎𝑟𝑑 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙𝑖𝑧𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑"
    },
    guide: {
      en: "{p}cardinfo7 [𝑟𝑒𝑝𝑙𝑦|𝑛𝑜𝑛𝑒]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "jimp": "",
      "moment-timezone": ""
    }
  },

  circle: async function (image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const fs = require("fs-extra");
      const axios = require("axios");
      const Canvas = require("canvas");
      const { loadImage, createCanvas } = Canvas;
      const moment = require("moment-timezone");

      const { senderID, threadID, messageID } = event;
      const tmpDir = __dirname + "/cache";
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

      const pathImg = __dirname + `/cache/${senderID}${threadID}_info.png`;
      const pathAvata = __dirname + `/cache/avtuser.png`;

      let uid;
      if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID) {
        uid = event.messageReply.senderID;
      } else {
        uid = senderID;
      }

      let res = {};
      try {
        const userInfo = await api.getUserInfo(uid);
        res = userInfo[uid] || { name: "𝑈𝑛𝑘𝑛𝑜𝑤𝑛", gender: null };
      } catch (e) {
        res = { name: "𝑈𝑛𝑘𝑛𝑜𝑤𝑛", gender: null };
      }

      const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=1449557605494892|aaf0a865c8bafc314ced5b7f18f3caa6`;
      const avatarResp = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      const avatarBuffer = Buffer.from(avatarResp.data);
      fs.writeFileSync(pathAvata, avatarBuffer);

      const bgResp = await axios.get(`https://i.imgur.com/rqbC4ES.jpg`, { responseType: "arraybuffer" });
      const bgBuffer = Buffer.from(bgResp.data);
      fs.writeFileSync(pathImg, bgBuffer);

      const fontPath = __dirname + fonts;
      if (!fs.existsSync(fontPath)) {
        try {
          const fontResp = await axios.get(downfonts, { responseType: "arraybuffer" });
          fs.writeFileSync(fontPath, Buffer.from(fontResp.data));
        } catch (err) {
          console.warn("𝐹𝑜𝑛𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 𝑓𝑜𝑛𝑡");
        }
      }

      const avatarCircleBuffer = await this.circle(pathAvata);

      const baseImage = await loadImage(pathImg);
      const baseAvata = await loadImage(avatarCircleBuffer);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvata, 910, 465, 229, 229);

      try {
        if (fs.existsSync(fontPath)) {
          Canvas.registerFont(fontPath, { family: "Play-Bold" });
        }
      } catch (err) {
        console.warn("𝐹𝑜𝑛𝑡 𝑟𝑒𝑔𝑖𝑠𝑡𝑒𝑟 𝑤𝑎𝑟𝑛𝑖𝑛𝑔:", err?.message || err);
      }

      const norm = (val) => {
        if (!val) return "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
        if (typeof val === "string" && val.trim() === "") return "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
        if (String(val).includes("𝐾ℎô𝑛𝑔 𝐶ó 𝐷ữ 𝐿𝑖ệ𝑢")) return "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
        return val;
      };

      const gender = res.gender === "MALE" ? "𝑀𝑎𝑙𝑒" : res.gender === "FEMALE" ? "𝐹𝑒𝑚𝑎𝑙𝑒" : "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
      const birthday = norm(res.birthday);
      const love = norm(res.relationship_status);
      const location = norm(res.location);
      const hometown = norm(res.hometown);
      const displayName = norm(res.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛");
      const profileLink = `https://facebook.com/${uid}`;

      ctx.textBaseline = "top";

      ctx.font = `35px "Play-Bold", sans-serif`;
      ctx.fillStyle = "#00FFFF";
      ctx.fillText(`𝑁𝑎𝑚𝑒: ${displayName}`, 340, 560);

      ctx.fillText(`𝐺𝑒𝑛𝑑𝑒𝑟: ${gender}`, 1245, 448);
      ctx.fillText(`𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝: ${love}`, 1245, 559);
      ctx.fillText(`𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦: ${birthday}`, 1245, 616);
      ctx.fillText(`𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛: ${location}`, 1245, 668);
      ctx.fillText(`𝐻𝑜𝑚𝑒𝑡𝑜𝑤𝑛: ${hometown}`, 1245, 723);

      ctx.font = `28px "Play-Bold", sans-serif`;
      ctx.fillStyle = "#FFCC33";
      ctx.fillText(`𝑈𝐼𝐷: ${uid}`, 814, 728);

      ctx.fillStyle = "#00FF00";
      ctx.fillText(`𝑃𝑟𝑜𝑓𝑖𝑙𝑒: ${profileLink}`, 32, 727);

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      const messageBody = `✅ *𝐼𝑛𝑓𝑜 𝐶𝑎𝑟𝑑 𝑅𝑒𝑎𝑑𝑦!* 🪪\n\n✨ 𝑁𝑎𝑚𝑒: ${displayName}\n🆔 𝑈𝐼𝐷: ${uid}\n🔗 𝑃𝑟𝑜𝑓𝑖𝑙𝑒: ${profileLink}`;

      await message.reply({
        body: messageBody,
        attachment: fs.createReadStream(pathImg)
      });

      // Cleanup
      try { 
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); 
        if (fs.existsSync(pathAvata)) fs.unlinkSync(pathAvata); 
      } catch (e) { }

    } catch (error) {
      console.error("𝑐𝑎𝑟𝑑𝑖𝑛𝑓𝑜7 𝑒𝑟𝑟𝑜𝑟:", error);
      return message.reply(`⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑖𝑛𝑓𝑜 𝑐𝑎𝑟𝑑: ${error.message || error}`);
    }
  }
};
