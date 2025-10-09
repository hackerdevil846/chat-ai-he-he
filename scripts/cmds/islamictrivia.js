const axios = require("axios");

const baseApiUrl = async () => {
  try {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json", {
      timeout: 10000
    });
    return base.data.mahmud;
  } catch (error) {
    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖻𝖺𝗌𝖾 𝖠𝖯𝖨 𝖴𝖱𝖫:", error.message);
    return "https://api-dien.sangnguyen206.repl.co";
  }
};

module.exports = {
  config: {
    name: "islamictrivia",
    aliases: [],
    version: "1.7",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "𝑔𝑎𝑚𝑒",
    guide: {
      en: "{p}islamictrivia [𝖻𝗇|𝖾𝗇]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("axios");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
      }

      const input = args.join("").toLowerCase() || "bn";
      const category = input === "en" || input === "english" ? "english" : "bangla";

      console.log(`🎯 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 ${category} 𝗊𝗎𝗂𝗓...`);

      const apiUrl = await baseApiUrl();
      const res = await axios.get(`${apiUrl}/api/quiz?category=${category}`, {
        timeout: 15000
      });
      
      const quiz = res.data;

      if (!quiz || !quiz.question || !quiz.correctAnswer || !quiz.options) {
        console.error("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗊𝗎𝗂𝗓 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽:", quiz);
        return message.reply("❌ 𝖭𝗈 𝗊𝗎𝗂𝗓 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗒.");
      }

      const { question, correctAnswer, options } = quiz;
      const { a, b, c, d } = options;
      
      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝖠) ${a}\n├‣ 𝖡) ${b}\n├‣ 𝖢) ${c}\n├‣ 𝖣) ${d}\n╰──────────────────‣\n𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝖺𝗇𝗌𝗐𝖾𝗋 (𝖠, 𝖡, 𝖢, 𝗈𝗋 𝖣).`,
      };

      message.reply(quizMsg, (error, info) => {
        if (error) {
          console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗊𝗎𝗂𝗓 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", error);
          return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍 𝗊𝗎𝗂𝗓. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }

        if (!global.client.handleReply) {
          global.client.handleReply = [];
        }

        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          correctAnswer: correctAnswer,
          timestamp: Date.now()
        });

        console.log(`✅ 𝖰𝗎𝗂𝗓 𝗌𝗍𝖺𝗋𝗍𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${event.senderID}, 𝖼𝗈𝗋𝗋𝖾𝖼𝗍 𝖺𝗇𝗌𝗐𝖾𝗋: ${correctAnswer}`);

        // Set timeout for quiz
        setTimeout(() => {
          const quizIndex = global.client.handleReply.findIndex(item => item.messageID === info.messageID);
          if (quizIndex !== -1) {
            message.reply(`⏰ 𝖰𝗎𝗂𝗓 𝗍𝗂𝗆𝖾𝗈𝗎𝗍! 𝖳𝗁𝖾 𝖼𝗈𝗋𝗋𝖾𝖼𝗍 𝖺𝗇𝗌𝗐𝖾𝗋 𝗐𝖺𝗌: ${correctAnswer}`);
            global.client.handleReply.splice(quizIndex, 1);
            console.log(`⏰ 𝖰𝗎𝗂𝗓 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍 𝖿𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖨𝖣: ${info.messageID}`);
          }
        }, 40000);

      });

    } catch (error) {
      console.error("💥 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝖳𝗋𝗂𝗏𝗂𝖺 𝖤𝗋𝗋𝗈𝗋:", error);
      
      let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗊𝗎𝗂𝗓. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
      }
      
      message.reply(errorMessage);
    }
  },

  onReply: async function ({ event, message, Reply, usersData }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("axios");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
      }

      const { correctAnswer, author, timestamp } = Reply;
      
      // Check if quiz is expired (more than 45 seconds)
      if (Date.now() - timestamp > 45000) {
        return message.reply("⏰ 𝖳𝗁𝗂𝗌 𝗊𝗎𝗂𝗓 𝗁𝖺𝗌 𝖾𝗑𝗉𝗂𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗍𝖺𝗋𝗍 𝖺 𝗇𝖾𝗐 𝗈𝗇𝖾.");
      }

      if (event.senderID !== author) {
        return message.reply("❌ 𝖳𝗁𝗂𝗌 𝗂𝗌 𝗇𝗈𝗍 𝗒𝗈𝗎𝗋 𝗊𝗎𝗂𝗓.");
      }

      const userReply = event.body.trim().toLowerCase();
      const validAnswers = ['a', 'b', 'c', 'd'];

      if (!validAnswers.includes(userReply)) {
        return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖠, 𝖡, 𝖢, 𝗈𝗋 𝖣 𝗈𝗇𝗅𝗒.");
      }

      if (userReply === correctAnswer.toLowerCase()) {
        const rewardCoins = 500;
        const rewardExp = 121;
        
        try {
          const userData = await usersData.get(author);
          
          await usersData.set(author, {
            money: (userData.money || 0) + rewardCoins,
            exp: (userData.exp || 0) + rewardExp,
            data: userData.data || {}
          });
          
          console.log(`✅ 𝖴𝗌𝖾𝗋 ${author} 𝖺𝗇𝗌𝗐𝖾𝗋𝖾𝖽 𝖼𝗈𝗋𝗋𝖾𝖼𝗍𝗅𝗒, 𝗋𝖾𝗐𝖺𝗋𝖽𝖾𝖽 ${rewardCoins} 𝖼𝗈𝗂𝗇𝗌 & ${rewardExp} 𝖾𝗑𝗉`);
          
          message.reply(`✅ | 𝖢𝗈𝗋𝗋𝖾𝖼𝗍 𝖺𝗇𝗌𝗐𝖾𝗋!\n𝖸𝗈𝗎 𝖾𝖺𝗋𝗇𝖾𝖽 ${rewardCoins} 𝖼𝗈𝗂𝗇𝗌 & ${rewardExp} 𝖾𝗑𝗉.`);
        } catch (userError) {
          console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError);
          message.reply(`✅ | 𝖢𝗈𝗋𝗋𝖾𝖼𝗍 𝖺𝗇𝗌𝗐𝖾𝗋! (𝖱𝖾𝗐𝖺𝗋𝖽𝗌 𝗇𝗈𝗍 𝖺𝗉𝗉𝗅𝗂𝖾𝖽 𝖽𝗎𝖾 𝗍𝗈 𝖾𝗋𝗋𝗈𝗋)`);
        }
      } else {
        console.log(`❌ 𝖴𝗌𝖾𝗋 ${author} 𝖺𝗇𝗌𝗐𝖾𝗋𝖾𝖽 𝗂𝗇𝖼𝗈𝗋𝗋𝖾𝖼𝗍𝗅𝗒: ${userReply}, 𝖼𝗈𝗋𝗋𝖾𝖼𝗍: ${correctAnswer}`);
        message.reply(`❌ | 𝖶𝗋𝗈𝗇𝗀 𝖺𝗇𝗌𝗐𝖾𝗋!\n𝖳𝗁𝖾 𝖼𝗈𝗋𝗋𝖾𝖼𝗍 𝖺𝗇𝗌𝗐𝖾𝗋 𝗐𝖺𝗌: ${correctAnswer}`);
      }

      // Remove the reply handler
      const replyIndex = global.client.handleReply.findIndex(item => item.messageID === Reply.messageID);
      if (replyIndex !== -1) {
        global.client.handleReply.splice(replyIndex, 1);
        console.log(`🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗊𝗎𝗂𝗓 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖿𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖨𝖣: ${Reply.messageID}`);
      }

    } catch (error) {
      console.error("💥 𝖱𝖾𝗉𝗅𝗒 𝖤𝗋𝗋𝗈𝗋:", error);
      message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖺𝗇𝗌𝗐𝖾𝗋.");
    }
  }
};
