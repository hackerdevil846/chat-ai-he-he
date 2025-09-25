const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "groupmention",
    aliases: ["gmention", "allmention"],
    version: "0.0.3",
    author: "Asif Mahmud",
    countDown: 80,
    role: 1,
    category: "group",
    shortDescription: {
      en: "Group member tagging with stylish header"
    },
    longDescription: {
      en: "Tag all group members with a beautiful custom header"
    },
    guide: {
      en: "{p}groupmention [text]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  onStart: async function({ api, event, args, threadsData }) {
    try {
      // Check dependencies
      try {
        if (!axios || !fs || !createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install axios, fs-extra, and canvas.", event.threadID, event.messageID);
      }

      // Get participant IDs
      const threadInfo = await api.getThreadInfo(event.threadID);
      let all = threadInfo.participantIDs;
      all = all.filter(id => id !== api.getCurrentUserID() && id !== event.senderID);
      
      // Create beautiful canvas header
      const width = 1000;
      const height = 300;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#8A2BE2");
      gradient.addColorStop(1, "#1E90FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add decorative elements
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 30 + 10,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Styled text
      ctx.font = "bold 60px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.fillText("📢 GROUP MENTION 📢", width / 2, height / 2);

      // Save image
      const pathImg = __dirname + '/cache/groupmention_header.png';
      const buffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, buffer);

      // Prepare message body
      const defaultMsg = "✨ Admin is mentioning everyone ✨";
      const customMsg = args.join(" ");
      const body = customMsg || defaultMsg;
      
      // Generate mentions
      const mentions = [];
      let bodyWithMentions = body + "\n\n";
      
      for (let i = 0; i < all.length; i++) {
        mentions.push({
          tag: `@user${i + 1}`,
          id: all[i],
          fromIndex: bodyWithMentions.length - 1
        });
        bodyWithMentions += `@user${i + 1} `;
      }

      bodyWithMentions += `\n\n📢 ${all.length} members tagged successfully!`;

      // Send message with styled header
      return api.sendMessage({
        body: bodyWithMentions,
        attachment: fs.createReadStream(pathImg),
        mentions
      }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

    } catch (e) {
      console.error(e);
      return api.sendMessage(`❌ Error while tagging: ${e.message}`, event.threadID);
    }
  }
};
