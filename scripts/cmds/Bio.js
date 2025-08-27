module.exports = {
  config: {
    name: "bio",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝑩𝒐𝒕'𝒔 𝒃𝒊𝒐 𝒄𝒉𝒂𝒏𝒈𝒆𝒓"
    },
    longDescription: {
      en: "𝑨𝒍𝒍𝒐𝒘𝒔 𝒂𝒅𝒎𝒊𝒏𝒔 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒕𝒉𝒆 𝒃𝒐𝒕'𝒔 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒃𝒊𝒐."
    },
    guide: {
      en: "{p}bio [𝒏𝒆𝒘 𝒃𝒊𝒐 𝒕𝒆𝒙𝒕]"
    }
  },

  langs: {
    en: {
      enterText: "❗ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒉𝒆 𝒏𝒆𝒘 𝒃𝒊𝒐 𝒕𝒆𝒙𝒕.",
      error: "⚠️ 𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅: %1",
      success: "✅ 𝑩𝒐𝒕'𝒔 𝒃𝒊𝒐 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒕𝒐:\n%1"
    },
    bn: {
      enterText: "❗ 𝑵𝒐𝒕𝒖𝒏 𝒃𝒊𝒐 𝒕𝒆𝒙𝒕 𝒅𝒆𝒏.",
      error: "⚠️ 𝑺𝒐𝒎𝒐𝒔𝒔𝒂 𝒈𝒉𝒐𝒕𝒆𝒄𝒉𝒆: %1",
      success: "✅ 𝑩𝒐𝒕'𝒔 𝒃𝒊𝒐 𝒔𝒂𝒑𝒉𝒐𝒍𝒍𝒐 𝒔𝒂𝒕𝒉𝒆 𝒑𝒐𝒓𝒊𝒃𝒐𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆:\n%1"
    }
  },

  onStart: async function({ api, event, args, message, getLang }) {
    try {
      const newBio = args.join(" ");

      if (!newBio) {
        return message.reply(getLang("enterText"));
      }

      api.changeBio(newBio, true, (err) => {
        if (err) {
          console.error("Bio change error:", err);
          return message.reply(getLang("error", err.message));
        }
        return message.reply(getLang("success", newBio));
      });

    } catch (err) {
      console.error("𝑼𝒏𝒆𝒙𝒑𝒆𝒄𝒕𝒆𝒅 𝒆𝒓𝒓𝒐𝒓 𝒊𝒏 𝒃𝒊𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:", err);
      await message.reply(`⚠️ 𝑼𝒏𝒆𝒙𝒑𝒆𝒄𝒕𝒆𝒅 𝒆𝒓𝒓𝒐𝒓: ${err.message}`);
    }
  }
};
