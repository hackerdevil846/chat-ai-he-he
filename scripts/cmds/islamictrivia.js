const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports.config = {
  name: "islamictrivia",
  aliases: ["islamictrv", "istrv"],
  version: "1.7",
  author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
  countDown: 10,
  role: 0,
  category: "𝑔𝑎𝑚𝑒",
  guide: {
    en: "{p}islamictrivia [𝑏𝑛|𝑒𝑛]"
  },
  dependencies: {
    "axios": ""
  }
};

module.exports.onStart = async function ({ message, event, args, usersData }) {
  try {
    // Check if axios is available
    if (!axios) {
      return message.reply("❌ 𝐴𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑖𝑠 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒", event.threadID, event.messageID);
    }

    const input = args.join("").toLowerCase() || "bn";
    const category = input === "en" || input === "english" ? "english" : "bangla";

    const apiUrl = await baseApiUrl();
    const res = await axios.get(`${apiUrl}/api/quiz?category=${category}`);
    const quiz = res.data;

    if (!quiz) {
      return message.reply("❌ 𝑁𝑜 𝑞𝑢𝑖𝑧 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦.", event.threadID, event.messageID);
    }

    const { question, correctAnswer, options } = quiz;
    const { a, b, c, d } = options;
    
    const quizMsg = {
      body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑎𝑛𝑠𝑤𝑒𝑟.`,
    };

    message.reply(quizMsg, (error, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        correctAnswer: correctAnswer
      });

      setTimeout(() => {
        if (global.client.handleReply.some(item => item.messageID === info.messageID)) {
          message.reply("⏰ 𝑄𝑢𝑖𝑧 𝑡𝑖𝑚𝑒𝑜𝑢𝑡! 𝑇ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟 𝑤𝑎𝑠: " + correctAnswer, event.threadID);
          global.client.handleReply = global.client.handleReply.filter(item => item.messageID !== info.messageID);
        }
      }, 40000);
    });

  } catch (error) {
    console.error("𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑇𝑟𝑖𝑣𝑖𝑎 𝐸𝑟𝑟𝑜𝑟:", error);
    message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑞𝑢𝑖𝑧. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ event, message, Reply, usersData }) {
  try {
    const { correctAnswer, author } = Reply;
    
    if (event.senderID !== author) {
      return message.reply("𝑇ℎ𝑖𝑠 𝑖𝑠 𝑛𝑜𝑡 𝑦𝑜𝑢𝑟 𝑞𝑢𝑖𝑧 𝑏𝑎𝑏𝑦 >🐸", event.threadID, event.messageID);
    }

    const userReply = event.body.trim().toLowerCase();

    if (userReply === correctAnswer.toLowerCase()) {
      const rewardCoins = 500;
      const rewardExp = 121;
      const userData = await usersData.get(author);
      
      await usersData.set(author, {
        money: userData.money + rewardCoins,
        exp: userData.exp + rewardExp,
        data: userData.data
      });
      
      message.reply(`✅ | 𝐶𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟 𝑏𝑎𝑏𝑦\n𝑌𝑜𝑢 𝑒𝑎𝑟𝑛𝑒𝑑 ${rewardCoins} 𝑐𝑜𝑖𝑛𝑠 & ${rewardExp} 𝑒𝑥𝑝.`, event.threadID, event.messageID);
    } else {
      message.reply(`❌ | 𝑊𝑟𝑜𝑛𝑔 𝑎𝑛𝑠𝑤𝑒𝑟 𝑏𝑎𝑏𝑦\n𝑇ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟 𝑤𝑎𝑠: ${correctAnswer}`, event.threadID, event.messageID);
    }

    // Remove the reply handler
    global.client.handleReply = global.client.handleReply.filter(item => item.messageID !== Reply.messageID);

  } catch (error) {
    console.error("𝑅𝑒𝑝𝑙𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
    message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑎𝑛𝑠𝑤𝑒𝑟.", event.threadID, event.messageID);
  }
};
