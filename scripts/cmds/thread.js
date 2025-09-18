module.exports = {
  config: {
    name: "thread",
    aliases: ["groupadmin", "threadadmin"],
    version: "0.0.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🛠️ 𝐺𝑟𝑜𝑢𝑝 𝑏𝑎𝑛/𝑢𝑛𝑏𝑎𝑛 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    longDescription: {
      en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑏𝑎𝑛𝑠 𝑎𝑛𝑑 𝑢𝑛𝑏𝑎𝑛𝑠 𝑤𝑖𝑡ℎ 𝑐𝑜𝑛𝑓𝑖𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    guide: {
      en: "{p}thread [𝑢𝑛𝑏𝑎𝑛/𝑏𝑎𝑛/𝑠𝑒𝑎𝑟𝑐ℎ] [𝐼𝐷 𝑜𝑟 𝑡𝑒𝑥𝑡]"
    },
    countDown: 5
  },

  handleReaction: async function ({ event, api, threadsData, handleReaction }) {
    try {
      // Ensure only the original author can confirm by reaction
      if (String(event.userID) !== String(handleReaction.author)) return;

      switch (handleReaction.type) {
        case "ban": {
          const threadObj = (await threadsData.get(String(handleReaction.target))) || {};
          const data = threadObj.data || {};
          data.banned = 1;
          await threadsData.set(handleReaction.target, { data });
          if (!global.data) global.data = {};
          if (!global.data.threadBanned) global.data.threadBanned = new Map();
          global.data.threadBanned.set(parseInt(handleReaction.target), 1);
          api.sendMessage(`[${handleReaction.target}] 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑏𝑎𝑛𝑛𝑒𝑑!`, event.threadID, () => {
            try { api.unsendMessage(handleReaction.messageID); } catch(e) {}
          });
          break;
        }
        case "unban": {
          const threadObj = (await threadsData.get(String(handleReaction.target))) || {};
          const data = threadObj.data || {};
          data.banned = 0;
          await threadsData.set(handleReaction.target, { data });
          if (global.data && global.data.threadBanned) global.data.threadBanned.delete(parseInt(handleReaction.target));
          api.sendMessage(`[${handleReaction.target}] 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑!`, event.threadID, () => {
            try { api.unsendMessage(handleReaction.messageID); } catch(e) {}
          });
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error(err);
    }
  },

  onStart: async function ({ event, api, args, threadsData, message }) {
    try {
      if (!args || args.length === 0) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎𝑛 𝑎𝑐𝑡𝑖𝑜𝑛: 𝑏𝑎𝑛, 𝑢𝑛𝑏𝑎𝑛, 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ");
      }

      const action = String(args[0]).toLowerCase();
      const content = args.slice(1);

      switch (action) {
        case "ban": {
          if (content.length == 0) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑔𝑟𝑜𝑢𝑝 𝐼𝐷𝑠 𝑡𝑜 𝑏𝑎𝑛!");

          for (let idThreadRaw of content) {
            const idThread = parseInt(idThreadRaw);
            if (isNaN(idThread)) {
              await message.reply(`[${idThreadRaw}] 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷!`);
              continue;
            }

            const threadObj = await threadsData.get(String(idThread));
            if (!threadObj) {
              await message.reply(`[${idThread}] 𝑇ℎ𝑟𝑒𝑎𝑑 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒!`);
              continue;
            }

            const data = threadObj.data || {};
            if (data.banned) {
              await message.reply(`[${idThread}] 𝐴𝑙𝑟𝑒𝑎𝑑𝑦 𝑏𝑎𝑛𝑛𝑒𝑑!`);
              continue;
            }

            // Ask for reaction confirmation to ban
            await message.reply(
              `[${idThread}] 𝐷𝑜 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑏𝑎𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑?\n\n𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 𝑏𝑎𝑛!`,
              (error, info) => {
                try {
                  if (!global.client) global.client = {};
                  if (!global.client.handleReaction) global.client.handleReaction = [];
                  global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "ban",
                    target: idThread
                  });
                } catch (e) { console.error(e); }
              }
            );
          }
          break;
        }
        case "unban": {
          if (content.length == 0) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑔𝑟𝑜𝑢𝑝 𝐼𝐷𝑠 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛!");

          for (let idThreadRaw of content) {
            const idThread = parseInt(idThreadRaw);
            if (isNaN(idThread)) {
              await message.reply(`[${idThreadRaw}] 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷!`);
              continue;
            }

            const threadObj = await threadsData.get(String(idThread));
            if (!threadObj) {
              await message.reply(`[${idThread}] 𝑇ℎ𝑟𝑒𝑎𝑑 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒!`);
              continue;
            }

            const data = threadObj.data || {};
            if (data.banned != 1) {
              await message.reply(`[${idThread}] 𝑁𝑜𝑡 𝑏𝑎𝑛𝑛𝑒𝑑!`);
              continue;
            }

            // Ask for reaction confirmation to unban
            await message.reply(
              `[${idThread}] 𝐷𝑜 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑?\n\n𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 𝑢𝑛𝑏𝑎𝑛!`,
              (error, info) => {
                try {
                  if (!global.client) global.client = {};
                  if (!global.client.handleReaction) global.client.handleReaction = [];
                  global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "unban",
                    target: idThread
                  });
                } catch (e) { console.error(e); }
              }
            );
          }
          break;
        }
        case "search": {
          if (content.length === 0) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑥𝑡!");
          const contentJoin = content.join(" ");
          const all = await threadsData.getAll(['threadID', 'name']);
          const getThreads = (all || []).filter(item => !!item.name);
          let matchThreads = [];
          getThreads.forEach(i => {
            if (i.name && i.name.toLowerCase().includes(contentJoin.toLowerCase())) {
              matchThreads.push({
                name: i.name,
                id: i.threadID
              });
            }
          });
          if (matchThreads.length === 0) return message.reply("❌ 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ!");
          let a = "", b = 0;
          matchThreads.forEach(i => a += `\n${++b}. ${i.name} - ${i.id}`);
          return message.reply(`🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠: \n${a}`);
        }
        default: {
          return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑐𝑡𝑖𝑜𝑛! 𝑈𝑠𝑒: 𝑏𝑎𝑛, 𝑢𝑛𝑏𝑎𝑛, 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ");
        }
      }
    } catch (err) {
      console.error(err);
      return message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${err.message || err}`);
    }
  }
};
