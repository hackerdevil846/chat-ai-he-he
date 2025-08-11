const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "xid",
    version: "1.0.7",
    role: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Get detailed UID information with profile picture",
    category: "info",
    guide: {
      en: "[reply/mention/@tag]"
    },
    cooldown: 5
  },

  onStart: async function () {
    console.log("XID command initialized");
  },

  onRun: async function ({ api, event, Users }) {
    try {
      const { threadID, messageID, senderID } = event;
      const startTime = Date.now();

      // Determine target user
      let uid, targetName;
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
        targetName = await Users.getNameUser(uid).catch(() => "Unknown User");
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
        targetName = event.mentions[uid];
      } else {
        uid = senderID;
        targetName = await Users.getNameUser(uid).catch(() => "You");
      }

      // Get user information
      const [name, gender, userData] = await Promise.all([
        Users.getNameUser(uid).catch(() => "Unknown User"),
        Users.getData(uid).then(u => u.gender).catch(() => "Unknown"),
        Users.getData(uid).catch(() => ({}))
      ]);

      // Get avatar URL
      const avatarUrl = await Users.getAvatarUrl(uid);
      if (!avatarUrl) throw new Error("Avatar not found");

      // Calculate account metrics
      const joinDate = userData.joinDate ?
        new Date(parseInt(userData.joinDate)).toLocaleDateString() : "Unknown";

      const lastSeen = userData.lastSeen ? parseInt(userData.lastSeen) : null;
      let daysActive = "Unknown";
      if (lastSeen) {
        const days = Math.floor((Date.now() - lastSeen) / 86400000);
        daysActive = days > 365 ?
          Math.floor(days / 365) + " years" :
          days + " days";
      }

      const speed = ((Date.now() - startTime) / 1000).toFixed(2);

      // Format the information
      const infoMessage = `╭─── 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 ────⭓
│ 𝗡𝗔𝗠𝗘: ${name}
│ 𝗨𝗜𝗗: ${uid}
│ 𝗚𝗘𝗡𝗗𝗘𝗥: ${gender}
│ 𝗝𝗢𝗜𝗡𝗘𝗗: ${joinDate}
│ 𝗔𝗖𝗧𝗜𝗩𝗘: ${daysActive}
│ 𝗦𝗣𝗘𝗘𝗗: ${speed} seconds
╰───────────────────⭓`;

      // Create cache directory
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download avatar
      const avatarPath = path.join(cacheDir, `avatar_${uid}_${Date.now()}.jpg`);
      const response = await axios.get(avatarUrl, {
        responseType: "arraybuffer",
        timeout: 10000
      });
      fs.writeFileSync(avatarPath, Buffer.from(response.data, "binary"));

      // Send response with avatar
      api.sendMessage({
        body: infoMessage,
        attachment: fs.createReadStream(avatarPath)
      }, threadID, async (err) => {
        try {
          fs.unlinkSync(avatarPath);
        } catch (cleanError) {
          console.error("Avatar cleanup error:", cleanError);
        }

        if (err) {
          console.error("Message send error:", err);
          api.sendMessage("❌ Failed to send user info. Please try again.", threadID, messageID);
        }
      }, messageID);

    } catch (error) {
      console.error("XID command error:", error);
      let errorMessage = "❌ Error retrieving user information";

      if (error.message.includes("not found")) {
        errorMessage = "🔍 User not found or data unavailable";
      } else if (error.message.includes("timeout")) {
        errorMessage = "⏱️ Avatar download timed out. Please try again later.";
      }

      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
