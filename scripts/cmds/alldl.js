const axios = require("axios");
const fs = require("fs-extra");
const qs = require('querystring');
const http = require('https');

async function baseApiUrl() {
  try {
    const base = await axios.get(
      `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
      { timeout: 10000 }
    );
    return base.data.api;
  } catch (error) {
    console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑏𝑎𝑠𝑒 𝐴𝑃𝐼 𝑈𝑅𝐿:", error);
    return "https://api-dien.sangnguyen206.repl.co";
  }
}

module.exports = {
  config: {
    name: "alldl",
    aliases: [],
    version: "1.0.6",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "𝑚𝑒𝑑𝑖𝑎",
    shortDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑠𝑜𝑐𝑖𝑎𝑙 𝑚𝑒𝑑𝑖𝑎"
    },
    longDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑇𝑖𝑘𝑇𝑜𝑘, 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘, 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚, 𝑌𝑜𝑢𝑇𝑢𝑏𝑒, 𝑒𝑡𝑐."
    },
    guide: {
      en: "{p}alldl [𝑣𝑖𝑑𝑒𝑜_𝑙𝑖𝑛𝑘] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑙𝑖𝑛𝑘"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "querystring": "",
      "https": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    try {
      // Dependency check with better validation
      let dependenciesAvailable = true;
      try {
        require("axios");
        require("fs-extra");
        require("querystring");
        require("https");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑞𝑢𝑒𝑟𝑦𝑠𝑡𝑟𝑖𝑛𝑔, 𝑎𝑛𝑑 ℎ𝑡𝑡𝑝𝑠.");
      }

      const videoUrl = event.messageReply?.body || args.join(" ");
      
      if (!videoUrl || videoUrl.trim() === "") {
        await message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑙𝑖𝑛𝑘");
        return;
      }

      // Extract URL from message if it contains text with URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const extractedUrl = videoUrl.match(urlRegex);
      const finalUrl = extractedUrl ? extractedUrl[0] : videoUrl.trim();

      if (!finalUrl.startsWith('http')) {
        await message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝐻𝑇𝑇𝑃 𝑜𝑟 𝐻𝑇𝑇𝑃𝑆 𝑙𝑖𝑛𝑘");
        return;
      }

      console.log(`🔗 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑈𝑅𝐿: ${finalUrl}`);
      const processingMsg = await message.reply("⏳ 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑛𝑘...");

      // List of API endpoints to try
      const apiEndpoints = [
        {
          name: "𝑠𝑛𝑎𝑝𝑣𝑖𝑑𝑒𝑜",
          handler: async (url) => await this.snapVideoApi(url)
        },
        {
          name: "𝑠𝑠𝑣𝑖𝑑",
          handler: async (url) => {
            const response = await axios.get(`https://ssvid.net/en20?url=${encodeURIComponent(url)}`, {
              timeout: 30000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            return response.data;
          }
        },
        {
          name: "𝑝𝑟𝑖𝑚𝑎𝑟𝑦",
          handler: async (url) => {
            const baseApi = await baseApiUrl();
            const response = await axios.get(`${baseApi}/alldl?url=${encodeURIComponent(url)}`, {
              timeout: 30000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            return response.data;
          }
        }
      ];

      let videoData = null;
      let videoUrlToDownload = null;
      let lastError = null;
      let successfulApi = null;

      // Try each API endpoint
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`🔗 𝑇𝑟𝑦𝑖𝑛𝑔 ${endpoint.name} 𝐴𝑃𝐼...`);
          
          const result = await endpoint.handler(finalUrl);
          
          if (result && (result.videoUrl || result.url || result.result || result.data?.url)) {
            videoData = result;
            videoUrlToDownload = result.videoUrl || result.url || result.result || result.data?.url;
            successfulApi = endpoint.name;
            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠 𝑤𝑖𝑡ℎ ${endpoint.name} 𝐴𝑃𝐼`);
            break;
          } else {
            throw new Error("𝑁𝑜 𝑣𝑖𝑑𝑒𝑜 𝑑𝑎𝑡𝑎 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
          }
          
        } catch (apiError) {
          lastError = apiError;
          console.error(`❌ ${endpoint.name} 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑:`, apiError.message);
          continue;
        }
      }

      if (!videoData || !videoUrlToDownload) {
        // Try to unsend processing message
        try {
          if (processingMsg && processingMsg.messageID) {
            await message.unsend(processingMsg.messageID);
          }
        } catch (e) {}
        
        throw new Error(`𝐴𝑙𝑙 𝐴𝑃𝐼𝑠 𝑓𝑎𝑖𝑙𝑒𝑑: ${lastError?.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟"}`);
      }

      // Create cache directory if it doesn't exist
      const cacheDir = __dirname + '/cache';
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = __dirname + `/cache/alldl_${Date.now()}.mp4`;
      
      console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜 𝑓𝑟𝑜𝑚: ${videoUrlToDownload}`);
      
      // Update processing message
      try {
        await message.unsend(processingMsg.messageID);
      } catch (e) {}
      
      const downloadMsg = await message.reply("📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜...");

      const videoResponse = await axios.get(videoUrlToDownload, { 
        responseType: "arraybuffer",
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.tiktok.com/',
          'Accept': 'video/mp4,video/webm,video/*'
        },
        maxContentLength: 50 * 1024 * 1024 // 50MB limit
      });

      await fs.writeFile(filePath, Buffer.from(videoResponse.data));

      // Get file size
      const stats = await fs.stat(filePath);
      const fileSize = (stats.size / (1024 * 1024)).toFixed(2);

      if (parseFloat(fileSize) > 25) {
        await fs.unlink(filePath);
        await message.unsend(downloadMsg.messageID);
        await message.reply(`❌ 𝑉𝑖𝑑𝑒𝑜 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒 (${fileSize}𝑀𝐵). 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 𝑠𝑖𝑧𝑒 𝑖𝑠 25𝑀𝐵.`);
        return;
      }

      console.log(`✅ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 (${fileSize}𝑀𝐵)`);

      const sourceName = videoData.cp || videoData.source || videoData.title || "𝑆𝑜𝑐𝑖𝑎𝑙 𝑀𝑒𝑑𝑖𝑎";
      const messageBody = `✅ 𝑉𝑖𝑑𝑒𝑜 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n📊 𝑆𝑖𝑧𝑒: ${fileSize}𝑀𝐵\n🔗 𝑆𝑜𝑢𝑟𝑐𝑒: ${sourceName}\n⚡ 𝐴𝑃𝐼: ${successfulApi}`;

      // Unsend download message
      try {
        await message.unsend(downloadMsg.messageID);
      } catch (e) {}

      await message.reply({
        body: messageBody,
        attachment: fs.createReadStream(filePath)
      });

      // Clean up file
      await fs.unlink(filePath);
      console.log(`🧹 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒`);

    } catch (error) {
      console.error("💥 𝑀𝑎𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
      
      // Handle Imgur links separately
      const finalUrl = event.messageReply?.body || args.join(" ");
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const extractedUrl = finalUrl?.match(urlRegex);
      const imgurUrl = extractedUrl ? extractedUrl[0] : finalUrl;

      if (imgurUrl && imgurUrl.includes("imgur.com")) {
        try {
          console.log(`🖼️ 𝑇𝑟𝑦𝑖𝑛𝑔 𝐼𝑚𝑔𝑢𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑...`);
          
          const imgurResponse = await axios.get(imgurUrl, { 
            responseType: "arraybuffer",
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          const fileExtension = imgurUrl.includes('.') ? imgurUrl.substring(imgurUrl.lastIndexOf(".")) : '.jpg';
          const imgurPath = __dirname + `/cache/imgur_${Date.now()}${fileExtension}`;
          
          await fs.writeFile(imgurPath, Buffer.from(imgurResponse.data));
          
          await message.reply({
            body: "✅ 𝐼𝑚𝑔𝑢𝑟 𝐼𝑚𝑎𝑔𝑒 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑",
            attachment: fs.createReadStream(imgurPath)
          });
          
          await fs.unlink(imgurPath);
          return;
          
        } catch (imgurError) {
          console.error("𝐼𝑚𝑔𝑢𝑟 𝐸𝑟𝑟𝑜𝑟:", imgurError);
        }
      }

      const errorMessages = [
        "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑙𝑖𝑛𝑘.",
        "❌ 𝑉𝑖𝑑𝑒𝑜 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑜𝑟 𝑝𝑟𝑖𝑣𝑎𝑡𝑒. 𝑇𝑟𝑦 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑙𝑖𝑛𝑘.",
        "❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑇ℎ𝑒 𝑙𝑖𝑛𝑘 𝑚𝑎𝑦 𝑏𝑒 𝑖𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑟 𝑒𝑥𝑝𝑖𝑟𝑒𝑑.",
        "❌ 𝑆𝑒𝑟𝑣𝑒𝑟 𝑏𝑢𝑠𝑦. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛 𝑎 𝑓𝑒𝑤 𝑚𝑖𝑛𝑢𝑡𝑒𝑠."
      ];
      
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      await message.reply(randomError);
    }
  },

  // Snap Video API function with better error handling
  snapVideoApi: function(url) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        hostname: 'snap-video3.p.rapidapi.com',
        port: null,
        path: '/download',
        headers: {
          'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
          'x-rapidapi-host': 'snap-video3.p.rapidapi.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000
      };

      const req = http.request(options, function (res) {
        const chunks = [];

        res.on('data', function (chunk) {
          chunks.push(chunk);
        });

        res.on('end', function () {
          try {
            const body = Buffer.concat(chunks);
            const response = JSON.parse(body.toString());
            
            if (response && response.videoUrl) {
              resolve(response);
            } else {
              reject(new Error("𝑁𝑜 𝑣𝑖𝑑𝑒𝑜 𝑈𝑅𝐿 𝑖𝑛 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒"));
            }
          } catch (parseError) {
            reject(new Error(`𝐽𝑆𝑂𝑁 𝑝𝑎𝑟𝑠𝑒 𝑒𝑟𝑟𝑜𝑟: ${parseError.message}`));
          }
        });
      });

      req.on('error', function (error) {
        reject(new Error(`𝐻𝑇𝑇𝑃 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑓𝑎𝑖𝑙𝑒𝑑: ${error.message}`));
      });

      req.on('timeout', function () {
        req.destroy();
        reject(new Error("𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡"));
      });

      req.write(qs.stringify({
        url: url
      }));
      
      req.end();
    });
  }
};
