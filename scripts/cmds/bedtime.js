module.exports = {
  config: {
    name: "bedtime",
    version: "3.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "group",
    shortDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑠𝑡𝑖𝑐𝑘𝑒𝑟𝑠 𝑎𝑛𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑟 𝑏𝑒𝑑𝑡𝑖𝑚𝑒"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑠𝑒𝑛𝑑𝑠 𝑠𝑡𝑖𝑐𝑘𝑒𝑟𝑠 𝑎𝑛𝑑 𝑣𝑖𝑑𝑒𝑜𝑠 𝑤ℎ𝑒𝑛 𝑢𝑠𝑒𝑟𝑠 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑏𝑒𝑑𝑡𝑖𝑚𝑒-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑝ℎ𝑟𝑎𝑠𝑒𝑠"
    },
    guide: {
      en: "{p}bedtime [𝑜𝑛/𝑜𝑓𝑓]"
    },
    countDown: 2,
    dependencies: {
      "axios": "",
      "request": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  onStart: async function({ threadsData, event, api, getText }) {
    try {
      const { threadID, messageID } = event;
      let data = await threadsData.get(threadID);
      
      if (typeof data.bedtimeAutoResponse === "undefined") 
        data.bedtimeAutoResponse = true;
      else 
        data.bedtimeAutoResponse = !data.bedtimeAutoResponse;
      
      await threadsData.set(threadID, data);
      
      return api.sendMessage(
        `${data.bedtimeAutoResponse ? getText("on") : getText("off")} ${getText("successText")}`, 
        threadID, 
        messageID
      );
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑢𝑝𝑑𝑎𝑡𝑖𝑛𝑔 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠", event.threadID, event.messageID);
    }
  },

  onChat: async function({ event, api, threadsData, usersData }) {
    try {
      const axios = require('axios');
      const request = require('request');
      const fs = require("fs-extra");
      const moment = require("moment-timezone");
      
      // Use Asia/Dhaka timezone for Bangladesh
      const time = moment.tz("Asia/Dhaka").format("D/MM/YYYY || HH:mm:ss");
      let day = moment.tz('Asia/Dhaka').format('dddd');
      
      const dayMap = {
        'Sunday': '𝑆𝑢𝑛𝑑𝑎𝑦',
        'Monday': '𝑀𝑜𝑛𝑑𝑎𝑦',
        'Tuesday': '𝑇𝑢𝑒𝑠𝑑𝑎𝑦',
        'Wednesday': '𝑊𝑒𝑑𝑛𝑒𝑠𝑑𝑎𝑦',
        'Thursday': '𝑇ℎ𝑢𝑟𝑠𝑑𝑎𝑦',
        'Friday': '𝐹𝑟𝑖𝑑𝑎𝑦',
        'Saturday': '𝑆𝑎𝑡𝑢𝑟𝑑𝑎𝑦'
      };
      day = dayMap[day] || day;

      const KEY = ["bedtime", "going to bed", "time for bed", "good night", "sleep time", "time to sleep", "sleep now"];

      let data = await threadsData.get(event.threadID);
      if (typeof data.bedtimeAutoResponse === "undefined" || data.bedtimeAutoResponse === false) 
        return;

      if (KEY.includes(event.body.toLowerCase())) {
        let stickerData = ["526214684778630", "526220108111421","526214684778630","526220108111421","526220308111401","526220484778050","526220691444696","526220814778017","526220978111334","526221104777988","526221318111300","526221564777942","526221711444594","526221971444568","2523892817885618","2523892964552270","2523893081218925","2523893217885578","2523893384552228","2523892544552312","2523892391218994","2523891461219087","2523891767885723","2523891204552446","2523890691219164","2523890981219135","2523890374552529","2523889681219265","2523889851219248","2523890051219228","2523886944552872","2523887171219516","2523888784552688","2523888217886078","2523888534552713","2523887371219496","2523887771219456","2523887571219476"];
        let sticker = stickerData[Math.floor(Math.random() * stickerData.length)];
        
        let textData = ["𝐻𝑎𝑝𝑝𝑦 𝑑𝑟𝑒𝑎𝑚𝑠!", "𝑆𝑤𝑒𝑒𝑡 𝑑𝑟𝑒𝑎𝑚𝑠!", "𝑆𝑙𝑒𝑒𝑝 𝑡𝑖𝑔ℎ𝑡!", "𝐺𝑜𝑜𝑑 𝑛𝑖𝑔ℎ𝑡!"];
        let text = textData[Math.floor(Math.random() * textData.length)];

        let hours = parseInt(moment().tz("Asia/Dhaka").format("HH"));
        let session = (
          hours > 0 && hours <= 4 ? "𝑙𝑎𝑡𝑒 𝑛𝑖𝑔ℎ𝑡" :
          hours > 4 && hours <= 7 ? "𝑒𝑎𝑟𝑙𝑦 𝑚𝑜𝑟𝑛𝑖𝑛𝑔" :
          hours > 7 && hours <= 10 ? "𝑚𝑜𝑟𝑛𝑖𝑛𝑔" :
          hours > 10 && hours <= 12 ? "𝑙𝑎𝑡𝑒 𝑚𝑜𝑟𝑛𝑖𝑛𝑔" :
          hours > 12 && hours <= 17 ? "𝑎𝑓𝑡𝑒𝑟𝑛𝑜𝑜𝑛" :
          hours > 17 && hours <= 18 ? "𝑒𝑎𝑟𝑙𝑦 𝑒𝑣𝑒𝑛𝑖𝑛𝑔" :
          hours > 18 && hours <= 21 ? "𝑒𝑣𝑒𝑛𝑖𝑛𝑔" :
          hours > 21 && hours <= 24 ? "𝑛𝑖𝑔ℎ𝑡" : "𝑒𝑟𝑟𝑜𝑟"
        );

        let name = await usersData.getName(event.senderID);
        
        let videoLinks = [
          "https://i.imgur.com/zyYDajr.mp4",
          "https://i.imgur.com/I98aB1o.mp4",
          "https://i.imgur.com/6oJIcHq.mp4",
        ];

        let videoUrl = videoLinks[Math.floor(Math.random() * videoLinks.length)];
        let videoPath = __dirname + "/cache/bedtime_video.mp4";

        await new Promise((resolve, reject) => {
          request(encodeURI(videoUrl))
            .pipe(fs.createWriteStream(videoPath))
            .on("close", resolve)
            .on("error", reject);
        });

        await api.sendMessage({
          body: `💖🏩『 𝐵𝐸𝐷𝑇𝐼𝑀𝐸 』🏩💖\n━━━━━━━━━━━━━\n[👤] 𝐺𝑜𝑜𝑑 𝑛𝑖𝑔ℎ𝑡 ${name}, 𝑠𝑙𝑒𝑒𝑝 𝑤𝑒𝑙𝑙 𝑎𝑛𝑑 𝑠𝑤𝑒𝑒𝑡 𝑑𝑟𝑒𝑎𝑚𝑠! 💤💤\n[⏳] 𝑇𝑖𝑚𝑒: ${day} ${time} (𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ 𝑇𝑖𝑚𝑒)`,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID);

        fs.unlinkSync(videoPath);

        await api.sendMessage({
          sticker: sticker
        }, event.threadID);
      }
    } catch (error) {
      console.error(error);
    }
  },

  languages: {
    en: {
      on: "𝑜𝑛",
      off: "𝑜𝑓𝑓",
      successText: "𝑏𝑒𝑑𝑡𝑖𝑚𝑒 𝑎𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑢𝑝𝑑𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!"
    }
  }
};
