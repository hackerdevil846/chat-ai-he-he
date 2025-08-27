module.exports = {
  config: {
    name: "out",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "𝐵𝑜𝑡 𝑘𝑒 𝑔𝑟𝑜𝑢𝑝 𝑡ℎ𝑒𝑘𝑒 𝑏𝑎ℎ𝑖𝑟 𝑘𝑜𝑟𝑢𝑛",
    category: "𝐴𝑑𝑚𝑖𝑛",
    usages: "𝑜𝑢𝑡 [𝑖𝑑]",
    cooldowns: 10
  },

  onStart: async function({ api, event, args }) {
    try {
      if (!args[0]) {
        await api.sendMessage(`🥲 𝐴𝑚𝑖 𝑡𝑜𝑑𝑒𝑟 𝑠𝑢𝑘ℎ 𝑑𝑒𝑤𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑎𝑠𝑐ℎ𝑖𝑙𝑎𝑚...\n😞 𝐾𝑖𝑛𝑡𝑢 𝑡𝑜𝑟𝑎 𝑎𝑚𝑎𝑟 𝑗𝑜𝑔𝑔𝑜 𝑛𝑎...`, event.threadID);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
      }

      if (!isNaN(args[0])) {
        return api.removeUserFromGroup(api.getCurrentUserID(), args[0]);
      }

      await api.sendMessage("❌ 𝐵𝑎𝑟𝑜 𝑔𝑟𝑜𝑢𝑝 𝐼𝐷 𝑑𝑖𝑎 𝑛𝑎...", event.threadID);
    } catch (error) {
      console.log("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑢𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
      await api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑: " + error.message, event.threadID);
    }
  }
};
