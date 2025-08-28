const axios = require('axios');
const fs = require('fs-extra');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

// Define the toBI function for bold italic text
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "banner3",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    category: "media",
    shortDescription: {
      en: toBI("Generate a great banner")
    },
    longDescription: {
      en: toBI("Create custom banners with multiple styles and options")
    },
    guide: {
      en: toBI("{p}banner3 [find] or reply to use")
    }
  },

  onStart: async function ({ event, message, args }) {
    try {
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache', 'banner3');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      if (args[0] === "find" || args[0] === "tìm") {
        if (!args[1]) {
          return message.reply(toBI("❎ Please provide a character ID"));
        }
        
        const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
        const character = lengthchar[args[1]];
        
        if (!character) {
          return message.reply(toBI("❎ Character not found"));
        }
        
        const imageStream = (await axios.get(character.imgAnime, { responseType: "stream" })).data;
        const msg = {
          body: toBI(`𝒄𝒉𝒂𝒓 𝒄𝒂𝒓𝒓𝒊𝒆𝒔 𝒐𝒓𝒅𝒊𝒏𝒂𝒍 𝒏𝒖𝒎𝒃𝒆𝒓 ${args[1]}`),
          attachment: imageStream
        };
        return message.reply(msg);
      }
      
      if (!args[0]) {
        const abcxyz = [
          "https://imgur.com/7AiLKO5.png",
          "https://imgur.com/6we7T1g.png", 
          "https://imgur.com/W1TNnj9.png",
          "https://imgur.com/qZAh20x.png"
        ];
        
        let attachments = [];
        for (let i = 0; i < 4; i++) {
          const imageStream = (await axios.get(abcxyz[i], { responseType: "stream" })).data;
          attachments.push(imageStream);
        }
        
        const msg = {
          body: toBI("𝑹𝒆𝒑𝒍𝒚 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝑻𝒐 𝑪𝒉𝒐𝒐𝒔𝒆 𝑺𝒕𝒚𝒍𝒆 (1-4)"),
          attachment: attachments
        };
        
        return message.reply(msg, (err, info) => {
          global.client.handleReply.push({
            step: 1,
            name: "banner3",
            author: event.senderID,
            messageID: info.messageID
          });
        });
      }
    } catch (error) {
      console.error("Banner3 error:", error);
      return message.reply(toBI("❎ An error occurred. Please try again later"));
    }
  },

  onReply: async function({ event, message, Reply }) {
    try {
      if (event.senderID !== Reply.author) {
        return message.reply(toBI("❎ Access denied"));
      }

      // Create cache directory
      const cacheDir = path.join(__dirname, 'cache', 'banner3');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
      
      // Define paths for temporary files
      const pathImg = path.join(cacheDir, 'avatar_1.png');
      const pathAva = path.join(cacheDir, 'avatar_2.png');
      const pathLine = path.join(cacheDir, 'avatar_3.png');
      const pathImg1 = path.join(cacheDir, 'avatar_1_11.png');
      const pathImg2 = path.join(cacheDir, 'avatar_1_21.png');

      // Download fonts
      const fonts = [
        { name: "GMV_DIN_Pro.ttf", url: "https://github.com/hanakuUwU/font/raw/main/GMV_DIN_Pro.ttf" },
        { name: "Asem-Kandis-PERSONAL-USE.ttf", url: "https://github.com/hanakuUwU/font/raw/main/Asem-Kandis-PERSONAL-USE.ttf" },
        { name: "MTD William Letter.otf", url: "https://drive.google.com/u/0/uc?id=1HsVzLw3LOsKfIeuCm9VlTuN_9zqucOni&export=download" },
        { name: "SteelfishRg-Regular.otf", url: "https://drive.google.com/u/0/uc?id=1SZD5VXMnXQTBYzHG834pHnfyt7B2tfRF&export=download" },
        { name: "SVN-BigNoodleTitling.otf", url: "https://drive.google.com/u/0/uc?id=1uCXXgyepedb9xwlqMsMsvH48D6wwCmUn&export=download" },
        { name: "UTM-Avo.ttf", url: "https://github.com/hanakuUwU/font/blob/main/UTM%20Avo.ttf?raw=true" }
      ];

      for (const font of fonts) {
        const fontPath = path.join(cacheDir, font.name);
        if (!fs.existsSync(fontPath)) {
          try {
            const fontData = (await axios.get(font.url, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(fontPath, Buffer.from(fontData));
          } catch (fontError) {
            console.error(`Error downloading font ${font.name}:`, fontError);
          }
        }
      }

      if (Reply.step === 1) {
        const styleNum = parseInt(event.body);
        if (isNaN(styleNum) || styleNum < 1 || styleNum > 4) {
          return message.reply(toBI('❎ Please reply with a number between 1-4'));
        }
        
        message.unsend(Reply.messageID);
        return message.reply(toBI(`𝒀𝒐𝒖 𝒄𝒉𝒐𝒔𝒆 𝒔𝒕𝒚𝒍𝒆 ${styleNum} - 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫`), (err, info) => {
          global.client.handleReply.push({
            step: 2,
            name: "banner3",
            author: event.senderID,
            kieu: styleNum,
            messageID: info.messageID
          });
        });
      } 
      else if (Reply.step === 2) {
        const charId = event.body.trim();
        const character = lengthchar[charId];
        
        if (!character) {
          return message.reply(toBI("❎ Invalid character ID. Please try again"));
        }
        
        message.unsend(Reply.messageID);
        return message.reply(toBI(`𝒀𝒐𝒖 𝒄𝒉𝒐𝒔𝒆 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫 ${charId} - 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒎𝒂𝒊𝒏 𝒏𝒂𝒎𝒆`), (err, info) => {
          global.client.handleReply.push({
            step: 3,
            name: "banner3",
            author: event.senderID,
            kieu: Reply.kieu,
            idnv: charId,
            messageID: info.messageID
          });
        });
      } 
      else if (Reply.step === 3) {
        message.unsend(Reply.messageID);
        return message.reply(toBI(`𝒀𝒐𝒖𝒓 𝒎𝒂𝒊𝒏 𝒏𝒂𝒎𝒆: ${event.body} - 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒔𝒖𝒃𝒏𝒂𝒎𝒆`), (err, info) => {
          global.client.handleReply.push({
            step: 4,
            name: "banner3",
            author: event.senderID,
            kieu: Reply.kieu,
            idnv: Reply.idnv,
            tenchinh: event.body,
            messageID: info.messageID
          });
        });
      } 
      else if (Reply.step === 4) {
        message.unsend(Reply.messageID);
        return message.reply(toBI(`𝒀𝒐𝒖𝒓 𝒔𝒖𝒃𝒏𝒂𝒎𝒆: ${event.body} - 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒄𝒐𝒍𝒐𝒓 (𝒐𝒓 "𝒏𝒐" 𝒇𝒐𝒓 𝒅𝒆𝒇𝒂𝒖𝒍𝒕)`), (err, info) => {
          global.client.handleReply.push({
            step: 5,
            name: "banner3",
            author: event.senderID,
            kieu: Reply.kieu,
            idnv: Reply.idnv,
            tenchinh: Reply.tenchinh,
            tenphu: event.body,
            messageID: info.messageID
          });
        });
      } 
      else if (Reply.step === 5) {
        message.unsend(Reply.messageID);
        
        const type = Reply.kieu;
        const charId = Reply.idnv;
        const tenchinh = Reply.tenchinh;
        const subname = Reply.tenphu;
        const colorInput = event.body.trim();
        
        const character = lengthchar[charId];
        if (!character) {
          return message.reply(toBI("❎ Character data not found"));
        }
        
        const color_ = (colorInput.toLowerCase() === "no") ? character.colorBg : colorInput;

        try {
          // Download character image
          const avtAnime = (await axios.get(character.imgAnime, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(pathAva, Buffer.from(avtAnime));

          if (type == 1) {
            await createStyle1(pathImg, pathAva, pathLine, tenchinh, subname, color_);
          } 
          else if (type == 2) {
            await createStyle2(pathImg, pathAva, pathLine, tenchinh, subname, color_);
          }
          else if (type == 3) {
            await createStyle3(pathImg, pathAva, pathLine, tenchinh, subname, color_);
          }
          else if (type == 4) {
            await createStyle4(pathImg, pathAva, pathLine, pathImg1, pathImg2, tenchinh, subname, color_, event.senderID);
          }

          return message.reply({
            body: toBI("𝒀𝒐𝒖𝒓 𝒃𝒂𝒏𝒏𝒆𝒓 𝒊𝒔 𝒓𝒆𝒂𝒅𝒚"),
            attachment: fs.createReadStream(pathImg)
          }, () => {
            // Cleanup files
            const filesToDelete = [pathImg, pathAva, pathLine, pathImg1, pathImg2];
            filesToDelete.forEach(filePath => {
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
          });
          
        } catch (error) {
          console.error("Banner creation error:", error);
          return message.reply(toBI("❎ Error generating banner"));
        }
      }
    } catch (error) {
      console.error("Reply handler error:", error);
      return message.reply(toBI("❎ An error occurred. Please try again"));
    }
  }
};

// Style creation functions
async function createStyle1(pathImg, pathAva, pathLine, tenchinh, subname, color_) {
  const axios = require('axios');
  const { createCanvas, loadImage } = require('canvas');
  
  const line = (await axios.get("https://i.imgur.com/4BQHmeI.png", { responseType: "arraybuffer" })).data;
  const background = (await axios.get("https://i.imgur.com/HUblFwC.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathLine, Buffer.from(line));
  fs.writeFileSync(pathImg, Buffer.from(background));
  
  const a = await loadImage(pathImg);
  const ab = await loadImage(pathAva);
  const az = await loadImage(pathLine);
  
  const canvas = createCanvas(a.width, a.height);
  const ctx = canvas.getContext("2d");
  const canvas2 = createCanvas(a.width, a.height);
  const ctx1 = canvas2.getContext("2d");
  
  ctx1.fillStyle = "#ffff";
  ctx1.fillRect(0, 0, 1500, 1500);
  ctx1.save();
  ctx1.globalAlpha = "0.1";
  ctx1.drawImage(ab, 0, 0, 1500, 1500);
  ctx1.restore();
  ctx1.save();
  ctx1.fillStyle = "#000";
  ctx1.globalCompositeOperation = "color";
  ctx1.fillRect(0, 0, 1500, 1500);
  ctx1.restore();
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color_;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-over";
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(az, 0, 0, canvas.width, canvas.height);
  
  ctx.save();
  ctx.textAlign = "center";
  registerFont(__dirname + '/cache/banner3/GMV_DIN_Pro.ttf', { family: "GMV DIN Pro Cond" });
  ctx.fillStyle = "rgba(255, 255, 255,0.8)";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.font = "200px GMV DIN Pro Cond";
  ctx.strokeText(tenchinh, canvas.width / 2, 650);
  ctx.fillText(tenchinh, canvas.width / 2, 825);
  ctx.strokeText(tenchinh, canvas.width / 2, 1000);
  ctx.restore();
  
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(canvas2, -canvas.width / 4, -canvas.width / 4, canvas.width * 1.5, canvas.height * 1.5);
  ctx.restore();
  
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0, 0.3)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.drawImage(ab, 0, 0, canvas.width, canvas.height);
  ctx.restore();
  
  ctx.save();
  registerFont(__dirname + '/cache/banner3/Asem-Kandis-PERSONAL-USE.ttf', { family: "Asem Kandis" });
  ctx.textAlign = "center";
  ctx.fillStyle = color_;
  ctx.font = "120px Asem Kandis";
  ctx.fillText(subname, canvas.width / 2, 200);
  
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
}

async function createStyle2(pathImg, pathAva, pathLine, tenchinh, subname, color_) {
  const axios = require('axios');
  const { createCanvas, loadImage } = require('canvas');
  
  const line = (await axios.get("https://1.bp.blogspot.com/-5SECGn_32Co/YQkQ-ZyDSPI/AAAAAAAAv1o/nZYKV0s_UPY41XlfWfNIX0HbVoRLhnlogCNcBGAsYHQ/s0/line.png", { responseType: "arraybuffer" })).data;
  const background = (await axios.get("https://i.imgur.com/j8FVO1W.jpg", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathLine, Buffer.from(line));
  fs.writeFileSync(pathImg, Buffer.from(background));
  
  const amg = await loadImage(pathImg);
  const cmg = await loadImage(pathAva);
  const omg = await loadImage(pathLine);
  
  const canvas = createCanvas(amg.width, amg.height);
  const ctx = canvas.getContext("2d");
  
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color_;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  registerFont(__dirname + '/cache/banner3/SteelfishRg-Regular.otf', { family: "SteelfishRg-Regular" });
  ctx.font = `430px SteelfishRg-Regular`;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgb(255 255 255 / 70%)";
  ctx.globalAlpha = 0.7;
  ctx.fillText(tenchinh.toUpperCase(), canvas.width / 2, 1350);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 7;
  ctx.textAlign = "center";
  ctx.strokeText(tenchinh.toUpperCase(), canvas.width / 2, 900);
  ctx.strokeText(tenchinh.toUpperCase(), canvas.width / 2, 1800);
  ctx.drawImage(cmg, 0, 0, 2000, 2000);
  ctx.drawImage(omg, 0, 0, canvas.width, canvas.height);
  
  registerFont(__dirname + '/cache/banner3/MTD William Letter.otf', { family: "MTD William Letter" });
  ctx.font = `300px MTD William Letter`;
  ctx.fillStyle = `#FFFFFF`;
  ctx.textAlign = "center";
  ctx.fillText(subname, canvas.width / 2, 350);
  
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
}

async function createStyle3(pathImg, pathAva, pathLine, tenchinh, subname, color_) {
  const axios = require('axios');
  const { createCanvas, loadImage } = require('canvas');
  
  const background = (await axios.get("https://lh3.googleusercontent.com/-p0IHqcx8eWE/YXZN2izzTrI/AAAAAAAAym8/T-hqrJ2IFooUfHPeVTbiwu047RkmxGLzgCNcBGAsYHQ/s0/layer2.jpg", { responseType: "arraybuffer" })).data;
  const hieuung = (await axios.get("https://lh3.googleusercontent.com/-F8w1tQRZ9s0/YXZZmKaylRI/AAAAAAAAynI/HBoYISaw-LE2z8QOE39OGwTUiFjHUH6xgCNcBGAsYHQ/s0/layer4.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(background));
  fs.writeFileSync(pathLine, Buffer.from(hieuung));
  
  const h = await loadImage(pathImg);
  const u = await loadImage(pathAva);
  const k = await loadImage(pathLine);
  
  const canvas = createCanvas(h.width, h.height);
  const ctx = canvas.getContext("2d");
  
  ctx.drawImage(h, 0, 0, h.width, h.height);
  ctx.fillStyle = color_;
  ctx.filter = "grayscale(1)";
  ctx.fillRect(0, 164, canvas.width, 633);
  ctx.drawImage(k, 0, 0, h.width, h.height);
  ctx.globalAlpha = 0.5;
  ctx.drawImage(u, 0, -320, canvas.width, canvas.width);
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.transform(1, 0, -0.2, 1, 0, 0);
  
  registerFont(__dirname + '/cache/banner3/SVN-BigNoodleTitling.otf', { family: "SVN-BigNoodleTitling" });
  ctx.font = `italic 200px SVN-BigNoodleTitling`;
  ctx.fillStyle = `#FFFFFF`;
  ctx.textAlign = "end";
  ctx.globalAlpha = 0.8;
  ctx.fillText(tenchinh.toUpperCase(), 1215, 535);
  
  ctx.font = `60px SVN-BigNoodleTitling`;
  ctx.fillStyle = `#FFFFFF`;
  ctx.textAlign = "end";
  ctx.globalAlpha = 1;
  const l = ctx.measureText(subname).width;
  ctx.fillRect(1500, 164, 150, 633);
  ctx.fillRect(canvas.width - l - 540, 580, l + 50, 75);
  ctx.fillStyle = color_;
  ctx.fillText(subname.toUpperCase(), 1195, 640);
  ctx.fillStyle = `#FFFFFF`;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(1300, 164, 150, 633);
  ctx.globalAlpha = 1;
  ctx.transform(1, 0, 0.2, 1, 0, 0);
  ctx.filter = "grayscale(0)";
  ctx.drawImage(u, 1010, 97, 700, 700);
  
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
}

async function createStyle4(pathImg, pathAva, pathLine, pathImg1, pathImg2, tenchinh, subname, color_, senderID) {
  const axios = require('axios');
  const { createCanvas, loadImage } = require('canvas');
  
  const background = (await axios.get("https://lh3.googleusercontent.com/-JZxo4uTVIKQ/YaS7VBjAojI/AAAAAAAA1rk/mg_Bp0Z6_yUGLp1lfC9ugriYTGFfRaXTwCNcBGAsYHQ/s0/layer-2.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(background));
  
  const background2 = (await axios.get("https://lh3.googleusercontent.com/-j9JKCim94ks/YaIMA7fVnPI/AAAAAAAA1k8/g9e5X5FfRH4NiG-7hHRNikGxViI2o8pYQCNcBGAsYHQ/s0/layer-3.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg1, Buffer.from(background2));
  
  const background3 = (await axios.get("https://lh3.googleusercontent.com/-F8w1tQRZ9s0/YXZZmKaylRI/AAAAAAAAynI/HBoYISaw-LE2z8QOE39OGwTUiFjHUH6xgCNcBGAsYHQ/s0/layer4.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg2, Buffer.from(background3));
  
  const l1 = await loadImage(pathAva);
  const l2 = await loadImage(pathImg);
  const l3 = await loadImage(pathImg1);
  const l4 = await loadImage(pathImg2);
  const a = await loadImage(pathImg);
  
  const canvas = createCanvas(a.width, a.height);
  const ctx = canvas.getContext("2d");
  
  registerFont(__dirname + '/cache/banner3/UTM-Avo.ttf', { family: "UTM-Avo" });
  
  ctx.save();
  ctx.fillStyle = color_;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  
  ctx.save();
  ctx.drawImage(l2, 0, 0, canvas.width, canvas.height);
  ctx.restore();
  
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = "0.5";
  ctx.drawImage(l1, -300, -300, 1500, 1500);
  ctx.restore();
  
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.transform(1, 0, 1, 1, 0, 0);
  ctx.fillRect(500, 0, 650, 740);
  ctx.restore();
  
  ctx.save();
  ctx.beginPath();
  ctx.save();
  ctx.transform(1, 0, 1, 1, 0, 0);
  ctx.rect(500, 0, 650, 740);
  ctx.restore();
  ctx.clip();
  
  ctx.save();
  ctx.globalAlpha = "0.1";
  ctx.drawImage(l1, 300, -300, 1500, 1500);
  ctx.restore();
  
  ctx.save();
  ctx.drawImage(l3, 0, 0, canvas.width, canvas.height);
  ctx.restore();
  
  ctx.save();
  ctx.globalCompositeOperation = "color";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.restore();
  
  const ttx = 950;
  const tty = 600;
  const ttpad = 180;
  const ttsize = "300px";
  
  ctx.save();
  ctx.beginPath();
  ctx.save();
  ctx.transform(1, 0, 1, 1, 0, 0);
  ctx.rect(500, 0, 650, 740);
  ctx.restore();
  ctx.clip();
  
  ctx.save();
  ctx.translate(ttx, tty);
  ctx.globalAlpha = 0.5;
  ctx.rotate(Math.PI / 180 * 45);
  ctx.strokeStyle = color_;
  ctx.lineWidth = 4;
  ctx.textAlign = "center";
  ctx.font = ttsize + " DIN Condensed";
  ctx.strokeText(subname.split("").join(String.fromCharCode(8203)), 0, 0);
  ctx.restore();
  
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = color_;
  ctx.lineWidth = 2;
  ctx.translate(ttx + ttpad, tty - ttpad);
  ctx.rotate(Math.PI / 180 * 45);
  ctx.textAlign = "center";
  ctx.font = ttsize + " DIN Condensed";
  ctx.fillText(subname.split("").join(String.fromCharCode(8202)), 0, 0);
  ctx.restore();
  
  ctx.strokeStyle = color_;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 5;
  ctx.translate(ttx + ttpad * 2, tty - ttpad * 2);
  ctx.rotate(Math.PI / 180 * 45);
  ctx.textAlign = "center";
  ctx.font = ttsize + " DIN Condensed"; 
  ctx.strokeText(subname.split("").join(String.fromCharCode(8202)), 0, 0);
  ctx.restore();
  ctx.restore();
  
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0, 0.3)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.drawImage(l1, 900, -200, 1000, 1000);
  ctx.restore();
  
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "bold 65px UTM-Avo";
  ctx.fillText(tenchinh, 430, 390);
  ctx.restore();
  
  const test = "https://facebook.com/" + senderID;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "27px UTM-Avo";
  ctx.fillText(test.toUpperCase(), 430, 440);
  ctx.restore();
  
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.fillRect(430 - 300 / 2, 470, 300, 5);
  ctx.font = "27px UTM-Avo";
  ctx.fillText("+++".toUpperCase(), 150, 300);
  ctx.restore();
  
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
}
