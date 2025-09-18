module.exports = {
  config: {
    name: "trace",
    aliases: ["track", "locate"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "📍 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡𝑟𝑎𝑐𝑘𝑖𝑛𝑔 𝑙𝑖𝑛𝑘 𝑓𝑜𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑡𝑟𝑎𝑐𝑘𝑖𝑛𝑔 𝑙𝑖𝑛𝑘 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}trace @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    countDown: 5
  },

  onStart: async function({ api, event, message }) {
    try {
      const mentionIDs = Object.keys(event.mentions);
      const mention = mentionIDs[0];

      if (!mention) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑡𝑟𝑎𝑐𝑘!");
      }

      const name = event.mentions[mention];
      const link = `https://tracker-rudra.onrender.com/?uid=${mention}`;
      const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      return message.reply({
        body:
          "🕵️‍♂️ 𝗧𝗿𝗮𝗰𝗸𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺\n\n" +
          `👤 𝑇𝑟𝑎𝑐𝑒 𝑡𝑎𝑟𝑔𝑒𝑡: ${name}\n` +
          `🔗 𝑇𝑟𝑎𝑐𝑘𝑖𝑛𝑔 𝑙𝑖𝑛𝑘: ${link}\n` +
          `🕒 𝑇𝑖𝑚𝑒: ${time}`,
        mentions: [{ id: mention, tag: name }]
      });

    } catch (error) {
      console.error("Trace error:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑡𝑟𝑦𝑖𝑛𝑔 𝑡𝑜 𝑡𝑟𝑎𝑐𝑘 𝑢𝑠𝑒𝑟.");
    }
  }
};
