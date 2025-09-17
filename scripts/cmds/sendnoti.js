const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "sendnoti",
    aliases: ["notify", "broadcast"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "admin",
    shortDescription: {
      en: "✨ 𝐴𝑑𝑚𝑖𝑛-𝑜𝑛𝑙𝑦 𝑔𝑙𝑜𝑏𝑎𝑙 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑔𝑙𝑜𝑏𝑎𝑙 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑡𝑜 𝑎𝑙𝑙 𝑏𝑜𝑡'𝑠 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠. 𝑆𝑢𝑝𝑝𝑜𝑟𝑡𝑠 𝑡𝑒𝑥𝑡-𝑜𝑛𝑙𝑦 𝑜𝑟 𝑡𝑒𝑥𝑡 𝑤𝑖𝑡ℎ 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡𝑠"
    },
    guide: {
      en: "{p}sendnoti [𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒]\n{p}sendnoti (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒/𝑣𝑖𝑑𝑒𝑜) [𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  onStart: async function({ api, event, args, message, usersData }) {
    try {
      const { threadID, messageReply, type } = event;

      if (args.length === 0 && type !== "message_reply") {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒/𝑣𝑖𝑑𝑒𝑜");
      }

      const name = await usersData.getName(event.senderID);
      const time = moment.tz("Asia/Dhaka").format("📅 𝐷𝐷/𝑀𝑀/𝑌𝑌𝑌𝑌 ⏰ 𝐻𝐻:𝑚𝑚:𝑠𝑠");

      let content = "";
      let attachment = null;

      if (type === "message_reply" && messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        const attachmentData = messageReply.attachments[0];
        content = args.join(" ") || messageReply.body || "";
        
        const response = await axios.get(attachmentData.url, { 
          responseType: 'arraybuffer' 
        });
        
        const ext = attachmentData.type === "photo" ? "jpg" : 
                   attachmentData.type === "video" ? "mp4" : 
                   attachmentData.type === "audio" ? "mp3" : "txt";
        
        const filePath = __dirname + `/cache/sendnoti.${ext}`;
        await fs.writeFile(filePath, Buffer.from(response.data, 'binary'));
        attachment = fs.createReadStream(filePath);
        
      } else {
        content = args.join(" ");
      }

      const allThreads = global.data.allThreadID || [];
      const failedThreads = [];
      let successCount = 0;

      const msgBody = `📢 𝗡𝗼𝘁𝗶𝗰𝗲 𝗳𝗿𝗼𝗺 𝗮𝗱𝗺𝗶𝗻 📢\n━━━━━━━━━━━━━━━━━━\n${content}\n\n👤 𝗔𝗱𝗺𝗶𝗻: ${name}\n${time}`;

      for (const thread of allThreads) {
        if (isNaN(thread) || thread == event.threadID) continue;

        try {
          if (attachment) {
            await api.sendMessage({
              body: msgBody,
              attachment: attachment
            }, thread);
          } else {
            await api.sendMessage(msgBody, thread);
          }
          
          successCount++;
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑡𝑜 𝑡ℎ𝑟𝑒𝑎𝑑 ${thread}:`, error);
          failedThreads.push(thread);
        }
      }

      const resultMessage = `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑡𝑜: ${successCount} 𝑔𝑟𝑜𝑢𝑝𝑠`;
      const failMessage = failedThreads.length > 0 ? 
        `\n❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑡𝑜 ${failedThreads.length} 𝑔𝑟𝑜𝑢𝑝(𝑠).` : "";

      await message.reply(resultMessage + failMessage);

      // Clean up attachment file if exists
      if (attachment) {
        const filePath = __dirname + `/cache/sendnoti.*`;
        const files = fs.readdirSync(__dirname + "/cache").filter(f => f.startsWith("sendnoti."));
        for (const file of files) {
          fs.unlinkSync(__dirname + `/cache/${file}`);
        }
      }

    } catch (error) {
      console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑠𝑒𝑛𝑑𝑛𝑜𝑡𝑖 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
      await message.reply("⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠.");
    }
  }
};
