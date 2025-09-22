const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "groupstats",
    aliases: ["ginfostats", "groupanalytics"],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "📊 𝐺𝑟𝑜𝑢𝑝 𝑠𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠 𝑎𝑛𝑑 𝑎𝑛𝑎𝑙𝑦𝑡𝑖𝑐𝑠"
    },
    longDescription: {
      en: "📊 𝐷𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑠𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠 𝑤𝑖𝑡ℎ 𝑎𝑑𝑚𝑖𝑛𝑠, 𝑎𝑐𝑡𝑖𝑣𝑒 𝑚𝑒𝑚𝑏𝑒𝑟𝑠, 𝑡𝑜𝑝 𝑠𝑒𝑛𝑑𝑒𝑟𝑠"
    },
    guide: {
      en: "{p}groupstats [--𝑐𝑜𝑙𝑜𝑢𝑟 𝑡𝑒𝑥𝑡] [--𝑏𝑔𝑐𝑜𝑙𝑜𝑢𝑟 𝑖𝑚𝑔𝑈𝑅𝐿] [--𝑎𝑑𝑚𝑖𝑛𝑐𝑜𝑙𝑜𝑢𝑟 𝑐𝑙𝑟] [--𝑚𝑒𝑚𝑏𝑒𝑟𝑐𝑜𝑙𝑜𝑢𝑟 𝑐𝑙𝑟]"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": ""
    }
  },

  onStart: async function({ api, event, usersData, message, args }) {
    try {
      // Check dependencies
      if (!fs.existsSync || !axios || !createCanvas || !loadImage) {
        throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
      }

      const options = {
        colour: "red",
        bgcolour: null,
        admincolour: "blue",
        membercolour: "green",
      };

      args.forEach((arg, index) => {
        if (arg === "--colour" && args[index + 1]) options.colour = args[index + 1];
        else if (arg === "--bgcolour" && args[index + 1]) options.bgcolour = args[index + 1];
        else if (arg === "--admincolour" && args[index + 1]) options.admincolour = args[index + 1];
        else if (arg === "--membercolour" && args[index + 1]) options.membercolour = args[index + 1];
      });

      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs;
      const adminIDs = threadInfo.adminIDs.map(a => a.id);

      // Get active users and top senders
      const messages = await api.getThreadHistory(event.threadID, 100, null);
      const senderCountMap = {};
      messages.forEach(msg => {
        if (participantIDs.includes(msg.senderID)) {
          senderCountMap[msg.senderID] = (senderCountMap[msg.senderID] || 0) + 1;
        }
      });

      const activeUserIDs = Object.keys(senderCountMap);
      const numActiveUsers = activeUserIDs.length;

      const topSenders = await Promise.all(
        Object.entries(senderCountMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(async ([uid, count]) => {
            try {
              const userInfo = await api.getUserInfo(uid);
              const userName = userInfo[uid]?.name || uid;
              return `• ${userName} (${count} 𝑚𝑠𝑔𝑠)`;
            } catch {
              return `• ${uid} (${count} 𝑚𝑠𝑔𝑠)`;
            }
          })
      );

      const profileImages = await Promise.all(
        participantIDs.map(async id => {
          try {
            const userInfo = await api.getUserInfo(id);
            const avatarUrl = `https://graph.facebook.com/${id}/picture?width=200&height=200&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
            return res.data;
          } catch {
            return null;
          }
        })
      );

      const adminProfiles = [], memberProfiles = [];
      for (let i = 0; i < participantIDs.length; i++) {
        if (adminIDs.includes(participantIDs[i])) adminProfiles.push(profileImages[i]);
        else memberProfiles.push(profileImages[i]);
      }

      const numAdmins = adminProfiles.length;
      const numMembers = memberProfiles.length;

      const profileSize = 42;
      const maxPerRow = 10;
      const gap = 10;
      const totalProfiles = numAdmins + numMembers;
      const rows = Math.ceil(totalProfiles / maxPerRow);
      const canvasWidth = maxPerRow * (profileSize + gap) - gap + 20;
      const canvasHeight = rows * (profileSize + gap) + 170 + 80;

      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (options.bgcolour) {
        try {
          const bg = await axios.get(options.bgcolour, { responseType: "arraybuffer" });
          const bgImg = await loadImage(bg.data);
          ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
        } catch (e) {
          console.error("𝐵𝐺 𝑒𝑟𝑟𝑜𝑟:", e);
        }
      }

      const groupImgSize = profileSize * 3;
      const groupX = (canvasWidth - groupImgSize) / 2;
      const groupY = 20;

      if (threadInfo.imageSrc) {
        try {
          const img = await axios.get(threadInfo.imageSrc, { responseType: "arraybuffer" });
          const loaded = await loadImage(img.data);
          ctx.save();
          ctx.beginPath();
          ctx.arc(canvasWidth / 2, groupY + groupImgSize / 2, groupImgSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(loaded, groupX, groupY, groupImgSize, groupImgSize);
          ctx.restore();

          ctx.beginPath();
          ctx.arc(canvasWidth / 2, groupY + groupImgSize / 2, groupImgSize / 2 + 3, 0, Math.PI * 2);
          ctx.lineWidth = 3;
          ctx.strokeStyle = "red";
          ctx.stroke();
        } catch (err) {
          console.error("𝐺𝑟𝑜𝑢𝑝 𝑖𝑚𝑎𝑔𝑒 𝑒𝑟𝑟𝑜𝑟:", err);
        }
      }

      ctx.font = "25px Arial";
      ctx.fillStyle = options.colour;
      ctx.textAlign = "center";
      ctx.fillText(threadInfo.threadName, canvasWidth / 2, groupY + groupImgSize + 30);

      ctx.font = "15px Arial";
      ctx.fillStyle = "white";
      const labelY = groupY + groupImgSize + 80;

      ctx.textAlign = "left";
      ctx.strokeStyle = options.admincolour;
      ctx.strokeText(`𝐴𝑑𝑚𝑖𝑛𝑠: ${numAdmins}`, 10, labelY);
      ctx.fillText(`𝐴𝑑𝑚𝑖𝑛𝑠: ${numAdmins}`, 10, labelY);

      ctx.textAlign = "center";
      ctx.strokeStyle = "#ffaa00";
      ctx.strokeText(`𝐴𝑐𝑡𝑖𝑣𝑒: ${numActiveUsers}`, canvasWidth / 2, labelY);
      ctx.fillText(`𝐴𝑐𝑡𝑖𝑣𝑒: ${numActiveUsers}`, canvasWidth / 2, labelY);

      ctx.textAlign = "right";
      ctx.strokeStyle = options.membercolour;
      ctx.strokeText(`𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${numMembers}`, canvasWidth - 10, labelY);
      ctx.fillText(`𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${numMembers}`, canvasWidth - 10, labelY);

      let x = 10, y = groupY + groupImgSize + 100, col = 0;
      for (const buffer of [...adminProfiles, ...memberProfiles]) {
        if (!buffer) continue;
        const avatar = await loadImage(buffer);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + profileSize / 2, y + profileSize / 2, profileSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, x, y, profileSize, profileSize);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(x + profileSize / 2, y + profileSize / 2, profileSize / 2 + 1.5, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = adminProfiles.includes(buffer) ? options.admincolour : options.membercolour;
        ctx.stroke();

        col++;
        x += profileSize + gap;
        if (col >= maxPerRow) {
          col = 0;
          x = 10;
          y += profileSize + gap;
        }
      }

      const outPath = __dirname + "/cache/group_stats.png";
      const outBuffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outPath, outBuffer);

      const caption =
        `📊 𝐺𝑟𝑜𝑢𝑝: ${threadInfo.threadName}\n` +
        `👑 𝐴𝑑𝑚𝑖𝑛𝑠: ${numAdmins} | 🟢 𝐴𝑐𝑡𝑖𝑣𝑒: ${numActiveUsers} | 👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${numMembers}\n` +
        `📈 𝑇𝑜𝑝 𝑆𝑒𝑛𝑑𝑒𝑟𝑠:\n${topSenders.join("\n")}`;

      await message.reply({
        body: caption,
        attachment: fs.createReadStream(outPath),
      });

      // Clean up
      setTimeout(() => {
        if (fs.existsSync(outPath)) {
          fs.unlinkSync(outPath);
        }
      }, 5000);

    } catch (err) {
      console.error("𝐹𝑎𝑖𝑙𝑒𝑑:", err);
      await message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ${err.message}`);
    }
  }
};
