const fs = require('fs');
const request = require('request'); // This dependency isn't strictly needed for the GoatBot version if global.utils.getStreamFromURL is used for attachments, but keeping it for consistency if it's used elsewhere.

module.exports = {
  config: {
    name: "search",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Your name with requested font
    role: 0, // 0 for everyone, 1 for admin
    category: "info",
    shortDescription: {
      en: "𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒆𝒏𝒈𝒊𝒏𝒆" // Requested font
    },
    longDescription: {
      en: "𝑨𝒍𝒍𝒐𝒘𝒔 𝒚𝒐𝒖 𝒕𝒐 𝒔𝒆𝒂𝒓𝒄𝒉 𝑮𝒐𝒐𝒈𝒍𝒆 𝒇𝒐𝒓 𝒕𝒆𝒙𝒕 𝒐𝒓 𝒑𝒆𝒓𝒇𝒐𝒓𝒎 𝒂 𝒓𝒆𝒗𝒆𝒓𝒔𝒆 𝒊𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒃𝒚 𝒓𝒆𝒑𝒍𝒚𝒊𝒏𝒈 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒐𝒓 𝒑𝒓𝒐𝒗𝒊𝒅𝒊𝒏𝒈 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝑼𝑹𝑳." // Requested font
    },
    guide: {
      en: "𝑼𝒔𝒂𝒈𝒆: {p}search [𝒕𝒆𝒙𝒕 𝒕𝒐 𝒔𝒆𝒂𝒓𝒄𝒉]\n𝑶𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒕𝒐 𝒑𝒆𝒓𝒇𝒐𝒓𝒎 𝒂 𝒓𝒆𝒗𝒆𝒓𝒔𝒆 𝒊𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉. (𝑬𝒙: {p}search 𝒑𝒓𝒐𝒈𝒓𝒂𝒎𝒎𝒊𝒏𝒈)" // Requested font
    },
    priority: 0,
    cooldowns: 5
  },

  onStart: async function({
    message, // For sending messages (REQUIRED in GoatBot)
    args,    // Command arguments array (REQUIRED in GoatBot)
    event    // Event data (senderID, threadID, etc. - useful for replies)
  }) {
    try {
      let textNeedSearch = "";
      // Regex to check if the input is a direct image URL (png, jpg, gif)
      const regex = /(https?:\/\/(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^/?#]*)+(?:\.(?:png|jpe?g|gif))(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(?:#.*)?)/i;

      // Check if user replied to an image
      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0 && event.messageReply.attachments[0].type === "Photo") {
        textNeedSearch = event.messageReply.attachments[0].url;
      } else if (args.length === 0) {
        // No reply to image and no text provided
        return await message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒔𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒕𝒐 𝒔𝒆𝒂𝒓𝒄𝒉 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 ❌"); // Requested font
      } else {
        // Text provided in arguments
        textNeedSearch = args.join(" ");
      }

      // If it's an image URL (either from reply or directly provided in args)
      if (regex.test(textNeedSearch)) {
        const imageUrl = `https://www.google.com/searchbyimage?&image_url=${textNeedSearch}`;
        return await message.reply(`🔎 𝑰𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕: \n${imageUrl}`); // Requested font
      } else {
        // It's a text search
        const searchUrl = `https://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`;
        return await message.reply(`🔎 𝑺𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕 𝒇𝒐𝒓 '${textNeedSearch}': \n${searchUrl}`); // Requested font
      }

    } catch (error) {
      console.error("Search Command Error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒔𝒆𝒂𝒓𝒄𝒉 ❌"); // Requested font
    }
  }
};
