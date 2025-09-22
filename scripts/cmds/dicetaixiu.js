const axios = require('axios');
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "dicetaixiu",
    aliases: ["dicebet", "dicegambling"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "🎲 𝐷𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙 𝑏𝑒𝑡𝑡𝑖𝑛𝑔"
    },
    longDescription: {
      en: "𝑇𝑎𝑖 𝑋𝑖𝑢 𝑑𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙 𝑏𝑒𝑡𝑡𝑖𝑛𝑔 𝑜𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    category: "𝑒𝑛𝑡𝑒𝑟𝑡𝑎𝑖𝑛𝑚𝑒𝑛𝑡",
    guide: {
      en: "{p}dicetaixiu [𝑏𝑖𝑔/𝑠𝑚𝑎𝑙𝑙] [𝑎𝑚𝑜𝑢𝑛𝑡]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, event, args, Users, Currencies }) {
    try {
      const { senderID, messageID, threadID } = event;
      const dataMoney = await Currencies.getData(senderID);
      const moneyUser = dataMoney.money;
      
      const quotes = [
        "𝐺𝑎𝑚𝑏𝑙𝑖𝑛𝑔 𝑖𝑠 𝑡ℎ𝑒 𝑓𝑎𝑡ℎ𝑒𝑟 𝑜𝑓 𝑝𝑜𝑣𝑒𝑟𝑡𝑦",
        "𝑌𝑜𝑢 𝑝𝑙𝑎𝑦, 𝑦𝑜𝑢 𝑤𝑖𝑛, 𝑦𝑜𝑢 𝑝𝑙𝑎𝑦, 𝑦𝑜𝑢 𝑙𝑜𝑠𝑒. 𝑌𝑜𝑢 𝑘𝑒𝑒𝑝 𝑝𝑙𝑎𝑦𝑖𝑛𝑔.",
        "𝑇ℎ𝑜𝑠𝑒 𝑤ℎ𝑜 𝑑𝑜𝑛'𝑡 𝑝𝑙𝑎𝑦 𝑛𝑒𝑣𝑒𝑟 𝑤𝑖𝑛",
        "𝑇ℎ𝑒 𝑠𝑎𝑓𝑒𝑠𝑡 𝑤𝑎𝑦 𝑡𝑜 𝑑𝑜𝑢𝑏𝑙𝑒 𝑦𝑜𝑢𝑟 𝑚𝑜𝑛𝑒𝑦 𝑖𝑠 𝑡𝑜 𝑓𝑜𝑙𝑑 𝑖𝑡 𝑜𝑛𝑐𝑒 𝑎𝑛𝑑 𝑝𝑢𝑡 𝑖𝑡 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑝𝑜𝑐𝑘𝑒𝑡.",
        "𝐺𝑎𝑚𝑏𝑙𝑖𝑛𝑔 𝑖𝑠 𝑎𝑛 𝑖𝑛ℎ𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑖𝑛𝑐𝑖𝑝𝑙𝑒 𝑜𝑓 ℎ𝑢𝑚𝑎𝑛 𝑛𝑎𝑡𝑢𝑟𝑒.",
        "𝐸𝑎𝑡 𝑦𝑜𝑢𝑟 𝑏𝑒𝑡𝑡𝑖𝑛𝑔 𝑚𝑜𝑛𝑒𝑦 𝑏𝑢𝑡 𝑑𝑜𝑛'𝑡 𝑏𝑒𝑡 𝑦𝑜𝑢𝑟 𝑒𝑎𝑡𝑖𝑛𝑔 𝑚𝑜𝑛𝑒𝑦",
        "𝐺𝑎𝑚𝑏𝑙𝑖𝑛𝑔 𝑐𝑜𝑠𝑡𝑠 𝑢𝑠 𝑡ℎ𝑒 𝑡𝑤𝑜 𝑚𝑜𝑠𝑡 𝑝𝑟𝑒𝑐𝑖𝑜𝑢𝑠 𝑡ℎ𝑖𝑛𝑔𝑠 𝑖𝑛 𝑙𝑖𝑓𝑒: 𝑡𝑖𝑚𝑒 𝑎𝑛𝑑 𝑚𝑜𝑛𝑒𝑦"
      ];
      
      const name = await Users.getNameUser(senderID);
      
      const imageUrls = [
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/3",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/4",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/5",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/6",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/7",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/8",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/9",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/10",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/11",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/12",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/13",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/14",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/15",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/16",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/17",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/18"
      ];

      if (!args[0]) {
        return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑦𝑜𝑢𝑟 𝑏𝑒𝑡: 𝑏𝑖𝑔 𝑜𝑟 𝑠𝑚𝑎𝑙𝑙...");
      }
      
      const choose = args[0].toLowerCase();
      if (choose !== 'big' && choose !== 'small') {
        return message.reply("𝑂𝑛𝑙𝑦 𝑏𝑒𝑡 𝑜𝑛 𝑏𝑖𝑔 𝑜𝑟 𝑠𝑚𝑎𝑙𝑙!");
      }
      
      const money = parseInt(args[1]);
      if (money < 500 || isNaN(money)) {
        return message.reply("𝑌𝑜𝑢𝑟 𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 𝑖𝑠 𝑖𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑟 𝑏𝑒𝑙𝑜𝑤 500$!!!");
      }
      
      if (moneyUser < money) {
        return message.reply(`𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ ${money}$ 𝑡𝑜 𝑝𝑙𝑎𝑦\n𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑖𝑠 ${moneyUser}$`);
      }

      try {
        const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        const res = await axios.get(randomUrl);
        const ketqua = res.data.total;
        const result = res.data.result.toLowerCase();
        const images = [];
        
        for (let i in res.data.images) {
          const path = __dirname + `/cache/${i}.png`;
          const imgData = (await axios.get(res.data.images[i], { responseType: "arraybuffer" })).data;
          fs.writeFileSync(path, Buffer.from(imgData, "utf-8"));
          images.push(fs.createReadStream(path));
        }

        if (choose === result) {
          await Currencies.increaseMoney(senderID, parseInt(money * 1));
          message.reply({
            attachment: images,
            body: `====== 𝐷𝐼𝐶𝐸 𝐺𝐴𝑀𝐸 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 ======\n` +
              `👤 𝑃𝑙𝑎𝑦𝑒𝑟: ${name}\n` +
              `✅ 𝑅𝑒𝑠𝑢𝑙𝑡: ${result}\n` +
              `🎲 𝑇𝑜𝑡𝑎𝑙 𝐷𝑖𝑐𝑒: ${ketqua}\n` +
              `🎯 𝑌𝑜𝑢𝑟 𝐶ℎ𝑜𝑖𝑐𝑒: ${choose}\n` +
              `💰 𝑌𝑜𝑢 𝑤𝑜𝑛: ${money * 1}$\n` +
              `📈 𝑆𝑡𝑎𝑡𝑢𝑠: 𝑅𝑒𝑤𝑎𝑟𝑑 𝑃𝑎𝑖𝑑\n` +
              `──────────────────\n` +
              `💼 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: ${moneyUser + money * 1}$\n` +
              `💡 𝐴𝑑𝑣𝑖𝑐𝑒: ${quotes[Math.floor(Math.random() * quotes.length)]}\n` +
              `====== 𝐺𝐴𝑀𝐸 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸𝐷 ======`
          });
        } else {
          await Currencies.decreaseMoney(senderID, parseInt(money));
          message.reply({
            attachment: images,
            body: `====== 𝐷𝐼𝐶𝐸 𝐺𝐴𝑀𝐸 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 ======\n` +
              `👤 𝑃𝑙𝑎𝑦𝑒𝑟: ${name}\n` +
              `✅ 𝑅𝑒𝑠𝑢𝑙𝑡: ${result}\n` +
              `🎲 𝑇𝑜𝑡𝑎𝑙 𝐷𝑖𝑐𝑒: ${ketqua}\n` +
              `🎯 𝑌𝑜𝑢𝑟 𝐶ℎ𝑜𝑖𝑐𝑒: ${choose}\n` +
              `💔 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡: ${money * 1}$\n` +
              `📉 𝑆𝑡𝑎𝑡𝑢𝑠: 𝐴𝑚𝑜𝑢𝑛𝑡 𝐷𝑒𝑑𝑢𝑐𝑡𝑒𝑑\n` +
              `──────────────────\n` +
              `💼 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: ${moneyUser - money * 1}$\n` +
              `💡 𝐴𝑑𝑣𝑖𝑐𝑒: ${quotes[Math.floor(Math.random() * quotes.length)]}\n` +
              `====== 𝐺𝐴𝑀𝐸 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸𝐷 ======`
          });
        }

        for (let i = 0; i < images.length; i++) {
          try {
            fs.unlinkSync(__dirname + `/cache/${i}.png`);
          } catch (err) {
            console.log("𝐸𝑟𝑟𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑐𝑎𝑐ℎ𝑒𝑑 𝑖𝑚𝑎𝑔𝑒:", err);
          }
        }

      } catch (err) {
        console.error("𝐷𝑖𝑐𝑒 𝑔𝑎𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", err);
        return message.reply("𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒");
      }
      
    } catch (error) {
      console.error("𝐺𝑒𝑛𝑒𝑟𝑎𝑙 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑");
    }
  }
};
