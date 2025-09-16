const fs = require("fs-extra");

module.exports = {
  config: {
    name: "prefix",
    aliases: ["setprefix", "prefixset"],
    version: "1.8",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    description: "𝐵𝑜𝑡𝑒𝑟 𝑝𝑟𝑒𝑓𝑖𝑥 𝑝𝑎𝑟𝑖𝑏𝑎𝑟𝑡𝑎𝑛 𝑘𝑜𝑟𝑢𝑛 𝑠𝑢𝑛𝑑𝑜𝑟 𝑑𝑒𝑧𝑎𝑖𝑛𝑒",
    category: "⚙️ 𝐾𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑒𝑠ℎ𝑜𝑛",
    guide: {
      en: `
╭───────『 ✧  𝑃𝑅𝐸𝐹𝐼𝑋 𝐺𝑈𝐼𝐷𝐸  ✧ 』───────╮
│
│ ✦ {𝑝} <𝑛𝑒𝑤 𝑝𝑟𝑒𝑓𝑖𝑥>
│     𝐸𝑖 𝑐ℎ𝑎𝑡 𝑒𝑟 𝑗𝑜𝑛𝑛𝑜 𝑝𝑟𝑒𝑓𝑖𝑥 𝑠𝑒𝑡 𝑘𝑜𝑟𝑢𝑛
│     𝑈𝑑𝑎ℎ𝑎𝑟𝑜𝑛: {𝑝} $
│
│ ✦ {𝑝} <𝑛𝑒𝑤 𝑝𝑟𝑒𝑓𝑖𝑥> -𝑔
│     𝐺𝑙𝑜𝑏𝑎𝑙 𝑝𝑟𝑒𝑓𝑖𝑥 𝑠𝑒𝑡 𝑘𝑜𝑟𝑢𝑛 (𝐴𝑑𝑚𝑖𝑛 𝑑𝑒𝑟 𝑗𝑜𝑛𝑛𝑜)
│     𝑈𝑑𝑎ℎ𝑎𝑟𝑜𝑛: {𝑝} $ -𝑔
│
│ ♻️ {𝑝} 𝑟𝑒𝑠𝑒𝑡
│     𝐷𝑒𝑓𝑎𝑢𝑙𝑡 𝑝𝑟𝑒𝑓𝑖𝑥 𝑒 𝑟𝑖𝑠𝑒𝑡 𝑘𝑜𝑟𝑢𝑛
│
╰───────────────────────╯`
    },
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, event, args, threadsData, role, api }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!fs) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return message.reply("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
      }

      const { threadID } = event;
      
      if (!args[0]) {
        return this.showPrefix(message, threadID, threadsData);
      }

      if (args[0] === "reset") {
        await threadsData.set(threadID, "", "data.prefix");
        return message.reply(this.getLang("reset", global.config.PREFIX));
      }

      const newPrefix = args[0];
      const setGlobal = args[1] === "-g";

      if (setGlobal) {
        if (role < 2) {
          return message.reply(this.getLang("onlyAdmin"));
        }
        
        global.config.PREFIX = newPrefix;
        fs.writeFileSync(global.client.configPath, JSON.stringify(global.config, null, 2));
        return message.reply(this.getLang("successGlobal", newPrefix));
      }

      await threadsData.set(threadID, newPrefix, "data.prefix");
      return message.reply(this.getLang("successThisThread", newPrefix));
    } catch (error) {
      console.error("𝑃𝑟𝑒𝑓𝑖𝑥 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑡𝑡𝑖𝑛𝑔 𝑝𝑟𝑒𝑓𝑖𝑥");
    }
  },

  onChat: async function ({ event, message, threadsData }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      this.showPrefix(message, event.threadID, threadsData);
    }
  },

  showPrefix: async function (message, threadID, threadsData) {
    try {
      const globalPrefix = global.config.PREFIX;
      const threadPrefix = await threadsData.get(threadID, "data.prefix") || globalPrefix;
      
      message.reply({
        body: this.getLang("myPrefix", globalPrefix, threadPrefix),
        attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/e7bozl.jpg")
      });
    } catch (error) {
      console.error("𝑆ℎ𝑜𝑤 𝑃𝑟𝑒𝑓𝑖𝑥 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠ℎ𝑜𝑤 𝑝𝑟𝑒𝑓𝑖𝑥 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛");
    }
  },

  getLang: function (key, ...values) {
    const lang = {
      reset: 
`╭───────『 ✧  𝑃𝑅𝐸𝐹𝐼𝑋 𝑅𝐸𝑆𝐸𝑇  ✧ 』───────╮
│
│ ✅ » 𝐷𝑒𝑓𝑎𝑢𝑙𝑡 𝑒 𝑟𝑖𝑠𝑒𝑡 𝑘𝑜𝑟𝑎 ℎ𝑜𝑙𝑜: %1
│
╰───────────────────────╯`,
      onlyAdmin: 
`╭───────『 ✧  𝑃𝐸𝑅𝑀𝐼𝑆𝑆𝐼𝑂𝑁  ✧ 』───────╮
│
│ ⛔ » 𝑆𝑢𝑑ℎ𝑢 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛𝑟𝑎 𝑔𝑙𝑜𝑏𝑎𝑙 𝑝𝑟𝑒𝑓𝑖𝑥 𝑝𝑎𝑟𝑖𝑏𝑎𝑟𝑡𝑎𝑛 𝑘𝑜𝑟𝑡𝑒 𝑝𝑎𝑟𝑏𝑒𝑛!
│
╰───────────────────────╯`,
      successGlobal: 
`╭───────『 ✧  𝑆𝑈𝐶𝐶𝐸𝑆𝑆  ✧ 』───────╮
│
│ ✅ » 𝐺𝑙𝑜𝑏𝑎𝑙 𝑝𝑟𝑒𝑓𝑖𝑥: %1
│
╰───────────────────────╯`,
      successThisThread: 
`╭───────『 ✧  𝑆𝑈𝐶𝐶𝐸𝑆𝑆  ✧ 』───────╮
│
│ ✅ » 𝐶ℎ𝑎𝑡 𝑝𝑟𝑒𝑓𝑖𝑥: %1
│
╰───────────────────────╯`,
      myPrefix: 
`╭───────『 ✧  𝐴𝑡𝑜𝑚𝑖𝑐𝐵𝑜𝑡  ✧ 』───────╮
│
│ ✨ 𝐴𝑆𝑆𝐴𝐿𝐴𝑀𝑈𝐴𝐿𝐴𝐼𝐾𝑈𝑀 ✨
│
│ ❄️ » 𝑆𝑖𝑠𝑡𝑒𝑚 𝑃𝑟𝑒𝑓𝑖𝑥: 【%1】
│ 💬 » 𝐶ℎ𝑎𝑡 𝑃𝑟𝑒𝑓𝑖𝑥: 【%2】
│
│ 📜 » 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑑𝑒𝑘ℎ𝑡𝑒 『%2ℎ𝑒𝑙𝑝』 𝑙𝑖𝑘ℎ𝑢𝑛
│
│ 🌟 » 𝑂𝑤𝑛𝑒𝑟: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
│
╰───────────────────────╯`
    };

    return lang[key].replace(/%(\d+)/g, (_, index) => values[parseInt(index) - 1]);
  }
};
