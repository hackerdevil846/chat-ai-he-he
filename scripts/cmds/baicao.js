const fs = require('fs');
const path = require('path');

// Define the toBI function first
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

module.exports = {
  config: {
    name: "cao3la",
    version: "1.0.4",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅",
    category: "game-mp",
    shortDescription: {
      en: "𝑩𝒂𝒊 𝑪𝒂𝒐 𝒈𝒂𝒎𝒆 𝒇𝒐𝒓 𝒈𝒓𝒐𝒖𝒑𝒔"
    },
    longDescription: {
      en: "𝑨 𝒕𝒓𝒂𝒅𝒊𝒕𝒊𝒐𝒏𝒂𝒍 𝑽𝒊𝒆𝒕𝒏𝒂𝒎𝒆𝒔𝒆 𝒄𝒂𝒓𝒅 𝒈𝒂𝒎𝒆 𝒘𝒉𝒆𝒓𝒆 𝒑𝒍𝒂𝒚𝒆𝒓𝒔 𝒄𝒐𝒎𝒑𝒆𝒕𝒆 𝒕𝒐 𝒈𝒆𝒕 𝒕𝒉𝒆 𝒉𝒊𝒈𝒉𝒆𝒔𝒕 𝒔𝒄𝒐𝒓𝒆"
    },
    guide: {
      en: "{p}cao3la [create/join/info/leave/start]"
    }
  },

  onStart: async function ({ event, message, args, usersData }) {
    const { senderID, threadID } = event;
    
    // Initialize game data if not exists
    if (!global.baicaoData) global.baicaoData = new Map();
    
    let values = global.baicaoData.get(threadID) || {};

    switch (args[0]) {
      case "create":
      case "-c": {
        if (global.baicaoData.has(threadID)) {
          return message.reply(toBI("A game is already running in this group"));
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
            "doibai": 2, 
            "ready": false,
            "tong": 0
          }] 
        });
        return message.reply(toBI("Game created! Players can join with 'cao3la join'"));
      }
      
      case "join":
      case "-j": {
        if (!global.baicaoData.has(threadID)) {
          return message.reply(toBI("No game running. Create one with 'cao3la create'"));
        }
        if (values.start == 1) {
          return message.reply(toBI("Game has already started"));
        }
        if (values.player.find(item => item.id == senderID)) {
          return message.reply(toBI("You've already joined the game"));
        }
        values.player.push({ 
          "id": senderID, 
          "card1": 0, 
          "card2": 0, 
          "card3": 0, 
          "tong": 0, 
          "doibai": 2, 
          "ready": false 
        });
        global.baicaoData.set(threadID, values);
        return message.reply(toBI("You've joined the game!"));
      }

      case "leave":
      case "-l": {
        if (!global.baicaoData.has(threadID)) {
          return message.reply(toBI("No game running. Create one with 'cao3la create'"));
        }
        if (!values.player.some(item => item.id == senderID)) {
          return message.reply(toBI("You're not in this game"));
        }
        if (values.start == 1) {
          return message.reply(toBI("Game has already started"));
        }
        if (values.author == senderID) {
          global.baicaoData.delete(threadID);
          return message.reply(toBI("Game creator left. Game ended!"));
        } else {
          values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
          global.baicaoData.set(threadID, values);
          return message.reply(toBI("You've left the game"));
        }
      }

      case "start":
      case "-s": {
        if (!global.baicaoData.has(threadID)) {
          return message.reply(toBI("No game running. Create one with 'cao3la create'"));
        }
        if (values.author !== senderID) {
          return message.reply(toBI("Only game creator can start"));
        }
        if (values.player.length <= 1) {
          return message.reply(toBI("Not enough players to start"));
        }
        if (values.start == 1) {
          return message.reply(toBI("Game already started"));
        }
        values.start = 1;
        global.baicaoData.set(threadID, values);
        return message.reply(toBI("Game started! Use 'chia bai' to deal cards"));
      }

      case "info":
      case "-i": {
        if (!global.baicaoData.has(threadID)) {
          return message.reply(toBI("No game running. Create one with 'cao3la create'"));
        }
        const playerNames = [];
        for (const player of values.player) {
          const name = await usersData.getName(player.id);
          playerNames.push(name);
        }
        
        const infoText = toBI(
          "=== 𝑩𝒂𝒊 𝑪𝒂𝒐 𝑮𝒂𝒎𝒆 ===\n" +
          "- 𝑪𝒓𝒆𝒂𝒕𝒐𝒓: " + (await usersData.getName(values.author)) + "\n" +
          "- 𝑷𝒍𝒂𝒚𝒆𝒓𝒔 (" + values.player.length + "): " + playerNames.join(", ")
        );
        return message.reply(infoText);
      }

      default: {
        const helpMessage = toBI(
          "𝑩𝒂𝒊 𝑪𝒂𝒐 𝑮𝒂𝒎𝒆 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔:\n" +
          "𝒄𝒓𝒆𝒂𝒕𝒆/-𝒄: 𝑪𝒓𝒆𝒂𝒕𝒆 𝒂 𝒏𝒆𝒘 𝒈𝒂𝒎𝒆\n" +
          "𝒋𝒐𝒊𝒏/-𝒋: 𝑱𝒐𝒊𝒏 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒈𝒂𝒎𝒆\n" +
          "𝒍𝒆𝒂𝒗𝒆/-𝒍: 𝑳𝒆𝒂𝒗𝒆 𝒕𝒉𝒆 𝒈𝒂𝒎𝒆\n" +
          "𝒔𝒕𝒂𝒓𝒕/-𝒔: 𝑺𝒕𝒂𝒓𝒕 𝒕𝒉𝒆 𝒈𝒂𝒎𝒆\n" +
          "𝒊𝒏𝒇𝒐/-𝒊: 𝑺𝒉𝒐𝒘 𝒈𝒂𝒎𝒆 𝒊𝒏𝒇𝒐\n\n" +
          "𝑮𝒂𝒎𝒆 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔:\n" +
          "𝒄𝒉𝒊𝒂 𝒃𝒂𝒊: 𝑫𝒆𝒂𝒍 𝒄𝒂𝒓𝒅𝒔\n" +
          "𝒅𝒐𝒊 𝒃𝒂𝒊: 𝑪𝒉𝒂𝒏𝒈𝒆 𝒄𝒂𝒓𝒅𝒔\n" +
          "𝒓𝒆𝒂𝒅𝒚: 𝑹𝒆𝒂𝒅𝒚 𝒖𝒑\n" +
          "𝒏𝒐𝒏𝒓𝒆𝒂𝒅𝒚: 𝑺𝒉𝒐𝒘 𝒏𝒐𝒕 𝒓𝒆𝒂𝒅𝒚 𝒑𝒍𝒂𝒚𝒆𝒓𝒔\n\n" +
          "𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅"
        );
        return message.reply(helpMessage);
      }
    }
  },

  onChat: async function({ event, message, usersData, api }) {
    const { senderID, threadID, body } = event;
    
    if (!body || !global.baicaoData || !global.baicaoData.has(threadID)) return;
    
    let values = global.baicaoData.get(threadID);
    if (values.start != 1) return;

    if (body.toLowerCase().includes("chia bai")) {
      if (values.chiabai == 1) return;
      for(let i = 0; i < values.player.length; i++) {
        const player = values.player[i];
        const card1 = Math.floor(Math.random() * 9) + 1;
        const card2 = Math.floor(Math.random() * 9) + 1;
        const card3 = Math.floor(Math.random() * 9) + 1;
        let tong = card1 + card2 + card3;
        if (tong >= 10) tong = tong % 10;
        
        player.card1 = card1;
        player.card2 = card2;
        player.card3 = card3;
        player.tong = tong;
        
        try {
          await api.sendMessage(toBI(`Your cards: ${card1} | ${card2} | ${card3} \n\nYour total: ${tong}`), player.id);
        } catch (error) {
          await message.reply(toBI(`Can't share cards with user: ${player.id}`));
        }
      }
      values.chiabai = 1;
      global.baicaoData.set(threadID, values);
      return message.reply(toBI("Cards have been dealt! Players can now check their cards"));
    }

    if (body.toLowerCase().includes("doi bai")) {
      if (values.chiabai != 1) return;
      let player = values.player.find(item => item.id == senderID);
      if (!player) return;
      if (player.doibai == 0) return message.reply(toBI("You've used all your card changes"));
      if (player.ready) return message.reply(toBI("You're already ready, can't change cards!"));
      
      const cards = ["card1", "card2", "card3"];
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      player[randomCard] = Math.floor(Math.random() * 9) + 1;
      player.tong = player.card1 + player.card2 + player.card3;
      if (player.tong >= 10) player.tong = player.tong % 10;
      player.doibai -= 1;
      global.baicaoData.set(threadID, values);
      
      try {
        await api.sendMessage(toBI(`Your new cards: ${player.card1} | ${player.card2} | ${player.card3} \n\nYour total: ${player.tong}`), player.id);
      } catch (error) {
        await message.reply(toBI(`Can't send cards to user: ${player.id}`));
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
          ranking.push(toBI(`${num++}. ${playerName} - Cards: ${info.card1} | ${info.card2} | ${info.card3} => ${info.tong} points`));
        }

        global.baicaoData.delete(threadID);
        return message.reply(toBI("🎉 𝑭𝑰𝑵𝑨𝑳 𝑹𝑬𝑺𝑼𝑳𝑻𝑺 🎉\n\n" + ranking.join("\n")));
      } else {
        return message.reply(toBI(`Player: ${name} is ready, waiting for: ${values.player.length - values.ready} players`));
      }
    }
    
    if (body.toLowerCase().includes("nonready")) {
      const notReadyPlayers = values.player.filter(item => !item.ready);
      let msg = [];

      for (const player of notReadyPlayers) {
        const name = await usersData.getName(player.id);
        msg.push(name);
      }
      if (msg.length > 0) {
        return message.reply(toBI("Players not ready: " + msg.join(", ")));
      }
    }
  }
};
