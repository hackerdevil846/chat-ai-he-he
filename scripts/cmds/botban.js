module.exports.config = {
  name: "otherbots",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑶𝒕𝒉𝒆𝒓 𝑩𝒐𝒕𝒔 𝑩𝒂𝒏 𝑺𝒚𝒔𝒕𝒆𝒎",
  commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎 𝑪𝒐𝒏𝒇𝒊𝒈",
  cooldowns: 0
};

module.exports.handleEvent = async ({ event: o, api: t, Users: n }) => {
  const { threadID: e, messageID: a, body: b, senderID: s } = o;
  const i = require("moment-timezone").tz("Asia/Kolkata").format("HH:MM:ss L");
  
  if (s === t.getCurrentUserID()) return;

  const c = await n.getNameUser(o.senderID);
  const h = {
    body: `🛡️ 𝗕𝗼𝘁 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱!\n\n${c}, 𝑻𝒖𝒎𝒊 𝒆𝒌𝒕𝒂 𝒃𝒐𝒕 𝒃𝒐𝒍𝒆 𝒔𝒐𝒏𝒈𝒌𝒉𝒂 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒐! 𝑺𝒑𝒂𝒎 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒄𝒉𝒂𝒕𝒆 𝒕𝒐𝒎𝒂𝒓 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒃𝒆. 😔`
  };

  const botTriggers = [
    "your keyboard level has reached level",
    "Command not found",
    "The command you used",
    "Uy may lumipad",
    "Unsend this message",
    "You are unable to use bot",
    "»» NOTICE «« Update user nicknames",
    "just removed 1 Attachments",
    "message removedcontent",
    "The current preset is",
    "Here Is My Prefix",
    "just removed 1 attachment.",
    "Unable to re-add members",
    "removed 1 message content:",
    "Here's your music, enjoy!🥰",
    "Ye Raha Aapka Music, enjoy!🥰",
    "your keyboard Power level Up",
    "bot ki mc",
    "your keyboard hero level has reached level"
  ];

  if (botTriggers.some(trigger => b.includes(trigger))) {
    console.log(`[ 𝑩𝑶𝑻 𝑩𝑨𝑵𝑵𝑬𝑫 ] ${c} (${s})`);
    
    const userData = n.getData(s).data || {};
    n.setData(s, { data: userData });
    
    userData.banned = 1;
    userData.reason = "𝑶𝒕𝒉𝒆𝒓 𝑩𝒐𝒕 𝑫𝒆𝒕𝒆𝒄𝒕𝒆𝒅";
    userData.dateAdded = i;
    
    global.data.userBanned.set(s, {
      reason: userData.reason,
      dateAdded: userData.dateAdded
    });

    t.sendMessage(h, e, () => {
      global.config.ADMINBOT.forEach(adminID => {
        t.sendMessage(
          `⚠️ 𝗡𝗲𝘄 𝗕𝗼𝘁 𝗕𝗮𝗻𝗻𝗲𝗱 ⚠️\n\n` +
          `𝑵𝒂𝒎𝒆: ${c}\n` +
          `𝑩𝒐𝒕 𝑼𝑰𝑫: ${s}\n` +
          `𝑫𝒂𝒕𝒆: ${i}\n\n` +
          `𝑻𝒉𝒊𝒔 𝒖𝒔𝒆𝒓 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒅𝒆𝒕𝒆𝒄𝒕𝒆𝒅 𝒂𝒔 𝒂𝒏 𝒐𝒕𝒉𝒆𝒓 𝒃𝒐𝒕 𝒂𝒏𝒅 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒃𝒂𝒏𝒏𝒆𝒅! 🔒`,
          adminID
        );
      });
    });
  }
};

module.exports.run = async ({ event: o, api: t }) => {
  t.sendMessage(
    `ℹ️ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗜𝗻𝗳𝗼:\n\n` +
    `𝑻𝒉𝒊𝒔 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒅𝒆𝒕𝒆𝒄𝒕𝒔 𝒂𝒏𝒅 𝒃𝒂𝒏𝒔 𝒐𝒕𝒉𝒆𝒓 𝒃𝒐𝒕𝒔 𝒕𝒐 𝒑𝒓𝒆𝒗𝒆𝒏𝒕 𝒔𝒑𝒂𝒎𝒎𝒊𝒏𝒈. ` +
    `𝑵𝒐 𝒂𝒅𝒅𝒊𝒕𝒊𝒐𝒏𝒂𝒍 𝒂𝒄𝒕𝒊𝒐𝒏 𝒊𝒔 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅. 🔍`,
    o.threadID
  );
};
