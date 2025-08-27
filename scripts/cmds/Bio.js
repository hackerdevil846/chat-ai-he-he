module.exports = {
  config: {
    name: "bio",
    version: "1.0.1", // Incrementing version for the fix
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Using the requested font
    role: 2, // Admin-only command
    category: "admin",
    shortDescription: {
      en: "𝑩𝒐𝒕'𝒔 𝒃𝒊𝒐 𝒄𝒉𝒂𝒏𝒈𝒆𝒓" // Metalic italic bold
    },
    longDescription: {
      en: "𝑨𝒍𝒍𝒐𝒘𝒔 𝒂𝒅𝒎𝒊𝒏𝒔 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒕𝒉𝒆 𝒃𝒐𝒕'𝒔 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒃𝒊𝒐." // Metalic italic bold
    },
    guide: {
      en: "{p}bio [𝒏𝒆𝒘 𝒃𝒊𝒐 𝒕𝒆𝒙𝒕]" // Metalic italic bold
    },
    priority: 0 // Default priority
  },

  onStart: async function({
    message, // For sending messages
    args,    // Command arguments array
    event,   // Event data (userID, threadID, etc.)
    api,     // Facebook API functions
    global   // Global data and functions (for languages)
  }) {
    try {
      // Accessing languages directly from module.exports as in the original
      const lang = global.GoatBot.config.language === "bn" ? module.exports.languages.bn : module.exports.languages.en;

      const newBio = args.join(" ");

      if (!newBio) {
        return message.reply(lang.enterText);
      }

      // Using api.changeBio as in the original structure
      api.changeBio(newBio, async (error) => {
        if (error) {
          console.error("Bio change error:", error);
          // Using message.reply for consistency with GoatBot structure
          return await message.reply(lang.error.replace('%1', error.message));
        }

        // Using message.reply for consistency with GoatBot structure
        await message.reply(lang.success.replace('%1', newBio));
      });

    } catch (err) {
      console.error("𝑼𝒏𝒆𝒙𝒑𝒆𝒄𝒕𝒆𝒅 𝒆𝒓𝒓𝒐𝒓 𝒊𝒏 𝒃𝒊𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:", err); // Metalic italic bold
      await message.reply(`⚠️ 𝑼𝒏𝒆𝒙𝒑𝒆𝒄𝒕𝒆𝒅 𝒆𝒓𝒓𝒐𝒓: ${err.message}`); // Metalic italic bold
    }
  },

  // Original languages object (kept as is for compatibility with previous version)
  languages: {
    en: {
      enterText: "❗ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒉𝒆 𝒏𝒆𝒘 𝒃𝒊𝒐 𝒕𝒆𝒙𝒕.", // Metalic italic bold
      error: "⚠️ 𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅: %1", // Metalic italic bold
      success: "✅ 𝑩𝒐𝒕'𝒔 𝒃𝒊𝒐 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒕𝒐:\n%1" // Metalic italic bold
    },
    bn: {
      enterText: "❗ 𝑵𝒐𝒕𝒖𝒏 𝒃𝒊𝒐 𝒕𝒆𝒙𝒕 𝒅𝒆𝒏.", // Metalic italic bold
      error: "⚠️ 𝑺𝒐𝒎𝒐𝒔𝒔𝒂 𝒈𝒉𝒐𝒕𝒆𝒄𝒉𝒆: %1", // Metalic italic bold
      success: "✅ 𝑩𝒐𝒕'𝒔 𝒃𝒊𝒐 𝒔𝒂𝒑𝒉𝒐𝒍𝒍𝒐 𝒔𝒂𝒕𝒉𝒆 𝒑𝒐𝒓𝒊𝒃𝒐𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆:\n%1" // Metalic italic bold
    }
  }
};
