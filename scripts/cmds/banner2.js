module.exports.config = {
  name: "banner2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒂𝒏𝒏𝒆𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒐𝒏 𝒕𝒐𝒐𝒍",
  category: "𝒎𝒆𝒅𝒊𝒂",
  usages: "",
  cooldowns: 5
};

module.exports.onStart = async function({ api, args, event }) {
   const axios = require('axios');
   const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
   
  if(args[0] == "find" || args[0] == "tìm") {
    const t = (await axios.get(`${lengthchar[args[1]].imgAnime}`, {
        responseType: "stream"
      })).data;
    var msg = ({
      body: `𝑪𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫: ${args[1]}, 𝑫𝒆𝒇𝒂𝒖𝒍𝒕 𝑪𝒐𝒍𝒐𝒓: ${lengthchar[args[1]].colorBg}`,
      attachment: t
    })
    return api.sendMessage(msg, event.threadID, event.messageID);
  }
  else if(args[0] == "list") {
    const alime = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
    var count = alime.listAnime.length;
    var data = alime.listAnime;
    var page = 1;
    page = parseInt(args[1]) || 1;
    page < -1 ? page = 1 : "";
    var limit = 20;
    var numPage = Math.ceil(count/limit);
    var msg = `𝑨𝒏𝒊𝒎𝒆 𝑳𝒊𝒔𝒕:\n\n`;
    for(var i = limit*(page - 1); i < limit*(page-1) + limit; i++) {
      if(i >= count) break;
      msg += `[ ${i+1} ] - ${data[i].ID} | ${data[i].name}\n`;
    }
    msg += `\n𝑷𝒂𝒈𝒆 (${page}/${numPage})\n𝑼𝒔𝒆 ${global.config.PREFIX}${this.config.name} 𝒍𝒊𝒔𝒕 <𝒑𝒂𝒈𝒆 𝒏𝒖𝒎𝒃𝒆𝒓>`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  } else {
    return api.sendMessage("𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒐 𝒔𝒆𝒍𝒆𝒄𝒕 𝒂 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓", event.threadID, (err, info) => {
      return global.client.handleReply.push({
        step: 1,
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID
      });
    }, event.messageID);
  }
}

