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
    aliases: [],
    version: "1.0.3",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "Love",
    shortDescription: {
      en: "💖 Pair with people in the group"
    },
    longDescription: {
      en: "💖 Pair with random people in the group with cute images"
    },
    guide: {
      en: "{p}pair1"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
      console.log("🔄 Initializing pair1 command...");

      // Ensure cache directory exists
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
        console.log(`✅ Created cache directory: ${dirMaterial}`);
      }

      // Download background image if not exists
      if (!fs.existsSync(bgPath)) {
        console.log("📥 Downloading background image...");
        try {
          const response = await axios.get(
            "https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg",
            {
              responseType: "arraybuffer",
              timeout: 30000,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
              }
            }
          );
          
          if (response.data && response.data.length > 1000) {
            fs.writeFileSync(bgPath, Buffer.from(response.data));
            console.log(`✅ Background image downloaded successfully`);
          } else {
            throw new Error("Invalid image data received");
          }
        } catch (downloadError) {
          console.error("❌ Failed to download background image:", downloadError.message);
          // Continue without background - will fail gracefully later
        }
      } else {
        console.log(`✅ Background image already exists`);
      }
    } catch (error) {
      console.error("❌ Error in onLoad:", error.message);
    }
  },

  onStart: async function({ api, event }) {
    let generatedImagePath = null;

    try {
      const { threadID, messageID, senderID } = event;

      // Random pair percentage
      const pairPercentages = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
      const pairRate = pairPercentages[Math.floor(Math.random() * pairPercentages.length)];

      // Get sender info
      let senderName = "Unknown User";
      try {
        const senderInfo = await api.getUserInfo(senderID);
        senderName = senderInfo[senderID]?.name || senderName;
      } catch (e) {
        console.warn("Could not fetch sender info:", e.message);
      }

      // Get thread participants
      let participants = [];
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        participants = threadInfo.participantIDs || [];
      } catch (e) {
        console.error("Could not fetch thread participants:", e.message);
        return api.sendMessage("❌ Failed to get group members. Please try again later.", threadID, messageID);
      }

      // Filter out sender and bot
      const eligibleParticipants = participants.filter(id =>
        id !== senderID &&
        id !== api.getCurrentUserID()
      );

      if (eligibleParticipants.length === 0) {
        return api.sendMessage("😢 No other members found for pairing!", threadID, messageID);
      }

      // Select random partner
      const randomID = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
      
      let partnerName = "Unknown User";
      try {
        const userInfo = await api.getUserInfo(randomID);
        partnerName = userInfo[randomID]?.name || partnerName;
      } catch (e) {
        console.warn("Could not fetch partner info:", e.message);
      }

      // Send loading message
      await api.sendMessage("💖 Creating your pairing image...", threadID, messageID);

      // Generate pairing image
      generatedImagePath = await this.makePairImage(senderID, randomID);

      if (!generatedImagePath || !fs.existsSync(generatedImagePath)) {
        throw new Error("Failed to generate pairing image");
      }

      // Prepare message with mentions
      const messageText = `💖 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! ${senderName} was paired with ${partnerName}!\n✨ 𝐏𝐚𝐢𝐫 𝐨𝐝𝐝𝐬: ${pairRate}`;

      await api.sendMessage({
        body: messageText,
        mentions: [
          { id: senderID, tag: senderName },
          { id: randomID, tag: partnerName }
        ],
        attachment: fs.createReadStream(generatedImagePath)
      }, threadID);

      console.log("✅ Successfully sent pairing image");

    } catch (error) {
      console.error("❌ Pair command error:", error);
      await api.sendMessage(
        "❌ An error occurred while processing the pairing command. Please try again later!",
        event.threadID,
        event.messageID
      );
    } finally {
      // Cleanup temporary image
      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        try {
          fs.unlinkSync(generatedImagePath);
          console.log("🧹 Cleaned up temporary pairing image");
        } catch (cleanupError) {
          console.warn("⚠️ Cleanup error:", cleanupError.message);
        }
      }
    }
  },

  makePairImage: async function(user1, user2) {
    const outputPath = path.join(dirMaterial, `pairing_${user1}_${user2}_${Date.now()}.png`);
    const avatar1Path = path.join(dirMaterial, `avt_${user1}_${Date.now()}.png`);
    const avatar2Path = path.join(dirMaterial, `avt_${user2}_${Date.now()}.png`);

    try {
      // Check if background exists
      if (!fs.existsSync(bgPath)) {
        throw new Error("Background image not found. Please restart the bot to download it.");
      }

      console.log("📥 Downloading avatars...");

      // Download avatars with better error handling
      let avatar1Buffer, avatar2Buffer;
      
      try {
        const avatar1Response = await axios.get(
          `https://graph.facebook.com/${user1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { 
            responseType: "arraybuffer",
            timeout: 15000
          }
        );
        avatar1Buffer = Buffer.from(avatar1Response.data);
      } catch (error) {
        console.error(`❌ Failed to download avatar for ${user1}:`, error.message);
        throw new Error(`Could not get avatar for first user`);
      }

      try {
        const avatar2Response = await axios.get(
          `https://graph.facebook.com/${user2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { 
            responseType: "arraybuffer",
            timeout: 15000
          }
        );
        avatar2Buffer = Buffer.from(avatar2Response.data);
      } catch (error) {
        console.error(`❌ Failed to download avatar for ${user2}:`, error.message);
        throw new Error(`Could not get avatar for second user`);
      }

      // Save avatar files
      fs.writeFileSync(avatar1Path, avatar1Buffer);
      fs.writeFileSync(avatar2Path, avatar2Buffer);

      // Read all images
      console.log("🎨 Processing images...");
      const [background, avatar1, avatar2] = await Promise.all([
        jimp.read(bgPath),
        jimp.read(avatar1Path),
        jimp.read(avatar2Path)
      ]);

      // Create circular avatars
      avatar1.circle();
      avatar2.circle();

      // Avatar sizes and positions (based on your template)
      const avatarSizeGirl = 85;  // Left side - larger
      const avatarSizeBoy = 75;   // Right side - smaller

      const girlAvatarX = 244;    // Left position X
      const girlAvatarY = 106;    // Left position Y
      const boyAvatarX = 333;     // Right position X  
      const boyAvatarY = 63;      // Right position Y

      // Composite avatars onto background
      background.composite(avatar1.resize(avatarSizeGirl, avatarSizeGirl), girlAvatarX, girlAvatarY);
      background.composite(avatar2.resize(avatarSizeBoy, avatarSizeBoy), boyAvatarX, boyAvatarY);

      // Save final image
      console.log("💾 Saving final image...");
      await background.writeAsync(outputPath);

      // Verify the image was created
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        if (stats.size > 0) {
          console.log(`✅ Successfully created pair image: ${outputPath}`);
          return outputPath;
        } else {
          throw new Error("Generated image file is empty");
        }
      } else {
        throw new Error("Failed to create output image file");
      }

    } catch (error) {
      console.error("❌ Error creating pair image:", error.message);
      throw error;
    } finally {
      // Cleanup temporary avatar files
      try {
        if (fs.existsSync(avatar1Path)) fs.unlinkSync(avatar1Path);
        if (fs.existsSync(avatar2Path)) fs.unlinkSync(avatar2Path);
      } catch (cleanupError) {
        console.warn("⚠️ Failed to clean up avatar files:", cleanupError.message);
      }
    }
  }
};
