module.exports.config = {
  name: "uptime2",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  hide: true,
  description: "𝑨𝑷𝑰 𝒕𝒉𝒆𝒌𝒆 𝒓𝒂𝒏𝒅𝒐𝒎 𝒊𝒎𝒂𝒈𝒆𝒔 - 𝒖𝒑𝒕𝒊𝒎𝒆",
  commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
  cooldowns: 2,
  dependencies: {
    "pidusage": ""
  }
};

function byte2mb(bytes) {
  const units = ['𝑩𝒚𝒕𝒆𝒔', '𝑲𝑩', '𝑴𝑩', '𝑮𝑩', '𝑻𝑩', '𝑷𝑩', '𝑬𝑩', '𝒁𝑩', '𝒀𝑩'];
  let l = 0, n = parseInt(bytes, 10) || 0;
  while (n >= 1024 && ++l) n = n / 1024;
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports.run = async ({ api, event, args, Threads }) => {
  var username = process.env.REPL_OWNER;
  if (username !== undefined) {
    var urlRepl = `https://${process.env.REPL_SLUG}.${username}.repl.co`;
  }
  
  var os = require("os");
  var cpus = os.cpus();
  var chips;
  for (var i of cpus) chips = i.model, speed = i.speed;
  if (cpus == undefined);
  
  var time = process.uptime(),
      hours = Math.floor(time / (60 * 60)),
      minutes = Math.floor((time % (60 * 60)) / 60),
      seconds = Math.floor(time % 60);
      
  var z_1 = (hours < 10) ? '0' + hours : hours;
  var x_1 = (minutes < 10) ? '0' + minutes : minutes;
  var y_1 = (seconds < 10) ? '0' + seconds : seconds;
  
  const axios = require('axios');
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  const { commands } = global.client;
  const pidusage = await global.nodemodule["pidusage"](process.pid);
  const timeStart = Date.now();
  const fs = require('fs-extra');
  
  if (!fs.existsSync(__dirname + `/tad/UTM-Avo.ttf`)) {
    let getfont = (await axios.get(`https://github.com/quyenkaneki/data/blob/main/UTM-Avo.ttf?raw=true`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/tad/UTM-Avo.ttf`, Buffer.from(getfont, "utf-8"));
  }
  
  if (!fs.existsSync(__dirname + `/tad/phenomicon.ttf`)) {
    let getfont2 = (await axios.get(`https://github.com/quyenkaneki/data/blob/main/phenomicon.ttf?raw=true`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/tad/phenomicon.ttf`, Buffer.from(getfont2, "utf-8"));
  };
  
  if (!fs.existsSync(__dirname + `/tad/CaviarDreams.ttf`)) {
    let getfont3 = (await axios.get(`https://github.com/quyenkaneki/data/blob/main/CaviarDreams.ttf?raw=true`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/tad/CaviarDreams.ttf`, Buffer.from(getfont3, "utf-8"));
  };
  
  const { loadImage, createCanvas, registerFont } = require("canvas");
  
  let k = args[0];
  if (args[0] == "list") {
    const alime = (await axios.get('https://raw.githubusercontent.com/quyenkaneki/data/main/dataanime.json')).data;
    var count = alime.listAnime.length;
    var data = alime.listAnime;
    var page = 1;
    page = parseInt(args[1]) || 1;
    page < -1 ? page = 1 : "";
    var limit = 20;
    var numPage = Math.ceil(count / limit);
    var msg = ``;
    for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
      if (i >= count) break;
      msg += `[ ${i + 1} ] - ${data[i].ID} | ${data[i].name}\n`;
    }
    msg += `𝑷𝒂𝒈𝒆 (${page}/${numPage})\n𝑼𝒔𝒆 ${global.config.PREFIX}${this.config.name} list <𝒑𝒂𝒈𝒆 𝒏𝒖𝒎𝒃𝒆𝒓>`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  }
  
  if (!k) {
    var id = Math.floor(Math.random() * 848) + 1;
  } else {
    var id = k;
  }
  
  const lengthchar = (await axios.get('https://raw.githubusercontent.com/quyenkaneki/data/main/dataimganime.json')).data;
  console.log(lengthchar.length);
  const Canvas = require('canvas');
  let pathImg = __dirname + `/tad/${id}.png`;
  let pathAva = __dirname + `/tad/${event.senderID}.png`;
  let background = (await axios.get(encodeURI(`https://imgur.com/x5JpRYu.png`), { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
  let ava = (await axios.get(encodeURI(`${lengthchar[id].imgAnime}`), { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathAva, Buffer.from(ava, "utf-8"));
  const request = require('request');
  const path = require('path');

  let l1 = await loadImage(pathAva);
  let a = await loadImage(pathImg);
  let canvas = createCanvas(a.width, a.height);
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = lengthchar[id].colorBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(l1, -200, -200, 1200, 1200);
  ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
  
  registerFont(__dirname + `/tad/phenomicon.ttf`, {
    family: "phenomicon"
  });
  
  ctx.textAlign = "start";
  ctx.strokeStyle = lengthchar[id].colorBg;
  ctx.filter = "brightness(90%) contrast(110%)";
  ctx.font = "130px phenomicon";
  ctx.fillStyle = lengthchar[id].colorBg;
  ctx.fillText(global.config.BOTNAME, 835, 340);
  ctx.beginPath();
  
  registerFont(__dirname + `/tad/UTM-Avo.ttf`, {
    family: "UTM"
  });
  
  ctx.textAlign = "start";
  ctx.font = "70px UTM";
  ctx.fillStyle = "#000000";
  ctx.fillText(`${z_1} : ${x_1} : ${y_1} `, 980, 440);
  ctx.restore();
  ctx.save();
  
  registerFont(__dirname + `/tad/CaviarDreams.ttf`, {
    family: "time"
  });
  
  ctx.textAlign = "start";
  ctx.font = "55px time";
  ctx.fillText("𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 930, 540);
  ctx.fillText("61571630409265", 930, 610);
  ctx.fillText("", 930, 690);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  
  return api.sendMessage({
    body: `======= 𝑺𝒆𝒓𝒗𝒆𝒓 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 =======\n\n𝑪𝒉𝒊𝒑: ${chips}\n𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝑺𝒑𝒆𝒆𝒅: ${speed}𝑴𝑯𝒛\n\n𝑻𝒐𝒕𝒂𝒍 𝑴𝒆𝒎𝒐𝒓𝒚: ${byte2mb(os.totalmem())}\n𝑼𝒔𝒆𝒅: ${byte2mb(os.freemem())} (${(os.freemem() * 100 / os.totalmem()).toFixed()}%)\n\n𝑩𝒐𝒕 𝒖𝒑𝒕𝒊𝒎𝒆: ${hours} 𝒉𝒐𝒖𝒓𝒔 ${minutes} 𝒎𝒊𝒏𝒖𝒕𝒆 ${seconds} 𝒔𝒆𝒄𝒐𝒏𝒅𝒔\n\n❯ 𝑻𝒐𝒕𝒂𝒍 𝒖𝒔𝒆𝒓𝒔: ${global.data.allUserID.length}\n❯ 𝑻𝒐𝒕𝒂𝒍 𝑮𝒓𝒐𝒖𝒑: ${global.data.allThreadID.length}\n❯ 𝑪𝑷𝑼 𝒖𝒔𝒂𝒈𝒆: ${pidusage.cpu.toFixed(1)}%\n❯ 𝑹𝑨𝑴 𝒖𝒔𝒂𝒈𝒆: ${byte2mb(pidusage.memory)}\n❯ 𝑷𝒊𝒏𝒈: ${Date.now() - timeStart}𝒎𝒔\n❯ 𝑪𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫: ${id}\n❯ 𝑶𝒘𝒏𝒆𝒓: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n❯ 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑰𝑫: 61571630409265`,
    attachment: fs.createReadStream(pathImg)
  },
  event.threadID,
  () => {
    fs.unlinkSync(pathImg);
    fs.unlinkSync(pathAva);
  },
  event.messageID);
};
