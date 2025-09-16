const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');

module.exports = {
  config: {
    name: "prayertime",
    aliases: ["azan", "salat"],
    version: "1.3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑒𝑑 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠 𝑤𝑖𝑡ℎ 𝑎𝑢𝑑𝑖𝑜 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑒𝑑 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠 𝑤𝑖𝑡ℎ 𝐵𝑒𝑛𝑔𝑎𝑙𝑖 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑛𝑑 𝑎𝑢𝑑𝑖𝑜 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟𝑠"
    },
    guide: {
      en: "𝑁/𝐴 (𝑎𝑢𝑡𝑜-𝑡𝑖𝑚𝑒𝑑)"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "node-cron": ""
    }
  },

  // 𝑃𝑟𝑎𝑦𝑒𝑟 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝐵𝑒𝑛𝑔𝑎𝑙𝑖 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑛𝑑 𝑎𝑢𝑑𝑖𝑜 𝑈𝑅𝐿𝑠
  PRAYER_CONFIG: {
    "Fajr": {
      message: "⏰ 𝐹𝑎𝑗𝑟 𝑎𝑧𝑎𝑛 𝑡𝑖𝑚𝑒\n\n𝑃𝑟𝑒𝑝𝑎𝑟𝑒 𝑓𝑜𝑟 𝑝𝑟𝑎𝑦𝑒𝑟\n𝐹𝑎𝑗𝑟 𝑝𝑟𝑎𝑦𝑒𝑟 𝑤𝑖𝑙𝑙 𝑠𝑡𝑎𝑟𝑡 𝑠𝑜𝑜𝑛",
      audio: "https://drive.google.com/uc?id=1m5jiP4q9"
    },
    "Dhuhr": {
      message: "⏰ 𝐷ℎ𝑢ℎ𝑟 𝑎𝑧𝑎𝑛 𝑡𝑖𝑚𝑒\n\n𝑃𝑟𝑒𝑝𝑎𝑟𝑒 𝑓𝑜𝑟 𝑝𝑟𝑎𝑦𝑒𝑟\n𝐷ℎ𝑢ℎ𝑟 𝑝𝑟𝑎𝑦𝑒𝑟 𝑤𝑖𝑙𝑙 𝑠𝑡𝑎𝑟𝑡 𝑠𝑜𝑜𝑛",
      audio: "https://drive.google.com/uc?id=1mB8EpEEb"
    },
    "Asr": {
      message: "⏰ 𝐴𝑠𝑟 𝑎𝑧𝑎𝑛 𝑡𝑖𝑚𝑒\n\n𝑃𝑟𝑒𝑝𝑎𝑟𝑒 𝑓𝑜𝑟 𝑝𝑟𝑎𝑦𝑒𝑟\n𝐴𝑠𝑟 𝑝𝑟𝑎𝑦𝑒𝑟 𝑤𝑖𝑙𝑙 𝑠𝑡𝑎𝑟𝑡 𝑠𝑜𝑜𝑛",
      audio: "https://drive.google.com/uc?id=1mkNnhFFv"
    },
    "Maghrib": {
      message: "⏰ 𝑀𝑎𝑔ℎ𝑟𝑖𝑏 𝑎𝑧𝑎𝑛 𝑡𝑖𝑚𝑒\n\n𝑃𝑟𝑒𝑝𝑎𝑟𝑒 𝑓𝑜𝑟 𝑝𝑟𝑎𝑦𝑒𝑟\n𝑀𝑎𝑔ℎ𝑟𝑖𝑏 𝑝𝑟𝑎𝑦𝑒𝑟 𝑤𝑖𝑙𝑙 𝑠𝑡𝑎𝑟𝑡 𝑠𝑜𝑜𝑛",
      audio: "https://drive.google.com/uc?id=1mNVwfsTE"
    },
    "Isha": {
      message: "⏰ 𝐼𝑠ℎ𝑎 𝑎𝑧𝑎𝑛 𝑡𝑖𝑚𝑒\n\n𝑃𝑟𝑒𝑝𝑎𝑟𝑒 𝑓𝑜𝑟 𝑝𝑟𝑎𝑦𝑒𝑟\n𝐼𝑠ℎ𝑎 𝑝𝑟𝑎𝑦𝑒𝑟 𝑤𝑖𝑙𝑙 𝑠𝑡𝑎𝑟𝑡 𝑠𝑜𝑜𝑛",
      audio: "https://drive.google.com/uc?id=1mP2HJlKR"
    }
  },

  // 𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠 𝑓𝑜𝑟 𝐷ℎ𝑎𝑘𝑎, 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ
  FALLBACK_TIMES: {
    Fajr: "05:35",
    Dhuhr: "13:00",
    Asr: "16:30",
    Maghrib: "19:05",
    Isha: "20:15"
  },

  onStart: async function({ api }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios || !fs || !path || !cron) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return console.error("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑛𝑜𝑑𝑒-𝑐𝑟𝑜𝑛.");
      }

      // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦
      const cacheDir = path.join(__dirname, 'prayer_cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      // 𝑃𝑟𝑒-𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒𝑠
      for (const [prayerName, config] of Object.entries(this.PRAYER_CONFIG)) {
        const audioPath = path.join(cacheDir, `${prayerName}.mp3`);
        if (!fs.existsSync(audioPath)) {
          try {
            const response = await axios({
              method: 'get',
              url: config.audio,
              responseType: 'stream',
              timeout: 30000
            });

            const writer = fs.createWriteStream(audioPath);
            response.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });
            console.log(`𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 ${prayerName} 𝑎𝑢𝑑𝑖𝑜`);
          } catch (error) {
            console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ${prayerName} 𝑎𝑢𝑑𝑖𝑜:`, error.message);
          }
        }
      }
      
      // 𝑆𝑐ℎ𝑒𝑑𝑢𝑙𝑒 𝑝𝑟𝑎𝑦𝑒𝑟 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠
      await this.schedulePrayerNotifications(api);
      
      // 𝑆𝑐ℎ𝑒𝑑𝑢𝑙𝑒 𝑑𝑎𝑖𝑙𝑦 𝑟𝑒𝑠𝑒𝑡 𝑎𝑡 𝑚𝑖𝑑𝑛𝑖𝑔ℎ𝑡 (𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎 𝑡𝑖𝑚𝑒)
      cron.schedule('0 0 * * *', async () => {
        console.log("𝑅𝑒𝑠𝑐ℎ𝑒𝑑𝑢𝑙𝑖𝑛𝑔 𝑝𝑟𝑎𝑦𝑒𝑟 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑛𝑒𝑤 𝑑𝑎𝑦...");
        await this.schedulePrayerNotifications(api);
      }, {
        scheduled: true,
        timezone: "Asia/Dhaka"
      });

      console.log("𝑃𝑟𝑎𝑦𝑒𝑟 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟𝑠 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
      
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑝𝑟𝑎𝑦𝑒𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛:", error);
    }
  },

  schedulePrayerNotifications: async function(api) {
    try {
      // 𝐺𝑒𝑡 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠
      const timings = await this.getPrayerTimes();
      
      // 𝑆𝑐ℎ𝑒𝑑𝑢𝑙𝑒 𝑒𝑎𝑐ℎ 𝑝𝑟𝑎𝑦𝑒𝑟
      for (const [prayerName, config] of Object.entries(this.PRAYER_CONFIG)) {
        const time = timings[prayerName];
        if (!time) continue;
        
        // 𝐶𝑜𝑛𝑣𝑒𝑟𝑡 𝑡𝑜 𝑐𝑟𝑜𝑛 𝑓𝑜𝑟𝑚𝑎𝑡 (𝐻𝐻:𝑚𝑚 -> 𝑚𝑚 𝐻𝐻 * * *)
        const [hours, minutes] = time.split(':');
        const cronTime = `${minutes} ${hours} * * *`;
        
        cron.schedule(cronTime, async () => {
          console.log(`𝑆𝑒𝑛𝑑𝑖𝑛𝑔 ${prayerName} 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑎𝑡 ${time}`);
          await this.sendPrayerNotification(api, prayerName);
        }, {
          scheduled: true,
          timezone: "Asia/Dhaka"
        });
        
        console.log(`𝑆𝑐ℎ𝑒𝑑𝑢𝑙𝑒𝑑 ${prayerName} 𝑎𝑡 ${time}`);
      }
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑠𝑐ℎ𝑒𝑑𝑢𝑙𝑖𝑛𝑔 𝑝𝑟𝑎𝑦𝑒𝑟 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠:", error);
    }
  },

  getPrayerTimes: async function() {
    try {
      // 𝐹𝑒𝑡𝑐ℎ 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠 𝑓𝑜𝑟 𝐷ℎ𝑎𝑘𝑎, 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1`,
        { timeout: 5000 }
      );
      
      // 𝑅𝑒𝑡𝑢𝑟𝑛 𝑜𝑛𝑙𝑦 𝑡ℎ𝑒 𝑝𝑟𝑎𝑦𝑒𝑟𝑠 𝑤𝑒 𝑛𝑒𝑒𝑑
      const { Fajr, Dhuhr, Asr, Maghrib, Isha } = response.data.data.timings;
      return { Fajr, Dhuhr, Asr, Maghrib, Isha };
      
    } catch (error) {
      console.error('𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠, 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘:', error.message);
      return this.FALLBACK_TIMES;
    }
  },

  sendPrayerNotification: async function(api, prayerName) {
    const config = this.PRAYER_CONFIG[prayerName];
    if (!config) return;
    
    try {
      const cacheDir = path.join(__dirname, 'prayer_cache');
      const audioPath = path.join(cacheDir, `${prayerName}.mp3`);
      
      // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      const messageData = {
        body: config.message,
        attachment: fs.existsSync(audioPath) 
          ? fs.createReadStream(audioPath)
          : undefined
      };

      // 𝑆𝑒𝑛𝑑 𝑡𝑜 𝑎𝑙𝑙 𝑎𝑐𝑡𝑖𝑣𝑒 𝑡ℎ𝑟𝑒𝑎𝑑𝑠
      if (global.data && global.data.allThreadID) {
        global.data.allThreadID.forEach(threadID => {
          api.sendMessage(messageData, threadID);
        });
      }

    } catch (error) {
      console.error(`𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 ${prayerName} 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛:`, error);
      // 𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑡𝑜 𝑡𝑒𝑥𝑡-𝑜𝑛𝑙𝑦 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      if (global.data && global.data.allThreadID) {
        global.data.allThreadID.forEach(threadID => {
          api.sendMessage(config.message, threadID);
        });
      }
    }
  }
};
