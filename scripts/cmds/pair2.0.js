module.exports.config = {
  name: "pair2.0",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑬𝒕𝒂 𝒆𝒌𝒕𝒊 𝒋𝒐𝒅𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂 :>",
  category: "𝒎𝒐𝒏𝒐𝒓𝒐𝒏𝒋𝒐𝒏",
  usages: "",
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  },
  cooldowns: 5,
  envConfig: {}
};

module.exports.onStart = async function ({ event, api, Users }) {
  try {
    const { loadImage, createCanvas } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    
    // Define paths
    const pathImg = __dirname + "/cache/pair_background.png";
    const pathAvt1 = __dirname + "/cache/pair_avt1.png";
    const pathAvt2 = __dirname + "/cache/pair_avt2.png";
    
    // Get sender info
    const id1 = event.senderID;
    const name1 = await Users.getNameUser(id1);
    
    // Get thread info
    const ThreadInfo = await api.getThreadInfo(event.threadID);
    const allUsers = ThreadInfo.userInfo;
    
    // Determine sender's gender
    const senderInfo = allUsers.find(u => u.id === id1);
    const gender1 = senderInfo ? senderInfo.gender : "UNKNOWN";
    
    // Filter potential matches
    const botID = api.getCurrentUserID();
    let candidates = [];
    
    if (gender1 === "FEMALE") {
      candidates = allUsers.filter(u => 
        u.gender === "MALE" && u.id !== id1 && u.id !== botID
      );
    } else if (gender1 === "MALE") {
      candidates = allUsers.filter(u => 
        u.gender === "FEMALE" && u.id !== id1 && u.id !== botID
      );
    } else {
      candidates = allUsers.filter(u => 
        u.id !== id1 && u.id !== botID
      );
    }
    
    // Select random match
    if (candidates.length === 0) {
      return api.sendMessage("😢 𝑵𝒂𝒌𝒉𝒂𝒃𝒆 𝒋𝒐𝒅𝒊 𝒌𝒐𝒓𝒂𝒓 𝒎𝒐𝒕𝒐 𝒑𝒂𝒊𝒍𝒂𝒎 𝒏𝒂𝒊!", event.threadID);
    }
    
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    const id2 = selected.id;
    const name2 = selected.name || await Users.getNameUser(id2);
    
    // Generate match percentage
    const percentage = Math.random() > 0.9 
      ? ["0", "-1", "99.99", "-99", "-100", "101", "0.01"][Math.floor(Math.random() * 7)]
      : Math.floor(Math.random() * 100) + 1;
    
    // Background images
    const backgrounds = [
      "https://i.postimg.cc/wjJ29HRB/background1.png",
      "https://i.postimg.cc/zf4Pnshv/background2.png",
      "https://i.postimg.cc/5tXRQ46D/background3.png"
    ];
    const bgUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    
    // Download images
    const downloadImage = async (url, path) => {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(response.data));
    };
    
    await Promise.all([
      downloadImage(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt1),
      downloadImage(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt2),
      downloadImage(bgUrl, pathImg)
    ]);
    
    // Process images
    const baseImage = await loadImage(pathImg);
    const avt1 = await loadImage(pathAvt1);
    const avt2 = await loadImage(pathAvt2);
    
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avt1, 100, 150, 300, 300);
    ctx.drawImage(avt2, 900, 150, 300, 300);
    
    // Add names
    ctx.font = "bold 40px 'Segoe UI', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 8;
    ctx.fillText(name1, 250, 500);
    ctx.fillText(name2, 1050, 500);
    
    // Add percentage
    ctx.font = "bold 80px 'Segoe UI', sans-serif";
    ctx.fillStyle = "#FF1493";
    ctx.fillText(`${percentage}%`, 650, 350);
    
    // Save result
    const resultPath = __dirname + "/cache/pair_result.png";
    const out = fs.createWriteStream(resultPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    await new Promise((resolve) => out.on("finish", resolve));
    
    // Send message
    api.sendMessage({
      body: `🎊 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 ${name1}! 𝒕𝒖𝒎𝒊 𝒋𝒐𝒅𝒊 𝒉𝒐𝒍𝒆𝒄𝒉𝒐 ${name2} 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆\n💝 𝑻𝒐𝒎𝒂𝒅𝒆𝒓 𝒔𝒂𝒎𝒂𝒏𝒏𝒋𝒐𝒔𝒚𝒂: ${percentage}%`,
      mentions: [{ tag: name2, id: id2 }],
      attachment: fs.createReadStream(resultPath)
    }, event.threadID, () => {
      // Clean up files
      [pathImg, pathAvt1, pathAvt2, resultPath].forEach(path => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
      });
    });
    
  } catch (error) {
    console.error("Pair command error:", error);
    api.sendMessage("❌ 𝑨𝒓𝒆 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒆𝒈𝒆𝒄𝒉𝒆, 𝒑𝒖𝒏𝒐𝒓𝒂𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!", event.threadID);
  }
};
