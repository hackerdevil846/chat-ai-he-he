const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "pair7",
    aliases: [],
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "💖 𝑹𝒐𝒎𝒂𝒏𝒄𝒆",
    shortDescription: {
      en: "💖 𝑬𝒌𝒕𝒖 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂"
    },
    longDescription: {
      en: "💖 𝑬𝒌𝒕𝒖 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂 𝒘𝒊𝒕𝒉 𝒃𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 𝒊𝒎𝒂𝒈𝒆𝒔 𝒂𝒏𝒅 𝒄𝒐𝒎𝒑𝒂𝒕𝒊𝒃𝒊𝒍𝒊𝒕𝒚 𝒑𝒆𝒓𝒄𝒆𝒏𝒕𝒂𝒈𝒆"
    },
    guide: {
      en: "{𝑝}pair7"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
      const dirMaterial = path.join(__dirname, "cache", "canvas");
      const filePath = path.join(dirMaterial, 'pairing.jpg');
      
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
      }
      
      if (!fs.existsSync(filePath)) {
        const response = await axios.get(
          "https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", 
          { responseType: 'arraybuffer' }
        );
        fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
      }
    } catch (error) {
      console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒐𝒏𝑳𝒐𝒂𝒅:", error);
    }
  },

  onStart: async function({ api, event, usersData }) {
    try {
      // Dependency check
      if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
      if (!jimp) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑗𝑖𝑚𝑝");

      const { threadID, messageID, senderID } = event;
      const __root = path.join(__dirname, "cache", "canvas");
      
      // Random compatibility percentages
      const tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
      const tle = tl[Math.floor(Math.random() * tl.length)];
      
      // Get sender info
      const senderInfo = await api.getUserInfo(senderID);
      const senderName = senderInfo[senderID]?.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
      
      // Get thread info
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs || [];
      
      // Filter out sender and bot
      const botID = api.getCurrentUserID();
      const eligibleParticipants = participantIDs.filter(id => 
        id !== senderID && id !== botID && !id.includes("100000")
      );
      
      if (eligibleParticipants.length === 0) {
        return api.sendMessage("😢 𝑵𝒂𝒌𝒉𝒂𝒃𝒆 𝒋𝒐𝒅𝒊 𝒌𝒐𝒓𝒂𝒓 𝒎𝒐𝒕𝒐 𝒑𝒂𝒊𝒍𝒂𝒎 𝒏𝒂𝒊!", threadID, messageID);
      }
      
      // Select random participant
      const participantID = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
      const participantInfo = await api.getUserInfo(participantID);
      const participantName = participantInfo[participantID]?.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
      
      // Create image
      const resultPath = await this.createPairImage(senderID, participantID);
      
      // Send result
      api.sendMessage({
        body: `💞 𝑳𝒐𝒗𝒆 𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒊𝒐𝒏 💞\n\n╭───────────────◉\n│ ✨ ${senderName}\n│ 💘 𝑨𝑵𝑫\n│ ✨ ${participantName}\n╰───────────────◉\n\n𝑪𝒐𝒎𝒑𝒂𝒕𝒊𝒃𝒊𝒍𝒊𝒕𝒚: 🧪 ${tle}\n\n"𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 𝒕𝒖𝒎𝒊 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒍𝒆 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆 ✨"`,
        mentions: [
          { id: senderID, tag: senderName },
          { id: participantID, tag: participantName }
        ],
        attachment: fs.createReadStream(resultPath)
      }, threadID, () => {
        try {
          if (fs.existsSync(resultPath)) fs.unlinkSync(resultPath);
        } catch (cleanupError) {
          console.error("🧹 𝑪𝒍𝒆𝒂𝒏𝒖𝒑 𝒆𝒓𝒓𝒐𝒓:", cleanupError);
        }
      }, messageID);
      
    } catch (error) {
      console.error("❌ 𝑷𝒂𝒊𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓𝒓𝒐𝒓:", error);
      api.sendMessage("❌ 𝑺𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒘𝒆𝒏𝒕 𝒘𝒓𝒐𝒏𝒈 𝒊𝒏 𝒑𝒂𝒊𝒓𝒊𝒏𝒈!", threadID, messageID);
    }
  },

  createPairImage: async function(uid1, uid2) {
    try {
      const __root = path.join(__dirname, "cache", "canvas");
      const outputPath = path.join(__root, `pairing_${uid1}_${uid2}.png`);
      const bgPath = path.join(__root, 'pairing.jpg');
      
      // Download avatars
      const [avatar1Path, avatar2Path] = await Promise.all([
        this.downloadAvatar(uid1, path.join(__root, `avt_${uid1}.png`)),
        this.downloadAvatar(uid2, path.join(__root, `avt_${uid2}.png`))
      ]);
      
      // Process images
      const bg = await jimp.read(bgPath);
      const circularAvatar1 = await this.createCircularImage(avatar1Path);
      const circularAvatar2 = await this.createCircularImage(avatar2Path);
      
      bg.composite(await jimp.read(circularAvatar1).then(img => img.resize(85, 85)), 355, 100)
        .composite(await jimp.read(circularAvatar2).then(img => img.resize(75, 75)), 250, 140);
      
      await bg.writeAsync(outputPath);
      
      // Cleanup temp files
      [avatar1Path, avatar2Path].forEach(filePath => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      
      return outputPath;
      
    } catch (error) {
      console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒑𝒂𝒊𝒓 𝒊𝒎𝒂𝒈𝒆:", error);
      throw error;
    }
  },

  downloadAvatar: async function(uid, savePath) {
    try {
      const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(savePath, Buffer.from(response.data, 'binary'));
      return savePath;
    } catch (error) {
      console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒂𝒗𝒂𝒕𝒂𝒓:", error);
      throw error;
    }
  },

  createCircularImage: async function(imagePath) {
    try {
      const image = await jimp.read(imagePath);
      image.circle();
      return await image.getBufferAsync("image/png");
    } catch (error) {
      console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒄𝒊𝒓𝒄𝒖𝒍𝒂𝒓 𝒊𝒎𝒂𝒈𝒆:", error);
      throw error;
    }
  }
};
