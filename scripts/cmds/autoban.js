module.exports.config = {
  name: "fixspam-ch",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒃𝒂𝒏 𝒖𝒔𝒆𝒓𝒔 𝒘𝒉𝒐 𝒖𝒔𝒆 𝒃𝒂𝒅 𝒘𝒐𝒓𝒅𝒔 𝒂𝒈𝒂𝒊𝒏𝒔𝒕 𝒕𝒉𝒆 𝒃𝒐𝒕",
  commandCategory: "𝒔𝒚𝒔𝒕𝒆𝒎",
  usages: "𝒏𝒐𝒑𝒓𝒆𝒇𝒊𝒙",
  cooldowns: 0,
  dependencies: {}
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const { threadID, messageID, body, senderID } = event;
  
  // Ignore messages from the bot itself
  if (senderID === api.getCurrentUserID()) return;
  
  const userName = await Users.getNameUser(senderID);
  const time = require("moment-timezone").tz("Asia/Dhaka").format("HH:MM:ss L");
  
  // Curse words list
  const badWords = [
    "bot mc", "Mc bot", "Chutiya bot", "Bsdk bot", "Bot teri maa ki chut", 
    "Jhatu bot", "Rhaine bobo", "stupid bots", "chicken bot", "Bot lund", 
    "Priyansh mc", "Mc priyansh", "Bsdk priyansh", "fuck bots", 
    "Priyansh chutiya", "Priyansh gandu", "bobo Ginoong choru bot", 
    "Priyansh bc", "crazy bots", "bc priyansh", "Nikal bsdk bot", 
    "bot khùng", "đĩ bot", "bot paylac rồi", "con bot lòn", "cmm bot", 
    "clap bot", "bot ncc", "bot oc", "bot óc", "bot óc chó", "cc bot", 
    "bot tiki", "lozz bottt", "lol bot", "loz bot", "lồn bot", "bot lồn", 
    "bot lon", "bot cac", "bot nhu lon", "bot như cc", "bot như bìu", 
    "Bot sida", "bot sida", "bot fake", "Bảo ngu", "bot shoppee", 
    "bad bots", "bot cau"
  ];

  for (const word of badWords) {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    
    if (body === word.toUpperCase() || body === word || body === capitalized) {
      console.log(`𝑩𝒂𝒅 𝒘𝒐𝒓𝒅 𝒅𝒆𝒕𝒆𝒄𝒕𝒆𝒅: ${userName} said "${word}"`);
      
      // Ban the user
      const userData = await Users.getData(senderID);
      userData.banned = 1;
      userData.reason = word;
      userData.dateAdded = time;
      
      await Users.setData(senderID, userData);
      global.data.userBanned.set(senderID, {
        reason: userData.reason,
        dateAdded: userData.dateAdded
      });

      // Send warning message
      const warningMsg = {
        body: `» 𝑵𝒐𝒕𝒊𝒄𝒆 𝒇𝒓𝒐𝒎 𝑶𝒘𝒏𝒆𝒓 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅 «\n\n${userName}, 𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝒃𝒆𝒆𝒏 𝒃𝒂𝒏𝒏𝒆𝒅 𝒇𝒓𝒐𝒎 𝒖𝒔𝒊𝒏𝒈 𝒕𝒉𝒆 𝒃𝒐𝒕 𝒔𝒚𝒔𝒕𝒆𝒎 𝒇𝒐𝒓 𝒖𝒔𝒊𝒏𝒈 𝒊𝒏𝒂𝒑𝒑𝒓𝒐𝒑𝒓𝒊𝒂𝒕𝒆 𝒍𝒂𝒏𝒈𝒖𝒂𝒈𝒆`
      };
      
      api.sendMessage(warningMsg, threadID);

      // Notify admin
      for (const adminID of global.config.ADMINBOT) {
        api.sendMessage(
          `=== 𝑩𝒐𝒕 𝑵𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 ===\n\n` +
          `🆔 𝑼𝒔𝒆𝒓: ${userName}\n` +
          `🔰 𝑼𝑰𝑫: ${senderID}\n` +
          `💬 𝑴𝒆𝒔𝒔𝒂𝒈𝒆: ${word}\n\n` +
          `𝑩𝒂𝒏𝒏𝒆𝒅 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒔𝒚𝒔𝒕𝒆𝒎`,
          adminID
        );
      }
      break;
    }
  }
};

module.exports.run = async ({ event, api }) => {
  api.sendMessage(
    "𝑻𝒉𝒊𝒔 𝒊𝒔 𝒂𝒏 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒆𝒅 𝒔𝒚𝒔𝒕𝒆𝒎 𝒄𝒐𝒎𝒎𝒂𝒏𝒅. 𝑰𝒕 𝒅𝒐𝒆𝒔 𝒏𝒐𝒕 𝒏𝒆𝒆𝒅 𝒕𝒐 𝒃𝒆 𝒄𝒂𝒍𝒍𝒆𝒅 𝒎𝒂𝒏𝒖𝒂𝒍𝒍𝒚.\n\n` +
    "𝑾𝒉𝒆𝒏 𝒖𝒔𝒆𝒓𝒔 𝒖𝒔𝒆 𝒃𝒂𝒅 𝒘𝒐𝒓𝒅𝒔 𝒂𝒈𝒂𝒊𝒏𝒔𝒕 𝒕𝒉𝒆 𝒃𝒐𝒕, 𝒕𝒉𝒆𝒚 𝒘𝒊𝒍𝒍 𝒃𝒆 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒃𝒂𝒏𝒏𝒆𝒅.",
    event.threadID
  );
};
