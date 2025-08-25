const moment = require("moment-timezone");

module.exports.config = {
  name: "hi",
  version: "12.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "☪️ 𝑰𝒔𝒍𝒂𝒎𝒊𝒄 𝑮𝒓𝒆𝒆𝒕𝒊𝒏𝒈𝒔 𝒘𝒊𝒕𝒉 𝑫𝒚𝒏𝒂𝒎𝒊𝒄 𝑩𝒐𝒓𝒅𝒆𝒓𝒔 𝒂𝒏𝒅 𝑺𝒕𝒊𝒄𝒌𝒆𝒓𝒔",
  category: "☪️ 𝑰𝒔𝒍𝒂𝒎𝒊𝒄 𝑺𝒘𝒂𝒈",
  usages: ["on/off"],
  cooldowns: 5,
  dependencies: {
    "moment-timezone": ""
  }
};

module.exports.languages = {
  "en": {
    "on": "🕌 𝑺𝒂𝒍𝒂𝒎 𝒎𝒐𝒅𝒖𝒍𝒆 𝒂𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅!\n✦━━━━━━━━━━━━✦\n✅ 𝑵𝒐𝒘 𝒓𝒆𝒔𝒑𝒐𝒏𝒅𝒊𝒏𝒈 𝒕𝒐 𝑰𝒔𝒍𝒂𝒎𝒊𝒄 𝒈𝒓𝒆𝒆𝒕𝒊𝒏𝒈𝒔",
    "off": "☪️ 𝑺𝒂𝒍𝒂𝒎 𝒎𝒐𝒅𝒖𝒍𝒆 𝒅𝒆𝒂𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅\n✦━━━━━━━━━━━━✦\n❌ 𝑵𝒐 𝒍𝒐𝒏𝒈𝒆𝒓 𝒓𝒆𝒔𝒑𝒐𝒏𝒅𝒊𝒏𝒈 𝒕𝒐 𝒈𝒓𝒆𝒆𝒕𝒊𝒏𝒈𝒔"
  }
};

