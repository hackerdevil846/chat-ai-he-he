const request = require("request");
const { createReadStream, createWriteStream, existsSync } = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "fruitmachine",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "game",
    shortDescription: {
      en: "𝐹𝑟𝑢𝑖𝑡 𝑠𝑙𝑜𝑡 𝑚𝑎𝑐ℎ𝑖𝑛𝑒 𝑔𝑎𝑚𝑒"
    },
    longDescription: {
      en: "𝑃𝑙𝑎𝑦 𝑓𝑟𝑢𝑖𝑡 𝑠𝑙𝑜𝑡 𝑚𝑎𝑐ℎ𝑖𝑛𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑒𝑡𝑡𝑖𝑛𝑔"
    },
    guide: {
      en: "{p}fruitmachine [𝑓𝑟𝑢𝑖𝑡 𝑛𝑎𝑚𝑒] [𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡]"
    },
    countDown: 5,
    dependencies: {
      "request": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  onLoad: async function () {
    const imageUrls = {
      'nho': 'https://i.imgur.com/tmKK6Yj.jpg',
      'dua': 'https://i.imgur.com/mBTKhUW.jpg',
      'dao': 'https://i.imgur.com/2qgYuDr.jpg',
      'tao': 'https://i.imgur.com/tXG56lV.jpg',
      'dau': 'https://i.imgur.com/PLQkfy3.jpg',
      'bay': 'https://i.imgur.com/1UBI1nc.jpg',
      'slot': 'https://i.imgur.com/QP7xZz4.gif'
    };

    for (const [key, url] of Object.entries(imageUrls)) {
      const path = `${__dirname}/cache/${key}.jpg`;
      if (!existsSync(path)) {
        request(url).pipe(createWriteStream(path));
      }
    }
  },

  onStart: async function({ api, event, args, usersData }) {
    const slotItems = ["nho", "dua", "dao", "tao", "dau", "bay"];
    const userMoney = (await usersData.get(event.senderID)).money;
    const betAmount = parseInt(args[1]);
    const fruitChoice = args[0]?.toLowerCase();

    if (!fruitChoice || !isNaN(fruitChoice)) {
      return api.sendMessage("𝑈𝑠𝑒: {p}fruitmachine [𝑔𝑟𝑎𝑝𝑒/𝑚𝑒𝑙𝑜𝑛/𝑝𝑒𝑎𝑐ℎ/𝑎𝑝𝑝𝑙𝑒/𝑠𝑡𝑟𝑎𝑤𝑏𝑒𝑟𝑟𝑦/𝑠𝑒𝑣𝑒𝑛] [𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡]", event.threadID, event.messageID);
    }

    if (isNaN(betAmount) || betAmount <= 0) {
      return api.sendMessage("𝐵𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑎 𝑝𝑜𝑠𝑖𝑡𝑖𝑣𝑒 𝑛𝑢𝑚𝑏𝑒𝑟", event.threadID, event.messageID);
    }

    if (betAmount > userMoney) {
      return api.sendMessage("𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑏𝑒𝑡 𝑡ℎ𝑎𝑡 𝑎𝑚𝑜𝑢𝑛𝑡", event.threadID, event.messageID);
    }

    if (betAmount < 10000) {
      return api.sendMessage("𝑀𝑖𝑛𝑖𝑚𝑢𝑚 𝑏𝑒𝑡 𝑖𝑠 10000", event.threadID, event.messageID);
    }

    const fruitIcons = {
      "nho": "🍇",
      "dua": "🍉", 
      "dao": "🍑",
      "tao": "🍎",
      "dau": "🍓",
      "bay": "➐"
    };

    if (!fruitIcons[fruitChoice]) {
      return api.sendMessage("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑟𝑢𝑖𝑡 𝑐ℎ𝑜𝑖𝑐𝑒. 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒: 𝑔𝑟𝑎𝑝𝑒, 𝑚𝑒𝑙𝑜𝑛, 𝑝𝑒𝑎𝑐ℎ, 𝑎𝑝𝑝𝑙𝑒, 𝑠𝑡𝑟𝑎𝑤𝑏𝑒𝑟𝑟𝑦, 𝑠𝑒𝑣𝑒𝑛", event.threadID, event.messageID);
    }

    const results = [];
    for (let i = 0; i < 3; i++) {
      results[i] = slotItems[Math.floor(Math.random() * slotItems.length)];
    }

    const resultIcons = results.map(fruit => fruitIcons[fruit]);
    const resultImages = results.map(fruit => createReadStream(`${__dirname}/cache/${fruit}.jpg`));

    api.sendMessage({
      body: "𝑆𝑝𝑖𝑛𝑛𝑖𝑛𝑔...",
      attachment: createReadStream(__dirname + "/cache/slot.gif")
    }, event.threadID, async (error, info) => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      api.unsendMessage(info.messageID);

      const matchCount = results.filter(result => result === fruitChoice).length;
      let winAmount = 0;
      let message = "";

      if (matchCount > 0) {
        winAmount = betAmount * matchCount;
        await usersData.set(event.senderID, {
          money: userMoney + winAmount
        });
        message = `[ 𝐹𝑅𝑈𝐼𝑇 𝑀𝐴𝐶𝐻𝐼𝑁𝐸 ]\n━━━━━━━━━━━━━━━━━━\n${resultIcons.join(" | ")}\n\n𝑌𝑜𝑢 𝑔𝑜𝑡 ${matchCount} ${fruitIcons[fruitChoice]}\n𝑌𝑜𝑢 𝑤𝑜𝑛: ${winAmount}\n𝑁𝑒𝑤 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${userMoney + winAmount}`;
      } else {
        await usersData.set(event.senderID, {
          money: userMoney - betAmount
        });
        message = `[ 𝐹𝑅𝑈𝐼𝑇 𝑀𝐴𝐶𝐻𝐼𝑁𝐸 ]\n━━━━━━━━━━━━━━━━━━\n${resultIcons.join(" | ")}\n\n𝑁𝑜 ${fruitIcons[fruitChoice]} 𝑓𝑜𝑢𝑛𝑑\n𝑌𝑜𝑢 𝑙𝑜𝑠𝑡: ${betAmount}\n𝑁𝑒𝑤 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${userMoney - betAmount}`;
      }

      api.sendMessage({
        body: message,
        attachment: resultImages
      }, event.threadID, event.messageID);
    });
  }
};
