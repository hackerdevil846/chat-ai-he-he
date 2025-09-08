module.exports = {
  config: {
    name: "out",
    aliases: ["leave", "exit"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 2,
    shortDescription: {
      en: "𝐵𝑜𝑡 𝑙𝑒𝑎𝑣𝑒𝑠 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝"
    },
    longDescription: {
      en: "𝑀𝑎𝑘𝑒𝑠 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑙𝑒𝑎𝑣𝑒 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑟𝑜𝑢𝑝 𝑜𝑟 𝑎 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑒𝑑 𝑔𝑟𝑜𝑢𝑝"
    },
    category: "𝑎𝑑𝑚𝑖𝑛",
    guide: {
      en: "{p}out [𝑔𝑟𝑜𝑢𝑝_𝐼𝐷]"
    }
  },

  onStart: async function({ message, args, event, api }) {
    try {
      if (!args[0]) {
        await message.reply(`🥲 𝐴𝑚𝑖 𝑡𝑜𝑑𝑒𝑟 𝑠𝑢𝑘ℎ 𝑑𝑒𝑤𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑎𝑠𝑐ℎ𝑖𝑙𝑎𝑚...\n😞 𝐾𝑖𝑛𝑡𝑢 𝑡𝑜𝑟𝑎 𝑎𝑚𝑎𝑟 𝑗𝑜𝑔𝑔𝑜 𝑛𝑎...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
      }

      if (!isNaN(args[0])) {
        return api.removeUserFromGroup(api.getCurrentUserID(), args[0]);
      }

      await message.reply("❌ 𝐵𝑎𝑟𝑜 𝑔𝑟𝑜𝑢𝑝 𝐼𝐷 𝑑𝑖𝑎 𝑛𝑎...");
    } catch (error) {
      console.log("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑢𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
      await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑: " + error.message);
    }
  }
};
