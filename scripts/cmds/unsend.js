module.exports = {
  config: {
    name: "unsend",
    aliases: ["remove", "delete"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "system",
    shortDescription: {
      en: "🗑️ 𝐵𝑜𝑡 𝑤𝑖𝑙𝑙 𝑢𝑛𝑠𝑒𝑛𝑑 𝑖𝑡𝑠 𝑜𝑤𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
    },
    longDescription: {
      en: "𝐴𝑙𝑙𝑜𝑤𝑠 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑚𝑎𝑘𝑒 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑑𝑒𝑙𝑒𝑡𝑒 𝑖𝑡𝑠 𝑜𝑤𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑏𝑦 𝑟𝑒𝑝𝑙𝑦𝑖𝑛𝑔 𝑡𝑜 𝑡ℎ𝑒𝑚"
    },
    guide: {
      en: "{p}unsend [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑏𝑜𝑡'𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    },
    countDown: 0
  },

  langs: {
    "en": {
      "returnCant": "❌ 𝐼 𝑐𝑎𝑛𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒",
      "missingReply": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑢𝑛𝑠𝑒𝑛𝑑 𝑖𝑡"
    }
  },

  onStart: async function ({ api, event, message, getText }) {
    try {
      // ensure it's a reply
      if (event.type !== "message_reply" || !event.messageReply) {
        return message.reply(getText("missingReply"));
      }

      // only allow unsend if the replied message was sent by the bot itself
      if (event.messageReply.senderID !== api.getCurrentUserID()) {
        return message.reply(getText("returnCant"));
      }

      // perform unsend
      await api.unsendMessage(event.messageReply.messageID);
      
    } catch (error) {
      console.error("Unsend Error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑡𝑟𝑦𝑖𝑛𝑔 𝑡𝑜 𝑢𝑛𝑠𝑒𝑛𝑑 𝑡ℎ𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
    }
  }
};
