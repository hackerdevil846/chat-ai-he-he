const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

module.exports = {
  config: {
    name: "quizgame",
    aliases: ["quizme", "trivia"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "games",
    shortDescription: {
      en: "🎯 𝑃𝑙𝑎𝑦 𝑎 𝑞𝑢𝑖𝑧 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛𝑠"
    },
    longDescription: {
      en: "𝑇𝑒𝑠𝑡 𝑦𝑜𝑢𝑟 𝑘𝑛𝑜𝑤𝑙𝑒𝑑𝑔𝑒 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑞𝑢𝑖𝑧 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛𝑠 𝑓𝑟𝑜𝑚 𝐽𝑆𝑂𝑁 𝑓𝑖𝑙𝑒𝑠"
    },
    guide: {
      en: "{p}quizgame"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const quizDataPath = path.join(__dirname, 'json');
      
      if (!fs.existsSync(quizDataPath)) {
        return message.reply("❌ 𝑄𝑢𝑖𝑧 𝑑𝑎𝑡𝑎 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.");
      }

      const allFiles = fs.readdirSync(quizDataPath).filter(file => file.endsWith('.json'));
      
      if (allFiles.length === 0) {
        return message.reply("❌ 𝑁𝑜 𝑞𝑢𝑖𝑧 𝑑𝑎𝑡𝑎 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.");
      }

      const randomFile = allFiles[crypto.randomInt(allFiles.length)];
      const filePath = path.join(quizDataPath, randomFile);

      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (!Array.isArray(data) || data.length === 0) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑞𝑢𝑖𝑧 𝑑𝑎𝑡𝑎 𝑓𝑜𝑟𝑚𝑎𝑡.");
      }

      const randomQuestion = data[crypto.randomInt(data.length)];
      
      if (!randomQuestion || !randomQuestion.question || !randomQuestion.answer) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛 𝑓𝑜𝑟𝑚𝑎𝑡.");
      }

      const questionText = `🎯 𝑄𝑢𝑖𝑧 𝑄𝑢𝑒𝑠𝑡𝑖𝑜𝑛:\n\n${randomQuestion.question}\n\n` +
                          `🅰️ ${randomQuestion.A || 'Option A'}\n` +
                          `🅱️ ${randomQuestion.B || 'Option B'}\n` +
                          `©️ ${randomQuestion.C || 'Option C'}\n` +
                          `🇩 ${randomQuestion.D || 'Option D'}\n\n` +
                          `𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑙𝑒𝑡𝑡𝑒𝑟 (𝐴, 𝐵, 𝐶, 𝑜𝑟 𝐷)`;

      await message.reply(questionText);

    } catch (error) {
      console.error('𝑄𝑢𝑖𝑧 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡ℎ𝑒 𝑞𝑢𝑖𝑧 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛.");
    }
  }
};
