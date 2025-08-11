module.exports.config = {
  name: "status",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒐𝒕 𝒆𝒓 𝒔𝒂𝒕𝒕𝒐 𝒅𝒆𝒌𝒉𝒂",
  commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
  usages: "",
  cooldowns: 3,
  denpendencies: {}
};

module.exports.run = async function ({ api, event, Threads, getText }) {
  const fs = global.nodemodule["fs-extra"];
  var { threadID, messageID, senderID } = event;
  
  var dataThread = (await Threads.getData(threadID));
  var data = dataThread.data;
  var rankup = data.rankup;
  var resend = data.resend;
  var log = data.log;
  var tagadmin = data.tagadmin;
  var guard = data.guard;
  var antiout = data.antiout;
  
  log == null ? log = "𝒕𝒓𝒖𝒆" : log = `${log}`;
  rankup == null ? rankup = "𝒇𝒂𝒍𝒔𝒆" : rankup = `${rankup}`;
  resend == null ? resend = "𝒇𝒂𝒍𝒔𝒆" : resend = `${resend}`;
  tagadmin == null ? tagadmin = "𝒕𝒓𝒖𝒆" : tagadmin = `${tagadmin}`;
  guard == null ? guard = "𝒕𝒓𝒖𝒆" : guard = `${guard}`;
  antiout == null ? antiout = "𝒕𝒓𝒖𝒆" : antiout = `${antiout}`;
  
  return api.sendMessage(
    `☣️ 𝑺𝒂𝒕𝒕𝒐 𝑻𝒂𝒃𝒍𝒆 ☣️\n\n` +
    `🍄────•🦋•────🍄\n` +
    `❯ 🍉 𝑳𝒐𝒈: ${log}\n` +
    `❯ 🍇 𝑹𝒂𝒏𝒌𝒖𝒑: ${rankup}\n` +
    `❯ 🍓 𝑹𝒆𝒔𝒆𝒏𝒅: ${resend}\n` +
    `❯ 🥕 𝑻𝒂𝒈 𝑨𝒅𝒎𝒊𝒏: ${tagadmin}\n` +
    `❯ 🛡️ 𝑨𝒏𝒕𝒊𝒓𝒐𝒃𝒃𝒆𝒓𝒚: ${guard}\n` +
    `❯ 🍒 𝑨𝒏𝒕𝒊𝒐𝒖𝒕: ${antiout}\n` +
    `🍄────•🦋•────🍄`,
    threadID, messageID
  );
};
