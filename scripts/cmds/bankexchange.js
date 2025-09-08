module.exports = {
  config: {
    name: "bankexchange",
    version: "1.0.0",
    role: 0,
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    category: "utility",
    shortDescription: {
      en: "𝐵𝑎𝑛𝑘 𝑒𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
      en: "𝐸𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑚𝑜𝑛𝑒𝑦 𝑎𝑛𝑑 𝑒𝑥𝑝 𝑝𝑜𝑖𝑛𝑡𝑠"
    },
    guide: {
      en: "{p}bankexchange [𝑐ℎ𝑒𝑐𝑘]"
    },
    dependencies: {
      "fs-extra": ""
    }
  },

  onLoad: function () {
    const fs = global.nodemodule["fs-extra"];
    if (!fs.existsSync(__dirname + "/cache/bill.json")) {
      const requestList = [];
      fs.writeFileSync(__dirname + "/cache/bill.json", JSON.stringify(requestList));
    }
  },

  onChat: async function ({ event, message }) {
    // Handle replies for banking system
  },

  onStart: async function ({ api, event, args, usersData }) {
    const fs = global.nodemodule["fs-extra"];
    const dirFile = __dirname + "/cache/bill.json";
    const getList = fs.readFileSync(dirFile);
    const getData = JSON.parse(getList);

    if (!args[0]) {
      return api.sendMessage(
        "🏦 𝗕𝗔𝗡𝗞 𝗘𝗫𝗖𝗛𝗔𝗡𝗚𝗘 𝗦𝗬𝗦𝗧𝗘𝗠\n━━━━━━━━━━━━━━\n" +
        "𝟭. 𝐸𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑒𝑥𝑝 💰→⭐\n" +
        "𝟮. 𝐸𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑒𝑥𝑝 𝑡𝑜 𝑚𝑜𝑛𝑒𝑦 ⭐→💰\n" +
        "𝟯. 𝑈𝑝𝑑𝑎𝑡𝑒 𝑠𝑜𝑜𝑛 ⚒\n\n" +
        "𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒",
        event.threadID,
        (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "banking"
          });
        },
        event.messageID
      );
    }

    if (args[0] == "check") {
      let workList = "📋 𝗧𝗥𝗔𝗡𝗦𝗔𝗖𝗧𝗜𝗢𝗡 𝗛𝗜𝗦𝗧𝗢𝗥𝗬\n━━━━━━━━━━━━━━\n";
      getData.forEach(item => workList += `\n${item}`);
      return api.sendMessage(workList, event.threadID, event.messageID);
    }
  },

  handleReply: async function ({ api, event, handleReply, usersData }) {
    const fs = global.nodemodule["fs-extra"];
    const dirFile = __dirname + "/cache/bill.json";
    const getList = fs.readFileSync(dirFile);
    const getData = JSON.parse(getList);

    if (handleReply.author != event.senderID) return;

    const userData = await usersData.get(handleReply.author);
    const exp = userData.exp;
    const money = userData.money;
    const d = new Date();
    const date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    const time = d.getHours() + ":" + d.getMinutes();

    switch (handleReply.type) {
      case "banking": {
        switch (event.body) {
          case "1": {
            return api.sendMessage(
              "💵 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑎𝑚𝑜𝑢𝑛𝑡 𝑜𝑓 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑒𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑡𝑜 𝑒𝑥𝑝\n𝑅𝑎𝑡𝑒: 10$ = 1⭐ 𝑒𝑥𝑝",
              event.threadID,
              (error, info) => {
                global.client.handleReply.push({
                  name: this.config.name,
                  messageID: info.messageID,
                  author: event.senderID,
                  type: "money"
                });
              },
              event.messageID
            );
          }
          case "2": {
            return api.sendMessage(
              "⭐ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑎𝑚𝑜𝑢𝑛𝑡 𝑜𝑓 𝑒𝑥𝑝 𝑡𝑜 𝑒𝑥𝑐ℎ𝑎𝑛𝑔𝑒 𝑡𝑜 𝑚𝑜𝑛𝑒𝑦\n𝑅𝑎𝑡𝑒: 5⭐ 𝑒𝑥𝑝 = 1$",
              event.threadID,
              (error, info) => {
                global.client.handleReply.push({
                  name: this.config.name,
                  messageID: info.messageID,
                  author: event.senderID,
                  type: "exp"
                });
              },
              event.messageID
            );
          }
          default:
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒", event.threadID, event.messageID);
        }
      }

      case "exp": {
        const content = parseInt(event.body);
        if (isNaN(content)) {
          return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟", event.threadID, event.messageID);
        }
        if (content > exp) {
          return api.sendMessage("❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑒𝑥𝑝 𝑝𝑜𝑖𝑛𝑡𝑠", event.threadID, event.messageID);
        }

        await usersData.increaseMoney(handleReply.author, parseInt(content / 5));
        await usersData.set(handleReply.author, { exp: exp - content });

        const msg = `✅ 𝐸𝑋𝐶𝐻𝐴𝑁𝐺𝐸 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿!\n⏰ 𝑇𝑖𝑚𝑒: ${time} - ${date}\n📊 𝐷𝑒𝑡𝑎𝑖𝑙𝑠: ${content}⭐ → ${content / 5}$`;
        
        api.sendMessage(msg, handleReply.author);
        getData.push(msg);
        fs.writeFileSync(dirFile, JSON.stringify(getData));
        
        return api.sendMessage("✅ 𝑇𝑟𝑎𝑛𝑠𝑎𝑐𝑡𝑖𝑜𝑛 𝑠𝑎𝑣𝑒𝑑 𝑡𝑜 ℎ𝑖𝑠𝑡𝑜𝑟𝑦", event.threadID, event.messageID);
      }

      case "money": {
        const content = parseInt(event.body);
        if (isNaN(content)) {
          return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟", event.threadID, event.messageID);
        }
        if (content > money) {
          return api.sendMessage("❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦", event.threadID, event.messageID);
        }

        await usersData.increaseMoney(handleReply.author, -content);
        await usersData.set(handleReply.author, { exp: exp + parseInt(content / 10) });

        const msg = `✅ 𝐸𝑋𝐶𝐻𝐴𝑁𝐺𝐸 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿!\n⏰ 𝑇𝑖𝑚𝑒: ${time} - ${date}\n📊 𝐷𝑒𝑡𝑎𝑖𝑙𝑠: ${content}$ → ${content / 10}⭐`;
        
        api.sendMessage(msg, handleReply.author);
        getData.push(msg);
        fs.writeFileSync(dirFile, JSON.stringify(getData));
        
        return api.sendMessage("✅ 𝑇𝑟𝑎𝑛𝑠𝑎𝑐𝑡𝑖𝑜𝑛 𝑠𝑎𝑣𝑒𝑑 𝑡𝑜 ℎ𝑖𝑠𝑡𝑜𝑟𝑦", event.threadID, event.messageID);
      }
    }
  }
};
