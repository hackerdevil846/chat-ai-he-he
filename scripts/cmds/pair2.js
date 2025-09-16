const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "pair2",
    aliases: ["pairv2", "jodi"],
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "💖 𝑷𝒊𝒄𝒕𝒖𝒓𝒆",
    shortDescription: {
      en: "💖 𝑬𝒌𝒕𝒊 𝒋𝒐𝒓𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂"
    },
    longDescription: {
      en: "💖 𝑬𝒌𝒕𝒊 𝒋𝒐𝒓𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂 𝒘𝒊𝒕𝒉 𝒃𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 𝒑𝒂𝒊𝒓𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    guide: {
      en: "{𝑝}pair2"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
      const dirMaterial = path.join(__dirname, 'cache', 'canvas');
      const filePath = path.join(dirMaterial, 'pairing.png');
      
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
      }
      
      if (!fs.existsSync(filePath)) {
        const response = await axios.get(
          "https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png",
          { responseType: "arraybuffer" }
        );
        fs.writeFileSync(filePath, Buffer.from(response.data));
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

      const { threadID, senderID, messageID } = event;
      const __root = path.join(__dirname, "cache", "canvas");

      async function circle(imagePath) {
        const img = await jimp.read(imagePath);
        img.circle();
        return await img.getBufferAsync("image/png");
      }

      async function makeImage(one, two) {
        const pathImg = path.join(__root, `pairing_${one}_${two}.png`);
        const avatarOne = path.join(__root, `avt_${one}.png`);
        const avatarTwo = path.join(__root, `avt_${two}.png`);
        const pairingImg = await jimp.read(path.join(__root, "pairing.png"));
        
        const getAvatar = async (uid) => {
          const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
          const { data } = await axios.get(url, { responseType: 'arraybuffer' });
          return Buffer.from(data, 'utf-8');
        };
        
        fs.writeFileSync(avatarOne, await getAvatar(one));
        fs.writeFileSync(avatarTwo, await getAvatar(two));
        
        const circleOne = await jimp.read(await circle(avatarOne));
        const circleTwo = await jimp.read(await circle(avatarTwo));
        
        pairingImg.composite(circleOne.resize(150, 150), 980, 200)
                 .composite(circleTwo.resize(150, 150), 140, 200);
        
        const raw = await pairingImg.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);
        
        [avatarOne, avatarTwo].forEach(filePath => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
        
        return pathImg;
      }

      const tl = ['𝟮𝟭%', '𝟲𝟳%', '𝟭𝟵%', '𝟯𝟳%', '𝟭𝟳%', '𝟵𝟲%', '𝟱𝟮%', '𝟲𝟮%', '𝟳𝟲%', '𝟴𝟯%', '𝟭𝟬𝟬%', '𝟵𝟵%', "𝟬%", "𝟰𝟴%"];
      const tle = tl[Math.floor(Math.random() * tl.length)];
      
      const namee = await usersData.getName(senderID);
      
      // Get thread participants
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs.filter(id => 
        id !== senderID && id !== api.getCurrentUserID()
      );
      
      if (participants.length === 0) {
        return api.sendMessage("😢 𝑲𝒆𝒖 𝒋𝒐𝒅𝒊 𝒌𝒐𝒓𝒂𝒓 𝒎𝒐𝒕𝒐 𝒏𝒂𝒊!", threadID, messageID);
      }
      
      const randomID = participants[Math.floor(Math.random() * participants.length)];
      const name = await usersData.getName(randomID);
      
      const imagePath = await makeImage(senderID, randomID);
      const msg = `🎉 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 ${namee}, 𝒕𝒖𝒎𝒊 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒍𝒆 ${name} 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆! 💖\n💌 𝑺𝒂𝒎𝒂𝒏𝒏𝒋𝒐𝒔𝒚𝒂𝒓 𝒉𝒂𝒓: 〘${tle}〙`;
      
      const mentions = [
        { id: senderID, tag: namee },
        { id: randomID, tag: name }
      ];
      
      api.sendMessage({
        body: msg,
        mentions,
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }, messageID);

    } catch (error) {
      console.error("❌ 𝑷𝒂𝒊𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓𝒓𝒐𝒓:", error);
      api.sendMessage("❌ 𝑨𝒓𝒆 𝒌𝒉𝒂𝒍𝒂𝒕𝒊 𝒉𝒐𝒚𝒆𝒈𝒆𝒄𝒉𝒆! 𝒑𝒖𝒏𝒂𝒓𝒂𝒚 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏...", event.threadID, event.messageID);
    }
  }
};
