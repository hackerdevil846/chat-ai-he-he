'use strict';
const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "xidach",
    aliases: ["blackjack", "xd"],
    version: "1.2.2-superfix",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐵𝑙𝑎𝑐𝑘𝑗𝑎𝑐𝑘 𝑐𝑎𝑟𝑑 𝑔𝑎𝑚𝑒"
    },
    longDescription: {
      en: "𝑃𝑙𝑎𝑦 𝑋ì 𝐷á𝑐ℎ (𝐵𝑙𝑎𝑐𝑘𝑗𝑎𝑐𝑘) 𝑤𝑖𝑡ℎ 𝑓𝑟𝑖𝑒𝑛𝑑𝑠"
    },
    category: "𝑔𝑎𝑚𝑒",
    guide: {
      en: "{p}xidach [create/join/leave/start]\ncreate 𝑚𝑜𝑛𝑒𝑦_𝑏𝑒𝑡 (𝑚𝑖𝑛 50$)\njoin 𝑚𝑜𝑛𝑒𝑦_𝑏𝑒𝑡 (𝑚𝑖𝑛 50$)\nleave (𝑙𝑒𝑎𝑣𝑒 𝑔𝑎𝑚𝑒)\nstart (𝑠𝑡𝑎𝑟𝑡 𝑔𝑎𝑚𝑒)"
    },
    dependencies: {
      "fs": "",
      "axios": ""
    },
    envConfig: {
      "maxPlayers": 5,
      "normalWinBonus": 1,
      "superWinBonus": 2,
      "epicWinBonus": 4
    }
  },

  langs: {
    "en": {
      "missingInput": "[ 𝑋𝐼𝐷𝐴𝐶𝐻 ] 𝐵𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑒 𝑒𝑚𝑝𝑡𝑦 𝑜𝑟 𝑛𝑒𝑔𝑎𝑡𝑖𝑣𝑒",
      "moneyBetNotEnough": "[ 𝑋𝐼𝐷𝐴𝐶𝐻 ] 𝐵𝑒𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 𝑖𝑠 𝑔𝑟𝑒𝑎𝑡𝑒𝑟 𝑡ℎ𝑎𝑛 𝑦𝑜𝑢𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒!",
      "limitBet": "[ 𝑋𝐼𝐷𝐴𝐶𝐻 ] 𝐵𝑒𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 50$!",
      "noGame": "[ 𝑋𝐼𝐷𝐴𝐶𝐻 ] 𝑁𝑜 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!",
      "xidachRules": "[ 𝑋𝐼𝐷𝐴𝐶𝐻 ]\n𝑁𝑂𝑇𝐸:\n𝐵𝑙𝑎𝑐𝑘𝑗𝑎𝑐𝑘: 𝐴 + 𝐽/𝑄/𝐾\n𝐷𝑜𝑢𝑏𝑙𝑒 𝐴𝑐𝑒𝑠: 2𝐴\n\n𝑅𝑢𝑙𝑒𝑠:\n16-21 𝑝𝑜𝑖𝑛𝑡𝑠:\n𝑃𝑙𝑎𝑦𝑒𝑟 > 𝐷𝑒𝑎𝑙𝑒𝑟: 𝑤𝑖𝑛 𝑥1\n𝑃𝑙𝑎𝑦𝑒𝑟 < 𝐷𝑒𝑎𝑙𝑒𝑟: 𝑙𝑜𝑠𝑒\n\n𝐷𝑜𝑢𝑏𝑙𝑒 𝐴𝑐𝑒𝑠 > 𝐵𝑙𝑎𝑐𝑘𝑗𝑎𝑐𝑘:\n𝑃𝑙𝑎𝑦𝑒𝑟 ℎ𝑎𝑠 𝐷𝐴, 𝐷𝑒𝑎𝑙𝑒𝑟 ℎ𝑎𝑠 𝑛𝑜𝑡ℎ𝑖𝑛𝑔 → 𝑥4\n𝑃𝑙𝑎𝑦𝑒𝑟 ℎ𝑎𝑠 𝐷𝐴, 𝐷𝑒𝑎𝑙𝑒𝑟 ℎ𝑎𝑠 𝐵𝐽 → 𝑥2\n𝑃𝑙𝑎𝑦𝑒𝑟 ℎ𝑎𝑠 𝐵𝐽, 𝐷𝑒𝑎𝑙𝑒𝑟 ℎ𝑎𝑠 𝐷𝐴 → 𝐿𝑜𝑠𝑒\n\n𝑀𝑎𝑔𝑖𝑐 5: 5 𝑐𝑎𝑟𝑑𝑠 𝑢𝑛𝑑𝑒𝑟 21. 𝐴𝑢𝑡𝑜 𝑤𝑖𝑛. 𝐵𝑜𝑡ℎ 𝑀5 → 𝑙𝑜𝑤𝑒𝑟 𝑝𝑜𝑖𝑛𝑡𝑠 𝑤𝑖𝑛𝑠.\n\n𝑂𝑣𝑒𝑟 21: 𝐵𝑜𝑡ℎ 𝑜𝑣𝑒𝑟 → 𝑙𝑜𝑤𝑒𝑟 𝑝𝑜𝑖𝑛𝑡𝑠 𝑤𝑖𝑛𝑠.\n\n𝑈𝑠𝑎𝑔𝑒:\n{p}xidach create 𝑏𝑒𝑡_𝑎𝑚𝑜𝑢𝑛𝑡\n{p}xidach join 𝑏𝑒𝑡_𝑎𝑚𝑜𝑢𝑛𝑡\n{p}xidach leave\n{p}xidach start",
      "magic_five": "𝑀𝑎𝑔𝑖𝑐 5",
      "blackJack": "𝐵𝑙𝑎𝑐𝑘𝑗𝑎𝑐𝑘",
      "double_aces": "𝐷𝑜𝑢𝑏𝑙𝑒 𝐴𝑐𝑒𝑠",
      "points": " 𝑝𝑜𝑖𝑛𝑡𝑠",
      "final": "[ 𝐺𝐴𝑀𝐸 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 ]\n──────────────────\n→ 𝐵𝑜𝑡: %1",
      "get_or_ready": "[ %1 ]\n𝑅𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔 𝑐𝑎𝑟𝑑𝑠: %2\n%3, 𝑐ℎ𝑜𝑜𝑠𝑒 𝑔𝑒𝑡 𝑜𝑟 𝑟𝑒𝑎𝑑𝑦.",
      "out_of_time": "%1, 𝑡𝑖𝑚𝑒𝑜𝑢𝑡 (20𝑠).",
      "yourCards": "𝑌𝑜𝑢𝑟 𝑐𝑎𝑟𝑑𝑠: %1",
      "cards_limit": "𝑀𝑎𝑥 5 𝑐𝑎𝑟𝑑𝑠 𝑟𝑒𝑎𝑐ℎ𝑒𝑑.",
      "points_limit": "21+ 𝑝𝑜𝑖𝑛𝑡𝑠 𝑟𝑒𝑎𝑐ℎ𝑒𝑑.",
      "getSuccess": "𝑅𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔 𝑐𝑎𝑟𝑑𝑠: %1\n𝑆𝑢𝑐𝑐𝑒𝑠𝑠! 𝐶ℎ𝑜𝑜𝑠𝑒 𝑟𝑒𝑎𝑑𝑦 𝑜𝑟 𝑔𝑒𝑡!",
      "ready": "𝑌𝑜𝑢 𝑐ℎ𝑜𝑠𝑒 𝑡𝑜 𝑠𝑡𝑎𝑦!",
      "alreadyHave": "𝐺𝑎𝑚𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!",
      "openSuccess": "𝐺𝑎𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑! (2/%1)\n𝐽𝑜𝑖𝑛 𝑤𝑖𝑡ℎ:\n{p}xidach join 𝑏𝑒𝑡",
      "alreadyJoined": "𝑌𝑜𝑢 𝑎𝑟𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒",
      "out_of_room": "𝑅𝑜𝑜𝑚 𝑖𝑠 𝑓𝑢𝑙𝑙...",
      "alreadyStarted_1": "𝐺𝑎𝑚𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑠𝑡𝑎𝑟𝑡𝑒𝑑, 𝑐𝑎𝑛'𝑡 𝑗𝑜𝑖𝑛!",
      "joinSuccess": "𝐽𝑜𝑖𝑛𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! (%1/%2)",
      "author_left_before_start": "𝐻𝑜𝑠𝑡 𝑙𝑒𝑓𝑡, 𝑔𝑎𝑚𝑒 𝑐𝑎𝑛𝑐𝑒𝑙𝑙𝑒𝑑!\n𝐵𝑒𝑡𝑠 𝑟𝑒𝑓𝑢𝑛𝑑𝑒𝑑!",
      "outSuccess": "𝐿𝑒𝑓𝑡 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! (%1/%2)",
      "not_yet_started": "𝐺𝑎𝑚𝑒 𝑛𝑜𝑡 𝑠𝑡𝑎𝑟𝑡𝑒𝑑, 𝑏𝑒𝑡 𝑟𝑒𝑓𝑢𝑛𝑑𝑒𝑑!",
      "only_bot_left": "𝑂𝑛𝑙𝑦 𝑏𝑜𝑡 𝑙𝑒𝑓𝑡, 𝑔𝑎𝑚𝑒 𝑐𝑎𝑛𝑐𝑒𝑙𝑙𝑒𝑑!",
      "not_author": "𝑌𝑜𝑢 𝑎𝑟𝑒 𝑛𝑜𝑡 𝑡ℎ𝑒 ℎ𝑜𝑠𝑡",
      "alreadyStarted_2": "𝐺𝑎𝑚𝑒 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔!",
      "testInbox": "𝐶ℎ𝑒𝑐𝑘𝑖𝑛𝑔 𝑖𝑛𝑏𝑜𝑥 𝑠𝑡𝑎𝑡𝑢𝑠...",
      "checkInbox_noti": "→ 𝐵𝑜𝑡 𝑤𝑖𝑙𝑙 𝑠𝑒𝑛𝑑 𝑐𝑎𝑟𝑑𝑠 𝑣𝑖𝑎 𝑖𝑛𝑏𝑜𝑥, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑖𝑛𝑏𝑜𝑥/𝑠𝑝𝑎𝑚",
      "cannotInbox": "%1, 𝑐𝑎𝑛'𝑡 𝑖𝑛𝑏𝑜𝑥 𝑦𝑜𝑢, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑏𝑜𝑡 𝑓𝑖𝑟𝑠𝑡",
      "explaining": "𝑊ℎ𝑒𝑛 𝑦𝑜𝑢𝑟 𝑡𝑢𝑟𝑛, 𝑡𝑦𝑝𝑒:\n𝑔𝑒𝑡 (𝑑𝑟𝑎𝑤 𝑐𝑎𝑟𝑑, 𝑚𝑎𝑥 3 𝑡𝑖𝑚𝑒𝑠)\n𝑟𝑒𝑎𝑑𝑦 (𝑠𝑡𝑎𝑦, 𝑛𝑜 𝑚𝑜𝑟𝑒 𝑐𝑎𝑟𝑑𝑠)",
      "start_after_5s": "𝑃𝑟𝑒𝑝𝑎𝑟𝑖𝑛𝑔...",
      "started": "𝐺𝐴𝑀𝐸 𝑆𝑇𝐴𝑅𝑇𝐸𝐷!"
    }
  },

  cards: {
    31: "3_of_spades.png",
    32: "3_of_clubs.png",
    33: "3_of_diamonds.png",
    34: "3_of_hearts.png",
    41: "4_of_spades.png",
    42: "4_of_clubs.png",
    43: "4_of_diamonds.png",
    44: "4_of_hearts.png",
    51: "5_of_spades.png",
    52: "5_of_clubs.png",
    53: "5_of_diamonds.png",
    54: "5_of_hearts.png",
    61: "6_of_spades.png",
    62: "6_of_clubs.png",
    63: "6_of_diamonds.png",
    64: "6_of_hearts.png",
    71: "7_of_spades.png",
    72: "7_of_clubs.png",
    73: "7_of_diamonds.png",
    74: "7_of_hearts.png",
    81: "8_of_spades.png",
    82: "8_of_clubs.png",
    83: "8_of_diamonds.png",
    84: "8_of_hearts.png",
    91: "9_of_spades.png",
    92: "9_of_clubs.png",
    93: "9_of_diamonds.png",
    94: "9_of_hearts.png",
    101: "10_of_spades.png",
    102: "10_of_clubs.png",
    103: "10_of_diamonds.png",
    104: "10_of_hearts.png",
    111: "jack_of_spades2.png",
    112: "jack_of_clubs2.png",
    113: "jack_of_diamonds2.png",
    114: "jack_of_hearts2.png",
    121: "queen_of_spades2.png",
    122: "queen_of_clubs2.png",
    123: "queen_of_diamonds2.png",
    124: "queen_of_hearts2.png",
    131: "king_of_spades2.png",
    132: "king_of_clubs2.png",
    133: "king_of_diamonds2.png",
    134: "king_of_hearts2.png",
    11: "ace_of_spades.png",
    12: "ace_of_clubs.png",
    13: "ace_of_diamonds.png",
    14: "ace_of_hearts.png",
    21: "2_of_spades.png",
    22: "2_of_clubs.png",
    23: "2_of_diamonds.png",
    24: "2_of_hearts.png",
  },

  onLoad: async function () {
    let path = __dirname + '/poker/';
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    await axios.get("https://raw.githubusercontent.com/Chinhle2224455/base64_poker/main/data.json").then(async (res) => {
      for (let e in res.data) {
        if (fs.existsSync(path + e)) continue;
        await fs.writeFileSync(path + e, res.data[e], 'base64');
      }
    });
    if (!global.client.xidach_otm) global.client.xidach_otm = {};
    console.log("https://www.facebook.com/profile.php?id=1193456508");
  },

  onStart: async function ({ api, event, args, message, usersData, currenciesData }) {
    try {
      // Check dependencies
      if (!fs.existsSync) throw new Error("𝑓𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
      if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

      if (!global.client.xidach_otm) global.client.xidach_otm = {};
      const { threadID, messageID, senderID } = event;
      const getText = (key, ...values) => {
        let text = this.langs.en[key];
        if (values.length > 0) {
          values.forEach((value, index) => {
            text = text.replace(`%${index + 1}`, value);
          });
        }
        return text;
      };

      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

      const countC = (array) => {
        let total = 0;
        array.forEach(e => {
          let num = 0;
          if (e >= 101) num = 10;
          else num = Math.floor((e / 10) % 10);
          total += num;
        });
        return total;
      };

      const nextUser = async (object) => {
        if (!global.client.xidach_otm[threadID]) return;
        global.client.xidach_otm[threadID].curUser++;
        if (global.client.xidach_otm[threadID].curUser == global.client.xidach_otm[threadID].data.length - 1) return endS(object);
        
        let curU = global.client.xidach_otm[threadID].curUser;
        let curUserD = global.client.xidach_otm[threadID].data[curU];
        let name = (await api.getUserInfo(curUserD.id))[curUserD.id]?.name || "Player";
        let oldL = curUserD.cards.length;
        
        api.sendMessage({
          body: getText("get_or_ready", new Date().toLocaleString("en-US", {timeZone: 'Asia/Dhaka'}), global.client.xidach_otm[threadID].cards.length, name),
          mentions: [{ tag: name, id: curUserD.id }]
        }, threadID);
        
        setTimeout(async () => {
          if (!global.client.xidach_otm[threadID]) return;
          let newCurUserD = global.client.xidach_otm[threadID].data[curU];
          if (oldL == newCurUserD.cards.length && !newCurUserD.ready) {
            api.sendMessage({
              body: getText("out_of_time", name),
              mentions: [{ tag: name, id: curUserD.id }]
            }, threadID);
            await delay(300);
            return nextUser(object);
          }
        }, 20000);
      };

      const endS = async (object) => {
        var botCards = object.data[object.players - 1].cards;
        var getBotPoint = countC(botCards);
        var botRank = (getBotPoint < 16) ? 0 : (getBotPoint <= 21) ? 2 : 1;
        if (getBotPoint == 2 && Math.floor((botCards[0] / 10) % 10) == 1) botRank = 5;
        if (getBotPoint == 11 && (botCards[0] >= 111 && Math.floor((botCards[1] / 10) % 10) == 1) || (botCards[1] >= 111 && Math.floor((botCards[0] / 10) % 10) == 1)) botRank = 4;
        
        let getCardIndex = Math.floor(Math.random() * object.cards.length);
        if (botRank == 0) {
          while (botCards.length < 5 && getBotPoint < 21) {
            object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
            object.cards.splice(getCardIndex, 1);
            botCards = object.data[object.players - 1].cards;
            getBotPoint = countC(botCards);
          }
          if (getBotPoint <= 21) botRank = 2;
          else botRank = 1;
        }
        
        if (botRank == 2) {
          if (botCards.length == 5) botRank = 3;
          while (getBotPoint < 16) {
            object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
            object.cards.splice(getCardIndex, 1);
            botCards = object.data[object.players - 1].cards;
            getBotPoint = countC(botCards);
          }
          if (getBotPoint < 18) {
            let rand = Math.random();
            if (rand <= 0.2) {
              object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
              object.cards.splice(getCardIndex, 1);
              botCards = object.data[object.players - 1].cards;
              getBotPoint = countC(botCards);
            }
          }
          if (getBotPoint > 21) botRank = 1;
        }
        
        var msg = getText("final", (botRank == 3) ? getText("magic_five") : (botRank == 4) ? getText("blackJack") : (botRank == 5) ? getText("double_aces") : (getBotPoint + getText("points")));
        var rank = 0, playerPoints = 0;
        var result = "";
        
        for (let i = 0; i < object.players - 1; i++) {
          let playerD = object.data[i];
          playerPoints = countC(playerD.cards);
          rank = (playerPoints < 16) ? 0 : (playerPoints <= 21) ? 2 : 1;
          if (playerPoints == 2 && Math.floor((playerD.cards[0] / 10) % 10) == 1) rank = 5;
          if (playerPoints == 11 && (playerD.cards[0] >= 111 && Math.floor((playerD.cards[1] / 10) % 10) == 1) || (playerD.cards[1] >= 111 && Math.floor((playerD.cards[0] / 10) % 10) == 1)) rank = 4;
          if (rank == 2 && playerD.cards.length == 5) rank = 3;
          
          let bonus = (rank == 3) ? object.bonus.superWinBonus : (rank >= 4) ? object.bonus.epicWinBonus : 1;
          result = (botRank > rank) ? `𝐿𝑜𝑠𝑒 (-${playerD.bet}$)` : `𝑊𝑖𝑛 (+${playerD.bet + "$ x" + bonus})`;
          
          if (botRank == rank) {
            result = (playerPoints == getBotPoint || rank >= 4) ? "𝐷𝑟𝑎𝑤" : (rank == 1) ? (playerPoints < getBotPoint) ? `𝑊𝑖𝑛 (+${playerD.bet}$)` : `𝐿𝑜𝑠𝑒 (-${playerD.bet}$)` : (rank == 2) ? (playerPoints > getBotPoint) ? `𝑊𝑖𝑛 (+${playerD.bet}$)` : `𝐿𝑜𝑠𝑒 (-${playerD.bet}$)` : (rank == 3) ? (playerPoints < getBotPoint) ? `𝑊𝑖𝑛 (+${playerD.bet + " x" + object.bonus.superWinBonus}$)` : `𝐿𝑜𝑠𝑒 (-${playerD.bet}$)` : '';
          }
          
          if (result == "𝐷𝑟𝑎𝑤") await currenciesData.increaseMoney(playerD.id, playerD.bet);
          else if (result.slice(0,3) != "𝐿𝑜𝑠") await currenciesData.increaseMoney(playerD.id, playerD.bet * (bonus + 1));
          
          let name = (await api.getUserInfo(playerD.id))[playerD.id]?.name || "Player";
          msg += `\n + ${name}: ${(rank == 3) ? getText("magic_five") : (rank == 4) ? getText("blackJack") : (rank == 5) ? getText("double_aces") : (playerPoints + getText("points"))} | ` + result;
        }
        
        api.sendMessage(msg, threadID, () => delete global.client.xidach_otm[threadID]);
      };

      // Main command logic
      const moneyUser = (await currenciesData.get(senderID)).money;
      const prefix = "/";
      let moneyBet = 0;

      switch (args[0]) {
        case 'create':
          moneyBet = parseInt(args[1]);
          if (isNaN(moneyBet) || moneyBet <= 0) return message.reply(getText("missingInput"));
          if (moneyBet > moneyUser) return message.reply(getText("moneyBetNotEnough"));
          if (moneyBet < 50) return message.reply(getText("limitBet"));
          if (threadID in global.client.xidach_otm) return message.reply(getText("alreadyHave"));
          
          await currenciesData.decreaseMoney(senderID, moneyBet);
          global.client.xidach_otm[threadID] = {
            players: 2,
            status: "pending",
            data: [{ id: senderID, bet: moneyBet, cards: [], type: "author" }],
            bonus: this.config.envConfig
          };
          
          return message.reply(getText("openSuccess", this.config.envConfig.maxPlayers, prefix + this.config.name));

        case "join":
          if (!(threadID in global.client.xidach_otm)) return message.reply(getText("noGame"));
          if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID)) return message.reply(getText("alreadyJoined"));
          if (global.client.xidach_otm[threadID].players == this.config.envConfig.maxPlayers) return message.reply(getText("out_of_room"));
          if (global.client.xidach_otm[threadID].status == "started") return message.reply(getText("alreadyStarted_1"));
          
          moneyBet = parseInt(args[1]);
          if (isNaN(moneyBet) || moneyBet <= 0) return message.reply(getText("missingInput"));
          if (moneyBet > moneyUser) return message.reply(getText("moneyBetNotEnough"));
          if (moneyBet < 50) return message.reply(getText("limitBet"));
          
          await currenciesData.decreaseMoney(senderID, moneyBet);
          global.client.xidach_otm[threadID].players++;
          global.client.xidach_otm[threadID].data.push({ id: senderID, bet: moneyBet, cards: [], type: "player" });
          
          return message.reply(getText("joinSuccess", global.client.xidach_otm[threadID].players, this.config.envConfig.maxPlayers));

        case "leave":
          if (!(threadID in global.client.xidach_otm)) return message.reply(getText("noGame"));
          
          if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID)?.type == "author" && global.client.xidach_otm[threadID].status == "pending") {
            global.client.xidach_otm[threadID].data.forEach(async (p) => {
              if (p.id != api.getCurrentUserID()) await currenciesData.increaseMoney(p.id, p.bet);
            });
            delete global.client.xidach_otm[threadID];
            return message.reply(getText("author_left_before_start"));
          }
          
          global.client.xidach_otm[threadID].players -= 1;
          if (global.client.xidach_otm[threadID].status == "pending") {
            const player = global.client.xidach_otm[threadID].data.find(p => p.id == senderID);
            if (player) await currenciesData.increaseMoney(senderID, player.bet);
          }
          
          global.client.xidach_otm[threadID].data = global.client.xidach_otm[threadID].data.filter(p => p.id != senderID);
          
          if (global.client.xidach_otm[threadID].players == 1) {
            delete global.client.xidach_otm[threadID];
            return message.reply(getText("only_bot_left"));
          }
          
          return message.reply(getText("outSuccess", global.client.xidach_otm[threadID].players, this.config.envConfig.maxPlayers));

        case "start":
          if (!(threadID in global.client.xidach_otm)) return message.reply(getText("noGame"));
          if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID)?.type != "author") return message.reply(getText("not_author"));
          if (global.client.xidach_otm[threadID].status == "started") return message.reply(getText("alreadyStarted_2"));
          
          global.client.xidach_otm[threadID].status = "started";
          global.client.xidach_otm[threadID].data.push({ id: api.getCurrentUserID(), cards: [], type: "BOSS" });
          
          var cardKeys = Object.keys(this.cards);
          for (let i = cardKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardKeys[i], cardKeys[j]] = [cardKeys[j], cardKeys[i]];
          }
          
          await message.reply(getText("testInbox"));
          for (let i = 0; i < global.client.xidach_otm[threadID].data.length; i++) {
            let p = global.client.xidach_otm[threadID].data[i];
            if (p.id == api.getCurrentUserID()) continue;
            try {
              await api.sendMessage("𝑡𝑒𝑠𝑡𝑖𝑛𝑔...", p.id);
            } catch (err) {
              let curName = (await api.getUserInfo(p.id))[p.id]?.name || "Player";
              await api.sendMessage({
                body: getText("cannotInbox", curName),
                mentions: [{ tag: curName, id: p.id }]
              }, threadID);
            }
            await delay(2000);
          }
          
          await message.reply(getText("checkInbox_noti"));
          for (let i = 0; i < global.client.xidach_otm[threadID].data.length; i++) {
            try {
              let p = global.client.xidach_otm[threadID].data[i];
              let one = cardKeys.shift();
              let two = cardKeys.shift();
              global.client.xidach_otm[threadID].data[i].cards.push(one, two);
              
              if (p.id == api.getCurrentUserID()) continue;
              
              const atms = [
                fs.createReadStream(__dirname + `/poker/${this.cards[one]}`),
                fs.createReadStream(__dirname + `/poker/${this.cards[two]}`)
              ];
              
              await api.sendMessage({
                body: getText("yourCards", countC(global.client.xidach_otm[threadID].data[i].cards)),
                attachment: atms
              }, p.id);
              await delay(300);
            } catch (e) {
              console.error("𝐶𝑎𝑟𝑑 𝑒𝑟𝑟𝑜𝑟:", e);
            }
          }
          
          await message.reply(getText("explaining"));
          await delay(1000);
          await message.reply(getText("start_after_5s"));
          await delay(5000);
          await message.reply(getText("started"));
          await delay(300);
          
          global.client.xidach_otm[threadID].cards = cardKeys;
          global.client.xidach_otm[threadID].curUser = -1;
          return nextUser(global.client.xidach_otm[threadID]);

        default:
          return message.reply(getText("xidachRules"));
      }

    } catch (error) {
      console.error("𝑋𝑖𝑑𝑎𝑐ℎ 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  },

  onChat: async function ({ event, api, getText, usersData, currenciesData }) {
    if (event.senderID == api.getCurrentUserID()) return;
    await delay(300);
    if (!event.body) return;
    
    const { threadID, senderID, body } = event;
    const getTextLocal = (key, ...values) => {
      let text = this.langs.en[key];
      if (values.length > 0) {
        values.forEach((value, index) => {
          text = text.replace(`%${index + 1}`, value);
        });
      }
      return text;
    };

    if (global.client.xidach_otm[threadID]?.curUser >= 0) {
      let curU = global.client.xidach_otm[threadID].curUser;
      if (global.client.xidach_otm[threadID].data[curU]?.id != senderID) return;
      
      const bodyLower = body.toLowerCase();
      const countC = (array) => {
        let total = 0;
        array.forEach(e => {
          let num = 0;
          if (e >= 101) num = 10;
          else num = Math.floor((e / 10) % 10);
          total += num;
        });
        return total;
      };

      if (bodyLower == "get") {
        global.client.xidach_otm[threadID].data[curU].cards.push(global.client.xidach_otm[threadID].cards.pop());
        
        const atms = global.client.xidach_otm[threadID].data[curU].cards.map(c => 
          fs.createReadStream(__dirname + `/poker/${this.cards[c]}`)
        );
        
        api.sendMessage({
          body: getTextLocal("yourCards", countC(global.client.xidach_otm[threadID].data[curU].cards)),
          attachment: atms
        }, senderID);
        
        if (global.client.xidach_otm[threadID].data[curU].cards.length == 5) {
          api.sendMessage(getTextLocal("cards_limit"), threadID);
          await delay(1000);
          return nextUser(global.client.xidach_otm[threadID]);
        }
        
        if (countC(global.client.xidach_otm[threadID].data[curU].cards) >= 21) {
          api.sendMessage(getTextLocal("points_limit"), threadID);
          await delay(1000);
          return nextUser(global.client.xidach_otm[threadID]);
        }
        
        api.sendMessage(getTextLocal("getSuccess", global.client.xidach_otm[threadID].cards.length), threadID);
      }
      
      if (bodyLower == "ready") {
        api.sendMessage(getTextLocal("ready"), threadID);
        global.client.xidach_otm[threadID].data[curU].ready = true;
        await delay(300);
        return nextUser(global.client.xidach_otm[threadID]);
      }
    }
  }
};
