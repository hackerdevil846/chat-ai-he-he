const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "setallbox",
    version: "1.1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝑪𝒉𝒂𝒏𝒈𝒆 𝒗𝒂𝒓𝒊𝒐𝒖𝒔 𝒈𝒓𝒐𝒖𝒑 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔"
    },
    longDescription: {
      en: "𝑴𝒂𝒏𝒂𝒈𝒆 𝒈𝒓𝒐𝒖𝒑 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔 𝒍𝒊𝒌𝒆 𝒆𝒎𝒐𝒋𝒊, 𝒏𝒂𝒎𝒆, 𝒂𝒗𝒂𝒕𝒂𝒓, 𝒄𝒐𝒍𝒐𝒓, 𝒆𝒕𝒄."
    },
    guide: {
      en: "{p}setallbox [emoji/Bname/rcolor/name/avt/poll/QTV] [args]"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      if (!args[0]) {
        const helpMessage = `🎭 𝑺𝒆𝒕𝒂𝒍𝒍𝒃𝒐𝒙 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 🎭

🔹 ${global.config.PREFIX}setallbox emoji [𝒆𝒎𝒐𝒋𝒊] - 𝑪𝒉𝒂𝒏𝒈𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆𝒎𝒐𝒋𝒊
🔹 ${global.config.PREFIX}setallbox Bname [𝒏𝒂𝒎𝒆] - 𝑪𝒉𝒂𝒏𝒈𝒆 𝒈𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆
🔹 ${global.config.PREFIX}setallbox rcolor - 𝑹𝒂𝒏𝒅𝒐𝒎 𝒈𝒓𝒐𝒖𝒑 𝒄𝒐𝒍𝒐𝒓
🔹 ${global.config.PREFIX}setallbox name [𝒏𝒂𝒎𝒆] - 𝑪𝒉𝒂𝒏𝒈𝒆 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆
🔹 ${global.config.PREFIX}setallbox avt - 𝑪𝒉𝒂𝒏𝒈𝒆 𝒈𝒓𝒐𝒖𝒑 𝒂𝒗𝒂𝒕𝒂𝒓 (𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒊𝒎𝒂𝒈𝒆)
🔹 ${global.config.PREFIX}setallbox poll <𝒕𝒊𝒕𝒍𝒆> => <𝒐𝒑𝒕1> | <𝒐𝒑𝒕2> - 𝑪𝒓𝒆𝒂𝒕𝒆 𝒑𝒐𝒍𝒍

𝑪𝒓𝒆𝒅𝒊𝒕𝒔: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
        return message.reply(helpMessage);
      }

      switch (args[0]) {
        case "emoji":
          try {
            if (!args[1]) {
              const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"];
              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
              await api.changeThreadEmoji(randomEmoji, event.threadID);
              return message.reply(`✅ 𝑹𝒂𝒏𝒅𝒐𝒎 𝒆𝒎𝒐𝒋𝒊 𝒔𝒆𝒕: ${randomEmoji}`);
            } else {
              await api.changeThreadEmoji(args[1], event.threadID);
              return message.reply(`✅ 𝑬𝒎𝒐𝒋𝒊 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒕𝒐: ${args[1]}`);
            }
          } catch (error) {
            return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒆𝒎𝒐𝒋𝒊");
          }

        case "Bname":
          try {
            const newName = args.slice(1).join(" ");
            if (!newName) return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒑𝒆𝒄𝒊𝒇𝒚 𝒂 𝒏𝒆𝒘 𝒈𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆");
            await api.setTitle(newName, event.threadID);
            return message.reply(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒕𝒐: ${newName}`);
          } catch (error) {
            return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒈𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆");
          }

        case "rcolor":
          try {
            const colors = [
              '196241301102133', '169463077092846', '2442142322678320',
              '234137870477637', '980963458735625', '175615189761153'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            await api.changeThreadColor(randomColor, event.threadID);
            return message.reply("✅ 𝑮𝒓𝒐𝒖𝒑 𝒄𝒐𝒍𝒐𝒓 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚");
          } catch (error) {
            return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒈𝒓𝒐𝒖𝒑 𝒄𝒐𝒍𝒐𝒓");
          }

        case "name":
          try {
            const name = args.slice(1).join(" ");
            if (!name) return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒑𝒆𝒄𝒊𝒇𝒚 𝒂 𝒏𝒆𝒘 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆");
            
            // For GoatBot, nickname changes might require different handling
            return message.reply("❌ 𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒄𝒉𝒂𝒏𝒈𝒆 𝒏𝒐𝒕 𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒗𝒆𝒓𝒔𝒊𝒐𝒏");
          } catch (error) {
            return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆");
          }

        case "avt":
          try {
            if (!event.messageReply || !event.messageReply.attachments?.[0]?.type?.includes("image")) {
              return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆");
            }

            const imgURL = event.messageReply.attachments[0].url;
            
            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
              fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const imagePath = path.join(cacheDir, `avt_${event.threadID}.jpg`);
            
            // Download image
            const response = await axios.get(imgURL, {
              responseType: 'arraybuffer'
            });
            
            fs.writeFileSync(imagePath, Buffer.from(response.data));
            
            // Change group image
            await api.changeGroupImage(fs.createReadStream(imagePath), event.threadID);
            
            // Clean up
            fs.unlinkSync(imagePath);
            
            return message.reply("✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒗𝒂𝒕𝒂𝒓 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚");
          } catch (error) {
            return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒈𝒓𝒐𝒖𝒑 𝒂𝒗𝒂𝒕𝒂𝒓");
          }

        case "poll":
          try {
            const content = args.slice(1).join(" ");
            const separatorIndex = content.indexOf(" => ");
            
            if (separatorIndex === -1) {
              return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒇𝒐𝒓𝒎𝒂𝒕! 𝑼𝒔𝒆: 𝒑𝒐𝒍𝒍 <𝒕𝒊𝒕𝒍𝒆> => <𝒐𝒑𝒕𝒊𝒐𝒏1> | <𝒐𝒑𝒕𝒊𝒐𝒏2>");
            }
            
            const title = content.substring(0, separatorIndex);
            const options = content.substring(separatorIndex + 4).split("|").map(opt => opt.trim());
            
            if (!title || options.length < 2) {
              return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒑𝒐𝒍𝒍 𝒇𝒐𝒓𝒎𝒂𝒕! 𝑴𝒊𝒏𝒊𝒎𝒖𝒎 2 𝒐𝒑𝒕𝒊𝒐𝒏𝒔 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅");
            }
            
            // For GoatBot, poll creation might require different handling
            return message.reply("❌ 𝑷𝒐𝒍𝒍 𝒄𝒓𝒆𝒂𝒕𝒊𝒐𝒏 𝒏𝒐𝒕 𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒗𝒆𝒓𝒔𝒊𝒐𝒏");
          } catch (error) {
            return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒑𝒐𝒍𝒍");
          }

        default:
          return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒐𝒑𝒕𝒊𝒐𝒏. 𝑼𝒔𝒆 '𝒔𝒆𝒕𝒂𝒍𝒍𝒃𝒐𝒙' 𝒘𝒊𝒕𝒉𝒐𝒖𝒕 𝒂𝒓𝒈𝒖𝒎𝒆𝒏𝒕𝒔 𝒇𝒐𝒓 𝒉𝒆𝒍𝒑.");
      }

    } catch (error) {
      console.error("Setallbox command error:", error);
      return message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
