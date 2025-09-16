const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "programmer",
    aliases: ["devmeme", "programmerfun"],
    version: "2.3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ ℎ𝑖𝑙𝑎𝑟𝑖𝑜𝑢𝑠 𝑝𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟 𝑚𝑒𝑚𝑒𝑠 𝑎𝑛𝑑 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ ℎ𝑖𝑙𝑎𝑟𝑖𝑜𝑢𝑠 𝑝𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟 𝑚𝑒𝑚𝑒𝑠 𝑎𝑛𝑑 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    guide: {
      en: "{𝑝}programmer [𝑜𝑛/𝑜𝑓𝑓]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      if (!axios || !fs || !path) {
        throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
      }
      
      console.log("🤖 𝐶𝑜𝑑𝑒𝑀𝑒𝑚𝑒 𝑚𝑜𝑑𝑢𝑙𝑒 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑");
      
      // 𝐶𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑠𝑒𝑡𝑢𝑝
      const cacheDir = path.join(__dirname, 'cache', 'programmer');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
    } catch (error) {
      console.error("𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
    }
  },

  onChat: async function({ event, api, threadsData }) {
    try {
      const { threadID, body, senderID } = event;
      const content = body ? body.toLowerCase() : '';

      // 𝐼𝑔𝑛𝑜𝑟𝑒 𝑖𝑓 𝑏𝑜𝑡 𝑠𝑒𝑛𝑡 𝑡ℎ𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      if (senderID === api.getCurrentUserID()) return;

      // 𝐺𝑒𝑡 𝑡ℎ𝑟𝑒𝑎𝑑 𝑑𝑎𝑡𝑎
      const threadData = await threadsData.get(threadID);
      const isEnabled = threadData.data?.codememe ?? true;

      // 𝐶ℎ𝑒𝑐𝑘 𝑖𝑓 𝑡𝑟𝑖𝑔𝑔𝑒𝑟 𝑤𝑜𝑟𝑑 𝑖𝑠 𝑢𝑠𝑒𝑑
      if (content.startsWith("programmer") && isEnabled) {
        this.cleanCache(); // 𝐶𝑙𝑒𝑎𝑛 𝑐𝑎𝑐ℎ𝑒 𝑏𝑒𝑓𝑜𝑟𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔
        
        // 𝑈𝑝𝑑𝑎𝑡𝑒𝑑 𝑐𝑜𝑙𝑙𝑒𝑐𝑡𝑖𝑜𝑛 𝑜𝑓 𝑝𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟 𝑚𝑒𝑚𝑒 𝑣𝑖𝑑𝑒𝑜𝑠
        const videoLinks = [
          "https://i.imgur.com/ymvcyfg.mp4",  // 𝐶𝑙𝑎𝑠𝑠𝑖𝑐 𝑝𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟 ℎ𝑢𝑚𝑜𝑟
        ];

        // 𝑃𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟-𝑡ℎ𝑒𝑚𝑒𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒𝑠
        const responses = [
          "🤡 𝑃𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟 𝑙𝑖𝑓𝑒 𝑏𝑒 𝑙𝑖𝑘𝑒 🤣",
          "💻 𝐶𝑜𝑑𝑖𝑛𝑔 24/7 🥵😎",
          "🚀 𝑊ℎ𝑒𝑛 𝑦𝑜𝑢𝑟 𝑐𝑜𝑑𝑒 𝑓𝑖𝑛𝑎𝑙𝑙𝑦 𝑤𝑜𝑟𝑘𝑠!",
          "😴 𝑀𝑒 𝑑𝑒𝑏𝑢𝑔𝑔𝑖𝑛𝑔 𝑎𝑡 3 𝐴𝑀",
          "🤯 𝑊ℎ𝑒𝑛 𝑦𝑜𝑢 𝑓𝑖𝑛𝑑 𝑡ℎ𝑎𝑡 𝑚𝑖𝑠𝑠𝑖𝑛𝑔 𝑠𝑒𝑚𝑖𝑐𝑜𝑙𝑜𝑛",
          "👨‍💻 𝑀𝑒: '𝐼𝑡 𝑤𝑜𝑟𝑘𝑠 𝑜𝑛 𝑚𝑦 𝑚𝑎𝑐ℎ𝑖𝑛𝑒'",
          "🔥 𝐹𝑖𝑥 𝑜𝑛𝑒 𝑏𝑢𝑔, 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡𝑤𝑜 𝑛𝑒𝑤 𝑜𝑛𝑒𝑠",
          "💾 𝐶𝑜𝑚𝑝𝑖𝑙𝑖𝑛𝑔... (5 ℎ𝑜𝑢𝑟𝑠 𝑙𝑎𝑡𝑒𝑟)",
          "🤖 𝑀𝑦 𝑐𝑜𝑑𝑒 𝑣𝑠. 𝑤ℎ𝑎𝑡 𝑡ℎ𝑒 𝑐𝑙𝑖𝑒𝑛𝑡 𝑤𝑎𝑛𝑡𝑒𝑑",
          "🧠 𝐵𝑟𝑎𝑖𝑛: 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑟𝑖𝑡𝑒 𝑡ℎ𝑒 𝑐𝑜𝑑𝑒\n𝑀𝑒: *𝑐𝑜𝑝𝑖𝑒𝑠 𝑓𝑟𝑜𝑚 𝑆𝑡𝑎𝑐𝑘 𝑂𝑣𝑒𝑟𝑓𝑙𝑜𝑤*",
          "🧪 𝑇𝑒𝑠𝑡𝑖𝑛𝑔 𝑖𝑛 𝑝𝑟𝑜𝑑𝑢𝑐𝑡𝑖𝑜𝑛 𝑎𝑔𝑎𝑖𝑛?",
          "📉 𝑀𝑦 𝑚𝑜𝑡𝑖𝑣𝑎𝑡𝑖𝑜𝑛 𝑎𝑓𝑡𝑒𝑟 𝑠𝑒𝑒𝑖𝑛𝑔 𝑎 𝑛𝑒𝑤 𝑓𝑟𝑎𝑚𝑒𝑤𝑜𝑟𝑘",
          "💥 𝑀𝑒: *𝑐ℎ𝑎𝑛𝑔𝑒𝑠 𝑜𝑛𝑒 𝑙𝑖𝑛𝑒*\n𝑇ℎ𝑒 𝑤ℎ𝑜𝑙𝑒 𝑎𝑝𝑝𝑙𝑖𝑐𝑎𝑡𝑖𝑜𝑛:"
        ];
        
        // 𝑆𝑒𝑙𝑒𝑐𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑣𝑖𝑑𝑒𝑜 𝑎𝑛𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒
        const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑢𝑛𝑖𝑞𝑢𝑒 𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒
        const cacheDir = path.join(__dirname, 'cache', 'programmer');
        const videoPath = path.join(cacheDir, `programmer_${threadID}_${Date.now()}.mp4`);
        
        try {
          // 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜
          const response = await axios.get(randomVideo, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
              '𝑈𝑠𝑒𝑟-𝐴𝑔𝑒𝑛𝑡': '𝑀𝑜𝑧𝑖𝑙𝑙𝑎/5.0 (𝑊𝑖𝑛𝑑𝑜𝑤𝑠 𝑁𝑇 10.0; 𝑊𝑖𝑛64; 𝑥64) 𝐴𝑝𝑝𝑙𝑒𝑊𝑒𝑏𝐾𝑖𝑡/537.36 (𝐾𝐻𝑇𝑀𝐿, 𝑙𝑖𝑘𝑒 𝐺𝑒𝑐𝑘𝑜) 𝐶ℎ𝑟𝑜𝑚𝑒/91.0.4472.124 𝑆𝑎𝑓𝑎𝑟𝑖/537.36'
            }
          });
          
          // 𝑆𝑎𝑣𝑒 𝑣𝑖𝑑𝑒𝑜
          fs.writeFileSync(videoPath, Buffer.from(response.data));
          
          // 𝑆𝑒𝑛𝑑 𝑟𝑒𝑝𝑙𝑦
          api.sendMessage({
            body: randomResponse,
            attachment: fs.createReadStream(videoPath)
          }, threadID, (error) => {
            if (error) console.error("𝑆𝑒𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            
            // 𝐶𝑙𝑒𝑎𝑛 𝑢𝑝 𝑎𝑓𝑡𝑒𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔
            if (fs.existsSync(videoPath)) {
              fs.unlinkSync(videoPath);
            }
          });
        } catch (error) {
          console.error("𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
          // 𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑡𝑜 𝑡𝑒𝑥𝑡 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒
          api.sendMessage(randomResponse, threadID);
        }
      }
    } catch (error) {
      console.error("𝑃𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
    }
  },

  onStart: async function({ event, api, args, threadsData, message }) {
    try {
      const { threadID, messageID } = event;
      const threadData = await threadsData.get(threadID);
      let currentState = threadData.data?.codememe ?? true;
      const action = args[0] ? args[0].toLowerCase() : '';
      
      // 𝐷𝑒𝑡𝑒𝑟𝑚𝑖𝑛𝑒 𝑛𝑒𝑤 𝑠𝑡𝑎𝑡𝑒
      if (action === "on") {
        currentState = true;
      } else if (action === "off") {
        currentState = false;
      } else {
        // 𝑇𝑜𝑔𝑔𝑙𝑒 𝑖𝑓 𝑛𝑜 𝑎𝑟𝑔𝑢𝑚𝑒𝑛𝑡𝑠
        currentState = !currentState;
      }
      
      // 𝑈𝑝𝑑𝑎𝑡𝑒 𝑠𝑡𝑎𝑡𝑒
      threadData.data = { ...threadData.data, codememe: currentState };
      await threadsData.set(threadID, threadData);
      
      // 𝑆𝑒𝑛𝑑 𝑐𝑜𝑛𝑓𝑖𝑟𝑚𝑎𝑡𝑖𝑜𝑛
      const status = currentState ? "𝑂𝑁 ✅" : "𝑂𝐹𝐹 ❌";
      const statusMessage = `🧠 𝑃𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑖𝑠 𝑛𝑜𝑤 ${status}\n\n` +
        `• 𝑈𝑠𝑒 "𝑐𝑜𝑑𝑒𝑚𝑒𝑚𝑒 𝑜𝑛" 𝑡𝑜 𝑒𝑛𝑎𝑏𝑙𝑒\n` +
        `• 𝑈𝑠𝑒 "𝑐𝑜𝑑𝑒𝑚𝑒𝑚𝑒 𝑜𝑓𝑓" 𝑡𝑜 𝑑𝑖𝑠𝑎𝑏𝑙𝑒\n` +
        `• 𝐽𝑢𝑠𝑡 𝑠𝑎𝑦 "𝑝𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟" 𝑡𝑜 𝑡𝑟𝑖𝑔𝑔𝑒𝑟`;
      
      message.reply(statusMessage);
      
    } catch (error) {
      console.error("𝑇𝑜𝑔𝑔𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑡𝑜𝑔𝑔𝑙𝑒 𝑝𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑒𝑟 𝑓𝑒𝑎𝑡𝑢𝑟𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  },

  cleanCache: function() {
    try {
      const cacheDir = path.join(__dirname, 'cache', 'programmer');
      if (!fs.existsSync(cacheDir)) return;
      
      const files = fs.readdirSync(cacheDir);
      const now = Date.now();
      
      files.forEach(file => {
        const filePath = path.join(cacheDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;
        
        if (fileAge > 3600000) { // 𝐷𝑒𝑙𝑒𝑡𝑒 𝑓𝑖𝑙𝑒𝑠 𝑜𝑙𝑑𝑒𝑟 𝑡ℎ𝑎𝑛 1 ℎ𝑜𝑢𝑟
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      console.error("𝐶𝑎𝑐ℎ𝑒 𝑐𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", error);
    }
  }
};
