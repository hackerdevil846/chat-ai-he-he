const axios = require('axios');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "sharecmd",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝑆ℎ𝑎𝑟𝑒 𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑚𝑜𝑑𝑢𝑙𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑢𝑠𝑒𝑟"
    },
    longDescription: {
      en: "𝑆ℎ𝑎𝑟𝑒 𝑎 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑚𝑜𝑑𝑢𝑙𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑢𝑠𝑒𝑟 𝑣𝑖𝑎 𝑃𝑎𝑠𝑡𝑒𝑏𝑖𝑛"
    },
    guide: {
      en: "{p}sharecmd [𝑟𝑒𝑝𝑙𝑦 𝑜𝑟 𝑡𝑎𝑔 𝑜𝑟 𝑙𝑒𝑎𝑣𝑒 𝑏𝑙𝑎𝑛𝑘] + 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑎𝑚𝑒"
    },
    countDown: 0,
    dependencies: {
      "axios": "",
      "fs": "",
      "request": "",
      "cheerio": "",
      "moment-timezone": "",
      "pastebin-api": ""
    }
  },

  onStart: async function({ api, event, args }) {
    const permission = global.config.ADMINBOT;
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!", event.threadID, event.messageID);
    }

    const picture = (await axios.get(`https://quatangabc.com/vnt_upload/File/Image/share_1.jpg`, { responseType: "stream"})).data;
    const hmm = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
    
    const uid = event.type == 'message_reply' ? 
                event.messageReply.senderID : 
                Object.keys(event.mentions)[0] ? 
                Object.keys(event.mentions)[0] : 
                args[0] ? args[0] : event.senderID;

    const { threadID, messageID, messageReply, type } = event;
    const name = args[0];
    
    if (type == "message_reply") {
      var text = messageReply.body;
    }

    if (!text && !name) {
      return api.sendMessage({
        body: `🌸--「 𝑆ℎ𝑎𝑟𝑒 𝑃𝑟𝑖𝑣𝑎𝑡𝑒 𝑀𝑜𝑑𝑢𝑙𝑒 」--🌸
◆━━━━━━━━━━━━━━━━━◆
⏰ 𝑇𝑖𝑚𝑒: ${hmm} 
📌 𝑌𝑜𝑢 𝑐𝑎𝑛 𝑟𝑒𝑝𝑙𝑦, 𝑡𝑎𝑔 𝑡ℎ𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠ℎ𝑎𝑟𝑒 𝑤𝑖𝑡ℎ`, 
        attachment: picture
      }, threadID, messageID);
    }

    if (!text && name) {
      const filePath = `./modules/commands/${args[0]}.js`;
      
      fs.readFile(filePath, "utf-8", async (err, data) => {
        if (err) {
          return api.sendMessage({
            body: `📝==「 𝑆𝐻𝐴𝑅𝐸 𝑃𝑅𝐼𝑉𝐴𝑇𝐸 𝑀𝑂𝐷𝑈𝐿𝐸 」==📝
━━━━━━━━━━━━━━━━━━━━━
⏰ 𝑇𝑖𝑚𝑒: ${hmm} 
𝐼'𝑚 𝑠𝑜𝑟𝑟𝑦, 𝑡ℎ𝑒 𝑚𝑜𝑑𝑢𝑙𝑒 '${args[0]}' 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠ℎ𝑎𝑟𝑒 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡 𝑜𝑛 ${global.config.BOTNAME}'𝑠 𝑠𝑦𝑠𝑡𝑒𝑚`, 
            attachment: picture
          }, threadID, messageID);
        }

        try {
          const { PasteClient } = require('pastebin-api');
          const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
          
          async function pastepin(name) {
            const url = await client.createPaste({
              code: data,
              expireDate: 'N',
              format: "javascript",
              name: name,
              publicity: 1
            });
            var id = url.split('/')[3];
            return 'https://pastebin.com/raw/' + id;
          }
          
          const link = await pastepin(args[1] || 'noname');
          
          api.sendMessage(`𝐴𝑡 ${hmm} 𝑠ℎ𝑎𝑟𝑒𝑑 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 |${args.join("")}|`, threadID, messageID);
          
          api.sendMessage({
            body: `${hmm}
𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑: ${link} 
𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒: ${args.join("")}`,
            attachment: picture
          }, uid);
          
        } catch (error) {
          console.error(error);
          api.sendMessage("𝐸𝑟𝑟𝑜𝑟 𝑠ℎ𝑎𝑟𝑖𝑛𝑔 𝑡ℎ𝑒 𝑚𝑜𝑑𝑢𝑙𝑒", threadID, messageID);
        }
      });
    }
  }
};
