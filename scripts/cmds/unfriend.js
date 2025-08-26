module.exports = {
  config: {
    name: "unfriend",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑼𝑰𝑫 𝒃𝒂 '𝒂𝒍𝒍' 𝒆𝒓 𝒎𝒂𝒅𝒉𝒚𝒆𝒎𝒆 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒖𝒏",
    category: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "[uid/all]",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const uid = args[0];
    if (!uid) return api.sendMessage("𝒅𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒌𝒊𝒔𝒖 𝑼𝑰𝑫 𝒃𝒂 '𝒂𝒍𝒍' 𝒍𝒊𝒌𝒉𝒖𝒏", event.threadID, event.messageID);

    // check for the "all" keyword (case-insensitive)
    if (typeof uid === "string" && uid.toLowerCase() === "all") {
      try {
        const friends = await api.getFriendsList();
        let count = 0;
        for (const friend of friends) {
          try {
            await api.unfriend(friend.userID);
            count++;
          } catch (err) {
            console.log(`❌ ${friend.userID} 𝒌𝒆 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂: ${err.message}`);
          }
        }
        return api.sendMessage(`✅ 𝑺𝒐𝒃 𝒇𝒓𝒊𝒆𝒏𝒅 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐. 𝑺𝒐𝒎𝒎𝒂𝒏: ${count}`, event.threadID, event.messageID);
      } catch (e) {
        return api.sendMessage("❌ 𝑭𝒓𝒊𝒆𝒏𝒅 𝒍𝒊𝒔𝒕 𝒑𝒂𝒘𝒂𝒓 𝒔𝒐𝒎𝒐𝒔𝒔𝒂", event.threadID, event.messageID);
      }
    } else {
      try {
        await api.unfriend(uid);
        return api.sendMessage(`✅ 𝑼𝑰𝑫 ${uid} 𝒌𝒆 𝒖𝒏𝒇𝒓𝒊𝒆𝒏𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐`, event.threadID, event.messageID);
      } catch (err) {
        return api.sendMessage(`❌ 𝑼𝒏𝒇𝒓𝒊𝒆𝒏𝒅 𝒌𝒐𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒔𝒔𝒂: ${err.message}`, event.threadID, event.messageID);
      }
    }
  }
};
