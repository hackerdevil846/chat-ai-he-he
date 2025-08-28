const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "avt",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "tools",
    shortDescription: {
      en: "𝑼𝒔𝒆𝒓 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂 𝒋𝒂𝒃𝒆"
    },
    longDescription: {
      en: "𝑮𝒆𝒕 𝒖𝒔𝒆𝒓 𝒐𝒓 𝒈𝒓𝒐𝒖𝒑 𝒂𝒗𝒂𝒕𝒂𝒓 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    guide: {
      en: "{p}avt [box/id/link/user]"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      if (!args[0]) {
        const helpMessage = `🎭=== 𝑭𝑨𝑪𝑬𝑩𝑶𝑶𝑲 𝑨𝑽𝑻𝑨𝑹 ===🎭

🎭→ ${global.config.PREFIX}avt box - 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂
🎭→ ${global.config.PREFIX}avt id [𝒊𝒅] - 𝒊𝒅 𝒅𝒊𝒚𝒆 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂
🎭→ ${global.config.PREFIX}avt user - 𝒏𝒊𝒋𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂
🎭→ ${global.config.PREFIX}avt user [@𝒎𝒆𝒏𝒕𝒊𝒐𝒏] - 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒂 𝒖𝒔𝒆𝒓 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂

𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
        return message.reply(helpMessage);
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imagePath = path.join(cacheDir, `avt_${Date.now()}.png`);

      if (args[0] === "box") {
        try {
          let threadID = event.threadID;
          let threadName = "𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑";
          
          if (args[1]) {
            threadID = args[1];
            try {
              const threadInfo = await api.getThreadInfo(threadID);
              threadName = threadInfo.threadName || "𝒖𝒏𝒌𝒏𝒐𝒘𝒏 𝒈𝒓𝒐𝒖𝒑";
            } catch {
              threadName = "𝒖𝒏𝒌𝒏𝒐𝒘𝒏 𝒈𝒓𝒐𝒖𝒑";
            }
          } else {
            const threadInfo = await api.getThreadInfo(threadID);
            threadName = threadInfo.threadName || "𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑";
          }
          
          // Download group avatar
          const response = await axios.get(`https://graph.facebook.com/${threadID}/picture?width=720&height=720`, {
            responseType: 'arraybuffer'
          });
          
          fs.writeFileSync(imagePath, Buffer.from(response.data));
          
          await message.reply({
            body: `✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒗𝒂𝒕𝒂𝒓: ${threadName}`,
            attachment: fs.createReadStream(imagePath)
          });
          
          // Clean up
          fs.unlinkSync(imagePath);
          
        } catch (e) {
          await message.reply("❌ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂");
        }
      }
      else if (args[0] === "id") {
        try {
          const id = args[1];
          if (!id) return message.reply("❌ 𝑼𝒔𝒆𝒓 𝑰𝑫 𝒅𝒊𝒚𝒆𝒏 𝒑𝒍𝒆𝒂𝒔𝒆");
          
          // Download user avatar
          const response = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720`, {
            responseType: 'arraybuffer'
          });
          
          fs.writeFileSync(imagePath, Buffer.from(response.data));
          
          await message.reply({
            body: `✅ 𝑼𝒔𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓: ${id}`,
            attachment: fs.createReadStream(imagePath)
          });
          
          // Clean up
          fs.unlinkSync(imagePath);
          
        } catch (e) {
          await message.reply("❌ 𝑼𝒔𝒆𝒓 𝒆𝒓 𝒇𝒐𝒕𝒐 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂");
        }
      }
      else if (args[0] === "user") {
        try {
          let id = event.senderID;
          let name = "𝒀𝒐𝒖𝒓";
          
          if (args[1] && event.mentions) {
            id = Object.keys(event.mentions)[0];
            const userInfo = await api.getUserInfo(id);
            name = userInfo[id]?.name || "𝑼𝒔𝒆𝒓";
          }
          
          // Download user avatar
          const response = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720`, {
            responseType: 'arraybuffer'
          });
          
          fs.writeFileSync(imagePath, Buffer.from(response.data));
          
          await message.reply({
            body: `✅ ${name} 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓`,
            attachment: fs.createReadStream(imagePath)
          });
          
          // Clean up
          fs.unlinkSync(imagePath);
          
        } catch (e) {
          await message.reply("❌ 𝑨𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂");
        }
      }
      else {
        await message.reply(`❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒐𝒑𝒕𝒊𝒐𝒏. 𝑼𝒔𝒆 ${global.config.PREFIX}avt 𝒇𝒐𝒓 𝒉𝒆𝒍𝒑`);
      }

    } catch (error) {
      console.error("Avatar command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
