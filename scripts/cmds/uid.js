module.exports = {
  config: {
    name: "uid",
    aliases: ["userid", "id"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "tools",
    shortDescription: {
      en: "𝐺𝑒𝑡 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑦𝑜𝑢𝑟 𝑜𝑤𝑛 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑜𝑟 𝑡ℎ𝑒 𝐼𝐷𝑠 𝑜𝑓 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟𝑠"
    },
    guide: {
      en: "{p}uid [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, message }) {
    try {
      if (Object.keys(event.mentions).length === 0) {
        return message.reply(`𝒀𝒐𝒖𝒓 𝑼𝒔𝒆𝒓 𝑰𝑫: ${event.senderID}`);
      } else {
        let msg = "";
        for (const [id, name] of Object.entries(event.mentions)) {
          const cleanName = name.replace('@', '');
          msg += `${cleanName} - 𝑼𝒔𝒆𝒓 𝑰𝑫: ${id}\n`;
        }
        return message.reply(msg);
      }
    } catch (error) {
      console.error("UID Error:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝐼𝐷𝑠");
    }
  }
};
