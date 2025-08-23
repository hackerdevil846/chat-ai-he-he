module.exports.config = {
  name: "autoadder",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑼𝒔𝒆𝒓 𝒌𝒆 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒃𝒆 𝒋𝒐𝒌𝒉𝒐𝒏 𝑼𝑰𝑫 𝒃𝒂 𝒇𝒃 𝒍𝒊𝒏𝒌 𝒅𝒆𝒌𝒉𝒂 𝒋𝒂𝒃𝒆",
  category: "𝒈𝒓𝒐𝒖𝒑",
  usages: "[𝑼𝑰𝑰𝑫 𝒃𝒂 𝒇𝒃 𝒍𝒊𝒏𝒌]",
  cooldowns: 2
};

module.exports.handleEvent = async ({ event, api }) => {
  const { threadID, body } = event;
  const fbLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/(?:profile\.php\?id=)?|fb\.com\/)?([0-9]{9,})/gi;
  const matches = [...body.matchAll(fbLinkRegex)];

  for (const match of matches) {
    const uid = match[1];

    try {
      await api.addUserToGroup(uid, threadID);
      api.sendMessage(`✅ 𝑴𝒆𝒎𝒃𝒆𝒓 𝒂𝒅𝒅𝒆𝒅 𝒕𝒐 𝒈𝒓𝒐𝒖𝒑: ${uid}`, threadID);
    } catch (e) {
      if (e.message && e.message.includes("approval")) {
        api.sendMessage(`⚠️ 𝑨𝒅𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕 𝒔𝒆𝒏𝒕 𝒇𝒐𝒓 𝑼𝑰𝑫: ${uid}. 𝑾𝒂𝒊𝒕𝒊𝒏𝒈 𝒇𝒐𝒓 𝒂𝒅𝒎𝒊𝒏 𝒂𝒑𝒑𝒓𝒐𝒗𝒂𝒍.`, threadID);
      } else {
        api.sendMessage(`❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒂𝒅𝒅 ${uid}: ${e.message || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝒆𝒓𝒓𝒐𝒓"}`, threadID);
      }
    }
  }
};

module.exports.run = () => {};
