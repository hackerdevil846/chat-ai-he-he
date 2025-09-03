const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "wordchain",
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
    
    if (!fs.existsSync(path)) {
      const response = await axios.get(`https://raw.githubusercontent.com/J-JRT/api2/mainV2/linkword.json`);
      this.data = response.data.split(',').filter(this.word_valid);
    } else {
      this.data = fs.readFileSync(path, 'utf8').split(',').filter(this.word_valid);
    }
    
    this.save(path);
  },

  word_valid: function(word) {
    return /^[a-zA-Zà-ỹÀ-Ỹ]+ [a-zA-Zà-ỹÀ-Ỹ]+$/.test(word);
  },

  save: function(path) {
    fs.writeFileSync(path, this.data.join(','), 'utf8');
  },

  stream_url: async function(url) {
    const response = await axios.get(url, { responseType: 'stream' });
    return response.data;
  },

  onStart: async function({ event, api, args, usersData }) {
    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    const bet = +args[0] || 0;
    
    if (args[0] === 'bot') {
      return send(`[⚜️] ➜ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑏𝑜𝑡 ℎ𝑎𝑠: ${this.data.length} 𝑤𝑜𝑟𝑑𝑠 𝑡𝑜 𝑐ℎ𝑎𝑖𝑛!`);
    }
    
    const userMoney = (await usersData.get(event.senderID)).money;
    if (bet < 10000 || bet > userMoney) {
      return send(`[⚜️] ➜ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑏𝑒𝑡 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑝𝑙𝑎𝑦\n[💵] ➜ 𝑁𝑒𝑒𝑑 10000 𝑉𝑁𝐷 𝑡𝑜 𝑝𝑙𝑎𝑦!\n[💬] 𝑤𝑜𝑟𝑑𝑐ℎ𝑎𝑖𝑛 + 𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡`);
    }

    const word_bot = this.data[Math.floor(Math.random() * this.data.length)];
    const image_all = ["https://i.imgur.com/ct7CqS5.jpeg"];
    const image_random = image_all[Math.floor(Math.random() * image_all.length)];

    send({
      body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[💵] ➜ 𝐵𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡: ${bet} 𝑉𝑁𝐷\n[📝] ➜ 𝐵𝑜𝑡 𝑠𝑡𝑎𝑟𝑡𝑠 𝑤𝑖𝑡ℎ: ${word_bot}\n[💬] ➜ 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑏𝑜𝑡 𝑡𝑜 𝑐ℎ𝑎𝑖𝑛 𝑤𝑜𝑟𝑑𝑠\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: 0`,
      attachment: await this.stream_url(image_random)
    }, (err, res) => {
      const replyData = {
        type: 'player_vs_bot',
        name: this.config.name,
        event: event,
        word_bot: word_bot,
        loop: 0,
        bet: bet
      };
      global.client.handleReply.push(replyData);
    });
  },

  handleReply: async function({ event, api, handleReply, usersData }) {
    const _ = handleReply;
    if (event.senderID !== _.event.senderID) return;

    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    const word = (event.body || '').split(' ');

    if (!this.word_valid(word.join(' '))) {
      send(`[⚜️] ➜ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑤𝑜𝑟𝑑 𝑐ℎ𝑎𝑖𝑛!`);
      api.unsendMessage(_.messageID);
      return;
    }

    if (_.type === 'player_vs_bot') {
      if (word[0].toLowerCase() !== _.word_bot.split(' ')[1].toLowerCase()) {
        const image_all = [
          "https://i.imgur.com/ct7CqS5.jpeg",
          "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
          "https://thietbimaycongnghiep.net/wp-content/uploads/2021-07/choi-noi-tu-online.jpg",
          "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
        ];
        const image_random = image_all[Math.floor(Math.random() * image_all.length)];
        
        send({
          body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[❎] ➜ 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${_.loop}\n[💸] ➜ 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡: ${_.bet} 𝑉𝑁𝐷`,
          attachment: await this.stream_url(image_random)
        }, 0);

        send(`[👎] ➜ 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠, 𝑦𝑜𝑢 𝑙𝑜𝑠𝑡!`);
        
        const userData = await usersData.get(event.senderID);
        await usersData.set(event.senderID, {
          money: userData.money - _.bet
        });
        return;
      }

      const word_matching = this.data.filter(item => 
        item.split(' ')[0].toLowerCase() === word[1].toLowerCase()
      );
      
      const random_word_ = word_matching[Math.floor(Math.random() * word_matching.length)];

      if (!this.word_valid(random_word_)) {
        if (!this.data.includes(word.join(' '))) {
          this.data.push(word.join(' '));
          this.save(`${__dirname}/Trò_chơi/wordchain/wordchain.txt`);
        }

        const userData = await usersData.get(event.senderID);
        await usersData.set(event.senderID, {
          money: userData.money + (_.bet * 3)
        });

        const image_all = [
          "https://i.imgur.com/ct7CqS5.jpeg",
          "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
          "https://thietbimaycongnghiep.net/wp-content/uploads/2021-07/choi-noi-tu-online.jpg",
          "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
        ];
        const image_random = image_all[Math.floor(Math.random() * image_all.length)];
        
        send({
          body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[✅] ➜ 𝑌𝑜𝑢 𝑤𝑜𝑛\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${_.loop}\n[💵] ➜ 𝑃𝑟𝑖𝑧𝑒 𝑚𝑜𝑛𝑒𝑦: ${_.bet * 3} 𝑉𝑁𝐷`,
          attachment: await this.stream_url(image_random)
        });
        
        send(`[👏] ➜ 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠, 𝑦𝑜𝑢 𝑏𝑒𝑎𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡!`);
      } else {
        send(`=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[📝] ➜ 𝐵𝑜𝑡 𝑐ℎ𝑎𝑖𝑛𝑠: ${random_word_}\n[💬] ➜ 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑏𝑜𝑡 𝑡𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑑\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${_.loop + 1}`, (err, res) => {
          const replyData = {
            type: 'player_vs_bot',
            name: this.config.name,
            event: event,
            word_bot: random_word_,
            loop: _.loop + 1,
            bet: _.bet
          };
          global.client.handleReply.push(replyData);
        });
      }
    }
  }
};
