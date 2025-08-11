const moment = require("moment-timezone");

module.exports.config = {
  name: "hi",
  version: "12.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑰𝒔𝒍𝒂𝒎𝒊𝒄 𝑺𝒘𝒂𝒈 𝒘𝒊𝒕𝒉 𝑫𝒚𝒏𝒂𝒎𝒊𝒄 𝑩𝒐𝒓𝒅𝒆𝒓𝒔",
  commandCategory: "☪️ 𝑰𝒔𝒍𝒂𝒎𝒊𝒄 𝑺𝒘𝒂𝒈",
  usages: "auto",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const triggers = [
    "salam", "assalamualaikum", "allah hu akbar", "subhanallah", "alhamdulillah",
    "mashallah", "astagfirullah", "inshallah", "bismillah", "ramadan", "eid mubarak"
  ];

  const thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["salam"] == "undefined" || thread["salam"] == false) return;

  const userMsg = event.body?.toLowerCase();
  if (!triggers.includes(userMsg)) return;

  const stickerIDs = [
    "789381034156662", "789381067489992", "789381100823322", "789381134156652",
    "789381167489982", "789381200823315", "789381234156645", "789381267489975",
    "789381300823305", "789381334156635", "789381367489965", "789381400823295",
    "789381434156625", "789381467489955", "789381500823285", "789381534156615",
    "789381567489945", "789381600823275", "789381634156605", "789381667489935"
  ];
  const sticker = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];

  const hours = moment.tz('Asia/Karachi').format('HHmm');
  const session =
    hours <= 400 ? "🌙 Tahajjud Time" :
    hours <= 600 ? "🕋 Fajr Prayer" :
    hours <= 1200 ? "☀️ Duha Time" :
    hours <= 1400 ? "🕌 Dhuhr Prayer" :
    hours <= 1600 ? "🕯️ Asr Prayer" :
    hours <= 1900 ? "🌅 Maghrib Prayer" :
    "🌌 Isha Prayer";

  const name = await Users.getNameUser(event.senderID);

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

  const msgs = [
    `${topBorder}\nAssalamualaikum ${name}!\n🕌 Barakah-filled ${session} to you!\n${bottomBorder}`,
    `${topBorder}\n☪️ Allah Hu Akbar ${name}!\n✨ May Allah's blessings be upon you this ${session}\n${bottomBorder}`,
    `${topBorder}\n📖 Subhanallah ${name}!\n🌟 Your faith shines bright on this ${session}\n${bottomBorder}`,
    `${topBorder}\n🌙 Alhamdulillah ${name}!\n🕯️ Gratitude illuminates your ${session}\n${bottomBorder}`,
    `${topBorder}\n🕋 Mashallah ${name}!\n💫 Allah's protection upon you always\n${bottomBorder}`,
    `${topBorder}\n🌹 Bismillah ${name}!\n📿 Begin your ${session} with His name\n${bottomBorder}`
  ];

  const reply = {
    body: msgs[Math.floor(Math.random() * msgs.length)],
    mentions: [{ tag: name, id: event.senderID }]
  };

  api.sendMessage(reply, event.threadID, () => {
    setTimeout(() => {
      api.sendMessage({ sticker }, event.threadID);
    }, 200);
  }, event.messageID);
};

module.exports.languages = {
  "en": {
    "on": "𝑺𝒂𝒍𝒂𝒎 𝒎𝒐𝒅𝒖𝒍𝒆 𝒂𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅! ✅",
    "off": "𝑺𝒂𝒍𝒂𝒎 𝒎𝒐𝒅𝒖𝒍𝒆 𝒅𝒆𝒂𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅. ❌",
    "successText": ""
  }
};

module.exports.run = async ({ event, api, Threads, getText }) => {
  const { threadID, messageID } = event;
  const data = (await Threads.getData(threadID)).data;

  if (typeof data["salam"] == "undefined" || data["salam"] == true) data["salam"] = false;
  else data["salam"] = true;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(`${data["salam"] ? getText("on") : getText("off")}`, threadID, messageID);
};
