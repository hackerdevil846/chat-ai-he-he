const sendWaiting = true;
const textWaiting = "⏳ 𝐼𝑚𝑎𝑔𝑒 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;

module.exports = {
  config: {
    name: "cardinfo2",
    aliases: ["profilecard2", "infocard2"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "logo",
    shortDescription: {
      en: "📇 𝑀𝑎𝑘𝑒 𝑎 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑"
    },
    longDescription: {
      en: "📇 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "{p}cardinfo2 <𝑁𝑎𝑚𝑒> <𝑆𝑒𝑥> <𝐹𝑜𝑙𝑙𝑜𝑤𝑒𝑟𝑠> <𝐿𝑜𝑣𝑒> <𝐷𝑂𝐵> <𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛> <𝐹𝐵 𝐿𝑖𝑛𝑘>"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const { loadImage, createCanvas } = require("canvas");
      const fs = require("fs-extra");
      const axios = require("axios");
      const Canvas = require("canvas");

      let pathImg = __dirname + `/cache/1.png`;
      let pathAvata = __dirname + `/cache/2.png`;

      if (sendWaiting) {
        await message.reply(textWaiting);
      }

      let uid;
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else {
        uid = event.senderID;
      }

      const res = await api.getUserInfo(uid);

      // Avatar & Background
      let getAvatarOne = (await axios.get(
        `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )).data;

      let bg = (await axios.get(
        encodeURI(`https://i.imgur.com/tW6nSDm.png`),
        { responseType: "arraybuffer" }
      )).data;

      fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, "utf-8"));
      const avataruser = await this.circle(pathAvata);
      fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

      // Download Fonts if not exists
      if (!fs.existsSync(__dirname + `${fonts}`)) {
        let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
      }

      // Draw Canvas
      let baseImage = await loadImage(pathImg);
      let baseAvata = await loadImage(avataruser);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvata, 80, 73, 285, 285);

      // Default Fallbacks
      if (!res[uid].name) res[uid].name = args[0] || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑";
      if (!res[uid].gender) res[uid].gender = args[1] || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑";
      if (!res[uid].follow) res[uid].follow = args[2] || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑";
      if (!res[uid].relationship_status) res[uid].relationship_status = args[3] || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑";
      if (!res[uid].birthday) res[uid].birthday = args[4] || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑";
      if (!res[uid].location) res[uid].location = args[5] || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑";
      if (!res[uid].link) res[uid].link = args[6] || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑";

      var name = res[uid].name || "𝑁𝑜 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑";
      var gender = res[uid].gender || "𝑁𝑜 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑";
      var follow = res[uid].follow || "𝑁𝑜 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑";
      var love = res[uid].relationship_status || "𝑁𝑜 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑";
      var birthday = res[uid].birthday || "𝑁𝑜 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑";
      var location = res[uid].location || "𝑁𝑜 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑";
      var link = res[uid].link || "𝑁𝑜 �𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑";

      Canvas.registerFont(__dirname + `${fonts}`, { family: "Play-Bold" });
      ctx.font = `${fontsInfo}px Play-Bold`;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";

      ctx.fillText(`${name}`, 480, 172);
      ctx.fillText(`${gender}`, 550, 208);
      ctx.fillText(`${follow}`, 550, 244);
      ctx.fillText(`${love}`, 550, 281);
      ctx.fillText(`${birthday}`, 550, 320);
      ctx.fillText(`${location}`, 550, 357);
      ctx.fillText(`${uid}`, 550, 399);

      ctx.font = `${fontsLink}px Play-Bold`;
      ctx.fillStyle = "#0000FF";
      ctx.textAlign = "start";
      ctx.fillText(`${link}`, 175, 470);

      // Export Final Image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      fs.removeSync(pathAvata);

      await message.reply({
        body: `✨ 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑 ✨`,
        attachment: fs.createReadStream(pathImg)
      });

      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("𝐶𝑎𝑟𝑑𝐼𝑛𝑓𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  },

  circle: async function (image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
  }
};
