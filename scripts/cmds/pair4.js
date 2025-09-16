const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pair4",
    aliases: ["pairing", "couple"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🍓 𝐺𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑓𝑒𝑎𝑡𝑢𝑟𝑒"
    },
    longDescription: {
      en: "𝑅𝑎𝑛𝑑𝑜𝑚𝑙𝑦 𝑝𝑎𝑖𝑟 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑝𝑒𝑟𝑐𝑒𝑛𝑡𝑎𝑔𝑒𝑠"
    },
    guide: {
      en: "{p}pair4 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛/𝑟𝑒𝑝𝑙𝑦/𝑙𝑒𝑎𝑣𝑒 𝑏𝑙𝑎𝑛𝑘]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    const dirMaterial = __dirname + `/cache/canvas/`;
    const pathFile = path.resolve(__dirname, 'cache/canvas', 'pairing.png');
    
    if (!fs.existsSync(dirMaterial)) {
      fs.mkdirSync(dirMaterial, { recursive: true });
    }
    
    if (!fs.existsSync(pathFile)) {
      try {
        const response = await axios.get("https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png", {
          responseType: 'arraybuffer'
        });
        fs.writeFileSync(pathFile, Buffer.from(response.data));
      } catch (error) {
        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", error);
      }
    }
  },

  onStart: async function({ api, event, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      
      // Compatibility percentages
      const tl = ['21%', '11%', '55%', '89%', '22%', '45%', '1%', '4%', 
                  '78%', '15%', '91%', '77%', '41%', '32%', '67%', '19%', 
                  '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', 
                  '99%', "0%", "48%"];
      const tle = tl[Math.floor(Math.random() * tl.length)];
      
      // Get sender info
      const senderInfo = await api.getUserInfo(senderID);
      const senderName = senderInfo[senderID]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
      
      // Get random participant
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs.filter(id => id !== senderID);
      
      if (participants.length === 0) {
        return message.reply("❌ 𝑁𝑜𝑡 𝑒𝑛𝑜𝑢𝑔ℎ 𝑢𝑠𝑒𝑟𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑡𝑜 𝑝𝑎𝑖𝑟!");
      }
      
      const participant = participants[Math.floor(Math.random() * participants.length)];
      const participantInfo = await api.getUserInfo(participant);
      const participantName = participantInfo[participant]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
      
      // Create mention array
      const arraytag = [
        { id: senderID, tag: senderName },
        { id: participant, tag: participantName }
      ];
      
      // Generate pairing image
      const imagePath = await makeImage({ 
        one: senderID, 
        two: participant 
      });
      
      // Send result
      await message.reply({ 
        body: `🌸┈┈┈┈┈┈┈┈┈┈┈┈🌸\n🍓 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${senderName}, 𝑡𝑢𝑚𝑖 𝑝𝑎𝑖𝑟 ℎ𝑜𝑙𝑒 ${participantName} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒!\n💝 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑚𝑖𝑙𝑎𝑛𝑒𝑟 ℎ𝑎𝑟: ${tle}\n🌸┈┈┈┈┈┈┈┈┈┈┈┈🌸`,
        mentions: arraytag,
        attachment: fs.createReadStream(imagePath) 
      });
      
      // Clean up
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      
    } catch (error) {
      console.error("𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑎𝑖𝑟𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");
  const pairing_img = await jimp.read(__root + "/pairing.png");
  const pathImg = __root + `/pairing_${one}_${two}.png`;
  const avatarOne = __root + `/avt_${one}.png`;
  const avatarTwo = __root + `/avt_${two}.png`;
  
  // Download and save avatars
  const [avatarOneData, avatarTwoData] = await Promise.all([
    axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
      responseType: 'arraybuffer' 
    }),
    axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
      responseType: 'arraybuffer' 
    })
  ]);
  
  fs.writeFileSync(avatarOne, Buffer.from(avatarOneData.data));
  fs.writeFileSync(avatarTwo, Buffer.from(avatarTwoData.data));
  
  // Create circular avatars
  const circleOne = await jimp.read(await circle(avatarOne));
  const circleTwo = await jimp.read(await circle(avatarTwo));
  
  // Composite images
  pairing_img.composite(circleOne.resize(150, 150), 980, 200)
            .composite(circleTwo.resize(150, 150), 140, 200);
  
  const raw = await pairing_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);
  
  // Clean up temp files
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);
  
  return pathImg;
}

async function circle(imagePath) {
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}
