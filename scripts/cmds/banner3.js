module.exports.config = {
  name: "banner3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂 𝒈𝒓𝒆𝒂𝒕 𝒃𝒂𝒏𝒏𝒆𝒓",
  category: "𝒎𝒆𝒅𝒊𝒂",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, args, event }) {
  const axios = require('axios')
  if(args[0] == "find" || args[0] == "tìm"){
     const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data
    const t = (await axios.get(`${lengthchar[args[1]].imgAnime}`, {
        responseType: "stream"
      })).data;
    const msg = ({
    body: `𝒄𝒉𝒂𝒓 𝒄𝒂𝒓𝒓𝒊𝒆𝒔 𝒐𝒓𝒅𝒊𝒏𝒂𝒍 𝒏𝒖𝒎𝒃𝒆𝒓 ${args[1]}`,
    attachment: t
  })
    return api.sendMessage(msg, event.threadID, event.messageID)
  }
  if(!args[0]){
  const abcxyz = ["https://imgur.com/7AiLKO5.png","https://imgur.com/6we7T1g.png","https://imgur.com/W1TNnj9.png","https://imgur.com/qZAh20x.png"]
  let o = [];
  for(let i = 0; i < 4; i++){
    const t = (await axios.get(`${abcxyz[i]}`, {
        responseType: "stream"
      })).data;
    o.push(t)
  }
  const msg = ({
    body: "𝑹𝒆𝒑𝒍𝒚 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝑻𝒐 𝑪𝒉𝒐𝒐𝒔𝒆 𝑺𝒕𝒚𝒍𝒆",
    attachment: o
  })
  return api.sendMessage(msg, event.threadID, (err, info) => {
    return global.client.handleReply.push({
      step: 1,
      name: "banner3",
      author: event.senderID,
      messageID: info.messageID
    });
  }, event.messageID);
}
}

