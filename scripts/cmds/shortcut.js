const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "shortcut",
    aliases: ["sc"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "system",
    shortDescription: {
      en: "🎯 𝑆ℎ𝑜𝑟𝑡𝑐𝑢𝑡 𝑎𝑑𝑑, 𝑟𝑒𝑚𝑜𝑣𝑒 𝑎𝑛𝑑 𝑙𝑖𝑠𝑡 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝑠ℎ𝑜𝑟𝑡𝑐𝑢𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑟 𝑞𝑢𝑖𝑐𝑘 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒𝑠"
    },
    guide: {
      en: "{p}shortcut [𝑎𝑙𝑙/𝑑𝑒𝑙𝑒𝑡𝑒/𝑒𝑚𝑝𝑡𝑦]"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": "",
      "path": ""
    }
  },

  langs: {
    "en": {
      "misingKeyword": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑘𝑒𝑦𝑤𝑜𝑟𝑑!",
      "shortcutExist": "❌ 𝑇ℎ𝑖𝑠 𝑖𝑛𝑝𝑢𝑡 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠!",
      "requestResponse": "📝 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑘𝑒𝑦𝑤𝑜𝑟𝑑",
      "addSuccess": "✅ 𝑁𝑒𝑤 𝑠ℎ𝑜𝑟𝑡𝑐𝑢𝑡 𝑎𝑑𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n- 𝐼𝐷: %1\n- 𝐼𝑛𝑝𝑢𝑡: %2\n- 𝑂𝑢𝑡𝑝𝑢𝑡: %3",
      "listShortcutNull": "📭 𝑁𝑜 𝑠ℎ𝑜𝑟𝑡𝑐𝑢𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑!",
      "removeSuccess": "✅ 𝑆ℎ𝑜𝑟𝑡𝑐𝑢𝑡 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
      "returnListShortcut": "📋 𝐴𝑙𝑙 𝑠ℎ𝑜𝑟𝑡𝑐𝑢𝑡𝑠 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑:\n[𝑁𝑜]/ [𝐼𝑛𝑝𝑢𝑡] => [𝑂𝑢𝑡𝑝𝑢𝑡]\n\n%1",
      "requestKeyword": "📝 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑘𝑒𝑦𝑤𝑜𝑟𝑑 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑠ℎ𝑜𝑟𝑡𝑐𝑢𝑡"
    }
  },

  onLoad: function () {
    try {
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const dataPath = path.join(cacheDir, "shortcutdata.json");
      
      if (!global.moduleData) global.moduleData = {};
      if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();

      if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify([], null, 4), "utf-8");
      }

      const dataRaw = fs.readFileSync(dataPath, "utf-8");
      let data = [];
      try { 
        data = JSON.parse(dataRaw || "[]"); 
      } catch (e) { 
        data = []; 
      }

      for (const threadData of data) {
        if (threadData && threadData.threadID) {
          global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts || []);
        }
      }
    } catch (e) {
      console.error("Shortcut onLoad error:", e);
    }
  },

  onChat: async function ({ event, api }) {
    try {
      const { threadID, messageID, body } = event;
      
      if (!global.moduleData || !global.moduleData.shortcut) return;
      if (!global.moduleData.shortcut.has(threadID)) return;
      if (!body) return;

      const data = global.moduleData.shortcut.get(threadID) || [];
      const matched = data.find(item => item.input === body);
      
      if (matched) {
        await api.sendMessage(matched.output, threadID, messageID);
      }
    } catch (e) {
      console.error("Shortcut onChat error:", e);
    }
  },

  onReply: async function ({ event, api, handleReply, message, getText }) {
    try {
      if (!handleReply || handleReply.author !== event.senderID) return;

      const { threadID, messageID, body } = event;
      const dataPath = path.join(__dirname, "cache", "shortcutdata.json");

      switch (handleReply.type) {
        case "requireInput": {
          if (!body) {
            return message.reply(getText("misingKeyword"));
          }

          const data = global.moduleData.shortcut.get(threadID) || [];
          if (data.some(item => item.input === body)) {
            return message.reply(getText("shortcutExist"));
          }

          await api.unsendMessage(handleReply.messageID);
          
          return message.reply(getText("requestResponse"), (error, info) => {
            global.client.handleReply.push({
              type: "final",
              name: this.config.name,
              author: event.senderID,
              messageID: info.messageID,
              input: body
            });
          });
        }

        case "final": {
          const id = Math.random().toString(36).slice(2, 12);
          let allData = [];
          
          try {
            const readData = fs.readFileSync(dataPath, "utf-8");
            allData = JSON.parse(readData || "[]");
          } catch (e) {
            allData = [];
          }

          let threadData = allData.find(item => item.threadID === threadID);
          if (!threadData) {
            threadData = { threadID, shortcuts: [] };
            allData.push(threadData);
          }

          const globalData = global.moduleData.shortcut.get(threadID) || [];
          const newShortcut = { id, input: handleReply.input, output: body || "empty" };

          threadData.shortcuts.push(newShortcut);
          globalData.push(newShortcut);

          global.moduleData.shortcut.set(threadID, globalData);
          fs.writeFileSync(dataPath, JSON.stringify(allData, null, 4), "utf-8");

          return message.reply(
            getText("addSuccess")
              .replace("%1", id)
              .replace("%2", handleReply.input)
              .replace("%3", body || "empty")
          );
        }
      }
    } catch (e) {
      console.error("Shortcut onReply error:", e);
    }
  },

  onStart: async function ({ api, event, args, message, getText }) {
    try {
      const { threadID, messageID, senderID } = event;
      const dataPath = path.join(__dirname, "cache", "shortcutdata.json");
      const subCommand = args[0] ? args[0].toLowerCase() : "";

      switch (subCommand) {
        case "remove":
        case "delete":
        case "del":
        case "-d": {
          let allData = [];
          try {
            const readData = fs.readFileSync(dataPath, "utf-8");
            allData = JSON.parse(readData || "[]");
          } catch (e) {
            allData = [];
          }

          const threadIndex = allData.findIndex(item => item.threadID === threadID);
          if (threadIndex === -1) {
            return message.reply(getText("listShortcutNull"));
          }

          const threadData = allData[threadIndex];
          const globalData = global.moduleData.shortcut.get(threadID) || [];

          if (!threadData.shortcuts || threadData.shortcuts.length === 0) {
            return message.reply(getText("listShortcutNull"));
          }

          if (!args[1]) {
            return message.reply(getText("requestKeyword"));
          }

          let removeIndex = -1;
          const maybeIndex = parseInt(args[1]);
          if (!isNaN(maybeIndex)) {
            const idx = maybeIndex - 1;
            if (idx >= 0 && idx < threadData.shortcuts.length) {
              removeIndex = idx;
            }
          }

          if (removeIndex === -1) {
            const key = args.slice(1).join(" ");
            removeIndex = threadData.shortcuts.findIndex(
              item => item.input === key || item.id === key
            );
          }

          if (removeIndex === -1 || removeIndex < 0 || removeIndex >= threadData.shortcuts.length) {
            return message.reply(getText("listShortcutNull"));
          }

          threadData.shortcuts.splice(removeIndex, 1);
          globalData.splice(removeIndex, 1);

          global.moduleData.shortcut.set(threadID, globalData);
          allData[threadIndex] = threadData;
          fs.writeFileSync(dataPath, JSON.stringify(allData, null, 4), "utf-8");

          return message.reply(getText("removeSuccess"));
        }

        case "list":
        case "all":
        case "-a": {
          const data = global.moduleData.shortcut.get(threadID) || [];
          if (data.length === 0) {
            return message.reply(getText("listShortcutNull"));
          }

          const list = data.map((item, index) => 
            `${index + 1}/ ${item.input} => ${item.output}`
          ).join("\n");

          return message.reply(getText("returnListShortcut").replace("%1", list));
        }

        default: {
          return message.reply(getText("requestKeyword"), (error, info) => {
            global.client.handleReply.push({
              type: "requireInput",
              name: this.config.name,
              author: senderID,
              messageID: info.messageID
            });
          });
        }
      }
    } catch (e) {
      console.error("Shortcut onStart error:", e);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑");
    }
  }
};
