module.exports.config = {
  name: "pair5",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑬𝒕𝒂 𝒆𝒌𝒕𝒊 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂 :>",
  commandCategory: "monoronjon",
  usages: "",
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  },
  cooldowns: 15
};

module.exports.run = async function ({ event, api, Users }) {
  try {
    const { createCanvas, loadImage } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    
    // Path setup
    const pathImg = __dirname + "/cache/background.png";
    const pathAvt1 = __dirname + "/cache/Avtmot.png";
    const pathAvt2 = __dirname + "/cache/Avthai.png";
    
    // Get sender info
    const id1 = event.senderID;
    const name1 = await Users.getNameUser(id1);
    
    // Get thread members
    const threadInfo = await api.getThreadInfo(event.threadID);
    const allUsers = threadInfo.userInfo;
    const botID = api.getCurrentUserID();
    
    // Find sender's gender
    const senderInfo = allUsers.find(user => user.id === id1);
    const gender1 = senderInfo ? senderInfo.gender : "UNKNOWN";
    
    // Filter potential matches
    let ungvien = [];
    if (gender1 === "FEMALE") {
      ungvien = allUsers.filter(u => 
        u.gender === "MALE" && u.id !== id1 && u.id !== botID
      );
    } else if (gender1 === "MALE") {
      ungvien = allUsers.filter(u => 
        u.gender === "FEMALE" && u.id !== id1 && u.id !== botID
      );
    } else {
      ungvien = allUsers.filter(u => 
        u.id !== id1 && u.id !== botID
      );
    }
    
    // Random selection
    const randomIndex = Math.floor(Math.random() * ungvien.length);
    const id2 = ungvien[randomIndex].id;
    const name2 = await Users.getNameUser(id2);
    
    // Compatibility calculation
    const rd1 = Math.floor(Math.random() * 100) + 1;
    const specialCases = ["0", "-1", "99.99", "-99", "-100", "101", "0.01"];
    const tileOptions = [...Array(9).fill(rd1), ...specialCases];
    const tile = tileOptions[Math.floor(Math.random() * tileOptions.length)];
    
    // Background selection
    const backgrounds = [
      "https://i.postimg.cc/wjJ29HRB/background1.png",
      "https://i.postimg.cc/zf4Pnshv/background2.png",
      "https://i.postimg.cc/5tXRQ46D/background3.png"
    ];
    const backgroundUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    
    // Download images
    const downloadImage = async (url, path) => {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(path, Buffer.from(response.data, 'utf-8'));
    };
    
    await Promise.all([
      downloadImage(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt1),
      downloadImage(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt2),
      downloadImage(backgroundUrl, pathImg)
    ]);
    
    // Process images
    const [baseImage, baseAvt1, baseAvt2] = await Promise.all([
      loadImage(pathImg),
      loadImage(pathAvt1),
      loadImage(pathAvt2)
    ]);
    
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    
    // Draw composition
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 100, 150, 300, 300);
    ctx.drawImage(baseAvt2, 900, 150, 300, 300);
    
    // Save result
    fs.writeFileSync(pathImg, canvas.toBuffer());
    
    // Clean up temp files
    [pathAvt1, pathAvt2].forEach(path => fs.unlinkSync(path));
    
    // Send result
    return api.sendMessage({
      body: `💞✨ 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 ${name1}, 𝒕𝒖𝒎𝒊 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 ${name2} 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒍𝒆!\n\n🔥💯 𝑻𝒐𝒎𝒂𝒅𝒆𝒓 𝒔𝒂𝒎𝒂𝒏𝒏𝒋𝒐𝒔𝒚𝒂: ${tile}%`,
      mentions: [{ tag: name2, id: id2 }],
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg));
    
  } catch (error) {
    console.error("❌ Pair command error:", error);
    return api.sendMessage("🥺 বন্ধু, জুটি বাঁধতে গিয়ে সমস্যা হলো! আবার চেষ্টা করো...", event.threadID);
  }
};
