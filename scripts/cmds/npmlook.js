const axios = require("axios");

module.exports = {
  config: {
    name: "npmlook",
    aliases: ["npminfo", "packinfo"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐶ℎ𝑒𝑐𝑘 𝑛𝑝𝑚 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑑𝑎𝑡𝑎"
    },
    longDescription: {
      en: "𝐹𝑒𝑡𝑐ℎ 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜 𝑜𝑓 𝑎𝑛 𝑛𝑝𝑚 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑢𝑠𝑖𝑛𝑔 𝑃𝑜𝑝𝐶𝑎𝑡 𝐴𝑃𝐼"
    },
    category: "𝐼𝑛𝑓𝑜",
    guide: {
      en: "{p}npmlook <𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑛𝑎𝑚𝑒>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}npmlook axios"
    }
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      return api.sendMessage("❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑝𝑚 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑛𝑎𝑚𝑒.", event.threadID, event.messageID);
    }

    const pkg = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/npm?q=${pkg}`);
      const data = res.data;

      if (!data || !data.name) {
        return api.sendMessage("⚠️ | 𝑁𝑜 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑓𝑜𝑢𝑛𝑑 𝑤𝑖𝑡ℎ 𝑡ℎ𝑎𝑡 𝑛𝑎𝑚𝑒.", event.threadID, event.messageID);
      }

      const reply =
`📦 𝑃𝑎𝑐𝑘𝑎𝑔𝑒: ${data.name}
📌 𝑉𝑒𝑟𝑠𝑖𝑜𝑛: ${data.version || "𝑁/𝐴"}
📝 𝐷𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛: ${data.description || "𝑁/𝐴"}
👤 𝐴𝑢𝑡ℎ𝑜𝑟: ${(data.author && data.author.name) || "𝑁/𝐴"}
📃 𝐿𝑖𝑐𝑒𝑛𝑠𝑒: ${data.license || "𝑁/𝐴"}
🔗 𝐻𝑜𝑚𝑒𝑝𝑎𝑔𝑒: ${data.homepage || "𝑁/𝐴"}
🌐 𝑁𝑃𝑀 𝐿𝑖𝑛𝑘: https://www.npmjs.com/package/${data.name}`;

      api.sendMessage(reply, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑖𝑛𝑓𝑜. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.", event.threadID, event.messageID);
    }
  }
};
