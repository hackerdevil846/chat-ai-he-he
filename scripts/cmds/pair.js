module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑬𝒕𝒂 𝒆𝒌𝒕𝒊 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂 :>",
  category: "monoronjon",
  usages: "",
  cooldowns: 0,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": "",
    "discord-image-generation": "optional"
  }
};

module.exports.languages = {
  "en": {
    "no_partner": "Couldn't find a partner to pair with right now. Try again later!",
    "success": "{name1} ❤️ {name2}\nTomader shompad: {tile}%",
    "error": "Oops! Something went wrong. Try again later."
  }
};

module.exports.onLoad = function () {
  const fs = require('fs-extra');
  const path = require('path');
  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
};

module.exports.onStart = async function ({ api, event, args, Users, Threads }) {
  const fs = global.nodemodule['fs-extra'] || require('fs-extra');
  const axios = global.nodemodule['axios'] || require('axios');
  const path = require('path');

  // try to use discord-image-generation if available (optional)
  let DIG = null;
  try {
    DIG = global.nodemodule['discord-image-generation'] || require('discord-image-generation');
  } catch (e) {
    DIG = null; // it's optional — fallback to canvas
  }

  const { loadImage, createCanvas } = (() => {
    try {
      return require('canvas');
    } catch (e) {
      throw new Error('Please install "canvas" module to use this command.');
    }
  })();

  const cachePath = __dirname + '/cache';
  const pathImg = path.join(cachePath, 'background.png');
  const pathAvt1 = path.join(cachePath, 'Avtmot.png');
  const pathAvt2 = path.join(cachePath, 'Avthai.png');

  try {
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

    const id1 = event.senderID;
    const name1 = await Users.getNameUser(id1);

    const ThreadInfo = await api.getThreadInfo(event.threadID);
    const all = ThreadInfo.userInfo || [];

    // find gender of sender if available
    let gender1 = null;
    for (const u of all) if (u.id == id1) gender1 = u.gender;

    const botID = api.getCurrentUserID();
    const ungvien = [];

    if (gender1 === 'FEMALE') {
      for (const u of all) if (u.gender === 'MALE' && u.id !== id1 && u.id !== botID) ungvien.push(u.id);
    } else if (gender1 === 'MALE') {
      for (const u of all) if (u.gender === 'FEMALE' && u.id !== id1 && u.id !== botID) ungvien.push(u.id);
    } else {
      for (const u of all) if (u.id !== id1 && u.id !== botID) ungvien.push(u.id);
    }

    if (!ungvien.length) {
      return api.sendMessage({ body: this.getLang("en").no_partner }, event.threadID);
    }

    const id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
    const name2 = await Users.getNameUser(id2);

    // percentage logic
    const rd1 = Math.floor(Math.random() * 100) + 1;
    const cc = ["0", "-1", "99,99", "-99", "-100", "101", "0,01"];
    const rd2 = cc[Math.floor(Math.random() * cc.length)];
    const djtme = [`${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd2}`, `${rd1}`, `${rd1}`, `${rd1}`, `${rd1}`];
    const tile = djtme[Math.floor(Math.random() * djtme.length)];

    // backgrounds list (kept links intact as requested)
    const backgrounds = [
      "https://i.postimg.cc/wjJ29HRB/background1.png",
      "https://i.postimg.cc/zf4Pnshv/background2.png",
      "https://i.postimg.cc/5tXRQ46D/background3.png"
    ];
    const rd = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    // fetch avatars and background
    const fbToken = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';

    const getAvtBuffer = async (uid) => {
      const res = await axios.get(`https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=${fbToken}`, { responseType: 'arraybuffer' });
      return Buffer.from(res.data);
    };

    const [bufAvt1, bufAvt2, bufBg] = await Promise.all([
      getAvtBuffer(id1),
      getAvtBuffer(id2),
      (await axios.get(rd, { responseType: 'arraybuffer' })).data
    ]).catch(err => { throw err; });

    fs.writeFileSync(pathAvt1, bufAvt1);
    fs.writeFileSync(pathAvt2, bufAvt2);
    fs.writeFileSync(pathImg, Buffer.from(bufBg));

    // If discord-image-generation available, use its Love generator for a polished image
    if (DIG && DIG.Love) {
      try {
        const love = new DIG.Love();
        const imageBuffer = await love.generate({avatar1: bufAvt1, avatar2: bufAvt2});
        fs.writeFileSync(pathImg, imageBuffer);
      } catch (e) {
        // fallback silently to canvas below
      }
    }

    // create canvas image (fallback and styling)
    const baseImage = await loadImage(pathImg);
    const baseAvt1 = await loadImage(pathAvt1);
    const baseAvt2 = await loadImage(pathAvt2);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');

    // base
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // circular avatars with border
    const drawCircular = (image, x, y, size) => {
      const radius = size / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(image, x, y, size, size);
      ctx.restore();
      // border
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius + 4, 0, Math.PI * 2, true);
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.stroke();
    };

    drawCircular(baseAvt1, 100, 150, 300);
    drawCircular(baseAvt2, canvas.width - 400, 150, 300);

    // hearts and text
    ctx.font = 'bold 48px Sans';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';

    // names
    ctx.fillText(name1, 250, 500);
    ctx.fillText(name2, canvas.width - 250, 500);

    // center big love text
    ctx.font = 'bold 72px Sans';
    ctx.fillText('💖 Juti Match 💖', canvas.width / 2, 420);

    // percentage box
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    const boxW = 420, boxH = 110;
    ctx.fillRect(canvas.width / 2 - boxW / 2, canvas.height - 200, boxW, boxH);
    ctx.font = 'bold 60px Sans';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillText(`${tile}%`, canvas.width / 2, canvas.height - 120);

    // export
    const imageBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pathImg, imageBuffer);

    // prepare mentions for a nicer message
    const mentions = [
      { tag: name1, id: id1 },
      { tag: name2, id: id2 }
    ];

    const body = `💘 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 ${name1} tumi ${name2} er sathe juti bandhlo!\n✨ Tomader shompad: ${tile}%`;

    return api.sendMessage({ body, mentions, attachment: fs.createReadStream(pathImg) }, event.threadID, () => {
      try { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); } catch (e) {}
      try { if (fs.existsSync(pathAvt1)) fs.unlinkSync(pathAvt1); } catch (e) {}
      try { if (fs.existsSync(pathAvt2)) fs.unlinkSync(pathAvt2); } catch (e) {}
    }, event.messageID);

  } catch (err) {
    console.error(err);
    try {
      if (fs.existsSync(pathAvt1)) fs.unlinkSync(pathAvt1);
      if (fs.existsSync(pathAvt2)) fs.unlinkSync(pathAvt2);
      if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
    } catch (e) {}
    return api.sendMessage({ body: this.getLang("en").error }, event.threadID);
  }
};
