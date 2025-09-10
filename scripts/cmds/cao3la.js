const fs = require('fs');
const path = require('path');

// Mathematical Bold Italic text conversion
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports.config = {
    name: "cao3la",
    aliases: ["baicao", "vietcard", "cardgame"],
    version: "1.0.4",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "game-mp",
    shortDescription: {
        en: "𝐵𝑎𝑖 𝐶𝑎𝑜 - 𝑉𝑖𝑒𝑡𝑛𝑎𝑚𝑒𝑠𝑒 𝑐𝑎𝑟𝑑 𝑔𝑎𝑚𝑒 𝑓𝑜𝑟 𝑔𝑟𝑜𝑢𝑝𝑠"
    },
    longDescription: {
        en: "𝐴 𝑡𝑟𝑎𝑑𝑖𝑡𝑖𝑜𝑛𝑎𝑙 𝑉𝑖𝑒𝑡𝑛𝑎𝑚𝑒𝑠𝑒 𝑐𝑎𝑟𝑑 𝑔𝑎𝑚𝑒 𝑤ℎ𝑒𝑟𝑒 𝑝𝑙𝑎𝑦𝑒𝑟𝑠 𝑐𝑜𝑚𝑝𝑒𝑡𝑒 𝑡𝑜 𝑔𝑒𝑡 𝑡ℎ𝑒 ℎ𝑖𝑔ℎ𝑒𝑠𝑡 𝑠𝑐𝑜𝑟𝑒 𝑏𝑦 𝑑𝑟𝑎𝑤𝑖𝑛𝑔 𝑐𝑎𝑟𝑑𝑠"
    },
    guide: {
        en: "{p}cao3la [create/join/info/leave/start]"
    },
    dependencies: {
        "fs": "",
        "path": ""
    },
    envConfig: {
        "maxPlayers": 10,
        "minPlayers": 2,
        "maxCardValue": 9,
        "minCardValue": 1,
        "cardChangeLimit": 2,
        "winningScore": 9,
        "autoEndGame": true,
        "timeout": 300000, // 5 minutes
        "language": "en"
    }
};