module.exports.handleReply = async function({ api, event, handleReply }) {
  const axios = require("axios");
  const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
  const fs = require("fs-extra");
  const { createCanvas, loadImage, registerFont } = require("canvas");
  const path = require('path');
  const Canvas = require('canvas');
  
  if (event.senderID !== handleReply.author) 
    return api.sendMessage('𝑨𝒄𝒄𝒆𝒔𝒔 𝒅𝒆𝒏𝒊𝒆𝒅', event.threadID);

  // Path definitions remain unchanged
  let pathImg = __dirname + `/wall/avatar_1.png`;
  let pathAva = __dirname + `/wall/avatar_2.png`;
  let pathLine = __dirname + `/wall/avatar_3.png`;
  let pathLine2 = __dirname + `/wall/avatar_34.png`;
  let pathLine3 = __dirname + `/wall/avatar_33.png`;
  let pathLine4 = __dirname + `/wall/avatar_31.png`;
  let pathLine5 = __dirname + `/wall/avatar_32.png`;
  let pathLine6 = __dirname + `/wall/avatar_33.png`;
  let pathLine7 = __dirname + `/wall/avatar_3s3.png`;

  // Download font if missing
  if (!fs.existsSync(__dirname + `/wall/MTOJamai.ttf`)) {
    let font = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/MTOJamai.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/wall/MTOJamai.ttf`, Buffer.from(font));
  }

  if(handleReply.step === 1) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`𝒀𝒐𝒖 𝒔𝒆𝒍𝒆𝒄𝒕𝒆𝒅: ${event.body}\n𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒏𝒂𝒎𝒆`, event.threadID, (err, info) => {
      return global.client.handleReply.push({
        step: 2,
        name: this.config.name,
        chartid: event.body,
        author: event.senderID,
        messageID: info.messageID
      });
    });
  } 
  else if(handleReply.step === 2) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`𝒀𝒐𝒖𝒓 𝒏𝒂𝒎𝒆: ${event.body}\n𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒄𝒐𝒍𝒐𝒓 𝒏𝒂𝒎𝒆 𝒐𝒓 𝒉𝒆𝒙 𝒄𝒐𝒅𝒆`, event.threadID, (err, info) => {
      return global.client.handleReply.push({
        step: 3,
        name: this.config.name,
        chartid: handleReply.chartid,
        ten: event.body,
        author: event.senderID,
        messageID: info.messageID
      });
    });
  } 
  else if(handleReply.step === 3) {
    api.unsendMessage(handleReply.messageID);
    const color = event.body;
    const id = handleReply.chartid;
    const title = handleReply.ten;
    const color_ = (!color || color.toLowerCase() === "no") 
      ? lengthchar[id].colorBg 
      : color;

    try {
      // Download assets
      const avtAnime = (await axios.get(lengthchar[id].imgAnime, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAva, Buffer.from(avtAnime));
      
      const assetUrls = [
        'https://lh3.googleusercontent.com/-tZ8DTN-bXEY/YhScBI5VuSI/AAAAAAAA5QI/8OxatfQvJU8q4TWk8vo9OWawDRn0aQhOACNcBGAsYHQ/s0/a1.png',
        'https://lh3.googleusercontent.com/-_GlhDWCWQLA/YhScA7so4UI/AAAAAAAA5QA/4NqayceKTTkbQrPT0Cu5TQCuEp-V95T3ACNcBGAsYHQ/s0/a2.png',
        'https://lh3.googleusercontent.com/-IiDSkRdLuK4/YhScA1Xd7WI/AAAAAAAA5QE/KlFoQuZpFc8W31A2C8-uUmXkpvLbmL6JQCNcBGAsYHQ/s0/a3.png',
        'https://lh3.googleusercontent.com/-jagDZ8l1rwc/YhSbpTKubAI/AAAAAAAA5P4/GYy2WICTkHAM0AoJvYhsLc6asVsnbAR2wCNcBGAsYHQ/s0/l1.png',
        'https://lh3.googleusercontent.com/-EE6U5xmi_QY/YhScRCT94XI/AAAAAAAA5QY/6WJM0j7URsgjisGTEN-tgOJ6NVx_Ql5-ACNcBGAsYHQ/s0/l2.png',
        'https://lh3.googleusercontent.com/-hkTkESFE1OU/YhSdWD3kR_I/AAAAAAAA5Qk/Fw4rwDc5CxEaLacLatZJLT6FAnm5dNYYACNcBGAsYHQ/s0/b1.png',
        'https://lh3.googleusercontent.com/-U-P92f1nTfk/YhSdVnqbEFI/AAAAAAAA5Qg/UgA37F2XTCY0u_Cu0fghfppITmPZIokFwCNcBGAsYHQ/s0/b2.png'
      ];

      const paths = [pathImg, pathLine, pathLine2, pathLine3, pathLine4, pathLine5, pathLine6];
      for (let i = 0; i < assetUrls.length; i++) {
        const data = (await axios.get(assetUrls[i], { responseType: "arraybuffer" })).data;
        fs.writeFileSync(paths[i], Buffer.from(data));
      }

      // Create banner
      const canvas = createCanvas(1080, 1920);
      const ctx = canvas.getContext("2d");
      
      // Load all images
      const images = await Promise.all([
        loadImage(pathAva),
        loadImage(pathImg),
        loadImage(pathLine),
        loadImage(pathLine2),
        loadImage(pathLine3),
        loadImage(pathLine4),
        loadImage(pathLine5),
        loadImage(pathLine6)
      ]);

      // Draw elements
      ctx.fillStyle = color_;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[1], 0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[0], -100, -1000, 1700, 1700);
      ctx.drawImage(images[2], 0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[3], 0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[4], 0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[5], -50, 130, 800, 800);
      ctx.drawImage(images[6], 0, 0, canvas.width, canvas.height);

      // Draw text
      registerFont(__dirname + '/wall/MTOJamai.ttf', { family: 'MTOJamai' });
      ctx.fillStyle = "#fff";
      ctx.font = "bold 80px MTOJamai";
      ctx.transform(1, -0.1, 0, 1, 0, 0);
      ctx.textAlign = "center";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 10;
      
      for (let i = 0; i < 5; i++) {
        ctx.fillText(title, 370, 580);
      }

      // Finalize
      const buffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, buffer);
      
      return api.sendMessage({
        body: "𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒃𝒂𝒏𝒏𝒆𝒓:",
        attachment: fs.createReadStream(pathImg)
      }, event.threadID, () => {
        // Cleanup files
        [
          pathImg, pathAva, pathLine, pathLine2, 
          pathLine3, pathLine4, pathLine5, pathLine6
        ].forEach(path => fs.unlinkSync(path));
      });
    } catch (e) {
      console.error(e);
      return api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒃𝒂𝒏𝒏𝒆𝒓", event.threadID);
    }
  }
}
