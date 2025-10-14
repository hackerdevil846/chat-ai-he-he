const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "wordchain",
    aliases: [],
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

  // Define word_valid function BEFORE onLoad to ensure it's available
  word_valid: function(word) {
    if (!word || typeof word !== 'string') return false;
    const trimmed = word.trim();
    return trimmed && /^[a-zA-Zà-ỹÀ-Ỹ]+ [a-zA-Zà-ỹÀ-Ỹ]+$/.test(trimmed);
  },

  onLoad: async function() {
    const self = this; // Store reference to 'this'
    const path = `${__dirname}/Trò_chơi/wordchain/wordchain.txt`;
    
    try {
      // Ensure directory exists
      const dir = `${__dirname}/Trò_chơi/wordchain`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      let wordData = [];
      
      if (!fs.existsSync(path)) {
        try {
          console.log("Downloading word data from GitHub...");
          const response = await axios.get(`https://raw.githubusercontent.com/J-JRT/api2/mainV2/linkword.json`);
          if (response.data && typeof response.data === 'string') {
            wordData = response.data.split(',').filter(word => self.word_valid(word));
            console.log(`Downloaded ${wordData.length} valid words`);
          } else {
            throw new Error("Invalid response data format");
          }
        } catch (error) {
          console.error("Error loading word data from GitHub:", error);
          wordData = ["hello world", "word chain", "game play", "bot chat", "chain reaction", "word game"];
        }
      } else {
        try {
          const fileContent = fs.readFileSync(path, 'utf8');
          if (fileContent && fileContent.trim()) {
            wordData = fileContent.split(',').filter(word => self.word_valid(word));
            console.log(`Loaded ${wordData.length} valid words from cache`);
          } else {
            throw new Error("File is empty");
          }
        } catch (error) {
          console.error("Error reading word file:", error);
          wordData = ["hello world", "word chain", "game play", "bot chat", "chain reaction", "word game"];
        }
      }
      
      // Ensure we have at least some words
      if (wordData.length === 0) {
        wordData = ["hello world", "word chain", "game play", "bot chat", "chain reaction", "word game"];
      }
      
      // Store data in module instance
      this.data = wordData;
      
      // Save to file
      this.save(path);
      
    } catch (error) {
      console.error("Critical error in onLoad:", error);
      this.data = ["hello world", "word chain", "game play", "bot chat", "chain reaction", "word game"];
    }
  },

  save: function(path) {
    try {
      if (this.data && this.data.length > 0) {
        fs.writeFileSync(path, this.data.join(','), 'utf8');
        console.log(`Saved ${this.data.length} words to file`);
      }
    } catch (error) {
      console.error("Error saving word data:", error);
    }
  },

  stream_url: async function(url) {
    try {
      const response = await axios.get(url, { 
        responseType: 'stream',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error streaming image:", error);
      return null;
    }
  },

  onStart: async function({ event, api, args, message, usersData }) {
    try {
      // Validate data exists
      if (!this.data || this.data.length === 0) {
        await this.onLoad(); // Reload data if empty
        if (!this.data || this.data.length === 0) {
          return message.reply(`[❌] ➜ 𝑊𝑜𝑟𝑑 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.`);
        }
      }

      const bet = +args[0] || 0;
      
      if (args[0] === 'bot') {
        return message.reply(`[⚜️] ➜ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑏𝑜𝑡 ℎ𝑎𝑠: ${this.data.length} 𝑤𝑜𝑟𝑑𝑠 𝑡𝑜 𝑐ℎ𝑎𝑖𝑛!`);
      }
      
      const userMoney = (await usersData.get(event.senderID)).money;
      if (bet < 10000 || bet > userMoney) {
        return message.reply(`[⚜️] ➜ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑏𝑒𝑡 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑝𝑙𝑎𝑦\n[💵] ➜ 𝑁𝑒𝑒𝑑 10000 𝑉𝑁𝐷 𝑡𝑜 𝑝𝑙𝑎𝑦!\n[💬] 𝑤𝑜𝑟𝑑𝑐ℎ𝑎𝑖𝑛 + 𝑏𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡`);
      }

      const word_bot = this.data[Math.floor(Math.random() * this.data.length)];
      const image_all = ["https://i.imgur.com/ct7CqS5.jpeg"];
      const image_random = image_all[Math.floor(Math.random() * image_all.length)];

      const attachment = await this.stream_url(image_random);

      const msg = await message.reply({
        body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[💵] ➜ 𝐵𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡: ${bet} 𝑉𝑁𝐷\n[📝] ➜ 𝐵𝑜𝑡 𝑠𝑡𝑎𝑟𝑡𝑠 𝑤𝑖𝑡ℎ: ${word_bot}\n[💬] ➜ 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑏𝑜𝑡 𝑡𝑜 𝑐ℎ𝑎𝑖𝑛 𝑤𝑜𝑟𝑑𝑠\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: 0\n[📚] ➜ 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑤𝑜𝑟𝑑𝑠: ${this.data.length}`,
        attachment: attachment
      });

      // Initialize handleReply if not exists
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
      
      // Remove any existing replies from same user to prevent conflicts
      global.client.handleReply = global.client.handleReply.filter(reply => 
        !(reply.author === event.senderID && reply.name === this.config.name)
      );
      
      global.client.handleReply.push(replyData);

    } catch (error) {
      console.error("Error in onStart:", error);
      message.reply(`[❌] ➜ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ${error.message}`);
    }
  },

  onReply: async function({ event, api, message, Reply, usersData }) {
    try {
      if (event.senderID !== Reply.author) return;

      const word = (event.body || '').trim().split(' ');

      if (word.length < 2 || !this.word_valid(word.join(' '))) {
        await message.reply(`[⚜️] ➜ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑤𝑜𝑟𝑑 𝑐ℎ𝑎𝑖𝑛! 𝑈𝑠𝑒 𝑡𝑤𝑜 𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑘𝑒 "𝑤𝑜𝑟𝑑 𝑐ℎ𝑎𝑖𝑛"\nExample: "chain reaction"`);
        // Don't unsend the original message, just return
        return;
      }

      if (Reply.type === 'player_vs_bot') {
        const botLastWord = Reply.word_bot.split(' ')[1].toLowerCase();
        const playerFirstWord = word[0].toLowerCase();

        if (playerFirstWord !== botLastWord) {
          const image_all = [
            "https://i.imgur.com/ct7CqS5.jpeg",
            "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
            "https://thietbimaycongnghiep.net/wp-content/uploads/2021-07/choi-noi-tu-online.jpg",
            "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
          ];
          const image_random = image_all[Math.floor(Math.random() * image_all.length)];
          
          const attachment = await this.stream_url(image_random);
          
          await message.reply({
            body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[❎] ➜ 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${Reply.loop}\n[💸] ➜ 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡: ${Reply.bet} 𝑉𝑁𝐷\n[❌] ➜ 𝐸𝑥𝑝𝑒𝑐𝑡𝑒𝑑: "${botLastWord}" but got "${playerFirstWord}"`,
            attachment: attachment
          });

          // Deduct money
          const userData = await usersData.get(event.senderID);
          await usersData.set(event.senderID, {
            money: Math.max(0, userData.money - Reply.bet)
          });
          
          // Clean up reply
          global.client.handleReply = global.client.handleReply.filter(item => 
            item.messageID !== Reply.messageID
          );
          return;
        }

        const word_matching = this.data.filter(item => {
          if (!item || typeof item !== 'string') return false;
          const firstWord = item.split(' ')[0];
          return firstWord && firstWord.toLowerCase() === word[1].toLowerCase();
        });
        
        if (word_matching.length === 0) {
          const newWord = word.join(' ');
          if (!this.data.includes(newWord)) {
            this.data.push(newWord);
            this.save(`${__dirname}/Trò_chơi/wordchain/wordchain.txt`);
          }

          // Award money
          const userData = await usersData.get(event.senderID);
          await usersData.set(event.senderID, {
            money: userData.money + (Reply.bet * 3)
          });

          const image_all = [
            "https://i.imgur.com/ct7CqS5.jpeg",
            "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
            "https://thietbimaycongnghiep.net/wp-content/uploads/2021-07/choi-noi-tu-online.jpg",
            "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
          ];
          const image_random = image_all[Math.floor(Math.random() * image_all.length)];
          const attachment = await this.stream_url(image_random);
          
          await message.reply({
            body: `=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[✅] ➜ 𝑌𝑜𝑢 𝑤𝑜𝑛\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${Reply.loop}\n[💵] ➜ 𝑃𝑟𝑖𝑧𝑒 𝑚𝑜𝑛𝑒𝑦: ${Reply.bet * 3} 𝑉𝑁𝐷\n[🎯] ➜ 𝐵𝑜𝑡 𝑐𝑜𝑢𝑙𝑑𝑛'𝑡 𝑐ℎ𝑎𝑖𝑛 𝑡𝑜 "${word[1]}"`,
            attachment: attachment
          });
          
          // Clean up reply
          global.client.handleReply = global.client.handleReply.filter(item => 
            item.messageID !== Reply.messageID
          );
        } else {
          const random_word_ = word_matching[Math.floor(Math.random() * word_matching.length)];
          
          const msg = await message.reply(`=== 『 𝑊𝑂𝑅𝐷 𝐶𝐻𝐴𝐼𝑁 𝐺𝐴𝑀𝐸 』 ===\n━━━━━━━━━━━━━━━━\n[📝] ➜ 𝐵𝑜𝑡 𝑐ℎ𝑎𝑖𝑛𝑠: ${random_word_}\n[💬] ➜ 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑏𝑜𝑡 𝑡𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑑\n[❗] ➜ 𝐶ℎ𝑎𝑖𝑛 𝑐𝑜𝑢𝑛𝑡: ${Reply.loop + 1}`);

          // Update reply data
          global.client.handleReply = global.client.handleReply.filter(item => 
            item.messageID !== Reply.messageID
          );
          
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
      
      // Clean up on error
      try {
        global.client.handleReply = global.client.handleReply.filter(item => 
          item.messageID !== Reply.messageID
        );
      } catch (cleanupError) {
        console.error("Error cleaning up reply:", cleanupError);
      }
    }
  }
};
