const fs = require('fs');
const request = require('request');

module.exports = {
  config: {
    name: "gimagesearch",
    aliases: ["gis", "googleimg", "imgsearch"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "𝒊𝒏𝒇𝒐",
    countDown: 5,
    shortDescription: {
      en: "𝑮𝒐𝒐𝒈𝒍𝒆 𝒊𝒎𝒂𝒈𝒆 𝒂𝒏𝒅 𝒕𝒆𝒙𝒕 𝒔𝒆𝒂𝒓𝒄𝒉"
    },
    longDescription: {
      en: "𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒇𝒐𝒓 𝒕𝒆𝒙𝒕 𝒐𝒓 𝒓𝒆𝒗𝒆𝒓𝒔𝒆 𝒊𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉"
    },
    guide: {
      en: "{p}gimagesearch [𝒕𝒆𝒙𝒕] 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒊𝒎𝒂𝒈𝒆"
    },
    dependencies: {
      "request": "",
      "fs": ""
    }
  },

  onStart: async function({ message, args, event }) {
    try {
      const { dependencies } = this.config;
      for (const dep in dependencies) {
        try {
          require.resolve(dep);
        } catch (e) {
          return await message.reply(`❌ 𝑴𝒊𝒔𝒔𝒊𝒏𝒈 𝒅𝒆𝒑𝒆𝒏𝒅𝒆𝒏𝒄𝒚: ${dep}`);
        }
      }

      let textNeedSearch = "";
      const regex = /(https?:\/\/(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^/?#]*)+(?:\.(?:png|jpe?g|gif))(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(?:#.*)?)/i;

      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0 && event.messageReply.attachments[0].type === "photo") {
        textNeedSearch = event.messageReply.attachments[0].url;
      } else if (args.length === 0) {
        return await message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒔𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒕𝒐 𝒔𝒆𝒂𝒓𝒄𝒉 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆");
      } else {
        textNeedSearch = args.join(" ");
      }

      if (regex.test(textNeedSearch)) {
        const imageUrl = `https://www.google.com/searchbyimage?&image_url=${textNeedSearch}`;
        return await message.reply(`🔎 𝑰𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕: \n${imageUrl}`);
      } else {
        const searchUrl = `https://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`;
        return await message.reply(`🔎 𝑺𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕: \n${searchUrl}`);
      }

    } catch (error) {
      console.error("𝑺𝒆𝒂𝒓𝒄𝒉 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅");
    }
  }
};