// Internationalization messages
const messages = {
    en: {
        gameAlreadyRunning: "🚫 𝐴 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝",
        gameCreated: "🎮 𝐺𝑎𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑! 𝑃𝑙𝑎𝑦𝑒𝑟𝑠 𝑐𝑎𝑛 𝑗𝑜𝑖𝑛 𝑤𝑖𝑡ℎ '{} 𝑗𝑜𝑖𝑛'",
        noGameRunning: "❌ 𝑁𝑜 𝑔𝑎𝑚𝑒 𝑟𝑢𝑛𝑛𝑖𝑛𝑔. 𝐶𝑟𝑒𝑎𝑡𝑒 𝑜𝑛𝑒 𝑤𝑖𝑡ℎ '{} 𝑐𝑟𝑒𝑎𝑡𝑒'",
        gameStarted: "✅ 𝐺𝑎𝑚𝑒 ℎ𝑎𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑠𝑡𝑎𝑟𝑡𝑒𝑑",
        alreadyJoined: "ℹ️ 𝑌𝑜𝑢'𝑣𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑗𝑜𝑖𝑛𝑒𝑑 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒",
        joinSuccess: "✅ 𝑌𝑜𝑢'𝑣𝑒 𝑗𝑜𝑖𝑛𝑒𝑑 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒!",
        notInGame: "❌ 𝑌𝑜𝑢'𝑟𝑒 𝑛𝑜𝑡 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑎𝑚𝑒",
        creatorLeft: "👋 𝐺𝑎𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑜𝑟 𝑙𝑒𝑓𝑡. 𝐺𝑎𝑚𝑒 𝑒𝑛𝑑𝑒𝑑!",
        leftGame: "👋 𝑌𝑜𝑢'𝑣𝑒 𝑙𝑒𝑓𝑡 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒",
        onlyCreatorStart: "⛔ 𝑂𝑛𝑙𝑦 𝑔𝑎𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑜𝑟 𝑐𝑎𝑛 𝑠𝑡𝑎𝑟𝑡",
        notEnoughPlayers: "👥 𝑁𝑜𝑡 𝑒𝑛𝑜𝑢𝑔ℎ 𝑝𝑙𝑎𝑦𝑒𝑟𝑠 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 (𝑚𝑖𝑛: {})",
        gameStartSuccess: "🎯 𝐺𝑎𝑚𝑒 𝑠𝑡𝑎𝑟𝑡𝑒𝑑! 𝑈𝑠𝑒 '𝑐ℎ𝑖𝑎 𝑏𝑎𝑖' 𝑡𝑜 𝑑𝑒𝑎𝑙 𝑐𝑎𝑟𝑑𝑠",
        gameInfo: "=== 🎴 𝐵𝑎𝑖 𝐶𝑎𝑜 𝐺𝑎𝑚𝑒 ===\n- 👑 𝐶𝑟𝑒𝑎𝑡𝑜𝑟: {}\n- 👥 𝑃𝑙𝑎𝑦𝑒𝑟𝑠 ({}): {}",
        helpMessage: `🎴 𝐵𝑎𝑖 𝐶𝑎𝑜 𝐺𝑎𝑚𝑒 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:

🛠️ 𝑆𝑒𝑡𝑢𝑝 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:
{}{} 𝑐𝑟𝑒𝑎𝑡𝑒/-𝑐 - 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑛𝑒𝑤 𝑔𝑎𝑚𝑒
{}{} 𝑗𝑜𝑖𝑛/-𝑗 - 𝐽𝑜𝑖𝑛 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑎𝑚𝑒
{}{} 𝑙𝑒𝑎𝑣𝑒/-𝑙 - 𝐿𝑒𝑎𝑣𝑒 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒
{}{} 𝑠𝑡𝑎𝑟𝑡/-𝑠 - 𝑆𝑡𝑎𝑟𝑡 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒
{}{} 𝑖𝑛𝑓𝑜/-𝑖 - 𝑆ℎ𝑜𝑤 𝑔𝑎𝑚𝑒 𝑖𝑛𝑓𝑜

🎮 𝐺𝑎𝑚𝑒 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:
𝑐ℎ𝑖𝑎 𝑏𝑎𝑖 - 𝐷𝑒𝑎𝑙 𝑐𝑎𝑟𝑑𝑠 𝑡𝑜 𝑎𝑙𝑙 𝑝𝑙𝑎𝑦𝑒𝑟𝑠
𝑑𝑜𝑖 𝑏𝑎𝑖 - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑦𝑜𝑢𝑟 𝑐𝑎𝑟𝑑𝑠 (𝑙𝑖𝑚𝑖𝑡: {})
𝑟𝑒𝑎𝑑𝑦 - 𝑀𝑎𝑟𝑘 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓 𝑎𝑠 𝑟𝑒𝑎𝑑𝑦
𝑛𝑜𝑛𝑟𝑒𝑎𝑑𝑦 - 𝑆ℎ𝑜𝑤 𝑝𝑙𝑎𝑦𝑒𝑟𝑠 𝑤ℎ𝑜 𝑎𝑟𝑒𝑛'𝑡 𝑟𝑒𝑎𝑑𝑦

📝 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
        cardsDealt: "🃏 𝐶𝑎𝑟𝑑𝑠 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑑𝑒𝑎𝑙𝑡! 𝑃𝑙𝑎𝑦𝑒𝑟𝑠 𝑐𝑎𝑛 𝑛𝑜𝑤 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒𝑖𝑟 𝑐𝑎𝑟𝑑𝑠",
        noCardChanges: "🚫 𝑌𝑜𝑢'𝑣𝑒 𝑢𝑠𝑒𝑑 𝑎𝑙𝑙 𝑦𝑜𝑢𝑟 𝑐𝑎𝑟𝑑 𝑐ℎ𝑎𝑛𝑔𝑒𝑠",
        alreadyReady: "✅ 𝑌𝑜𝑢'𝑟𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑟𝑒𝑎𝑑𝑦, 𝑐𝑎𝑛'𝑡 𝑐ℎ𝑎𝑛𝑔𝑒 𝑐𝑎𝑟𝑑𝑠!",
        playerReady: "✅ 𝑃𝑙𝑎𝑦𝑒𝑟: {} 𝑖𝑠 𝑟𝑒𝑎𝑑𝑦, 𝑤𝑎𝑖𝑡𝑖𝑛𝑔 𝑓𝑜𝑟: {} 𝑝𝑙𝑎𝑦𝑒𝑟𝑠",
        finalResults: "🎉 𝐹𝐼𝑁𝐴𝐿 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 🎉\n\n{}",
        notReadyPlayers: "⏰ 𝑃𝑙𝑎𝑦𝑒𝑟𝑠 𝑛𝑜𝑡 𝑟𝑒𝑎𝑑𝑦: {}",
        cardMessage: "🃏 𝑌𝑜𝑢𝑟 𝑐𝑎𝑟𝑑𝑠: {} | {} | {} \n\n📊 𝑌𝑜𝑢𝑟 𝑡𝑜𝑡𝑎𝑙: {}",
        newCardMessage: "🃏 𝑌𝑜𝑢𝑟 𝑛𝑒𝑤 𝑐𝑎𝑟𝑑𝑠: {} | {} | {} \n\n📊 𝑌𝑜𝑢𝑟 𝑡𝑜𝑡𝑎𝑙: {}",
        cantSendCards: "❌ 𝐶𝑎𝑛'𝑡 𝑠𝑒𝑛𝑑 𝑐𝑎𝑟𝑑𝑠 𝑡𝑜 𝑢𝑠𝑒𝑟: {}"
    }
};

module.exports.onStart = async function ({ event, message, args, usersData, api, prefix }) {
    const { senderID, threadID } = event;
    const config = this.config.envConfig;
    const lang = config.language || 'en';
    const msg = messages[lang];
    
    // Initialize game data if not exists
    if (!global.baicaoData) global.baicaoData = new Map();
    
    let values = global.baicaoData.get(threadID) || {};

    switch (args[0]) {
      case "create":
      case "-c": {
        if (global.baicaoData.has(threadID)) {
          return message.reply(toBI(msg.gameAlreadyRunning));
        }
        global.baicaoData.set(threadID, { 
          "author": senderID, 
          "start": 0, 
          "chiabai": 0, 
          "ready": 0, 
          player: [{ 
            "id": senderID, 
            "card1": 0, 
            "card2": 0, 
            "card3": 0, 
            "doibai": config.cardChangeLimit, 
            "ready": false,
            "tong": 0
          }] 
        });
        return message.reply(toBI(msg.gameCreated.replace("{}", prefix + this.config.name)));
      }
      
      case "join":
      case "-j": {
        if (!global.baicaoData.has(threadID)) {
          return message.reply(toBI(msg.noGameRunning.replace("{}", prefix + this.config.name)));
        }
        if (values.start == 1) {
          return message.reply(toBI(msg.gameStarted));
        }
        if (values.player.find(item => item.id == senderID)) {
          return message.reply(toBI(msg.alreadyJoined));
        }
        if (values.player.length >= config.maxPlayers) {
          return message.reply(toBI(`🚫 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 𝑝𝑙𝑎𝑦𝑒𝑟𝑠 𝑟𝑒𝑎𝑐ℎ𝑒𝑑 (${config.maxPlayers})`));
        }
        values.player.push({ 
          "id": senderID, 
          "card1": 0, 
          "card2": 0, 
          "card3": 0, 
          "tong": 0, 
          "doibai": config.cardChangeLimit, 
          "ready": false 
        });
        global.baicaoData.set(threadID, values);
        return message.reply(toBI(msg.joinSuccess));
      }

      case "leave":
      case "-l": {
        if (!global.baicaoData.has(threadID)) {
          return message.reply(toBI(msg.noGameRunning.replace("{}", prefix + this.config.name)));
        }
        if (!values.player.some(item => item.id == senderID)) {
          return message.reply(toBI(msg.notInGame));
        }
        if (values.start == 1) {
          return message.reply(toBI(msg.gameStarted));
        }
        if (values.author == senderID) {
          global.baicaoData.delete(threadID);
          return message.reply(toBI(msg.creatorLeft));
        } else {
          values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
          global.baicaoData.set(threadID, values);
          return message.reply(toBI(msg.leftGame));
        }
      }

      case "start":
      case "-s": {
        if (!global.baicaoData.has(threadID)) {
          return message.reply(toBI(msg.noGameRunning.replace("{}", prefix + this.config.name)));
        }
        if (values.author !== senderID) {
          return message.reply(toBI(msg.onlyCreatorStart));
        }
        if (values.player.length < config.minPlayers) {
          return message.reply(toBI(msg.notEnoughPlayers.replace("{}", config.minPlayers)));
        }
        if (values.start == 1) {
          return message.reply(toBI(msg.gameStarted));
        }
        values.start = 1;
        global.baicaoData.set(threadID, values);
        return message.reply(toBI(msg.gameStartSuccess));
      }

      case "info":
      case "-i": {
        if (!global.baicaoData.has(threadID)) {
          return message.reply(toBI(msg.noGameRunning.replace("{}", prefix + this.config.name)));
        }
        const playerNames = [];
        for (const player of values.player) {
          const name = await usersData.getName(player.id);
          playerNames.push(name);
        }
        
        const creatorName = await usersData.getName(values.author);
        const infoText = toBI(msg.gameInfo.replace("{}", creatorName).replace("{}", values.player.length).replace("{}", playerNames.join(", ")));
        return message.reply(infoText);
      }

      default: {
        const helpText = msg.helpMessage
            .replace(/{}{}/g, prefix + this.config.name + " ")
            .replace("{}", config.cardChangeLimit);
        return message.reply(toBI(helpText));
      }
    }
};

module.exports.onChat = async function({ event, message, usersData, api }) {
    const { senderID, threadID, body } = event;
    const config = this.config.envConfig;
    const lang = config.language || 'en';
    const msg = messages[lang];
    
    if (!body || !global.baicaoData || !global.baicaoData.has(threadID)) return;
    
    let values = global.baicaoData.get(threadID);
    if (values.start != 1) return;

    if (body.toLowerCase().includes("chia bai")) {
      if (values.chiabai == 1) return;
      for(let i = 0; i < values.player.length; i++) {
        const player = values.player[i];
        const card1 = Math.floor(Math.random() * config.maxCardValue) + config.minCardValue;
        const card2 = Math.floor(Math.random() * config.maxCardValue) + config.minCardValue;
        const card3 = Math.floor(Math.random() * config.maxCardValue) + config.minCardValue;
        let tong = card1 + card2 + card3;
        if (tong >= config.winningScore) tong = tong % 10;
        
        player.card1 = card1;
        player.card2 = card2;
        player.card3 = card3;
        player.tong = tong;
        
        try {
          await api.sendMessage(toBI(msg.cardMessage.replace("{}", card1).replace("{}", card2).replace("{}", card3).replace("{}", tong)), player.id);
        } catch (error) {
          await message.reply(toBI(msg.cantSendCards.replace("{}", player.id)));
        }
      }
      values.chiabai = 1;
      global.baicaoData.set(threadID, values);
      return message.reply(toBI(msg.cardsDealt));
    }

    if (body.toLowerCase().includes("doi bai")) {
      if (values.chiabai != 1) return;
      let player = values.player.find(item => item.id == senderID);
      if (!player) return;
      if (player.doibai == 0) return message.reply(toBI(msg.noCardChanges));
      if (player.ready) return message.reply(toBI(msg.alreadyReady));
      
      const cards = ["card1", "card2", "card3"];
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      player[randomCard] = Math.floor(Math.random() * config.maxCardValue) + config.minCardValue;
      player.tong = player.card1 + player.card2 + player.card3;
      if (player.tong >= config.winningScore) player.tong = player.tong % 10;
      player.doibai -= 1;
      global.baicaoData.set(threadID, values);
      
      try {
        await api.sendMessage(toBI(msg.newCardMessage.replace("{}", player.card1).replace("{}", player.card2).replace("{}", player.card3).replace("{}", player.tong)), player.id);
      } catch (error) {
        await message.reply(toBI(msg.cantSendCards.replace("{}", player.id)));
      }
    }

    if (body.toLowerCase().includes("ready")) {
      if (values.chiabai != 1) return;
      let player = values.player.find(item => item.id == senderID);
      if (!player) return;
      if (player.ready) return;
      
      const name = await usersData.getName(senderID);
      values.ready += 1;
      player.ready = true;
      
      if (values.player.length == values.ready) {
        const sortedPlayers = [...values.player].sort((a, b) => b.tong - a.tong);
        let ranking = [];
        let num = 1;

        for (const info of sortedPlayers) {
          const playerName = await usersData.getName(info.id);
          ranking.push(toBI(`${num++}. ${playerName} - 🃏 ${info.card1} | ${info.card2} | ${info.card3} => 📊 ${info.tong} 𝑝𝑜𝑖𝑛𝑡𝑠`));
        }

        global.baicaoData.delete(threadID);
        return message.reply(toBI(msg.finalResults.replace("{}", ranking.join("\n"))));
      } else {
        return message.reply(toBI(msg.playerReady.replace("{}", name).replace("{}", values.player.length - values.ready)));
      }
    }
    
    if (body.toLowerCase().includes("nonready")) {
      const notReadyPlayers = values.player.filter(item => !item.ready);
      let playerNames = [];

      for (const player of notReadyPlayers) {
        const name = await usersData.getName(player.id);
        playerNames.push(name);
      }
      if (playerNames.length > 0) {
        return message.reply(toBI(msg.notReadyPlayers.replace("{}", playerNames.join(", "))));
      }
    }
};
