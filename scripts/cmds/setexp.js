module.exports.config = {
  name: "setexp",
  version: "1.0",
  hasPermission: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑴𝒐𝒅𝒊𝒇𝒚 𝑬𝑿𝑷 𝒍𝒆𝒗𝒆𝒍𝒔 𝒇𝒐𝒓 𝒖𝒔𝒆𝒓𝒔",
  commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
  usages: "setexp [me/del/UID] [amount/userID]",
  cooldowns: 5,
  dependencies: {
    "GoatBot": "latest"
  }
};

module.exports.languages = {
  "vi": {
    "setexp_success": "✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒕 𝒚𝒐𝒖𝒓 𝑬𝑿𝑷 𝒕𝒐 {exp} 🥇",
    "setexp_reset": "✅ 𝑹𝒆𝒎𝒐𝒗𝒆𝒅 {exp} 𝑬𝑿𝑷 𝒑𝒐𝒊𝒏𝒕𝒔",
    "setexp_invalid": "❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑬𝑿𝑷 𝒗𝒂𝒍𝒖𝒆! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒏𝒖𝒎𝒃𝒆𝒓"
  },
  "en": {
    "setexp_success": "✅ Successfully set your EXP to {exp} 🥇",
    "setexp_reset": "✅ Removed {exp} EXP points",
    "setexp_invalid": "❌ Invalid EXP value! Please enter a number"
  }
};

module.exports.run = async function({ api, event, args, Currencies, Users, language }) {
  try {
    const { threadID, messageID, senderID } = event;
    const action = args[0]?.toLowerCase();
    const target = args[1];
    const amount = parseInt(args[2]);

    // Set own EXP
    if (action === 'me') {
      const expValue = parseInt(args[1]);
      if (isNaN(expValue)) {
        return api.sendMessage(language.setexp_invalid, threadID, messageID);
      }
      await Currencies.setData(senderID, { exp: expValue });
      return api.sendMessage(language.setexp_success.replace("{exp}", expValue), threadID, messageID);
    }

    // Reset EXP to zero
    if (action === 'del') {
      if (target === 'me') {
        const currentExp = (await Currencies.getData(senderID)).exp;
        await Currencies.setData(senderID, { exp: 0 });
        return api.sendMessage(language.setexp_reset.replace("{exp}", currentExp), threadID, messageID);
      }
      
      if (event.mentions && Object.keys(event.mentions).length === 1) {
        const mentionID = Object.keys(event.mentions)[0];
        const userName = event.mentions[mentionID].replace("@", "");
        const currentExp = (await Currencies.getData(mentionID)).exp;
        await Currencies.setData(mentionID, { exp: 0 });
        return api.sendMessage(language.setexp_reset.replace("{exp}", currentExp), threadID, messageID);
      }
      
      return api.sendMessage("❌ Invalid usage: Please tag a user or use 'me'", threadID, messageID);
    }

    // Set EXP by UID
    if (action === 'uid') {
      if (!target || isNaN(amount)) {
        return api.sendMessage("❌ Invalid syntax: Use 'setexp UID [userID] [amount]'", threadID, messageID);
      }
      const userData = await Users.getData(target);
      if (!userData || !userData.name) {
        return api.sendMessage("❌ User not found! Please check the UID", threadID, messageID);
      }
      await Currencies.setData(target, { exp: amount });
      return api.sendMessage(`✅ Set ${userData.name}'s EXP to ${amount} 🥇`, threadID, messageID);
    }

    // Set EXP for mentioned user
    if (event.mentions && Object.keys(event.mentions).length === 1) {
      const mentionID = Object.keys(event.mentions)[0];
      const expValue = parseInt(args[args.length - 1]);
      if (isNaN(expValue)) {
        return api.sendMessage("❌ Invalid EXP value! Please enter a number", threadID, messageID);
      }
      const userName = event.mentions[mentionID].replace("@", "");
      await Currencies.setData(mentionID, { exp: expValue });
      return api.sendMessage({
        body: `✅ Set ${userName}'s EXP to ${expValue} 🥇`,
        mentions: [{ tag: userName, id: parseInt(mentionID) }]
      }, threadID, messageID);
    }

    // Default error message
    return api.sendMessage(`❌ Invalid command! Usage examples:
• setexp me 100
• setexp @user 500
• setexp del @user
• setexp UID 12345678 1000`, threadID, messageID);

  } catch (error) {
    console.error("SetEXP Error:", error);
    api.sendMessage("❌ An error occurred while processing your request", event.threadID, event.messageID);
  }
};
