const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "setcoins",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑴𝒂𝒏𝒂𝒈𝒆 𝒖𝒔𝒆𝒓 𝒄𝒖𝒓𝒓𝒆𝒏𝒄𝒚 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏",
  commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
  usages: "[add/set/clean] [amount] [user tag]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function ({ event, api, Currencies, args }) {
  const { threadID, messageID, senderID } = event;
  const mentionID = Object.keys(event.mentions);
  const action = args[0];
  const amount = parseInt(args[1]);
  let message = [];
  let error = [];

  // Validate action type
  if (!['add', 'set', 'clean'].includes(action)) {
    return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒄𝒕𝒊𝒐𝒏! 𝑼𝒔𝒆: 𝒂𝒅𝒅, 𝒔𝒆𝒕, 𝒐𝒓 𝒄𝒍𝒆𝒂𝒏", threadID, messageID);
  }

  // Validate amount for add/set actions
  if (action !== 'clean' && (isNaN(amount) || amount <= 0)) {
    return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒏𝒖𝒎𝒃𝒆𝒓", threadID, messageID);
  }

  // Process based on action
  try {
    if (mentionID.length > 0) {
      // Process mentioned users
      for (const singleID of mentionID) {
        switch (action) {
          case 'add':
            await Currencies.increaseMoney(singleID, amount);
            message.push(singleID);
            break;
          case 'set':
            await Currencies.setData(singleID, { money: amount });
            message.push(singleID);
            break;
          case 'clean':
            await Currencies.setData(singleID, { money: 0 });
            message.push(singleID);
            break;
        }
      }
    } else {
      // Process sender if no mentions
      switch (action) {
        case 'add':
          await Currencies.increaseMoney(senderID, amount);
          message.push(senderID);
          break;
        case 'set':
          await Currencies.setData(senderID, { money: amount });
          message.push(senderID);
          break;
        case 'clean':
          await Currencies.setData(senderID, { money: 0 });
          message.push(senderID);
          break;
      }
    }

    // Success messages
    const successMessages = {
      add: `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒂𝒅𝒅𝒆𝒅 ${amount} 𝒄𝒐𝒊𝒏𝒔 𝒕𝒐 ${message.length} 𝒖𝒔𝒆𝒓𝒔`,
      set: `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒕 ${amount} 𝒄𝒐𝒊𝒏𝒔 𝒇𝒐𝒓 ${message.length} 𝒖𝒔𝒆𝒓𝒔`,
      clean: `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒄𝒍𝒆𝒂𝒏𝒆𝒅 𝒄𝒐𝒊𝒏𝒔 𝒇𝒐𝒓 ${message.length} 𝒖𝒔𝒆𝒓𝒔`
    };

    api.sendMessage(successMessages[action], threadID, messageID);
    
  } catch (err) {
    console.error(err);
    api.sendMessage(`❌ 𝑬𝒓𝒓𝒐𝒓: ${err.message}`, threadID, messageID);
  }
};
