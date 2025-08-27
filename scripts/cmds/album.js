const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "album",
    version: "1.7",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝑽𝒊𝒅𝒆𝒐 𝒂𝒍𝒃𝒖𝒎 𝒎𝒂𝒏𝒂𝒈𝒆𝒎𝒆𝒏𝒕 𝒔𝒚𝒔𝒕𝒆𝒎"
    },
    longDescription: {
      en: "𝑨𝒅𝒅, 𝒍𝒊𝒔𝒕, 𝒂𝒏𝒅 𝒗𝒊𝒆𝒘 𝒗𝒊𝒅𝒆𝒐𝒔 𝒇𝒓𝒐𝒎 𝒗𝒂𝒓𝒊𝒐𝒖𝒔 𝒄𝒂𝒕𝒆𝒈𝒐𝒓𝒊𝒆𝒔"
    },
    guide: {
      en: "{p}album [page]\n{p}album add [category] [URL]\n{p}album list"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      const baseApiUrl = "https://your-api-url.com"; // Replace with your actual API URL

      if (args[0] === "add") {
        if (!args[1]) {
          return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒑𝒆𝒄𝒊𝒇𝒚 𝒂 𝒄𝒂𝒕𝒆𝒈𝒐𝒓𝒚. 𝑼𝒔𝒂𝒈𝒆: !𝒂𝒍𝒃𝒖𝒎 𝒂𝒅𝒅 [𝒄𝒂𝒕𝒆𝒈𝒐𝒓𝒚]");
        }

        const category = args[1].toLowerCase();

        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
          const attachment = event.messageReply.attachments[0];
          
          if (attachment.type !== "video") {
            return message.reply("❌ 𝑶𝒏𝒍𝒚 𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕𝒔 𝒂𝒓𝒆 𝒂𝒍𝒍𝒐𝒘𝒆𝒅.");
          }

          try {
            // For GoatBot, we'll use the attachment URL directly instead of Imgur
            const videoUrl = attachment.url;
            
            try {
              const uploadResponse = await axios.post(`${baseApiUrl}/api/album/add`, {
                category,
                videoUrl,
              });

              return message.reply(uploadResponse.data.message);
            } catch (error) {
              return message.reply(`❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒖𝒑𝒍𝒐𝒂𝒅 𝒗𝒊𝒅𝒆𝒐.\n𝑬𝒓𝒓𝒐𝒓: ${error.response?.data?.error || error.message}`);
            }

          } catch (error) {
            return message.reply(`❌ 𝑬𝒓𝒓𝒐𝒓: ${error.message}`);
          }
        }

        if (!args[2]) {
          return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒗𝒊𝒅𝒆𝒐 𝑼𝑹𝑳 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒗𝒊𝒅𝒆𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆.");
        }

        const videoUrl = args[2];
        try {
          const response = await axios.post(`${baseApiUrl}/album/add`, {
            category,
            videoUrl,
          });

          return message.reply(response.data.message);
        } catch (error) {
          return message.reply(`❌ 𝑬𝒓𝒓𝒐𝒓: ${error.response?.data?.error || error.message}`);
        }

      } else if (args[0] === "list") {
        try {
          const response = await axios.get(`${baseApiUrl}/api/album/list`);
          return message.reply(response.data.message);
        } catch (error) {
          return message.reply(`❌ 𝑬𝒓𝒓𝒐𝒓: ${error.message}`);
        }
      } else {
        const displayNames = [
          "𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨", "𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨", "𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨",
          "𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐇𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐂𝐨𝐮𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐅𝐥𝐨𝐰𝐞𝐫 𝐕𝐢𝐝𝐞𝐨", "𝐁𝐢𝐤𝐞 & 𝐂𝐚𝐫 𝐕𝐢𝐝𝐞𝐨",
          "𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐋𝐲𝐫𝐢𝐜𝐬 𝐕𝐢𝐝𝐞𝐨", "𝐂𝐚𝐭 𝐕𝐢𝐝𝐞𝐨", "𝟏𝟖+ 𝐕𝐢𝐝𝐞𝐨", "𝐅𝐫𝐞𝐞 𝐅𝐢𝐫𝐞 𝐕𝐢𝐝𝐞𝐨",
          "𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨", "𝐁𝐚𝐛𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐕𝐢𝐝𝐞𝐨", "𝐏𝐮𝐛𝐠 𝐯𝐢𝐝𝐞𝐨", "𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 𝐕𝐢𝐝𝐞𝐨"
        ];    
        
        const itemsPerPage = 10;
        const page = parseInt(args[0]) || 1;
        const totalPages = Math.ceil(displayNames.length / itemsPerPage);

        if (page < 1 || page > totalPages) {
          return message.reply(`❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒑𝒂𝒈𝒆! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒄𝒉𝒐𝒐𝒔𝒆 𝒃𝒆𝒕𝒘𝒆𝒆𝒏 1 - ${totalPages}.`);
        }

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedCategories = displayNames.slice(startIndex, endIndex);

        const messageText = `𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨 𝐋𝐢𝐬𝐭 🎀\n` +
          "𐙚━━━━━━━━━━━━━━━━━━━━━ᡣ𐭩\n" +
          displayedCategories.map((option, index) => `${startIndex + index + 1}. ${option}`).join("\n") +
          "\n𐙚━━━━━━━━━━━━━━━━━━━━━ᡣ𐭩" +
          `\n♻ | 𝐏𝐚𝐠𝐞 [${page}/${totalPages}]<😘\nℹ | 𝐓𝐲𝐩𝐞 ${global.config.PREFIX}album ${page + 1} - 𝐭𝐨 𝐬𝐞𝐞 𝐧𝐞𝐱𝐭 𝐩𝐚𝐠𝐞.`;

        await message.reply(messageText);

      }
    } catch (error) {
      console.error("Album command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
