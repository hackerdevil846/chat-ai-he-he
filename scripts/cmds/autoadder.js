module.exports = {
  config: {
    name: "autoadder",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑼𝒔𝒆𝒓 𝒌𝒆 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒃𝒆 𝒋𝒐𝒌𝒉𝒐𝒏 𝑼𝑰𝑫 𝒃𝒂 𝒇𝒃 𝒍𝒊𝒏𝒌 𝒅𝒆𝒌𝒉𝒂 𝒋𝒂𝒃𝒆",
    category: "𝒈𝒓𝒐𝒖𝒑",
    usages: "[𝑼𝑰𝑫 𝒃𝒂 𝒇𝒃 𝒍𝒊𝒏𝒌]",
    cooldowns: 2
  },

  onStart: async function({ api, event, message }) {
    // 𝑇ℎ𝑖𝑠 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛 𝑖𝑠 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑏𝑦 𝐺𝑜𝑎𝑡𝐵𝑜𝑡 𝑓𝑟𝑎𝑚𝑒𝑤𝑜𝑟𝑘
    // 𝐵𝑢𝑡 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑤𝑜𝑟𝑘𝑠 𝑎𝑠 𝑎𝑛 𝑒𝑣𝑒𝑛𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟
    await message.reply("🤖 𝑨𝒖𝒕𝒐 𝑨𝒅𝒅𝒆𝒓 𝒊𝒔 𝒂𝒄𝒕𝒊𝒗𝒆! 𝑰 𝒘𝒊𝒍𝒍 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒂𝒅𝒅 𝒖𝒔𝒆𝒓𝒔 𝒘𝒉𝒆𝒏 𝒚𝒐𝒖 𝒔𝒆𝒏𝒅 𝒂 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑼𝑰𝑫 𝒐𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌.");
  },

  handleEvent: async function({ event, api }) {
    const { threadID, body, senderID } = event;
    
    // 𝑃𝑟𝑒𝑣𝑒𝑛𝑡 𝑏𝑜𝑡 𝑓𝑟𝑜𝑚 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑛𝑔 𝑡𝑜 𝑖𝑡𝑠𝑒𝑙𝑓
    if (senderID === api.getCurrentUserID()) return;
    
    if (!body) return;

    const fbLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/(?:profile\.php\?id=)?|fb\.me\/|fb\.com\/)?([0-9]{9,})/gi;
    const matches = [...body.matchAll(fbLinkRegex)];

    for (const match of matches) {
      const uid = match[1];

      try {
        await api.addUserToGroup(uid, threadID);
        api.sendMessage(`✅ 𝑴𝒆𝒎𝒃𝒆𝒓 𝒂𝒅𝒅𝒆𝒅 𝒕𝒐 𝒈𝒓𝒐𝒖𝒑: ${uid}`, threadID);
      } catch (e) {
        if (e && e.message && e.message.includes("approval")) {
          api.sendMessage(`⚠️ 𝑨𝒅𝒅 𝒓𝒆𝒒𝒖𝒆𝒔𝒕 𝒔𝒆𝒏𝒕 𝒇𝒐𝒓 𝑼𝑰𝑫: ${uid}. 𝑾𝒂𝒊𝒕𝒊𝒏𝒈 𝒇𝒐𝒓 𝒂𝒅𝒎𝒊𝒏 𝒂𝒑𝒑𝒓𝒐𝒗𝒂𝒍.`, threadID);
        } else {
          api.sendMessage(`❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒂𝒅𝒅 ${uid}: ${e && e.message ? e.message : "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝒆𝒓𝒓𝒐𝒓"}`, threadID);
        }
      }
    }
  }
};
