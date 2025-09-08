module.exports = {
  config: {
    name: "bio",
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝐵𝑜𝑡'𝑠 𝑏𝑖𝑜 𝑐ℎ𝑎𝑛𝑔𝑒𝑟"
    },
    longDescription: {
      en: "𝐴𝑙𝑙𝑜𝑤𝑠 𝑎𝑑𝑚𝑖𝑛𝑠 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑏𝑖𝑜."
    },
    guide: {
      en: "{p}bio [𝑛𝑒𝑤 𝑏𝑖𝑜 𝑡𝑒𝑥𝑡]"
    }
  },

  langs: {
    en: {
      enterText: "❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑛𝑒𝑤 𝑏𝑖𝑜 𝑡𝑒𝑥𝑡.",
      error: "⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: %1",
      success: "✅ 𝐵𝑜𝑡'𝑠 𝑏𝑖𝑜 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜:\n%1"
    }
  },

  onStart: async function({ api, event, args, message, getLang }) {
    try {
      const newBio = args.join(" ");

      if (!newBio) {
        return message.reply(getLang("enterText"));
      }

      // Change bot's bio
      await api.changeBio(newBio);
      
      return message.reply(getLang("success", newBio));

    } catch (err) {
      console.error("𝑈𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑖𝑛 𝑏𝑖𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", err);
      await message.reply(getLang("error", err.message));
    }
  }
};