module.exports.handleReply = async function({ api, event, handleReply }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const { createCanvas, loadImage, registerFont } = require("canvas");
  const Canvas = require('canvas');
  
  if (handleReply.author != event.senderID) 
    return api.sendMessage('𝑨𝒄𝒄𝒆𝒔𝒔 𝒅𝒆𝒏𝒊𝒆𝒅', event.threadID);

  let pathImg1 = __dirname + `/tad/avatar_1_11.png`;
  let pathImg2 = __dirname + `/tad/avatar_1_21.png`;
  let pathImg = __dirname + `/tad/avatar_1.png`;
  let pathAva = __dirname + `/tad/avatar_2.png`;
  let pathLine = __dirname + `/tad/avatar_3.png`;
  const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
  
  const fonts = [
    { name: "GMV_DIN_Pro.ttf", url: "https://github.com/hanakuUwU/font/raw/main/GMV_DIN_Pro.ttf" },
    { name: "Asem-Kandis-PERSONAL-USE.ttf", url: "https://github.com/hanakuUwU/font/raw/main/Asem-Kandis-PERSONAL-USE.ttf" },
    { name: "MTD William Letter.otf", url: "https://drive.google.com/u/0/uc?id=1HsVzLw3LOsKfIeuCm9VlTuN_9zqucOni&export=download" },
    { name: "SteelfishRg-Regular.otf", url: "https://drive.google.com/u/0/uc?id=1SZD5VXMnXQTBYzHG834pHnfyt7B2tfRF&export=download" },
    { name: "SVN-BigNoodleTitling.otf", url: "https://drive.google.com/u/0/uc?id=1uCXXgyepedb9xwlqMsMsvH48D6wwCmUn&export=download" }
  ];

  for (const font of fonts) {
    const fontPath = __dirname + `/tad/${font.name}`;
    if (!fs.existsSync(fontPath)) {
      const fontData = (await axios.get(font.url, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(fontPath, Buffer.from(fontData));
    }
  }

  if (handleReply.step == 1) {
    if(isNaN(event.body)) return api.sendMessage('𝑵𝒐𝒕 𝒂 𝒏𝒖𝒎𝒃𝒆𝒓', event.threadID)
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`𝒀𝒐𝒖 𝒄𝒉𝒐𝒔𝒆 𝒔𝒕𝒚𝒍𝒆 ${event.body} - 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫`, event.threadID, (err, info) => {
      return global.client.handleReply.push({
        step: 2,
        name: "banner3",
        author: event.senderID,
        kieu: event.body,
        messageID: info.messageID
      })
    });
  } 
  else if (handleReply.step == 2) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`𝒀𝒐𝒖 𝒄𝒉𝒐𝒔𝒆 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫 ${event.body} - 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒎𝒂𝒊𝒏 𝒏𝒂𝒎𝒆`, event.threadID, (err, info) => {
      return global.client.handleReply.push({
        step: 3,
        name: "banner3",
        author: event.senderID,
        kieu: handleReply.kieu,
        idnv: event.body,
        messageID: info.messageID
      })
    });
  } else if (handleReply.step == 3) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`𝒀𝒐𝒖𝒓 𝒎𝒂𝒊𝒏 𝒏𝒂𝒎𝒆: ${event.body} - 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒔𝒖𝒃𝒏𝒂𝒎𝒆`, event.threadID, (err, info) => {
      return global.client.handleReply.push({
        step: 4,
        name: "banner3",
        author: event.senderID,
        kieu: handleReply.kieu,
        idnv: handleReply.idnv,
        tenchinh: event.body,
        messageID: info.messageID
      })
    });
  } else if (handleReply.step == 4) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`𝒀𝒐𝒖𝒓 𝒔𝒖𝒃𝒏𝒂𝒎𝒆: ${event.body} - 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒄𝒐𝒍𝒐𝒓 (𝒐𝒓 "𝒏𝒐" 𝒇𝒐𝒓 𝒅𝒆𝒇𝒂𝒖𝒍𝒕)`, event.threadID, (err, info) => {
      return global.client.handleReply.push({
        step: 5,
        name: "banner3",
        author: event.senderID,
        kieu: handleReply.kieu,
        idnv: handleReply.idnv,
        tenchinh: handleReply.tenchinh,
        tenphu: event.body,
        messageID: info.messageID
      })
    });
  } else if (handleReply.step == 5) {
    const type = handleReply.kieu;
    const char = handleReply.idnv;
    const tenchinh = handleReply.tenchinh;
    const subname = handleReply.tenphu;
    const color = event.body;
    
    const color_ = (color.toLowerCase() === "no") 
      ? lengthchar[char].colorBg 
      : color;

    try {
      const avtAnime = (await axios.get(lengthchar[char].imgAnime, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAva, Buffer.from(avtAnime));

      if (type == 1) {
        let line = (await axios.get("https://i.imgur.com/4BQHmeI.png", { responseType: "arraybuffer" })).data;
        let background = (await axios.get("https://i.imgur.com/HUblFwC.png", { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathLine, Buffer.from(line));
        fs.writeFileSync(pathImg, Buffer.from(background));
        let a = await loadImage(pathImg);
        let ab = await loadImage(pathAva);
        let az = await loadImage(pathLine);
        let canvas = createCanvas(a.width, a.height);
        let ctx = canvas.getContext("2d");
        let canvas2 = createCanvas(a.width, a.height);
        let ctx1 = canvas2.getContext("2d");
        ctx1.fillStyle = "#ffff"
        ctx1.fillRect(0, 0, 1500, 1500)
        ctx1.save();
        ctx1.globalAlpha = "0.1";
        ctx1.drawImage(ab, 0, 0, 1500, 1500);
        ctx1.restore();
        ctx1.save();
        ctx1.fillStyle = "#000"
        ctx1.globalCompositeOperation = "color";
        ctx1.fillRect(0, 0, 1500, 1500)
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
        Canvas.registerFont(__dirname + `/tad/GMV_DIN_Pro.ttf`, { family: "GMV DIN Pro Cond" });
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
        Canvas.registerFont(__dirname + `/tad/Asem-Kandis-PERSONAL-USE.ttf`, { family: "Asem Kandis" });
        ctx.textAlign = "center";
        ctx.fillStyle = color_;
        ctx.font = "120px Asem Kandis";
        ctx.fillText(subname, canvas.width / 2, 200);
        ctx.save();
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
      } 
      else if (type == 2) {
        let line = (await axios.get("https://1.bp.blogspot.com/-5SECGn_32Co/YQkQ-ZyDSPI/AAAAAAAAv1o/nZYKV0s_UPY41XlfWfNIX0HbVoRLhnlogCNcBGAsYHQ/s0/line.png", { responseType: "arraybuffer" })).data;
        let background = (await axios.get("https://i.imgur.com/j8FVO1W.jpg", { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathLine, Buffer.from(line));
        fs.writeFileSync(pathImg, Buffer.from(background));
        let amg = await loadImage(pathImg);
        let cmg = await loadImage(pathAva);
        let omg = await loadImage(pathLine);
        let canvas = createCanvas(amg.width, amg.height);
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color_;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        Canvas.registerFont(__dirname + `/tad/SteelfishRg-Regular.otf`, { family: "SteelfishRg-Regular" });
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
        Canvas.registerFont(__dirname + `/tad/MTD William Letter.otf`, { family: "MTD William Letter" });
        ctx.font = `300px MTD William Letter`;
        ctx.fillStyle = `#FFFFFF`;
        ctx.textAlign = "center";
        ctx.fillText(subname, canvas.width / 2, 350);
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
      }
      else if (type == 3) {
        let background = (await axios.get("https://lh3.googleusercontent.com/-p0IHqcx8eWE/YXZN2izzTrI/AAAAAAAAym8/T-hqrJ2IFooUfHPeVTbiwu047RkmxGLzgCNcBGAsYHQ/s0/layer2.jpg", { responseType: "arraybuffer" })).data;
        let hieuung = (await axios.get("https://lh3.googleusercontent.com/-F8w1tQRZ9s0/YXZZmKaylRI/AAAAAAAAynI/HBoYISaw-LE2z8QOE39OGwTUiFjHUH6xgCNcBGAsYHQ/s0/layer4.png", { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg, Buffer.from(background));
        fs.writeFileSync(pathLine, Buffer.from(hieuung));
        let h = await loadImage(pathImg);
        let u = await loadImage(pathAva);
        let k = await loadImage(pathLine);
        let canvas = createCanvas(h.width, h.height);
        let ctx = canvas.getContext("2d");
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
        Canvas.registerFont(__dirname + `/tad/SVN-BigNoodleTitling.otf`, { family: "SVN-BigNoodleTitling" });
        ctx.font = `italic 200px SVN-BigNoodleTitling`;
        ctx.fillStyle = `#FFFFFF`;
        ctx.textAlign = "end";
        ctx.globalAlpha = 0.8;
        ctx.fillText(tenchinh.toUpperCase(), 1215, 535);
        Canvas.registerFont(__dirname + `/tad/SVN-BigNoodleTitling.otf`, { family: "SVN-BigNoodleTitling" });
        ctx.font = `60px SVN-BigNoodleTitling`;
        ctx.fillStyle = `#FFFFFF`;
        ctx.textAlign = "end";
        ctx.globalAlpha = 1;
        var l = ctx.measureText(subname).width;
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
      else if(type == 4){
        let background = (await axios.get("https://lh3.googleusercontent.com/-JZxo4uTVIKQ/YaS7VBjAojI/AAAAAAAA1rk/mg_Bp0Z6_yUGLp1lfC9ugriYTGFfRaXTwCNcBGAsYHQ/s0/layer-2.png", { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg, Buffer.from(background));
        let background2 = (await axios.get("https://lh3.googleusercontent.com/-j9JKCim94ks/YaIMA7fVnPI/AAAAAAAA1k8/g9e5X5FfRH4NiG-7hHRNikGxViI2o8pYQCNcBGAsYHQ/s0/layer-3.png", { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg1, Buffer.from(background2));
        let background3 = (await axios.get("https://lh3.googleusercontent.com/-F8w1tQRZ9s0/YXZZmKaylRI/AAAAAAAAynI/HBoYISaw-LE2z8QOE39OGwTUiFjHUH6xgCNcBGAsYHQ/s0/layer4.png", { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg2, Buffer.from(background3));
        if (!fs.existsSync(__dirname + `/tad/UTM-Avo.ttf`)) {
          let getfont = (await axios.get(`https://github.com/hanakuUwU/font/blob/main/UTM%20Avo.ttf?raw=true`, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + `/tad/UTM-Avo.ttf`, Buffer.from(getfont));
        }
        const test = "https://facebook.com/" + event.senderID;
        let l1 = await loadImage(pathAva);
        let l2 = await loadImage(pathImg);
        let l3 = await loadImage(pathImg1);
        let l4 = await loadImage(pathImg2);
        let a = await loadImage(pathImg);
        let canvas = createCanvas(a.width, a.height);
        var ctx = canvas.getContext("2d");
        Canvas.registerFont(__dirname + `/tad/UTM-Avo.ttf`, { family: "UTM-Avo" });
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
        var ttx = 950;
        var tty = 600;
        var ttpad = 180;
        var ttsize = "300px";
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

      return api.sendMessage({
        body: "𝒀𝒐𝒖𝒓 𝒃𝒂𝒏𝒏𝒆𝒓 𝒊𝒔 𝒓𝒆𝒂𝒅𝒚",
        attachment: fs.createReadStream(pathImg)
      }, event.threadID, () => {
        const filesToDelete = [
          pathImg, pathAva, pathLine, 
          pathImg1, pathImg2
        ];
        filesToDelete.forEach(path => {
          if (fs.existsSync(path)) fs.unlinkSync(path);
        });
      });
      
    } catch (error) {
      console.error(error);
      return api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒃𝒂𝒏𝒏𝒆𝒓", event.threadID);
    }
  }
}
