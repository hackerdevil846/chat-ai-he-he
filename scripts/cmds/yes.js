const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "yes",
    version: "3.1.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: "Board e comment korun",
    longDescription: "Board e comment korun",
    category: "memes",
    guide: "{pn} [text]",
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  wrapText: (ctx, text, maxWidth) => {
    return new Promise(resolve => {
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
          if (split) {
            words[1] = `${temp.slice(-1)}${words[1]}`;
          } else {
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
  },

  onStart: async function ({ message, args }) {
    const pathImg = __dirname + "/cache/yes.png";
    const text = args.join(" ");
    if (!text) {
      return message.reply("❔ | Doya kore board e likhar jonno kichu text din.");
    }

    const getImage = (await axios.get(
      "https://i.ibb.co/GQbRhkY/Picsart-22-08-14-17-32-11-488.jpg",
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "bold 400 35px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "start";

    let fontSize = 45;
    while (ctx.measureText(text).width > 2250) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    }

    const lines = await this.wrapText(ctx, text, 350);
    ctx.fillText(lines.join("\n"), 280, 50); // comment

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    message.reply({ attachment: fs.createReadStream(pathImg) }, () => {
      fs.unlinkSync(pathImg);
    });
  }
};