module.exports.handleEvent = async function({ event, api, Users, Threads }) {
  const { threadID } = event;
  const threadData = await Threads.getData(threadID);
  
  if (!threadData || !threadData.data || threadData.data.salam !== true) return;

  const triggers = [
    "salam", "assalamualaikum", "allah hu akbar", "subhanallah", 
    "alhamdulillah", "mashallah", "astagfirullah", "inshallah", 
    "bismillah", "ramadan", "eid mubarak"
  ];

  const userMsg = event.body?.toLowerCase();
  if (!triggers.includes(userMsg)) return;

  const stickerIDs = [
    "789381034156662", "789381067489992", "789381100823322", 
    "789381134156652", "789381167489982", "789381200823315", 
    "789381234156645", "789381267489975", "789381300823305", 
    "789381334156635", "789381367489965", "789381400823295", 
    "789381434156625", "789381467489955", "789381500823285", 
    "789381534156615", "789381567489945", "789381600823275", 
    "789381634156605", "789381667489935"
  ];

  const name = await Users.getNameUser(event.senderID);
  const hours = moment.tz('Asia/Dhaka').format('HHmm');
  
  const session = 
    hours <= 400 ? "🌙 Tahajjud Time" :
    hours <= 600 ? "🕋 Fajr Prayer" :
    hours <= 1200 ? "☀️ Duha Time" :
    hours <= 1400 ? "🕌 Dhuhr Prayer" :
    hours <= 1600 ? "🕯️ Asr Prayer" :
    hours <= 1900 ? "🌅 Maghrib Prayer" :
    "🌌 Isha Prayer";

  const borders = [
    ["🕋┏━☪️━┓🕋", "🕋┗━☪️━┛🕋"],
    ["🌟━━✥☪️✥━━🌟", "🌟━━✥☪️✥━━🌟"],
    ["🌙〘", "〙🌙"],
    ["☪️【", "】☪️"],
    ["✨➤", "➤✨"],
    ["🙏❖", "❖🙏"],
    ["🌺〓", "〓🌺"],
    ["📿⟦", "⟧📿"],
    ["🕌<<", ">>🕌"],
    ["🌹╭", "╮🌹"]
  ];

  const [topBorder, bottomBorder] = borders[Math.floor(Math.random() * borders.length)];
  const sticker = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];

  const messages = [
    `${topBorder}\n🕌 𝑨𝒔𝒔𝒂𝒍𝒂𝒎𝒖𝒂𝒍𝒂𝒊𝒌𝒖𝒎 ${name}!\n📿 𝑩𝒂𝒓𝒂𝒌𝒂𝒉-𝒇𝒊𝒍𝒍𝒆𝒅 ${session} 𝒕𝒐 𝒚𝒐𝒖!\n${bottomBorder}`,
    `${topBorder}\n☪️ 𝑨𝒍𝒍𝒂𝒉 𝑯𝒖 𝑨𝒌𝒃𝒂𝒓 ${name}!\n✨ 𝑴𝒂𝒚 𝑨𝒍𝒍𝒂𝒉'𝒔 𝒃𝒍𝒆𝒔𝒔𝒊𝒏𝒈𝒔 𝒃𝒆 𝒖𝒑𝒐𝒏 𝒚𝒐𝒖 𝒕𝒉𝒊𝒔 ${session}\n${bottomBorder}`,
    `${topBorder}\n📖 𝑺𝒖𝒃𝒉𝒂𝒏𝒂𝒍𝒍𝒂𝒉 ${name}!\n🌟 𝒀𝒐𝒖𝒓 𝒇𝒂𝒊𝒕𝒉 𝒔𝒉𝒊𝒏𝒆𝒔 𝒃𝒓𝒊𝒈𝒉𝒕 𝒐𝒏 𝒕𝒉𝒊𝒔 ${session}\n${bottomBorder}`,
    `${topBorder}\n🌙 𝑨𝒍𝒉𝒂𝒎𝒅𝒖𝒍𝒊𝒍𝒍𝒂𝒉 ${name}!\n🕯️ 𝑮𝒓𝒂𝒕𝒊𝒕𝒖𝒅𝒆 𝒊𝒍𝒍𝒖𝒎𝒊𝒏𝒂𝒕𝒆𝒔 𝒚𝒐𝒖𝒓 ${session}\n${bottomBorder}`,
    `${topBorder}\n🕋 𝑴𝒂𝒔𝒉𝒂𝒍𝒍𝒂𝒉 ${name}!\n💫 𝑨𝒍𝒍𝒂𝒉'𝒔 𝒑𝒓𝒐𝒕𝒆𝒄𝒕𝒊𝒐𝒏 𝒖𝒑𝒐𝒏 𝒚𝒐𝒖 𝒂𝒍𝒘𝒂𝒚𝒔\n${bottomBorder}`,
    `${topBorder}\n🌹 𝑩𝒊𝒔𝒎𝒊𝒍𝒍𝒂𝒉 ${name}!\n📿 𝑩𝒆𝒈𝒊𝒏 𝒚𝒐𝒖𝒓 ${session} 𝒘𝒊𝒕𝒉 𝑯𝒊𝒔 𝒏𝒂𝒎𝒆\n${bottomBorder}`
  ];

  const response = {
    body: messages[Math.floor(Math.random() * messages.length)],
    mentions: [{ tag: name, id: event.senderID }]
  };

  api.sendMessage(response, threadID, (err) => {
    if (!err) setTimeout(() => api.sendMessage({ sticker }, threadID), 200);
  });
};

module.exports.onStart = async function({ api, event, Threads, getText }) {
  const { threadID, messageID } = event;
  const threadData = await Threads.getData(threadID);
  
  if (!threadData.data) threadData.data = {};
  threadData.data.salam = !threadData.data.salam;
  
  await Threads.setData(threadID, threadData);
  global.data.threadData.set(threadID, threadData.data);
  
  api.sendMessage(
    `✦━━━━━━━━━━━━━━━━✦\n${threadData.data.salam ? getText("on") : getText("off")}\n✦━━━━━━━━━━━━━━━━✦`,
    threadID,
    messageID
  );
};
