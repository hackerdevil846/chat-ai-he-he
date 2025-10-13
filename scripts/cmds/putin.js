const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "putin",
    aliases: [],
    version: "2.1",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "meme",
    shortDescription: {
      en: "🇷🇺 𝖢𝗋𝖾𝖺𝗍𝖾 𝖯𝗎𝗍𝗂𝗇 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗆𝖾𝗆𝖾"
    },
    longDescription: {
      en: "🇷🇺 𝖢𝗋𝖾𝖺𝗍𝖾 𝖯𝗎𝗍𝗂𝗇 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗆𝖾𝗆𝖾 𝗐𝗂𝗍𝗁 𝗍𝖺𝗀𝗀𝖾𝖽 𝗎𝗌𝖾𝗋 𝗈𝗋 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿"
    },
    guide: {
      en: "{p}putin [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
    },
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args, usersData }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("discord-image-generation");
        require("fs-extra");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖽𝗂𝗌𝖼𝗈𝗋𝖽-𝗂𝗆𝖺𝗀𝖾-𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.", event.threadID, event.messageID);
      }

      const { threadID, messageID, senderID, mentions } = event;

      let targetID, userName;

      // Determine target user
      if (mentions && Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        userName = mentions[targetID].replace("@", "").trim();
      } else {
        targetID = senderID;
        try {
          const userInfo = await api.getUserInfo(senderID);
          userName = userInfo[senderID]?.name || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
        } catch (userError) {
          userName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
        }
      }

      // Validate user name
      if (!userName || userName.length > 50) {
        userName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
      }

      const processingMsg = await api.sendMessage("🔄 𝖯𝗎𝗍𝗂𝗇 𝗂𝗌 𝗉𝗋𝖾𝗉𝖺𝗋𝗂𝗇𝗀 𝗍𝗈 𝗆𝖾𝖾𝗍...", threadID, messageID);

      try {
        // Get avatar URL
        let avatarURL;
        try {
          const userInfo = await api.getUserInfo(targetID);
          avatarURL = userInfo[targetID]?.profileUrl;
          
          if (!avatarURL) {
            throw new Error("𝖭𝗈 𝖺𝗏𝖺𝗍𝖺𝗋 𝖴𝖱𝖫 𝖿𝗈𝗎𝗇𝖽");
          }
        } catch (avatarError) {
          await api.unsendMessage(processingMsg.messageID);
          return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.", threadID, messageID);
        }

        // Create cache directory
        const cacheDir = path.join(__dirname, "cache");
        try {
          await fs.ensureDir(cacheDir);
        } catch (dirError) {
          await api.unsendMessage(processingMsg.messageID);
          return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.", threadID, messageID);
        }

        const filePath = path.join(cacheDir, `putin_${targetID}_${Date.now()}.png`);

        try {
          // Generate Putin meme using DIG
          const imgBuffer = await new DIG.Poutine().getImage(avatarURL);
          
          // Save the image
          await fs.writeFile(filePath, imgBuffer);
          
          // Verify file was created
          const stats = await fs.stat(filePath);
          if (stats.size < 1000) {
            throw new Error("𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗂𝗆𝖺𝗀𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗌𝗆𝖺𝗅𝗅");
          }

          // Send result
          await api.sendMessage({
            body: `🇷🇺✨ 𝖯𝗎𝗍𝗂𝗇 𝗂𝗌 𝗈𝖿𝖿𝗂𝖼𝗂𝖺𝗅𝗅𝗒 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 ${userName}!\n\n👤 𝖳𝖺𝗋𝗀𝖾𝗍: ${userName}\n🎨 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖻𝗒: ${this.config.author}`,
            attachment: fs.createReadStream(filePath)
          }, threadID, messageID);

          // Clean up
          await fs.unlink(filePath);
          await api.unsendMessage(processingMsg.messageID);

        } catch (imageError) {
          console.error("𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", imageError);
          
          // Clean up file if it exists
          try {
            if (await fs.pathExists(filePath)) {
              await fs.unlink(filePath);
            }
          } catch (cleanupError) {}
          
          await api.unsendMessage(processingMsg.messageID);
          await api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗆𝖾𝗆𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗎𝗌𝖾𝗋.", threadID, messageID);
        }

      } catch (error) {
        console.error("💥 𝖯𝗎𝗍𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        await api.unsendMessage(processingMsg.messageID);
        await api.sendMessage("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", threadID, messageID);
      }

    } catch (error) {
      console.error("💥 𝖯𝗎𝗍𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗆𝖺𝗂𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
      // Don't send error message to avoid spam
    }
  }
};
