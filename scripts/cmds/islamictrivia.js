const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "islamictrivia",
    aliases: ["islamictrv", "istrv"],
    version: "1.7",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "𝑔𝑎𝑚𝑒",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, usersData, args }) {
    try {
      const input = args.join("").toLowerCase() || "bn";
      const category = input === "en" || input === "english" ? "english" : "bangla";

      const apiUrl = await baseApiUrl();
      const res = await axios.get(`${apiUrl}/api/quiz?category=${category}`);
      const quiz = res.data;

      if (!quiz) {
        return api.sendMessage("❌ 𝑁𝑜 𝑞𝑢𝑖𝑧 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦.", event.threadID, event.messageID);
      }

      const { question, correctAnswer, options } = quiz;
      const { a, b, c, d } = options;
      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑎𝑛𝑠𝑤𝑒𝑟.`,
      };

      api.sendMessage(quizMsg, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "reply",
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          correctAnswer
        });

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 40000);
      }, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑞𝑢𝑖𝑧. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { correctAnswer, author } = Reply;
    if (event.senderID !== author) return api.sendMessage("𝑇ℎ𝑖𝑠 𝑖𝑠 𝑛𝑜𝑡 𝑦𝑜𝑢𝑟 𝑞𝑢𝑖𝑧 𝑏𝑎𝑏𝑦 >🐸", event.threadID, event.messageID);

    await api.unsendMessage(Reply.messageID);
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
      api.sendMessage(`✅ | 𝐶𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟 𝑏𝑎𝑏𝑦\n𝑌𝑜𝑢 𝑒𝑎𝑟𝑛𝑒𝑑 ${rewardCoins} 𝑐𝑜𝑖𝑛𝑠 & ${rewardExp} 𝑒𝑥𝑝.`, event.threadID, event.messageID);
    } else {
      api.sendMessage(`❌ | 𝑊𝑟𝑜𝑛𝑔 𝑎𝑛𝑠𝑤𝑒𝑟 𝑏𝑎𝑏𝑦\n𝑇ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟 𝑤𝑎𝑠: ${correctAnswer}`, event.threadID, event.messageID);
    }
  }
};
