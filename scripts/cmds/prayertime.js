const axios = require("axios");

module.exports = {
  config: {
    name: "salattime",
    aliases: ["prayertime", "namaztime"],
    version: "1.3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🕌 𝐺𝑒𝑡 𝑎𝑐𝑐𝑢𝑟𝑎𝑡𝑒 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠 𝑓𝑜𝑟 𝑎𝑛𝑦 𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "🕌 𝐺𝑒𝑡 𝑎𝑐𝑐𝑢𝑟𝑎𝑡𝑒 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠 𝑓𝑜𝑟 𝑎𝑛𝑦 𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛 𝑤𝑜𝑟𝑙𝑑𝑤𝑖𝑑𝑒"
    },
    guide: {
      en: "{𝑝}𝑠𝑎𝑙𝑎𝑡𝑡𝑖𝑚𝑒 [𝑐𝑖𝑡𝑦] 𝑜𝑟 [𝑐𝑖𝑡𝑦, 𝑐𝑜𝑢𝑛𝑡𝑟𝑦]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;
      let processingMsg;
      
      // 𝐺𝑒𝑡 𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛 𝑓𝑟𝑜𝑚 𝑎𝑟𝑔𝑢𝑚𝑒𝑛𝑡𝑠 𝑜𝑟 𝑢𝑠𝑒 𝑑𝑒𝑓𝑎𝑢𝑙𝑡
      const location = args.join(" ") || "𝐷ℎ𝑎𝑘𝑎";
      
      // 𝑆𝑒𝑛𝑑 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      processingMsg = await api.sendMessage(
        `⏳ 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠 𝑓𝑜𝑟 ${location}...`,
        threadID
      );

      // 𝐺𝑒𝑡 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠 𝑓𝑟𝑜𝑚 𝐴𝑃𝐼
      const apiUrl = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(location)}`;
      const response = await axios.get(apiUrl, { 
        timeout: 10000,
        headers: {
          '𝑈𝑠𝑒𝑟-𝐴𝑔𝑒𝑛𝑡': '𝑀𝑜𝑧𝑖𝑙𝑙𝑎/5.0 (𝑊𝑖𝑛𝑑𝑜𝑤𝑠 𝑁𝑇 10.0; 𝑊𝑖𝑛64; 𝑥64) 𝐴𝑝𝑝𝑙𝑒𝑊𝑒𝑏𝐾𝑖𝑡/537.36 (𝐾𝐻𝑇𝑀𝐿, 𝑙𝑖𝑘𝑒 𝐺𝑒𝑐𝑘𝑜) 𝐶ℎ𝑟𝑜𝑚𝑒/91.0.4472.124 𝑆𝑎𝑓𝑎𝑟𝑖/537.36'
        }
      });
      
      if (!response.data || !response.data.data) {
        throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
      }
      
      const prayerData = response.data.data;
      const timings = prayerData.timings;
      const dateInfo = prayerData.date;
      const meta = prayerData.meta;
      
      // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑓𝑜𝑟𝑚𝑎𝑡𝑡𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      let prayerMessage = "🕌 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑃𝑟𝑎𝑦𝑒𝑟 𝑇𝑖𝑚𝑒𝑠 🕌\n\n";
      prayerMessage += `📍 𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛: ${location}\n`;
      prayerMessage += `📅 𝐷𝑎𝑡𝑒: ${dateInfo.readable}\n`;
      prayerMessage += `📅 𝐻𝑖𝑗𝑟𝑖 𝐷𝑎𝑡𝑒: ${dateInfo.hijri.day} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year}\n\n`;
      
      prayerMessage += "⏰ 𝑃𝑟𝑎𝑦𝑒𝑟 𝑆𝑐ℎ𝑒𝑑𝑢𝑙𝑒:\n";
      prayerMessage += `• 𝐹𝑎𝑗𝑟: ${timings.Fajr}\n`;
      prayerMessage += `• 𝑆𝑢𝑛𝑟𝑖𝑠𝑒: ${timings.Sunrise}\n`;
      prayerMessage += `• 𝐷ℎ𝑢ℎ𝑟: ${timings.Dhuhr}\n`;
      prayerMessage += `• 𝐴𝑠𝑟: ${timings.Asr}\n`;
      prayerMessage += `• 𝑀𝑎𝑔ℎ𝑟𝑖𝑏: ${timings.Maghrib}\n`;
      prayerMessage += `• 𝐼𝑠ℎ𝑎: ${timings.Isha}\n\n`;
      
      prayerMessage += "🌙 𝐴𝑑𝑑𝑖𝑡𝑖𝑜𝑛𝑎𝑙 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛:\n";
      prayerMessage += `• 𝑄𝑖𝑏𝑙𝑎 𝐷𝑖𝑟𝑒𝑐𝑡𝑖𝑜𝑛: ${meta.qiblaDirection}° 𝑓𝑟𝑜𝑚 𝑁𝑜𝑟𝑡ℎ\n`;
      prayerMessage += `• 𝐶𝑎𝑙𝑐𝑢𝑙𝑎𝑡𝑖𝑜𝑛 𝑀𝑒𝑡ℎ𝑜𝑑: ${meta.method.name}\n`;
      prayerMessage += `• 𝑇𝑖𝑚𝑒𝑧𝑜𝑛𝑒: ${meta.timezone}`;

      // 𝑆𝑒𝑛𝑑 𝑡ℎ𝑒 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠
      await api.sendMessage(prayerMessage, threadID, messageID);
      
      // 𝐷𝑒𝑙𝑒𝑡𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      if (processingMsg) {
        api.unsendMessage(processingMsg.messageID);
      }
      
    } catch (error) {
      console.error("𝑃𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      
      // 𝐷𝑒𝑙𝑒𝑡𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑖𝑓 𝑒𝑥𝑖𝑠𝑡𝑠
      if (processingMsg) {
        api.unsendMessage(processingMsg.messageID);
      }
      
      // 𝑆𝑒𝑛𝑑 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑝𝑟𝑎𝑦𝑒𝑟 𝑡𝑖𝑚𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦:\n\n";
      errorMessage += "1. 𝐶ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛 𝑠𝑝𝑒𝑙𝑙𝑖𝑛𝑔\n";
      errorMessage += "2. 𝑇𝑟𝑦 𝑎 𝑛𝑒𝑎𝑟𝑏𝑦 𝑚𝑎𝑗𝑜𝑟 𝑐𝑖𝑡𝑦 (𝑒.𝑔., '𝐿𝑜𝑛𝑑𝑜𝑛' 𝑖𝑛𝑠𝑡𝑒𝑎𝑑 𝑜𝑓 '𝐿𝑛𝑑𝑛')\n";
      errorMessage += "3. 𝑈𝑠𝑒 𝑐𝑖𝑡𝑦 𝑎𝑛𝑑 𝑐𝑜𝑢𝑛𝑡𝑟𝑦 𝑓𝑜𝑟𝑚𝑎𝑡 (𝑒.𝑔., '𝑃𝑎𝑟𝑖𝑠, 𝐹𝑟𝑎𝑛𝑐𝑒')\n";
      errorMessage += "4. 𝐸𝑛𝑠𝑢𝑟𝑒 𝑦𝑜𝑢 ℎ𝑎𝑣𝑒 𝑎𝑛 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛\n";
      errorMessage += "5. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛 𝑎 𝑓𝑒𝑤 𝑚𝑖𝑛𝑢𝑡𝑒𝑠\n\n";
      errorMessage += "𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑠𝑎𝑙𝑎𝑡𝑡𝑖𝑚𝑒 𝑁𝑒𝑤 𝑌𝑜𝑟𝑘";
      
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
