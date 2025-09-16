const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

// Paths for cache and background image
const dirMaterial = path.join(__dirname, "cache", "canvas");
const bgPath = path.join(dirMaterial, "pairing.jpg");

module.exports = {
  config: {
    name: "pair1",
    aliases: ["pairing", "couple"],
    version: "1.0.3",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "💖 𝑳𝒐𝒗𝒆",
    shortDescription: {
      en: "💖 𝑷𝒂𝒊𝒓 𝒘𝒊𝒕𝒉 𝒑𝒆𝒐𝒑𝒍𝒆 𝒊𝒏 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑"
    },
    longDescription: {
      en: "💖 𝑷𝒂𝒊𝒓 𝒘𝒊𝒕𝒉 𝒓𝒂𝒏𝒅𝒐𝒎 𝒑𝒆𝒐𝒑𝒍𝒆 𝒊𝒏 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑 𝒘𝒊𝒕𝒉 𝒄𝒖𝒕𝒆 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    guide: {
      en: "{𝑝}pair"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
      // Ensure cache directory exists
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
      }

      // Download background image if not exists
      if (!fs.existsSync(bgPath)) {
        const response = await axios.get(
          "https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg",
          {
            responseType: "arraybuffer",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
          }
        );
        fs.writeFileSync(bgPath, Buffer.from(response.data, "utf-8"));
      }
    } catch (error) {
      console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒛𝒊𝒏𝒈 𝒑𝒂𝒊𝒓𝒊𝒏𝒈 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:", error);
    }
  },

  onStart: async function({ api, event, usersData, threadsData }) {
    try {
      // Dependency check
      if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
      if (!jimp) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑗𝑖𝑚𝑝");

      const { threadID, messageID, senderID } = event;

      // Random pair percentage
      const pairPercentages = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
      const pairRate = pairPercentages[Math.floor(Math.random() * pairPercentages.length)];

      // Get sender info
      const senderInfo = await api.getUserInfo(senderID);
      const senderName = senderInfo[senderID]?.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";

      // Get thread info
      const threadInfo = await threadsData.get(threadID);
      const participants = threadInfo.participantIds || [];

      // Filter out sender, bots, and current bot
      const eligibleParticipants = participants.filter(id =>
        id !== senderID &&
        !id.includes("100000") &&
        !id.includes("bot") &&
        id !== api.getCurrentUserID()
      );

      if (eligibleParticipants.length === 0) {
        return api.sendMessage("😢 𝑵𝒐 𝒆𝒍𝒊𝒈𝒊𝒃𝒍𝒆 𝒑𝒂𝒓𝒕𝒊𝒄𝒊𝒑𝒂𝒏𝒕𝒔 𝒇𝒐𝒖𝒏𝒅 𝒇𝒐𝒓 𝒑𝒂𝒊𝒓𝒊𝒏𝒈!", threadID, messageID);
      }

      // Select a random participant for pairing
      const randomID = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
      const userInfo = await api.getUserInfo(randomID);
      const partnerName = userInfo[randomID]?.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";

      // Generate pairing image
      const imgPath = await makePairImage(senderID, randomID);

      // Prepare mentions
      const mentions = [
        { id: senderID, tag: senderName },
        { id: randomID, tag: partnerName }
      ];

      // Prepare message content
      const messageText = `💖 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔! ${senderName} 𝒘𝒂𝒔 𝒑𝒂𝒊𝒓𝒆𝒅 𝒘𝒊𝒕𝒉 ${partnerName}!\n✨ 𝑷𝒂𝒊𝒓 𝒐𝒅𝒅𝒔: ${pairRate}`;

      // Send message with attachment
      api.sendMessage({
        body: messageText,
        mentions: mentions,
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => {
        // Cleanup temporary image
        try {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        } catch (cleanupError) {
          console.error("🧹 𝑪𝒍𝒆𝒂𝒏𝒖𝒑 𝒆𝒓𝒓𝒐𝒓:", cleanupError);
        }
      }, messageID);

    } catch (error) {
      console.error("❌ 𝑷𝒂𝒊𝒓 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓𝒓𝒐𝒓:", error);
      api.sendMessage(
        "❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒕𝒉𝒆 𝒑𝒂𝒊𝒓𝒊𝒏𝒈 𝒄𝒐𝒎𝒎𝒂𝒏𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓!",
        event.threadID,
        event.messageID
      );
    }
  }
};

// Function to generate circular avatars and composite them on background
async function makePairImage(user1, user2) {
  try {
    const outputPath = path.join(dirMaterial, `pairing_${user1}_${user2}.png`);
    const avatar1Path = path.join(dirMaterial, `avt_${user1}.png`);
    const avatar2Path = path.join(dirMaterial, `avt_${user2}.png`);

    // Download avatars in parallel
    const [avatar1Data, avatar2Data] = await Promise.all([
      axios.get(`https://graph.facebook.com/${user1}/picture?width=512&height=512`, { responseType: "arraybuffer" }),
      axios.get(`https://graph.facebook.com/${user2}/picture?width=512&height=512`, { responseType: "arraybuffer" })
    ]);

    fs.writeFileSync(avatar1Path, Buffer.from(avatar1Data.data, "utf-8"));
    fs.writeFileSync(avatar2Path, Buffer.from(avatar2Data.data, "utf-8"));

    // Read images using Jimp
    const [background, circle1, circle2] = await Promise.all([
      jimp.read(bgPath),
      createCircle(avatar1Path),
      createCircle(avatar2Path)
    ]);

    // Composite avatars onto background
    background.composite(circle1.resize(85, 85), 355, 100);
    background.composite(circle2.resize(75, 75), 250, 140);

    // Save final image
    await background.writeAsync(outputPath);

    // Cleanup avatar files
    [avatar1Path, avatar2Path].forEach(filePath => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    return outputPath;

  } catch (error) {
    console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒑𝒂𝒊𝒓 𝒊𝒎𝒂𝒈𝒆:", error);
    throw error;
  }
}

// Helper function to create circular avatar
async function createCircle(imagePath) {
  try {
    const image = await jimp.read(imagePath);
    return image.circle();
  } catch (error) {
    console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒄𝒊𝒓𝒄𝒖𝒍𝒂𝒓 𝒂𝒗𝒂𝒕𝒂𝒓:", error);
    throw error;
  }
}
