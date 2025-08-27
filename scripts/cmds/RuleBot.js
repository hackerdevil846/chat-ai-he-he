module.exports = {
  config: {
    name: "rulebot",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "group",
    shortDescription: {
      en: "𝑩𝒐𝒕 𝒖𝒔𝒂𝒈𝒆 𝒓𝒖𝒍𝒆𝒔"
    },
    longDescription: {
      en: "𝑫𝒊𝒔𝒑𝒍𝒂𝒚𝒔 𝒕𝒉𝒆 𝒓𝒖𝒍𝒆𝒔 𝒇𝒐𝒓 𝒖𝒔𝒊𝒏𝒈 𝒕𝒉𝒆 𝒄𝒉𝒂𝒕𝒃𝒐𝒕"
    },
    guide: {
      en: "{p}rulebot"
    },
    cooldowns: 5
  },

  langs: {
    en: {
      message: "💌 𝑪𝒉𝒂𝒕𝒃𝒐𝒕 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒏𝒊𝒚𝒐𝒎:\n" +
               "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
               "❯ 𝑺𝒐𝒖𝒓𝒄𝒆 𝑪𝒐𝒅𝒆 𝑩𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅\n" +
               "❯ 𝑼𝒔𝒆𝒓𝒅𝒆𝒓𝒂 𝒃𝒐𝒕 𝒌𝒆 20 𝒃𝒂𝒓/𝒅𝒊𝒏𝒆𝒓 𝒄𝒉𝒆𝒚𝒆 𝒔𝒑𝒂𝒎 𝒏𝒂 𝒌𝒐𝒓𝒃𝒆𝒏\n" +
               "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
               "💖 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅"
    }
  },

  onStart: async function({ message }) {
    try {
      await message.reply(this.langs.en.message);
    } catch (error) {
      console.error("𝑹𝒖𝒍𝒆𝑩𝒐𝒕 𝒐𝒏𝑺𝒕𝒂𝒓𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒉𝒐𝒘 𝒓𝒖𝒍𝒆𝒔.");
    }
  },

  onChat: async function({ event, message }) {
    try {
      const triggers = ["rulebot", "bot rules", "rules", "rule bot"];
      
      if (event.body && triggers.some(trigger =>
          event.body.toLowerCase().includes(trigger.toLowerCase())
      )) {
        await message.reply(this.langs.en.message);
      }
    } catch (error) {
      console.error("𝑹𝒖𝒍𝒆𝑩𝒐𝒕 𝒐𝒏𝑪𝒉𝒂𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
    }
  }
};
