module.exports.config = {
  name: "drake",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎭 Create Drake meme with custom text",
  commandCategory: "🖼️ Edit-Image",
  usages: "[text 1] | [text 2]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    const Canvas = global.nodemodule["canvas"];
    
    let pathImg = __dirname + `/cache/drake_${event.senderID}.png`;
    const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
    
    if (!text[0] || !text[1]) return api.sendMessage("❌ Invalid format!\n💡 Use: drake [text 1] | [text 2]", event.threadID, event.messageID);

    // Download template
    const imageResponse = await axios.get("https://i.imgur.com/qmkwLUx.png", {
      responseType: "arraybuffer"
    });
    fs.writeFileSync(pathImg, Buffer.from(imageResponse.data, "utf-8"));

    // Download font if not exists
    if (!fs.existsSync(__dirname + '/cache/SVN-Arial 2.ttf')) {
      const fontResponse = await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", {
        responseType: "arraybuffer"
      });
      fs.writeFileSync(__dirname + "/cache/SVN-Arial 2.ttf", Buffer.from(fontResponse.data, "utf-8"));
    }

    // Process image
    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    Canvas.registerFont(__dirname + '/cache/SVN-Arial 2.ttf', {
      family: "SVN-Arial 2"
    });

    // Text formatting
    ctx.font = "30px SVN-Arial 2";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    const wrapText = (text, maxWidth) => {
      const words = text.split(" ");
      const lines = [];
      let line = "";

      for (const word of words) {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== "") {
          lines.push(line.trim());
          line = word + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());
      return lines;
    };

    // Draw texts
    const lines1 = wrapText(text[0], 464);
    const lines2 = wrapText(text[1], 464);

    ctx.fillText(lines1.join("\n"), 464, 129 - (lines1.length - 1) * 15);
    ctx.fillText(lines2.join("\n"), 464, 339 - (lines2.length - 1) * 15);

    // Save and send
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    await api.sendMessage({
      body: "🖼️ Here's your Drake meme!",
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, event.messageID);

    // Clean up
    fs.unlinkSync(pathImg);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Error generating image", event.threadID, event.messageID);
  }
};
