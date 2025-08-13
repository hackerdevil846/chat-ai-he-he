module.exports.config = {
  name: "top",
  version: "0.0.5",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑺𝒆𝒓𝒗𝒆𝒓 𝒆𝒓 𝒕𝒐𝒑 𝒄𝒉𝒂𝒓𝒕!",
  category: "𝒈𝒓𝒐𝒖𝒑",
  usages: "[𝒕𝒉𝒓𝒆𝒂𝒅/𝒖𝒔𝒆𝒓/𝒎𝒐𝒏𝒆𝒚/𝒍𝒆𝒗𝒆𝒍]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args, Currencies, Users }) => {
  const { threadID, messageID } = event;

  // Validate numeric argument if provided
  if ((args[1] && isNaN(args[1])) || parseInt(args[1]) <= 0) {
    return api.sendMessage(
      "𝑳𝒊𝒔𝒕 𝒆𝒓 𝒅𝒐𝒊𝒓𝒈𝒉𝒐 𝒆𝒌𝒕𝒊 𝒔𝒐𝒏𝒌𝒉𝒂 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆 𝒂𝒓 𝒕𝒂 0 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒔𝒊 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆",
      threadID,
      messageID
    );
  }

  const option = parseInt(args[1] || 10);
  let data, msg = "";

  // For level conversion
  function expToLevel(point) {
    if (point < 0) return 0;
    return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
  }

  // ========== Top Users by Level ==========
  if (args[0] === "user" || args[0] === "level") {
    const all = await Currencies.getAll(["userID", "exp"]);
    all.sort((a, b) => b.exp - a.exp);

    let num = 0;
    let topMsg = {
      body: "𝑺𝒂𝒓𝒃𝒆𝒓 𝒆𝒓 𝒔𝒃𝒐𝒄𝒄𝒉𝒂 𝒖𝒄𝒄𝒉 𝒍𝒆𝒗𝒆𝒍𝒆𝒓 10 𝒋𝒂𝒏:"
    };

    for (let i = 0; i < 10; i++) {
      try {
        const level = expToLevel(all[i].exp);
        const userInfo = await Users.getData(all[i].userID);
        const name = userInfo.name || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔";
        num++;
        topMsg.body += `\n${num}. ${name} - 𝒍𝒆𝒗𝒆𝒍 ${level}`;
      } catch (e) {
        console.error("𝑼𝒔𝒆𝒓 𝒊𝒏𝒇𝒐 𝒑𝒂𝒐𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂: ", e);
      }
    }

    return api.sendMessage(topMsg, threadID, messageID);
  }

  // ========== Top Groups by Message Count ==========
  else if (args[0] === "thread") {
    const threadList = [];
    try {
      data = await api.getThreadList(option + 10, null, ["INBOX"]);
    } catch (e) {
      console.log(e);
      return api.sendMessage("𝑮𝒓𝒐𝒖𝒑 𝒍𝒊𝒔𝒕 𝒑𝒂𝒐𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂", threadID, messageID);
    }

    for (const t of data) {
      if (t.isGroup) {
        threadList.push({
          threadName: t.name,
          threadID: t.threadID,
          messageCount: t.messageCount
        });
      }
    }

    threadList.sort((a, b) => b.messageCount - a.messageCount);

    msg = `𝑺𝒂𝒓𝒃𝒐𝒄𝒄𝒉𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒔𝒐𝒎𝒖𝒅𝒓𝒊 𝒕𝒐𝒑 ${threadList.length} 𝒈𝒓𝒐𝒖𝒑:\n`;

    for (let i = 0; i < option && i < threadList.length; i++) {
      const d = threadList[i];
      msg += `\n${i + 1}. ${d.threadName || "𝑵𝒂𝒎 𝒏𝒆𝒊"}\nThread ID: ${d.threadID}\nMessages: ${d.messageCount}\n`;
    }

    return api.sendMessage(msg, threadID, messageID);
  }

  // ========== Top Users by Money ==========
  else if (args[0] === "money") {
    const all = await Currencies.getAll(["userID", "money"]);
    all.sort((a, b) => b.money - a.money);

    let num = 0;
    let topMsg = {
      body: "𝑺𝒂𝒓𝒃𝒆𝒓 𝒆𝒓 𝒔𝒃𝒐𝒄𝒄𝒉𝒂 𝒅𝒉𝒂𝒏𝒊 10 𝒋𝒂𝒏:"
    };

    for (let i = 0; i < 10; i++) {
      try {
        const money = all[i].money;
        const userInfo = await Users.getData(all[i].userID);
        const name = userInfo.name || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔";
        num++;
        topMsg.body += `\n${num}. ${name}: ${money} 💵`;
      } catch (e) {
        console.error("𝑼𝒔𝒆𝒓 𝒊𝒏𝒇𝒐 𝒑𝒂𝒐𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂: ", e);
      }
    }

    return api.sendMessage(topMsg, threadID, messageID);
  }

  // ========== Usage Help ==========
  else {
    return api.sendMessage(
      "𝑼𝒔𝒂𝒈𝒆: top [thread/user/money/level]\n\n" +
      "Examples:\n" +
      "top thread 5\n" +
      "top money\n" +
      "top user",
      threadID,
      messageID
    );
  }
};
