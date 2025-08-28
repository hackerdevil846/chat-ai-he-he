module.exports = {
  config: {
    name: "animeguess",
    aliases: ["guessanime"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "𝑔𝑎𝑚𝑒",
    shortDescription: {
      en: "𝐺𝑢𝑒𝑠𝑠 𝑡ℎ𝑒 𝑎𝑛𝑖𝑚𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑓𝑜𝑟 𝑟𝑒𝑤𝑎𝑟𝑑𝑠"
    },
    longDescription: {
      en: "𝐺𝑢𝑒𝑠𝑠 𝑡ℎ𝑒 𝑎𝑛𝑖𝑚𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒 𝑎𝑛𝑑 𝑤𝑖𝑛 𝑐𝑜𝑖𝑛𝑠! 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 30 𝑠𝑒𝑐𝑜𝑛𝑑𝑠 𝑡𝑜 𝑎𝑛𝑠𝑤𝑒𝑟."
    },
    guide: {
      en: "{𝑝}𝑎𝑛𝑖𝑚𝑒𝑔𝑢𝑒𝑠𝑠"
    }
  },
  onStart: async function({ message, event, usersData, api, global }) {
    try {
      const axios = require('axios');
      const fs = require('fs');
      const path = require('path');

      // 𝐹𝑒𝑡𝑐ℎ 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟
      const response = await axios.get('https://global-prime-mahis-apis.vercel.app');
      const characters = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      const character = characters[Math.floor(Math.random() * characters.length)];

      // 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑖𝑚𝑎𝑔𝑒
      const imagePath = path.join(__dirname, 'character.jpg');
      const imageRes = await axios.get(character.image, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, imageRes.data);

      // 𝑆𝑒𝑛𝑑 𝑔𝑎𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      const gameMsg =
        `𝐺𝑢𝑒𝑠𝑠 𝑡ℎ𝑖𝑠 𝑎𝑛𝑖𝑚𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟!\n\n` +
        `𝑇𝑟𝑎𝑖𝑡𝑠: ${character.traits || '𝑁/𝐴'}\n` +
        `𝑇𝑎𝑔𝑠: ${character.tags || '𝑁/𝐴'}\n\n` +
        `𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 30 𝑠𝑒𝑐𝑜𝑛𝑑𝑠 𝑡𝑜 𝑎𝑛𝑠𝑤𝑒𝑟!`;

      const sentMsg = await message.reply({
        body: gameMsg,
        attachment: fs.createReadStream(imagePath)
      });

      // 𝑆𝑒𝑡 𝑔𝑎𝑚𝑒 𝑠𝑡𝑎𝑡𝑒
      global.GoatBot.onReply.set(sentMsg.messageID, {
        commandName: this.config.name,
        correctAnswer: [character.fullName, character.firstName].map(ans => ans.toLowerCase()),
        imagePath: imagePath,
        messageID: sentMsg.messageID
      });

      // 𝑆𝑒𝑡 𝑡𝑖𝑚𝑒𝑜𝑢𝑡
      setTimeout(async () => {
        if (global.GoatBot.onReply.has(sentMsg.messageID)) {
          await message.reply(`⏰ 𝑇𝑖𝑚𝑒'𝑠 𝑢𝑝! 𝑇ℎ𝑒 𝑎𝑛𝑠𝑤𝑒𝑟 𝑤𝑎𝑠: ${character.fullName}`);
          this.cleanup(imagePath, sentMsg.messageID);
        }
      }, 30000);

    } catch (err) {
      console.error("𝐸𝑟𝑟𝑜𝑟:", err);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
    }
  },
  onReply: async function({ message, event, Reply, usersData }) {
    try {
      const userAnswer = event.body.trim().toLowerCase();
      if (Reply.correctAnswer.includes(userAnswer)) {
        const reward = 1000;
        const currentMoney = (await usersData.get(event.senderID, "money")) || 0;
        await usersData.set(event.senderID, { money: currentMoney + reward });

        await message.reply(
          `🎉 𝐶𝑜𝑟𝑟𝑒𝑐𝑡! 𝑌𝑜𝑢 𝑤𝑜𝑛 ${reward} 𝑐𝑜𝑖𝑛𝑠.\n` +
          `𝐶ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟: ${Reply.correctAnswer[0]}\n` +
          `𝑌𝑜𝑢𝑟 𝑛𝑒𝑤 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${currentMoney + reward} 𝑐𝑜𝑖𝑛𝑠`
        );
      } else {
        await message.reply(
          `❌ 𝑊𝑟𝑜𝑛𝑔! 𝑇ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟 𝑤𝑎𝑠: ${Reply.correctAnswer[0]}`
        );
      }
      this.cleanup(Reply.imagePath, Reply.messageID);
    } catch (err) {
      console.error("𝐸𝑟𝑟𝑜𝑟:", err);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑎𝑛𝑠𝑤𝑒𝑟.");
    }
  },
  // 𝐻𝑒𝑙𝑝𝑒𝑟 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛 𝑓𝑜𝑟 𝑐𝑙𝑒𝑎𝑛𝑢𝑝
  cleanup: function (imagePath, messageID) {
    try {
      fs.unlinkSync(imagePath);
      global.GoatBot.onReply.delete(messageID);
    } catch (err) {
      console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", err);
    }
  }
};
