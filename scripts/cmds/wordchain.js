const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "wordchain",
    aliases: ["wordgame", "chainword"],
    version: "1.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "game",
    shortDescription: {
      en: "𝑊𝑜𝑟𝑑 𝑐ℎ𝑎𝑖𝑛 𝑔𝑎𝑚𝑒"
    },
    longDescription: {
      en: "𝑃𝑙𝑎𝑦 𝑤𝑜𝑟𝑑 𝑐ℎ𝑎𝑖𝑛 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑜𝑡"
    },
    guide: {
      en: "{p}wordchain [𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 > 10000 𝑉𝑁𝐷]"
    },
    countDown: 3,
    dependencies: {
      "axios": "",
      "fs": ""
    }
  },

  onLoad: async function() {
    const path = `${__dirname}/Trò_chơi/wordchain/wordchain.txt`;
    
    // Ensure directory exists
    const dir = `${__dirname}/Trò_chơi/wordchain`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(path)) {
      try {
        const response = await axios.get(`https://raw.githubusercontent.com/J-JRT/api2/mainV2/linkword.json`);
        this.data = response.data.split(',').filter(word => this.word_valid(word));
      } catch (error) {
        console.error("Error loading word data:", error);
        this.data = ["hello world", "word chain", "game play", "bot chat"];
      }
    } else {
      try {
        this.data = fs.readFileSync(path, 'utf8').split(',').filter(word => this.word_valid(word));
      } catch (error) {
        console.error("Error reading word file:", error);
        this.data = ["hello world", "word chain", "game play", "bot chat"];
      }
    }
    
    this.save(path);
  },

  word_valid: function(word) {
    return word && /^[a-zA-Zà-ỹÀ-Ỹ]+ [a-zA-Zà-ỹÀ-Ỹ]+$/.test(word.trim());
  },

  save: function(path) {
    try {
      fs.writeFileSync(path, this.data.join(','), 'utf8');
    } catch (error) {
      console.error("Error saving word data:", error);
    }
  },

  stream_url: async function(url) {
    try {
      const response = await axios.get(url, { responseType: 'stream' });
      return response.data;
    } catch (error) {
      console.error("Error streaming image:", error);
      return null;
    }
  },

  onStart: async function({ event, api, args, message, usersData }) {
    try {
      const bet = +args[0] || 0;
      
      if (args[0] === 'bot') {
        return message.reply(`[⚜️] ➜ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑏𝑜𝑡 ℎ𝑎𝑠: ${this.data?.length || 0} 𝑤𝑜𝑟𝑑𝑠 𝑡𝑜 𝑐ℎ𝑎𝑖𝑛!`);
      }
      
      const userMoney = (await usersData.get(event.senderID)).money;
      if (bet < 10000 || bet > userMoney) {
        return message.reply(`[⚜️] ➜ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑏𝑒𝑡 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑝𝑙𝑎𝑦\n[💵] ➜ 𝑁𝑒𝑒𝑑 10000 𝑉𝑁𝐷 𝑡𝑜 𝑝𝑙𝑎𝑦!\n[💬] 𝑤𝑜𝑟𝑑𝑐ℎ𝑎𝑖𝑛 + 𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡`);
      }

      if (!this.data || this.data.length === 0) {
        return message.reply(`[❌] ➜ 𝑊𝑜𝑟𝑑 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.`);
      }

      const word_bot = this.data[Math.floor(Math.random() * this.data.length)];
      const image_all = ["https://i.imgur.com/ct7CqS5.jpeg"];
      const image_random = image_all[Math.floor(Math.random() * image_all.length)];

      const attachment = await this.stream_url(image_random);

      const msg = await message.reply({
        body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[💵] ➜ 𝐵𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡: ${bet} 𝑉𝑁𝐷\n[📝] ➜ 𝐵𝑜𝑡 𝑠𝑡𝑎𝑟𝑡𝑠 𝑤𝑖𝑡ℎ: ${word_bot}\n[💬] ➜ 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑏𝑜𝑡 𝑡𝑜 𝑐ℎ𝑎𝑖𝑛 𝑤𝑜𝑟𝑑𝑠\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: 0`,
        attachment: attachment
      });

      global.client.handleReply = global.client.handleReply || [];
      const replyData = {
        type: 'player_vs_bot',
        name: this.config.name,
        messageID: msg.messageID,
        author: event.senderID,
        word_bot: word_bot,
        loop: 0,
        bet: bet
      };
      global.client.handleReply.push(replyData);

    } catch (error) {
      console.error("Error in onStart:", error);
      message.reply(`[❌] ➜ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ${error.message}`);
    }
  },

  onReply: async function({ event, api, message, Reply }) {
    try {
      if (event.senderID !== Reply.author) return;

      const word = (event.body || '').split(' ');

      if (word.length < 2 || !this.word_valid(word.join(' '))) {
        await message.reply(`[⚜️] ➜ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑤𝑜𝑟𝑑 𝑐ℎ𝑎𝑖𝑛! 𝑈𝑠𝑒 𝑡𝑤𝑜 𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑘𝑒 "𝑤𝑜𝑟𝑑 𝑐ℎ𝑎𝑖𝑛"`);
        api.unsendMessage(Reply.messageID);
        return;
      }

      if (Reply.type === 'player_vs_bot') {
        if (word[0].toLowerCase() !== Reply.word_bot.split(' ')[1].toLowerCase()) {
          const image_all = [
            "https://i.imgur.com/ct7CqS5.jpeg",
            "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
            "https://thietbimaycongnghiep.net/wp-content/uploads/2021-07/choi-noi-tu-online.jpg",
            "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
          ];
          const image_random = image_all[Math.floor(Math.random() * image_all.length)];
          
          const attachment = await this.stream_url(image_random);
          
          await message.reply({
            body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[❎] ➜ 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${Reply.loop}\n[💸] ➜ 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡: ${Reply.bet} 𝑉𝑁𝐷`,
            attachment: attachment
          });

          await message.reply(`[👎] ➜ 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠, 𝑦𝑜𝑢 𝑙𝑜𝑠𝑡!`);
          
          const userData = await usersData.get(event.senderID);
          await usersData.set(event.senderID, {
            money: userData.money - Reply.bet
          });
          return;
        }

        const word_matching = this.data.filter(item => 
          item.split(' ')[0].toLowerCase() === word[1].toLowerCase()
        );
        
        if (word_matching.length === 0) {
          if (!this.data.includes(word.join(' '))) {
            this.data.push(word.join(' '));
            this.save(`${__dirname}/Trò_chơi/wordchain/wordchain.txt`);
          }

          const userData = await usersData.get(event.senderID);
          await usersData.set(event.senderID, {
            money: userData.money + (Reply.bet * 3)
          });

          const image_all = [
            "https://i.imgur.com/ct7CqS5.jpeg",
            "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
            "https://thietbimaycongngep.net/wp-content/uploads/2021-07/choi-noi-tu-online.jpg",
            "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
          ];
          const image_random = image_all[Math.floor(Math.random() * image_all.length)];
          const attachment = await this.stream_url(image_random);
          
          await message.reply({
            body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[✅] ➜ 𝑌𝑜𝑢 𝑤𝑜𝑛\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${Reply.loop}\n[💵] ➜ 𝑃𝑟𝑖𝑧𝑒 𝑚𝑜𝑛𝑒𝑦: ${Reply.bet * 3} 𝑉𝑁𝐷`,
            attachment: attachment
          });
          
          await message.reply(`[👏] ➜ 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠, 𝑦𝑜𝑢 𝑏𝑒𝑎𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡!`);
        } else {
          const random_word_ = word_matching[Math.floor(Math.random() * word_matching.length)];
          
          const msg = await message.reply(`=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[📝] ➜ 𝐵𝑜𝑡 𝑐ℎ𝑎𝑖𝑛𝑠: ${random_word_}\n[💬] ➜ 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑏𝑜𝑡 𝑡𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑑\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${Reply.loop + 1}`);

          global.client.handleReply.push({
            type: 'player_vs_bot',
            name: this.config.name,
            messageID: msg.messageID,
            author: event.senderID,
            word_bot: random_word_,
            loop: Reply.loop + 1,
            bet: Reply.bet
          });
        }
      }
    } catch (error) {
      console.error("Error in onReply:", error);
      message.reply(`[❌] ➜ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ${error.message}`);
    }
  }
};
