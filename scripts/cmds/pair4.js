const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

// Define paths
const cacheDir = path.join(__dirname, "cache", "canvas");
const bgPath = path.join(cacheDir, "pairing.png");

module.exports = {
  config: {
    name: "pair4",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "asif",
    description: "Create romantic pairings between users",
    category: "love",
    usages: "pair4",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function() {
    try {
      // Ensure cache directory exists
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download background image if not exists
      if (!fs.existsSync(bgPath)) {
        const response = await axios.get("https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png", {
          responseType: "arraybuffer",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
          }
        });
        fs.writeFileSync(bgPath, Buffer.from(response.data));
        console.log("Pairing background image downloaded successfully!");
      }
    } catch (error) {
      console.error("Error initializing pairing command:", error);
    }
  },

  run: async function({ api, event }) {
    try {
      const { threadID, messageID, senderID } = event;
      const tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
      const tle = tl[Math.floor(Math.random() * tl.length)];
      
      // Get sender info
      const senderInfo = await api.getUserInfo(senderID);
      const namee = senderInfo[senderID].name;
      
      // Get thread info
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs;
      
      // Filter out sender and bots
      const eligibleParticipants = participants.filter(id => 
        id !== senderID && 
        !id.includes("100000") && 
        !id.includes("bot") &&
        id !== api.getCurrentUserID()  // Exclude bot itself
      );
      
      if (eligibleParticipants.length === 0) {
        return api.sendMessage("😢 No eligible participants found for pairing!", threadID, messageID);
      }
      
      const randomID = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
      const userInfo = await api.getUserInfo(randomID);
      const name = userInfo[randomID].name;
      
      // Create image
      const imgPath = await this.makeImage(senderID, randomID);
      
      // Prepare message
      const arraytag = [
        { id: senderID, tag: namee },
        { id: randomID, tag: name }
      ];
      
      const messageText = `💖 Congratulations ${namee} was paired with ${name}\n✨ Pair odds are: ${tle}`;
      
      api.sendMessage({
        body: messageText,
        mentions: arraytag,
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => {
        try {
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }, messageID);
      
    } catch (error) {
      console.error("Pair command error:", error);
      api.sendMessage("❌ An error occurred while processing the pairing command. Please try again later!", event.threadID, event.messageID);
    }
  },

  makeImage: async function(one, two) {
    try {
      const outputPath = path.join(cacheDir, `pairing_${one}_${two}.png`);
      const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
      const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);
      
      // Download avatars in parallel
      const [avatarOne, avatarTwo] = await Promise.all([
        axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { 
          responseType: 'arraybuffer',
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
          }
        }),
        axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { 
          responseType: 'arraybuffer',
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
          }
        })
      ]);
      
      fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne.data));
      fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo.data));
      
      // Process images
      const [pairingImg, circleOne, circleTwo] = await Promise.all([
        jimp.read(bgPath),
        this.circleImage(avatarOnePath),
        this.circleImage(avatarTwoPath)
      ]);
      
      // Position avatars on background
      pairingImg.composite(circleOne.resize(150, 150), 980, 200);   // Right position
      pairingImg.composite(circleTwo.resize(150, 150), 140, 200);   // Left position
      
      // Save processed image
      const processedImg = await pairingImg.getBufferAsync("image/png");
      fs.writeFileSync(outputPath, processedImg);
      
      // Cleanup temp avatar files
      [avatarOnePath, avatarTwoPath].forEach(filePath => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      
      return outputPath;
      
    } catch (error) {
      console.error("Error creating pair image:", error);
      throw error;
    }
  },

  circleImage: async function(imagePath) {
    try {
      const image = await jimp.read(imagePath);
      return image.circle();
    } catch (error) {
      console.error("Error creating circle avatar:", error);
      throw error;
    }
  }
};
