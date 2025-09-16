const { createCanvas } = require("canvas");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "pending",
    aliases: ["pendings", "approve"],
    version: "1.1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 2,
    category: "🛡️ 𝑺𝒚𝒔𝒕𝒆𝒎",
    shortDescription: {
      en: "📋 𝑩𝒐𝒕 𝒆𝒓 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒎𝒂𝒏𝒂𝒈𝒆 𝒌𝒐𝒓𝒂"
    },
    longDescription: {
      en: "📋 𝑩𝒐𝒕 𝒆𝒓 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒎𝒂𝒏𝒂𝒈𝒆 𝒌𝒐𝒓𝒂"
    },
    guide: {
      en: "{𝑝}pending [𝒂𝒑𝒑𝒓𝒐𝒗𝒆/𝒓𝒆𝒋𝒆𝒄𝒕] [𝒏𝒖𝒎𝒃𝒆𝒓𝒔]"
    },
    dependencies: {
      "canvas": "",
      "fs-extra": ""
    }
  },

  langs: {
    en: {
      "invaildNumber": "❌ | %1 𝒆𝒌𝒕𝒂 𝒔𝒂𝒕𝒉𝒊𝒌 𝒏𝒂𝒎𝒃𝒂𝒓 𝒏𝒂!",
      "cancelSuccess": "❌ | %1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒓𝒆𝒋𝒆𝒄𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!",
      "notiBox": "🌟 | 𝑩𝒐𝑻 𝒔𝒂𝒕𝒉𝒊𝒌𝒃𝒉𝒂𝒃𝒆 𝒄𝒐𝒏𝒏𝒆𝒄𝒕 𝒉𝒐𝒍𝒐!\n𝑨𝒓𝒐 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒉𝒐𝒏 𝒋𝒂𝒏𝒕𝒆 +𝒉𝒆𝒍𝒑 𝒕𝒂𝒊𝒑 𝒌𝒐𝒓𝒖𝒏",
      "approveSuccess": "✅ | %1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!",
      "cantGetPendingList": "⚠️ | 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝒍𝒊𝒔𝒕 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!",
      "returnListPending": "📋 | 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝑳𝒊𝒔𝒕 (%1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅)",
      "returnListClean": "✨ | 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝒍𝒊𝒔𝒕𝒆 𝒌𝒐𝒏𝒐 𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒆𝒊",
      "instructions": "⚡ 𝑰𝒏𝒔𝒕𝒓𝒖𝒄𝒕𝒊𝒐𝒏𝒔:\n✅ 𝒂𝒑𝒑𝒓𝒐𝒗𝒆: 1,2,3\n❌ 𝒓𝒆𝒋𝒆𝒄𝒕: c1,2,3"
    }
  },

  handleReply: async function({ api, event, handleReply, getLang }) {
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID } = event;
    let count = 0;

    if (body.toLowerCase().startsWith("c") || body.toLowerCase().startsWith("cancel")) {
        const index = body.replace(/[^0-9\s]/g, '').split(/\s+/).filter(Boolean);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(this.styledMessage(getLang("invaildNumber", singleIndex), "error"), threadID, messageID);
            
            api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[singleIndex - 1].threadID);
            count++;
        }
        return api.sendMessage(this.styledMessage(getLang("cancelSuccess", count), "success"), threadID, messageID);
    }
    else {
        const index = body.split(/\s+/).filter(Boolean);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(this.styledMessage(getLang("invaildNumber", singleIndex), "error"), threadID, messageID);
            
            api.sendMessage(this.styledMessage(getLang("notiBox"), "info"), handleReply.pending[singleIndex - 1].threadID);
            count++;
        }
        return api.sendMessage(this.styledMessage(getLang("approveSuccess", count), "success"), threadID, messageID);
    }
  },

  onStart: async function({ api, event, getLang }) {
    try {
      // Dependency check
      if (!createCanvas) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑐𝑎𝑛𝑣𝑎𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");

      const { threadID, messageID } = event;
      
      const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
      const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
      const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

      if (list.length === 0) {
        return api.sendMessage(this.styledMessage(getLang("returnListClean"), "info"), threadID, messageID);
      }

      // Create stylish canvas header with CSS-like design
      const canvas = createCanvas(800, 250);
      const ctx = canvas.getContext("2d");
      
      // CSS-like gradient background
      const gradient = ctx.createLinearGradient(0, 0, 800, 250);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 250);
      
      // Add header text with shadow
      ctx.font = "bold 45px 'Arial'";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText("📋 𝑷𝑬𝑵𝑫𝑰𝑵𝑮 𝑻𝑯𝑹𝑬𝑨𝑫𝑺", 400, 80);
      ctx.shadowBlur = 0;
      
      // Add subtitle with CSS styling
      ctx.font = "28px 'Arial'";
      ctx.fillStyle = "#f8f9fa";
      ctx.fillText(`${list.length} 𝑻𝒉𝒓𝒆𝒂𝒅𝒔 𝑨𝒘𝒂𝒊𝒕𝒊𝒏𝒈 𝑨𝒑𝒑𝒓𝒐𝒗𝒂𝒍`, 400, 130);
      
      // Add decorative elements
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 160);
      ctx.lineTo(700, 160);
      ctx.stroke();
      
      // Add footer text
      ctx.font = "italic 20px 'Arial'";
      ctx.fillStyle = "#d8bfd8";
      ctx.fillText("© 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝑺𝒚𝒔𝒕𝒆𝒎 𝑨𝒅𝒎𝒊𝒏", 400, 220);
      
      // Save canvas as image
      const cacheDir = __dirname + '/cache';
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const pathImg = cacheDir + '/pending_header.png';
      const buffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, buffer);
      
      // Generate thread list with CSS-like formatting
      let msg = "";
      list.forEach((group, index) => {
        const num = (index + 1).toString().padStart(2, '0');
        msg += `├── ${num}. ${group.name || "𝑼𝒏𝒏𝒂𝒎𝒆𝒅 𝑮𝒓𝒐𝒖𝒑"}\n`;
        msg += `│   └── 🆔: ${group.threadID}\n`;
      });
      
      const fullMessage = 
        `📋 𝑷𝑬𝑵𝑫𝑰𝑵𝑮 𝑳𝑰𝑺𝑻 (${list.length} 𝑻𝒉𝒓𝒆𝒂𝒅𝒔)\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${msg}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `⚡ 𝑰𝑵𝑺𝑻𝑹𝑼𝑪𝑻𝑰𝑶𝑵𝑺:\n` +
        `✅ 𝑨𝒑𝒑𝒓𝒐𝒗𝒆: 1,2,3\n` +
        `❌ 𝑹𝒆𝒋𝒆𝒄𝒕: c1,2,3\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💡 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: "1,2,3" 𝒐𝒓 "c1,2"`;
      
      // Send message with canvas header
      api.sendMessage({
        body: fullMessage,
        attachment: fs.createReadStream(pathImg)
      }, threadID, (err, info) => {
        fs.unlinkSync(pathImg);
        if (!err) {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            pending: list
          });
        }
      }, messageID);
      
    } catch (e) {
      console.error("𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑬𝒓𝒓𝒐𝒓:", e);
      return api.sendMessage(this.styledMessage(getLang("cantGetPendingList"), "error"), event.threadID, event.messageID);
    }
  },

  // CSS-like styled message generator
  styledMessage: function(text, type = "info") {
    const styles = {
      success: {
        header: "✅ 𝑺𝑼𝑪𝑪𝑬𝑺𝑺",
        border: "━━━━━━━━━━━━━━━━━━",
        color: "#27ae60"
      },
      error: {
        header: "❌ 𝑬𝑹𝑹𝑶𝑹",
        border: "━━━━━━━━━━━━━━━━━━",
        color: "#e74c3c"
      },
      warning: {
        header: "⚠️ 𝑾𝑨𝑹𝑵𝑰𝑵𝑮",
        border: "━━━━━━━━━━━━━━━━━━",
        color: "#f39c12"
      },
      info: {
        header: "💡 𝑰𝑵𝑭𝑶",
        border: "━━━━━━━━━━━━━━━━━━",
        color: "#3498db"
      }
    };

    const style = styles[type] || styles.info;
    
    return `\n${style.header}\n${style.border}\n${text}\n${style.border}\n`;
  }
};
