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
  try {
    const fs = require('fs-extra');
    const axios = require('axios');
    const os = require('os');
    const { loadImage, createCanvas, registerFont } = require('canvas');

    // ensure asset folder exists
    const tadDir = __dirname + '/tad';
    fs.ensureDirSync(tadDir);

    // repl url (if available)
    var username = process.env.REPL_OWNER;
    var urlRepl = (username !== undefined) ? `https://${process.env.REPL_SLUG}.${username}.repl.co` : undefined;

    // CPU info (safe extraction)
    const cpus = os.cpus() || [];
    let chips = "Unknown";
    let speed = 0;
    if (cpus.length > 0) {
      chips = cpus[0].model || "Unknown";
      speed = cpus[0].speed || 0;
    }

    // uptime formatting
    var time = process.uptime();
    var hours = Math.floor(time / (60 * 60));
    var minutes = Math.floor((time % (60 * 60)) / 60);
    var seconds = Math.floor(time % 60);

    var z_1 = (hours < 10) ? '0' + hours : hours;
    var x_1 = (minutes < 10) ? '0' + minutes : minutes;
    var y_1 = (seconds < 10) ? '0' + seconds : seconds;

    // thread prefix and commands (keeps original behavior)
    const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    const { commands } = global.client;

    // pidusage (keeps original access pattern)
    const pidusage = await global.nodemodule["pidusage"](process.pid);
    const timeStart = Date.now();

    // download fonts if not present (do not change links)
    if (!fs.existsSync(tadDir + `/UTM-Avo.ttf`)) {
      let getfont = (await axios.get(`https://github.com/quyenkaneki/data/blob/main/UTM-Avo.ttf?raw=true`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(tadDir + `/UTM-Avo.ttf`, Buffer.from(getfont));
    }

    if (!fs.existsSync(tadDir + `/phenomicon.ttf`)) {
      let getfont2 = (await axios.get(`https://github.com/quyenkaneki/data/blob/main/phenomicon.ttf?raw=true`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(tadDir + `/phenomicon.ttf`, Buffer.from(getfont2));
    }

    if (!fs.existsSync(tadDir + `/CaviarDreams.ttf`)) {
      let getfont3 = (await axios.get(`https://github.com/quyenkaneki/data/blob/main/CaviarDreams.ttf?raw=true`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(tadDir + `/CaviarDreams.ttf`, Buffer.from(getfont3));
    }

    // handle list command (unchanged links)
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

    // choose id
    var id = (!k) ? (Math.floor(Math.random() * 848) + 1) : k;

    // fetch image data (keep links)
    const lengthchar = (await axios.get('https://raw.githubusercontent.com/quyenkaneki/data/main/dataimganime.json')).data;
    const pathImg = tadDir + `/${id}.png`;
    const pathAva = tadDir + `/${event.senderID}.png`;

    let background = (await axios.get(encodeURI(`https://imgur.com/x5JpRYu.png`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(background));

    let ava = (await axios.get(encodeURI(`${lengthchar[id].imgAnime}`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAva, Buffer.from(ava));

    // build canvas
    let l1 = await loadImage(pathAva);
    let a = await loadImage(pathImg);
    let canvas = createCanvas(a.width, a.height);
    var ctx = canvas.getContext("2d");

    // save initial state so restores are safe
    ctx.save();

    ctx.fillStyle = lengthchar[id].colorBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(l1, -200, -200, 1200, 1200);
    ctx.drawImage(a, 0, 0, canvas.width, canvas.height);

    registerFont(tadDir + `/phenomicon.ttf`, { family: "phenomicon" });

    ctx.textAlign = "start";
    ctx.strokeStyle = lengthchar[id].colorBg;
    ctx.filter = "brightness(90%) contrast(110%)";
    ctx.font = "130px phenomicon";
    ctx.fillStyle = lengthchar[id].colorBg;
    ctx.fillText(global.config.BOTNAME, 835, 340);
    ctx.beginPath();

    registerFont(tadDir + `/UTM-Avo.ttf`, { family: "UTM" });

    ctx.textAlign = "start";
    ctx.font = "70px UTM";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${z_1} : ${x_1} : ${y_1} `, 980, 440);

    registerFont(tadDir + `/CaviarDreams.ttf`, { family: "time" });

    ctx.textAlign = "start";
    ctx.font = "55px time";
    ctx.fillText("𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 930, 540);
    ctx.fillText("61571630409265", 930, 610);

    // restore canvas state
    ctx.restore();

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // compute memory usage (fixed to show used memory)
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const usedPercent = ((usedMem * 100) / totalMem).toFixed();

    return api.sendMessage({
      body: `======= 𝑺𝒆𝒓𝒗𝒆𝒓 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 =======\n\n𝑪𝒉𝒊𝒑: ${chips}\n𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝑺𝒑𝒆𝒆𝒅: ${speed}𝑴𝑯𝒛\n\n𝑻𝒐𝒕𝒂𝒍 𝑴𝒆𝒎𝒐𝒓𝒚: ${byte2mb(totalMem)}\n𝑼𝒔𝒆𝒅: ${byte2mb(usedMem)} (${usedPercent}%)\n\n𝑩𝒐𝒕 𝒖𝒑𝒕𝒊𝒎𝒆: ${hours} 𝒉𝒐𝒖𝒓𝒔 ${minutes} 𝒎𝒊𝒏𝒖𝒕𝒆 ${seconds} 𝒔𝒆𝒄𝒐𝒏𝒅𝒔\n\n❯ 𝑻𝒐𝒕𝒂𝒍 𝒖𝒔𝒆𝒓𝒔: ${global.data.allUserID.length}\n❯ 𝑻𝒐𝒕𝒂𝒍 𝑮𝒓𝒐𝒖𝒑: ${global.data.allThreadID.length}\n❯ 𝑪𝑷𝑼 𝒖𝒔𝒂𝒈𝒆: ${pidusage.cpu.toFixed(1)}%\n❯ 𝑹𝑨𝑴 𝒖𝒔𝒂𝒈𝒆: ${byte2mb(pidusage.memory)}\n❯ 𝑷𝒊𝒏𝒈: ${Date.now() - timeStart}𝒎𝒔\n❯ 𝑪𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝑰𝑫: ${id}\n❯ 𝑶𝒘𝒏𝒆𝒓: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n❯ 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑰𝑫: 61571630409265`,
      attachment: fs.createReadStream(pathImg)
    },
    event.threadID,
    () => {
      try {
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
        if (fs.existsSync(pathAva)) fs.unlinkSync(pathAva);
      } catch (e) { }
    },
    event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred while running the uptime command.", event.threadID);
  }
};
