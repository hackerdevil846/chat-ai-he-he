const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "pay",
    aliases: ["transfer", "sendmoney"],
    version: "2.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 15,
    role: 0,
    category: "💰 𝑬𝒄𝒐𝒏𝒐𝒎𝒚",
    shortDescription: {
      en: "💰 𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒎𝒐𝒏𝒆𝒚 𝒘𝒊𝒕𝒉 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝒓𝒆𝒄𝒆𝒊𝒑𝒕𝒔"
    },
    longDescription: {
      en: "💰 𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒎𝒐𝒏𝒆𝒚 𝒕𝒐 𝒐𝒕𝒉𝒆𝒓 𝒖𝒔𝒆𝒓𝒔 𝒘𝒊𝒕𝒉 𝒃𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 𝒓𝒆𝒄𝒆𝒊𝒑𝒕 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    guide: {
      en: "{𝑝}pay [@𝒕𝒂𝒈] [𝒂𝒎𝒐𝒖𝒏𝒕]"
    },
    dependencies: {
      "canvas": "",
      "moment-timezone": "",
      "fs-extra": ""
    },
    envConfig: {
      taxRate: 0.15
    }
  },

  langs: {
    en: {
      "missingTag": "💸 | 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒂𝒈 𝒕𝒉𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕",
      "overTagLength": "⚠️ | 𝑶𝒏𝒍𝒚 𝒐𝒏𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕 𝒂𝒍𝒍𝒐𝒘𝒆𝒅",
      "userNotExist": "❌ | 𝑹𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 𝒊𝒏 𝒔𝒚𝒔𝒕𝒆𝒎",
      "invalidInput": "⚠️ | 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒆𝒏𝒕𝒆𝒓𝒆𝒅",
      "payerNotExist": "❌ | 𝑺𝒆𝒏𝒅𝒆𝒓 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏",
      "notEnoughMoney": "⚠️ | 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒃𝒂𝒍𝒂𝒏𝒄𝒆",
      "paySuccess": "💸 | 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓𝒓𝒆𝒅 %1$ (𝟏𝟓% 𝒕𝒂𝒙 𝒅𝒆𝒅𝒖𝒄𝒕𝒆𝒅) 𝒕𝒐: %2",
      "error": "❌ | 𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒇𝒂𝒊𝒍𝒆𝒅, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏"
    }
  },

  onStart: async function({ api, event, args, usersData, getLang }) {
    try {
      // Dependency check
      if (!createCanvas || !loadImage) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑐𝑎𝑛𝑣𝑎𝑠");
      if (!moment) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");

      const { threadID, messageID, senderID } = event;
      const { taxRate } = this.config.envConfig;
      let targetID, amount;
      
      // Argument processing
      if (!args[0]) return api.sendMessage(this.styledMessage(getLang("missingTag"), "error"), threadID, messageID);
      if (Object.keys(event.mentions).length > 1) {
        return api.sendMessage(this.styledMessage(getLang("overTagLength"), "warning"), threadID, messageID);
      }
      
      // Get target user
      if (Object.keys(event.mentions).length === 1) {
        targetID = Object.keys(event.mentions)[0];
        amount = args[args.indexOf(event.mentions[targetID]) + 1];
      } else {
        targetID = args[0];
        amount = args[1];
      }
      
      // Validate user and amount
      const allUsers = await usersData.getAll();
      if (!allUsers.some(user => user.ID === targetID)) {
        return api.sendMessage(this.styledMessage(getLang("userNotExist"), "error"), threadID, messageID);
      }
      if (isNaN(amount) || amount < 1) {
        return api.sendMessage(this.styledMessage(getLang("invalidInput"), "warning"), threadID, messageID);
      }
      
      // Currency operations
      const payerData = await usersData.get(senderID);
      if (!payerData || !payerData.money) {
        return api.sendMessage(this.styledMessage(getLang("payerNotExist"), "error"), threadID, messageID);
      }
      if (payerData.money < amount) {
        return api.sendMessage(this.styledMessage(getLang("notEnoughMoney"), "warning"), threadID, messageID);
      }
      
      const taxAmount = Math.floor(amount * taxRate);
      const netAmount = amount - taxAmount;
      
      await usersData.decreaseMoney(senderID, parseInt(amount));
      await usersData.increaseMoney(targetID, netAmount);
      
      // Generate receipt
      const senderInfo = await api.getUserInfo(senderID);
      const receiverInfo = await api.getUserInfo(targetID);
      const senderName = senderInfo[senderID]?.name || "Unknown";
      const receiverName = receiverInfo[targetID]?.name || "Unknown";
      
      const receiptPath = await this.generateReceipt(api, senderID, targetID, amount, taxRate, netAmount);
      
      // Send result with beautiful styling
      const successMsg = this.styledMessage(
        `💸 𝑺𝑼𝑪𝑪𝑬𝑺𝑺𝑭𝑼𝑳 𝑻𝑹𝑨𝑵𝑺𝑭𝑬𝑹\n━━━━━━━━━━━━━━━━━━\n` +
        `💰 𝑨𝒎𝒐𝒖𝒏𝒕: $${amount}\n` +
        `📊 𝑻𝒂𝒙 (15%): $${taxAmount}\n` +
        `🎯 𝑵𝒆𝒕 𝑹𝒆𝒄𝒆𝒊𝒗𝒆𝒅: $${netAmount}\n` +
        `👤 𝑹𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕: ${receiverName}\n` +
        `⏰ 𝑻𝒊𝒎𝒆: ${moment().tz("Asia/Dhaka").format('h:mm:ss A')}\n━━━━━━━━━━━━━━━━━━\n` +
        `✅ 𝑻𝒓𝒂𝒏𝒔𝒂𝒄𝒕𝒊𝒐𝒏 𝑪𝒐𝒎𝒑𝒍𝒆𝒕𝒆𝒅`,
        "success"
      );
      
      if (receiptPath) {
        api.sendMessage({
          body: successMsg,
          attachment: fs.createReadStream(receiptPath)
        }, threadID, () => {
          try {
            fs.unlinkSync(receiptPath);
          } catch (e) {}
        }, messageID);
      } else {
        api.sendMessage(successMsg, threadID, messageID);
      }
    } catch (error) {
      console.error("𝑷𝒂𝒚 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑬𝒓𝒓𝒐𝒓:", error);
      api.sendMessage(this.styledMessage(getLang("error"), "error"), event.threadID, event.messageID);
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
  },

  generateReceipt: async function(api, senderID, receiverID, amount, tax, net) {
    try {
      const width = 800;
      const height = 500;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // CSS-like gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#2c3e50');
      gradient.addColorStop(0.5, '#34495e');
      gradient.addColorStop(1, '#2c3e50');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Header with CSS-like shadow
      ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.fillRect(0, 0, width, 100);
      ctx.shadowBlur = 0;
      
      // Title with CSS-like text shadow
      ctx.font = 'bold 38px "Arial"';
      ctx.fillStyle = '#f1c40f';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText('💰 𝑷𝑨𝒀𝑴𝑬𝑵𝑻 𝑹𝑬𝑪𝑬𝑰𝑷𝑻', width/2, 65);
      ctx.shadowBlur = 0;
      
      // Main content box with CSS-like border radius
      this.drawRoundedRect(ctx, 40, 120, width-80, height-180, 15);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Transaction details with CSS-like styling
      ctx.font = '26px "Arial"';
      ctx.fillStyle = '#ecf0f1';
      ctx.textAlign = 'left';
      
      const details = [
        { icon: '📅', text: `𝑫𝒂𝒕𝒆: ${moment().tz("Asia/Dhaka").format('MMMM Do YYYY, h:mm:ss a')}` },
        { icon: '💳', text: `𝑺𝒆𝒏𝒅𝒆𝒓: ${(await api.getUserInfo(senderID))[senderID]?.name || "Unknown"}` },
        { icon: '👤', text: `𝑹𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕: ${(await api.getUserInfo(receiverID))[receiverID]?.name || "Unknown"}` },
        { icon: '💵', text: `𝑨𝒎𝒐𝒖𝒏𝒕: $${amount}` },
        { icon: '📊', text: `𝑻𝒂𝒙: $${amount * tax} (${tax * 100}%)` },
        { icon: '🎯', text: `𝑵𝒆𝒕 𝑹𝒆𝒄𝒆𝒊𝒗𝒆𝒅: $${net}` },
        { icon: '🆔', text: `𝑻𝒓𝒂𝒏𝒔𝒂𝒄𝒕𝒊𝒐𝒏 𝑰𝑫: #${Date.now().toString(36).toUpperCase()}` }
      ];
      
      const startY = 160;
      const lineHeight = 40;
      
      details.forEach((detail, index) => {
        ctx.fillStyle = '#f1c40f';
        ctx.fillText(detail.icon, 60, startY + (index * lineHeight));
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(detail.text, 100, startY + (index * lineHeight));
      });
      
      // Footer with CSS-like gradient
      const footerGradient = ctx.createLinearGradient(0, height-50, width, height);
      footerGradient.addColorStop(0, 'rgba(44, 62, 80, 0.8)');
      footerGradient.addColorStop(1, 'rgba(26, 26, 46, 1)');
      ctx.fillStyle = footerGradient;
      ctx.fillRect(0, height-50, width, 50);
      
      // Copyright text
      ctx.font = 'italic 18px "Arial"';
      ctx.fillStyle = '#bdc3c7';
      ctx.textAlign = 'center';
      ctx.fillText('© 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝑬𝒄𝒐𝒏𝒐𝒎𝒚 𝑺𝒚𝒔𝒕𝒆𝒎 • Secure Transactions', width/2, height-20);
      
      // Save image
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const receiptPath = path.join(cacheDir, `pay_receipt_${Date.now()}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(receiptPath, buffer);
      
      return receiptPath;
    } catch (e) {
      console.error('𝑹𝒆𝒄𝒆𝒊𝒑𝒕 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒐𝒏 𝒆𝒓𝒓𝒐𝒓:', e);
      return null;
    }
  },

  // Helper function for rounded rectangles (CSS border-radius equivalent)
  drawRoundedRect: function(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
};
