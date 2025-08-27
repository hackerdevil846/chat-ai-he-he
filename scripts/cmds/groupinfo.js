const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

const profileSize = 42;

function toMathBoldItalic(text) {
  const mapping = {
    'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 
    'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 
    'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍',
    'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 
    'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 
    'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧'
  };
  
  return text.split('').map(char => mapping[char] || char).join('');
}

module.exports = {
  config: {
    name: "groupinfo",
    aliases: ["ginfo"],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "📊 𝐺𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑠𝑢𝑚𝑚𝑎𝑟𝑦"
    },
    longDescription: {
      en: "📊 𝐺𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎𝑑𝑚𝑖𝑛𝑠, 𝑎𝑐𝑡𝑖𝑣𝑒 𝑚𝑒𝑚𝑏𝑒𝑟𝑠, 𝑡𝑜𝑝 𝑠𝑒𝑛𝑑𝑒𝑟𝑠 & 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
    },
    category: "𝑖𝑚𝑎𝑔𝑒",
    guide: {
      en: "{p}{n} --colour [text] --bgcolour [imgURL] --admincolour [clr] --membercolour [clr]"
    },
    usePrefix: true,
    useChat: true
  },

  onStart: async function ({ api, event, usersData, message }) {
    try {
      const args = event.body.split(" ").slice(1);
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

      const topSenders = Object.entries(senderCountMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([uid, count]) => `• ${uid} (${count} 𝑚𝑠𝑔)`);

      const profileImages = await Promise.all(
        participantIDs.map(async id => {
          try {
            const url = await usersData.getAvatarUrl(id);
            const res = await axios.get(url, { responseType: "arraybuffer" });
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

      const maxPerRow = 10, gap = 10;
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
      ctx.strokeText(`${toMathBoldItalic("Admins")}: ${numAdmins}`, 10, labelY);
      ctx.fillText(`${toMathBoldItalic("Admins")}: ${numAdmins}`, 10, labelY);

      ctx.textAlign = "center";
      ctx.strokeStyle = "#ffaa00";
      ctx.strokeText(`${toMathBoldItalic("Active")}: ${numActiveUsers}`, canvasWidth / 2, labelY);
      ctx.fillText(`${toMathBoldItalic("Active")}: ${numActiveUsers}`, canvasWidth / 2, labelY);

      ctx.textAlign = "right";
      ctx.strokeStyle = options.membercolour;
      ctx.strokeText(`${toMathBoldItalic("Members")}: ${numMembers}`, canvasWidth - 10, labelY);
      ctx.fillText(`${toMathBoldItalic("Members")}: ${numMembers}`, canvasWidth - 10, labelY);

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
      fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

      const caption =
        `📊 ${toMathBoldItalic("Group")}: ${threadInfo.threadName}\n` +
        `👑 ${toMathBoldItalic("Admins")}: ${numAdmins} | 🟢 ${toMathBoldItalic("Active")}: ${numActiveUsers} | 👥 ${toMathBoldItalic("Members")}: ${numMembers}\n` +
        `📈 ${toMathBoldItalic("Top Senders")}:\n${topSenders.join("\n")}`;

      message.reply({
        body: caption,
        attachment: fs.createReadStream(outPath),
      });

    } catch (err) {
      console.error("𝐹𝑎𝑖𝑙𝑒𝑑:", err);
      message.reply(`❌ ${toMathBoldItalic("Error occurred")}: ${err.message}`);
    }
  },

  // No-prefix support
  onChat: async function ({ event, message }) {
    const body = event.body.toLowerCase();
    if (body === "groupinfo" || body === "ginfo") {
      message.body = "+groupinfo";
      return this.onStart(...arguments);
    }
  }
};
