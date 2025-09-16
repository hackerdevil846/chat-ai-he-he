const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "rip",
    aliases: ["tombstone", "grave"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🪦 Create RIP tombstone with user's avatar"
    },
    longDescription: {
      en: "🪦 Create a RIP tombstone image with user's profile picture"
    },
    guide: {
      en: "{p}rip [@mention]"
    },
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      // Check dependencies
      try {
        if (!DIG || !fs || !path) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install discord-image-generation and fs-extra.", event.threadID, event.messageID);
      }

      const { threadID, messageID, senderID, mentions } = event;
      const mentionID = Object.keys(mentions)[0] || senderID;
      const targetName = mentions[mentionID] || "you";

      // Get avatar URL
      const userInfo = await api.getUserInfo(mentionID);
      const avatarURL = userInfo[mentionID]?.profileUrl;
      
      if (!avatarURL) {
        return api.sendMessage("❌ | Failed to fetch profile picture!", threadID, messageID);
      }

      // Generate RIP image
      const imgBuffer = await new DIG.Rip().getImage(avatarURL);
      const tmpDir = path.join(__dirname, "tmp");
      const filePath = path.join(tmpDir, `${mentionID}_rip.png`);

      await fs.ensureDir(tmpDir);
      await fs.writeFile(filePath, imgBuffer);

      // Send message with image
      await api.sendMessage({
        body: `🪦 Rest in peace ${targetName}...\n\n✨ Created by ${this.config.author}`,
        attachment: fs.createReadStream(filePath)
      }, threadID, messageID);

      // Clean up
      fs.unlinkSync(filePath);
      
    } catch (err) {
      console.error("[RIP Command Error]", err);
      return api.sendMessage("⚠️ | Failed to generate image! Please try again later.", event.threadID, event.messageID);
    }
  }
};
