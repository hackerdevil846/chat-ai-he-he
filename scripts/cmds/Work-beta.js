module.exports = {
  config: {
    name: "job",
    aliases: ["work", "kaj"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑒𝑐𝑜𝑛𝑜𝑚𝑦",
    shortDescription: {
      en: "𝐸𝑎𝑟𝑛 𝑐𝑜𝑖𝑛𝑠 𝑏𝑦 𝑤𝑜𝑟𝑘𝑖𝑛𝑔"
    },
    longDescription: {
      en: "𝑊𝑜𝑟𝑘 𝑡𝑜 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦 𝑖𝑛 𝑡ℎ𝑒 𝑒𝑐𝑜𝑛𝑜𝑚𝑦 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    guide: {
      en: "{p}job"
    }
  },

  langs: {
    en: {
      cooldown: "𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑤𝑜𝑟𝑘𝑒𝑑, 𝑐𝑜𝑚𝑒 𝑏𝑎𝑐𝑘 𝑖𝑛: %1 𝑚𝑖𝑛𝑢𝑡𝑒(𝑠) %2 𝑠𝑒𝑐𝑜𝑛𝑑(𝑠)."
    }
  },

  onStart: async function({ event, message, usersData, getLang }) {
    try {
      const cooldownTime = 5 * 60 * 1000; // 5 minutes cooldown
      const userData = await usersData.get(event.senderID);
      const userJobData = userData.data || {};
      
      if (userJobData.work2Time && (Date.now() - userJobData.work2Time) < cooldownTime) {
        const timeLeft = cooldownTime - (Date.now() - userJobData.work2Time);
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        return message.reply(getLang("cooldown", minutes, seconds));
      }

      const menu = `𝐶𝑜𝑖𝑛 𝐸𝑎𝑟𝑛 𝐽𝑜𝑏 𝐶𝑒𝑛𝑡𝑒𝑟

1. 𝐼𝑛𝑑𝑢𝑠𝑡𝑟𝑖𝑎𝑙 𝑧𝑜𝑛𝑒 𝑤𝑜𝑟𝑘
2. 𝑆𝑒𝑟𝑣𝑖𝑐𝑒 𝑎𝑟𝑒𝑎 𝑤𝑜𝑟𝑘
3. 𝑂𝑖𝑙 𝑓𝑖𝑒𝑙𝑑 𝑤𝑜𝑟𝑘
4. 𝑀𝑖𝑛𝑖𝑛𝑔 𝑤𝑜𝑟𝑘
5. 𝐷𝑖𝑔𝑔𝑖𝑛𝑔 𝑤𝑜𝑟𝑘
6. 𝑆𝑝𝑒𝑐𝑖𝑎𝑙 𝑗𝑜𝑏
7. 𝑈𝑝𝑑𝑎𝑡𝑒 𝑠𝑜𝑜𝑛...

⚡️𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎 𝑗𝑜𝑏`;

      await message.reply(menu);
      
      // Store the cooldown time
      userJobData.work2Time = Date.now();
      await usersData.set(event.senderID, { data: userJobData });

    } catch (error) {
      console.error("𝐽𝑜𝑏 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑗𝑜𝑏 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
  },

  onChat: async function({ event, message, usersData, api }) {
    try {
      if (event.type === "message_reply") {
        const userData = await usersData.get(event.senderID);
        const userJobData = userData.data || {};
        
        if (!userJobData.work2Time) return;
        
        // Job arrays
        const industrialJobs = [
          'ℎ𝑖𝑟𝑒𝑑 𝑠𝑡𝑎𝑓𝑓',
          'ℎ𝑜𝑡𝑒𝑙 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟',
          '𝑝𝑜𝑤𝑒𝑟 𝑝𝑙𝑎𝑛𝑡 𝑤𝑜𝑟𝑘𝑒𝑟',
          '𝑟𝑒𝑠𝑡𝑎𝑢𝑟𝑎𝑛𝑡 𝑐ℎ𝑒𝑓',
          '𝑤𝑜𝑟𝑘𝑒𝑟'
        ];
        
        const serviceJobs = [
          '𝑝𝑙𝑢𝑚𝑏𝑒𝑟',
          '𝐴𝐶 𝑟𝑒𝑝𝑎𝑖𝑟 𝑓𝑜𝑟 𝑛𝑒𝑖𝑔ℎ𝑏𝑜𝑟',
          '𝑚𝑢𝑙𝑡𝑖-𝑙𝑒𝑣𝑒𝑙 𝑠𝑎𝑙𝑒𝑠',
          '𝑓𝑙𝑦𝑒𝑟 𝑑𝑖𝑠𝑡𝑟𝑖𝑏𝑢𝑡𝑖𝑜𝑛',
          '𝑠ℎ𝑖𝑝𝑝𝑒𝑟',
          '𝑐𝑜𝑚𝑝𝑢𝑡𝑒𝑟 𝑟𝑒𝑝𝑎𝑖𝑟',
          '𝑡𝑜𝑢𝑟 𝑔𝑢𝑖𝑑𝑒',
          '𝑏𝑜𝑎𝑡 𝑤𝑜𝑟𝑘'
        ];
        
        const oilFieldJobs = [
          '𝑒𝑎𝑟𝑛𝑒𝑑 13 𝑏𝑎𝑟𝑟𝑒𝑙𝑠 𝑜𝑓 𝑜𝑖𝑙',
          '𝑒𝑎𝑟𝑛𝑒𝑑 8 𝑏𝑎𝑟𝑟𝑒𝑙𝑠 𝑜𝑓 𝑜𝑖𝑙',
          '𝑒𝑎𝑟𝑛𝑒𝑑 9 𝑏𝑎𝑟𝑟𝑒𝑙𝑠 𝑜𝑓 𝑜𝑖𝑙',
          '𝑠𝑡𝑜𝑙𝑒 𝑜𝑖𝑙',
          '𝑠𝑜𝑙𝑑 𝑜𝑖𝑙 𝑎𝑛𝑑 𝑤𝑎𝑡𝑒𝑟 𝑚𝑖𝑥𝑡𝑢𝑟𝑒'
        ];
        
        const miningJobs = [
          '𝑖𝑟𝑜𝑛 𝑜𝑟𝑒',
          '𝑔𝑜𝑙𝑑 𝑜𝑟𝑒',
          '𝑐𝑜𝑎𝑙 𝑜𝑟𝑒',
          '𝑙𝑒𝑎𝑑 𝑜𝑟𝑒',
          '𝑐𝑜𝑝𝑝𝑒𝑟 𝑜𝑟𝑒',
          '𝑜𝑖𝑙 𝑜𝑟𝑒'
        ];
        
        const diggingJobs = [
          '𝑑𝑖𝑎𝑚𝑜𝑛𝑑',
          '𝑔𝑜𝑙𝑑',
          '𝑐𝑜𝑎𝑙',
          '𝑒𝑚𝑒𝑟𝑎𝑙𝑑',
          '𝑖𝑟𝑜𝑛',
          '𝑜𝑟𝑑𝑖𝑛𝑎𝑟𝑦 𝑠𝑡𝑜𝑛𝑒',
          '𝑙𝑎𝑧𝑦',
          '𝑏𝑙𝑢𝑒𝑠𝑡𝑜𝑛𝑒'
        ];
        
        const specialJobs = [
          '𝑉𝐼𝑃 𝑔𝑢𝑒𝑠𝑡',
          '𝑝𝑎𝑡𝑖𝑒𝑛𝑡',
          '𝑜𝑠𝑡𝑟𝑖𝑐ℎ',
          '23 𝑦𝑒𝑎𝑟 𝑜𝑙𝑑 𝑓𝑜𝑜𝑙',
          '𝑝𝑎𝑡𝑟𝑜𝑛',
          '92 𝑦𝑒𝑎𝑟 𝑜𝑙𝑑 𝑡𝑦𝑐𝑜𝑜𝑛',
          '12 𝑦𝑒𝑎𝑟 𝑜𝑙𝑑 𝑏𝑜𝑦'
        ];

        const industrialJob = industrialJobs[Math.floor(Math.random() * industrialJobs.length)];
        const serviceJob = serviceJobs[Math.floor(Math.random() * serviceJobs.length)];
        const oilFieldJob = oilFieldJobs[Math.floor(Math.random() * oilFieldJobs.length)];
        const miningJob = miningJobs[Math.floor(Math.random() * miningJobs.length)];
        const diggingJob = diggingJobs[Math.floor(Math.random() * diggingJobs.length)];
        const specialJob = specialJobs[Math.floor(Math.random() * specialJobs.length)];

        // Random coin amounts
        const industrialCoins = Math.floor(Math.random() * 401) + 200;
        const serviceCoins = Math.floor(Math.random() * 801) + 200;
        const oilFieldCoins = Math.floor(Math.random() * 401) + 200;
        const miningCoins = Math.floor(Math.random() * 601) + 200;
        const diggingCoins = Math.floor(Math.random() * 201) + 200;
        const specialCoins = Math.floor(Math.random() * 801) + 200;

        let msg = "";
        let coinsEarned = 0;

        switch(event.body) {
          case "1": 
            msg = `⚡️𝑌𝑜𝑢 𝑤𝑜𝑟𝑘𝑒𝑑 𝑖𝑛 𝑖𝑛𝑑𝑢𝑠𝑡𝑟𝑖𝑎𝑙 𝑧𝑜𝑛𝑒 𝑎𝑠 ${industrialJob} 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛𝑒𝑑 ${industrialCoins}$`;
            coinsEarned = industrialCoins;
            break;
          case "2": 
            msg = `⚡️𝑌𝑜𝑢 𝑤𝑜𝑟𝑘𝑒𝑑 𝑖𝑛 𝑠𝑒𝑟𝑣𝑖𝑐𝑒 𝑎𝑟𝑒𝑎 𝑎𝑠 ${serviceJob} 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛𝑒𝑑 ${serviceCoins}$`;
            coinsEarned = serviceCoins;
            break;
          case "3": 
            msg = `⚡️𝑌𝑜𝑢 𝑤𝑜𝑟𝑘𝑒𝑑 𝑖𝑛 𝑜𝑖𝑙 𝑓𝑖𝑒𝑙𝑑: ${oilFieldJob} 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛𝑒𝑑 ${oilFieldCoins}$`;
            coinsEarned = oilFieldCoins;
            break;
          case "4": 
            msg = `⚡️𝑌𝑜𝑢 𝑚𝑖𝑛𝑒𝑑 ${miningJob} 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛𝑒𝑑 ${miningCoins}$`;
            coinsEarned = miningCoins;
            break;
          case "5": 
            msg = `⚡️𝑌𝑜𝑢 𝑑𝑢𝑔 𝑢𝑝 ${diggingJob} 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛𝑒𝑑 ${diggingCoins}$`;
            coinsEarned = diggingCoins;
            break;
          case "6": 
            msg = `⚡️𝑌𝑜𝑢 𝑤𝑒𝑟𝑒 𝑐ℎ𝑜𝑠𝑒𝑛 𝑎𝑠 ${specialJob} 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛𝑒𝑑 ${specialCoins}$`;
            coinsEarned = specialCoins;
            break;
          case "7": 
            msg = "⚡️ 𝑈𝑝𝑑𝑎𝑡𝑒 𝑠𝑜𝑜𝑛..."; 
            break;
          default: 
            return;
        };

        if (coinsEarned > 0) {
          await usersData.increaseMoney(event.senderID, coinsEarned);
        }
        
        await message.reply(msg);
      }
    } catch (error) {
      console.error("𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
      api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑗𝑜𝑏 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛", event.threadID);
    }
  }
};
