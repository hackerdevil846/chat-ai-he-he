module.exports.config = {
  name: "antirobbery",
  version: "1.0.0",
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  hasPermssion: 1,
  description: "𝑷𝒓𝒆𝒗𝒆𝒏𝒕 𝒄𝒉𝒂𝒏𝒈𝒊𝒏𝒈 𝒈𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓𝒔",
  usages: "",
  category: "𝑩𝒐𝒙 𝑪𝒉𝒂𝒕",
  cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
      return api.sendMessage('❌ 𝑵𝒆𝒆𝒅 𝒈𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏𝒔, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒂𝒅𝒅 𝒃𝒐𝒕 𝒂𝒔 𝒂𝒅𝒎𝒊𝒏 𝒂𝒏𝒅 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏!', event.threadID, event.messageID);
    
    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["guard"] == "undefined" || data["guard"] == false) {
        data["guard"] = true;
    } else {
        data["guard"] = false;
    }
    
    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);
    
    return api.sendMessage(
        `✅ ${(data["guard"] === true) ? "𝑨𝒏𝒕𝒊-𝑹𝒐𝒃𝒃𝒆𝒓𝒚 𝒔𝒚𝒔𝒕𝒆𝒎 𝒂𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅" : "𝑨𝒏𝒕𝒊-𝑹𝒐𝒃𝒃𝒆𝒓𝒚 𝒔𝒚𝒔𝒕𝒆𝒎 𝒅𝒆𝒂𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅"}`,
        event.threadID,
        event.messageID
    );
};
