const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "setcoins",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Manage user currency information",
  category: "System",
  usages: "[add/set/clean] [amount] [user tag]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.languages = {
  "en": {
    invalidAction: "❌ Invalid action! Use: add, set, or clean",
    invalidAmount: "❌ Invalid amount! Please enter a valid number",
    error: "❌ Error: %1",
    successAdd: "✅ Successfully added %1 coins to %2 users",
    successSet: "✅ Successfully set %1 coins for %2 users",
    successClean: "✅ Successfully cleaned coins for %1 users"
  },
  "vi": {
    invalidAction: "❌ Hành động không hợp lệ! Sử dụng: add, set, hoặc clean",
    invalidAmount: "❌ Số tiền không hợp lệ! Vui lòng nhập một số hợp lệ",
    error: "❌ Lỗi: %1",
    successAdd: "✅ Thêm thành công %1 coins cho %2 người dùng",
    successSet: "✅ Đặt thành công %1 coins cho %2 người dùng",
    successClean: "✅ Xoá thành công coins cho %2 người dùng"
  }
};

module.exports.onStart = async function({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mentionIDs = Object.keys(mentions);
  const action = args[0]?.toLowerCase();
  const amount = parseInt(args[1]);
  let processedUsers = [];

  // Validate action
  if (!['add', 'set', 'clean'].includes(action)) 
    return api.sendMessage(module.exports.languages.en.invalidAction, threadID, messageID);

  // Validate amount if needed
  if (action !== 'clean' && (isNaN(amount) || amount <= 0))
    return api.sendMessage(module.exports.languages.en.invalidAmount, threadID, messageID);

  try {
    // Determine target users (mentions or sender)
    const targetUsers = mentionIDs.length > 0 ? mentionIDs : [senderID];

    for (const uid of targetUsers) {
      switch(action) {
        case 'add':
          await Currencies.increaseMoney(uid, amount);
          processedUsers.push(uid);
          break;
        case 'set':
          await Currencies.setData(uid, { money: amount });
          processedUsers.push(uid);
          break;
        case 'clean':
          await Currencies.setData(uid, { money: 0 });
          processedUsers.push(uid);
          break;
      }
    }

    // Send success message
    const successMsgs = {
      add: module.exports.languages.en.successAdd.replace('%1', amount).replace('%2', processedUsers.length),
      set: module.exports.languages.en.successSet.replace('%1', amount).replace('%2', processedUsers.length),
      clean: module.exports.languages.en.successClean.replace('%1', processedUsers.length)
    };

    api.sendMessage(successMsgs[action], threadID, messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage(module.exports.languages.en.error.replace('%1', err.message), threadID, messageID);
  }
};
