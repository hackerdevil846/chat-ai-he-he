module.exports.config = {
  name: "pair3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "✨ 𝐏𝐚𝐢𝐫 𝐮𝐩 𝐮𝐬𝐞𝐫𝐬 𝐚𝐧𝐝 𝐬𝐡𝐨𝐰 𝐜𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲 ✨",
  commandCategory: "𝐌𝐨𝐣𝐚",
  usages: "",
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  },
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  try {
    const { loadImage, createCanvas } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    
    // 🖼️ Path setup
    const pathImg = __dirname + "/cache/pair_background.png";
    const pathAvt1 = __dirname + "/cache/pair_avt1.png";
    const pathAvt2 = __dirname + "/cache/pair_avt2.png";
    
    const id1 = event.senderID;
    const name1 = await Users.getNameUser(id1);
    const ThreadInfo = await api.getThreadInfo(event.threadID);
    const all = ThreadInfo.userInfo;
    
    // 👤 Get user gender
    let gender1 = "UNKNOWN";
    for (const user of all) {
      if (user.id === id1) {
        gender1 = user.gender;
        break;
      }
    }
    
    const botID = api.getCurrentUserID();
    const ungvien = [];
    
    // 🔍 Find potential matches
    if (gender1 === "FEMALE") {
      for (const user of all) {
        if (user.gender === "MALE" && user.id !== id1 && user.id !== botID) {
          ungvien.push(user.id);
        }
      }
    } else if (gender1 === "MALE") {
      for (const user of all) {
        if (user.gender === "FEMALE" && user.id !== id1 && user.id !== botID) {
          ungvien.push(user.id);
        }
      }
    } else {
      for (const user of all) {
        if (user.id !== id1 && user.id !== botID) {
          ungvien.push(user.id);
        }
      }
    }
    
    if (ungvien.length === 0) {
      return api.sendMessage("😢 𝐍𝐨 𝐞𝐥𝐢𝐠𝐢𝐛𝐥𝐞 𝐩𝐚𝐫𝐭𝐧𝐞𝐫𝐬 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩!", event.threadID);
    }
    
    // 🎲 Random selection
    const id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
    const name2 = await Users.getNameUser(id2);
    
    // 💖 Compatibility calculation
    const tileOptions = ["0", "-1", "99.99", "-99", "-100", "101", "0.01"];
    const randomPercent = Math.random() < 0.8
      ? Math.floor(Math.random() * 100) + 1
      : tileOptions[Math.floor(Math.random() * tileOptions.length)];
    
    // 🎨 Background selection
    const backgrounds = [
      "https://i.postimg.cc/wjJ29HRB/background1.png",
      "https://i.postimg.cc/zf4Pnshv/background2.png",
      "https://i.postimg.cc/5tXRQ46D/background3.png"
    ];
    const selectedBG = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    
    // 📥 Download images
    const [avt1Response, avt2Response, bgResponse] = await Promise.all([
      axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
      axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
      axios.get(selectedBG, { responseType: "arraybuffer" })
    ]);
    
    fs.writeFileSync(pathAvt1, Buffer.from(avt1Response.data));
    fs.writeFileSync(pathAvt2, Buffer.from(avt2Response.data));
    fs.writeFileSync(pathImg, Buffer.from(bgResponse.data));
    
    // 🎭 Create canvas
    const baseImage = await loadImage(pathImg);
    const baseAvt1 = await loadImage(pathAvt1);
    const baseAvt2 = await loadImage(pathAvt2);
    
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 100, 150, 300, 300);
    ctx.drawImage(baseAvt2, 900, 150, 300, 300);
    
    // ✍️ Add names
    ctx.font = "bold 35px 'Segoe UI'";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(name1, 250, 500);
    ctx.fillText(name2, 1050, 500);
    
    // 🔥 Add compatibility text
    ctx.font = "bold 40px 'Segoe UI'";
    ctx.fillStyle = "#FF1493";
    ctx.fillText(`💝 𝐂𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲: ${randomPercent}% 💝`, 700, 600);
    
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    
    // 📤 Send result
    api.sendMessage({
      body: `💌 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 𝐀𝐥𝐞𝐫𝐭 💌\n━━━━━━━━━━━━━━\n\n${name1}, 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐩𝐚𝐢𝐫𝐞𝐝 𝐰𝐢𝐭𝐡 ${name2}!\n\n💘 𝐘𝐨𝐮𝐫 𝐜𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲 𝐢𝐬: ${randomPercent}% 💘\n\n𝐌𝐚𝐲 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 𝐚 𝐛𝐥𝐞𝐬𝐬𝐞𝐝 𝐫𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩! 💑`,
      mentions: [{
        tag: name2,
        id: id2
      }],
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => {
      // 🧹 Cleanup
      [pathImg, pathAvt1, pathAvt2].forEach(path => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      });
    });
    
  } catch (error) {
    console.error(error);
    api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐚𝐢𝐫𝐢𝐧𝐠. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫!", event.threadID);
  }
};
