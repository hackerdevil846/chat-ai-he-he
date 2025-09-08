const axios = require('axios');
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "dicetaixiu",
    aliases: ["dicebet"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Dice game with big/small betting"
    },
    longDescription: {
      en: "Tai Xiu dice game with big/small betting options"
    },
    category: "entertainment",
    guide: {
      en: "{p}dicetaixiu [big/small] [amount]"
    }
  },

  onStart: async function ({ api, event, args, Currencies, Users }) {
    try {
      // Check for dependencies
      if (!axios) throw new Error("Missing axios dependency");
      if (!fs) throw new Error("Missing fs-extra dependency");
      
      const { senderID, messageID, threadID } = event;
      const dataMoney = await Currencies.getData(senderID);
      const moneyUser = dataMoney.money;
      
      // Gambling quotes
      const quotes = [
        "Gambling is the father of poverty",
        "You play, you win, you play, you lose. You keep playing.",
        "Those who don't play never win",
        "You never know what's worse than the bad luck you have.",
        "The safest way to double your money is to fold it once and put it in your pocket.",
        "Gambling is an inherent principle of human nature.",
        "The best way to throw dice is to throw them away and stop playing.",
        "Eat your betting money but don't bet your eating money",
        "Bet small, when you win you lose more",
        "Gambling costs us the two most precious things in life: time and money",
        "Gambling has winners and losers, few win but many lose."
      ];
      
      const name = await Users.getNameUser(senderID);
      
      // Image URLs for dice results
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
        return api.sendMessage("Please specify your bet: big or small...", threadID, messageID);
      }
      
      const choose = args[0].toLowerCase();
      if (choose !== 'big' && choose !== 'small') {
        return api.sendMessage("Only bet on big or small!", threadID, messageID);
      }
      
      const money = parseInt(args[1]);
      if (money < 500 || isNaN(money)) {
        return api.sendMessage("Your bet amount is invalid or below 500$!!!", threadID, messageID);
      }
      
      if (moneyUser < money) {
        return api.sendMessage(`You don't have enough ${money}$ to play\nYour current balance is ${moneyUser}$`, threadID, messageID);
      }

      try {
        const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        const res = await axios.get(randomUrl);
        const ketqua = res.data.total;
        const result = res.data.result.toLowerCase(); // Convert to lowercase for comparison
        const images = [];
        
        // Download and process dice images
        for (let i in res.data.images) {
          const path = __dirname + `/cache/${i}.png`;
          const imgData = (await axios.get(res.data.images[i], { responseType: "arraybuffer" })).data;
          fs.writeFileSync(path, Buffer.from(imgData, "utf-8"));
          images.push(fs.createReadStream(path));
        }

        if (choose === result) {
          // Player wins
          await Currencies.increaseMoney(senderID, parseInt(money * 1));
          api.sendMessage({
            attachment: images,
            body: `====== DICE GAME RESULTS ======\n` +
              `👤 Player: ${name}\n` +
              `✅ Result: ${result}\n` +
              `🎲 Total Dice: ${ketqua}\n` +
              `🎯 Your Choice: ${choose}\n` +
              `💰 You won: ${money * 1}$\n` +
              `📈 Status: Reward Paid\n` +
              `──────────────────\n` +
              `💼 Current Balance: ${moneyUser + money * 1}$\n` +
              `💡 Advice: ${quotes[Math.floor(Math.random() * quotes.length)]}\n` +
              `====== GAME COMPLETED ======`
          }, threadID, messageID);
        } else {
          // Player loses
          await Currencies.decreaseMoney(senderID, parseInt(money));
          api.sendMessage({
            attachment: images,
            body: `====== DICE GAME RESULTS ======\n` +
              `👤 Player: ${name}\n` +
              `✅ Result: ${result}\n` +
              `🎲 Total Dice: ${ketqua}\n` +
              `🎯 Your Choice: ${choose}\n` +
              `💔 You lost: ${money * 1}$\n` +
              `📉 Status: Amount Deducted\n` +
              `──────────────────\n` +
              `💼 Current Balance: ${moneyUser - money * 1}$\n` +
              `💡 Advice: ${quotes[Math.floor(Math.random() * quotes.length)]}\n` +
              `====== GAME COMPLETED ======`
          }, threadID, messageID);
        }

        // Clean up cached images
        for (let i = 0; i < images.length; i++) {
          try {
            fs.unlinkSync(__dirname + `/cache/${i}.png`);
          } catch (err) {
            console.log("Error deleting cached image:", err);
          }
        }

      } catch (err) {
        console.error("Dice game error:", err);
        return api.sendMessage("An error occurred while processing the game", threadID, messageID);
      }
      
    } catch (error) {
      console.error("General error:", error);
      api.sendMessage("❌ An error occurred", event.threadID, event.messageID);
    }
  }
};
