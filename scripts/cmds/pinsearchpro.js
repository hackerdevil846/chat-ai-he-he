const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "pinsearchpro",
    aliases: ["pinfinder", "pindownload"],
    version: "1.6.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "search",
    shortDescription: {
      en: "🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡"
    },
    longDescription: {
      en: "🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ℎ𝑖𝑔ℎ-𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑏𝑎𝑛𝑛𝑒𝑟𝑠"
    },
    guide: {
      en: "{𝑝}𝑝𝑖𝑛𝑠𝑒𝑎𝑟𝑐ℎ𝑝𝑟𝑜 [𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚]-[𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑖𝑚𝑎𝑔𝑒𝑠]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    },
    envConfig: {
      apiUrl: "https://asif-pinterest-api.onrender.com/v1/pinterest"
    }
  },

  onLoad: function() {
    const tempDir = path.join(__dirname, "pinsearch_cache");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID, senderID } = event;
      const { apiUrl } = this.config.envConfig;
      
      const input = args.join(" ");
      
      if (!input || !input.includes("-")) {
        const helpMessage = `🖼️ 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁 𝗜𝗺𝗮𝗴𝗲 𝗦𝗲𝗮𝗿𝗰𝗵\n\n` +
          `📝 𝑈𝑠𝑎𝑔𝑒: ${global.config.PREFIX}𝑝𝑖𝑛𝑠𝑒𝑎𝑟𝑐ℎ𝑝𝑟𝑜 [𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚]-[𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑖𝑚𝑎𝑔𝑒𝑠]\n` +
          `💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}𝑝𝑖𝑛𝑠𝑒𝑎𝑟𝑐ℎ𝑝𝑟𝑜 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑠𝑢𝑛𝑠𝑒𝑡-5\n\n` +
          `⚠️ 𝑁𝑜𝑡𝑒: 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 10 𝑖𝑚𝑎𝑔𝑒𝑠 𝑝𝑒𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡`;
        return api.sendMessage(helpMessage, threadID, messageID);
      }

      const [keyword, countStr] = input.split("-").map(item => item.trim());
      let imageCount = parseInt(countStr) || 5;
      
      if (!keyword) {
        return api.sendMessage("🔍 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑘𝑒𝑦𝑤𝑜𝑟𝑑", threadID, messageID);
      }

      imageCount = Math.max(1, Math.min(imageCount, 10));
      
      const bannerPath = await createSearchBanner(keyword, senderID);
      
      api.sendMessage({
        body: `🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑓𝑜𝑟: "${keyword}"...`,
        attachment: fs.createReadStream(bannerPath)
      }, threadID, async () => {
        fs.unlinkSync(bannerPath);
        
        try {
          const response = await axios.get(apiUrl, { 
            params: { 
              search: encodeURIComponent(keyword) 
            },
            timeout: 30000
          });
          
          if (!response.data || !response.data.data || response.data.data.length === 0) {
            return api.sendMessage(
              `❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${keyword}". 𝑇𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚.`,
              threadID,
              messageID
            );
          }
          
          const imageUrls = response.data.data.slice(0, imageCount);
          const tempDir = path.join(__dirname, "pinsearch_cache");
          const imgPaths = [];
          
          fs.readdirSync(tempDir)
            .filter(file => file.startsWith(`${senderID}_`))
            .forEach(file => fs.unlinkSync(path.join(tempDir, file)));
          
          let downloadedCount = 0;
          for (let i = 0; i < imageUrls.length; i++) {
            try {
              const imagePath = path.join(tempDir, `${senderID}_${Date.now()}_${i}.jpg`);
              const imageRes = await axios.get(imageUrls[i], {
                responseType: 'arraybuffer',
                timeout: 25000
              });
              
              fs.writeFileSync(imagePath, imageRes.data);
              imgPaths.push(imagePath);
              downloadedCount++;
            } catch (err) {
              console.error(`𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟: ${err.message}`);
            }
          }
          
          if (imgPaths.length > 0) {
            const attachments = imgPaths.map(path => fs.createReadStream(path));
            const resultMessage = `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 ${downloadedCount} 𝑖𝑚𝑎𝑔𝑒(𝑠) 𝑓𝑜𝑟:\n"${keyword}"\n\n✨ 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
            
            api.sendMessage({
              body: resultMessage,
              attachment: attachments
            }, threadID, (err) => {
              if (err) console.error("𝑆𝑒𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
              
              imgPaths.forEach(filePath => {
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }
              });
            }, messageID);
          } else {
            api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑦 𝑖𝑚𝑎𝑔𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
          }
          
        } catch (error) {
          console.error("𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", error);
          api.sendMessage("⚠️ 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝐴𝑃𝐼 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
        }
      });
      
    } catch (error) {
      console.error("𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      api.sendMessage("⚠️ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
  }
};

async function createSearchBanner(keyword, userId) {
  const width = 700;
  const height = 250;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#8a2387');
  gradient.addColorStop(0.5, '#e94057');
  gradient.addColorStop(1, '#f27121');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  const logoSize = 60;
  const logoPadding = 20;
  const logoX = logoPadding + logoSize/2;
  const logoY = height/2;
  
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoSize/2, 0, Math.PI * 2);
  ctx.fillStyle = '#E60023';
  ctx.fill();
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', logoX, logoY);
  
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const size = Math.random() * 30 + 15;
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.moveTo(x, y);
    ctx.arc(x, y, size, 0, Math.PI * 2);
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fill();
  
  ctx.font = 'bold 38px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  
  ctx.fillText('PINTEREST IMAGE SEARCH', width / 2, 100);
  
  const text = `"${keyword}"`;
  ctx.font = 'italic 32px Arial';
  const textWidth = ctx.measureText(text).width;
  const boxWidth = textWidth + 50;
  const boxHeight = 60;
  const cornerRadius = 15;
  
  const x = width / 2 - boxWidth / 2;
  const y = 130;
  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + boxWidth - cornerRadius, y);
  ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + cornerRadius);
  ctx.lineTo(x + boxWidth, y + boxHeight - cornerRadius);
  ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - cornerRadius, y + boxHeight);
  ctx.lineTo(x + cornerRadius, y + boxHeight);
  ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
  ctx.closePath();
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, width / 2, 170);
  
  const bannerPath = path.join(__dirname, "pinsearch_cache", `${userId}_banner.png`);
  fs.writeFileSync(bannerPath, canvas.toBuffer('image/png'));
  
  return bannerPath;
}
