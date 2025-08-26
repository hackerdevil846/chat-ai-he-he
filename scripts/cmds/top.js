module.exports.config = {
  name: "top",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑺𝒆𝒓𝒗𝒆𝒓 𝒆𝒓 𝒕𝒐𝒑 𝒄𝒉𝒂𝒓𝒕!",
  category: "𝒈𝒓𝒐𝒖𝒑",
  usages: "[𝒕𝒉𝒓𝒆𝒂𝒅/𝒖𝒔𝒆𝒓/𝒎𝒐𝒏𝒆𝒚/𝒍𝒆𝒗𝒆𝒍]",
  cooldowns: 5,
  dependencies: {}
};

module.exports.onStart = async function({ api, event, args, Currencies, Users }) {
  const { threadID, messageID } = event;

  if ((args[1] && isNaN(args[1])) || parseInt(args[1]) <= 0) {
    return api.sendMessage(
      "❌ 𝑳𝒊𝒔𝒕 𝒆𝒓 𝒅𝒐𝒊𝒓𝒈𝒉𝒐 𝒆𝒌𝒕𝒊 𝒔𝒐𝒏𝒌𝒉𝒂 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆 𝒂𝒓 𝒕𝒂 0 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒔𝒊 𝒉𝒐𝒕𝒆 𝒉𝒃𝒆",
      threadID,
      messageID
    );
  }

  const option = parseInt(args[1] || 10);

  const expToLevel = (point) => {
    return point < 0 ? 0 : Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
  };

  switch (args[0]) {
    case "user":
    case "level":
      const allExp = await Currencies.getAll(["userID", "exp"]);
      allExp.sort((a, b) => b.exp - a.exp);
      
      let levelMsg = "╔════════════════════╗\n";
      levelMsg +=     "║    🏆 𝐓𝐎𝐏 𝐋𝐄𝐕𝐄𝐋𝐒 🏆    ║\n";
      levelMsg +=     "╚════════════════════╝\n\n";
      
      for (let i = 0; i < Math.min(10, allExp.length); i++) {
        try {
          const userInfo = await Users.getData(allExp[i].userID);
          const level = expToLevel(allExp[i].exp);
          
          // Create a progress bar for level
          const progressBarLength = 15;
          const progress = Math.min(1, (allExp[i].exp % 100) / 100);
          const filledBar = '█'.repeat(Math.floor(progress * progressBarLength));
          const emptyBar = '░'.repeat(progressBarLength - filledBar.length);
          
          levelMsg += `【${i + 1}】✦ ${userInfo.name || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔"}\n`;
          levelMsg += `   ╭─ Level: ${level} ✨\n`;
          levelMsg += `   ╰─ Exp: ${allExp[i].exp} [${filledBar}${emptyBar}]\n\n`;
        } catch {
          levelMsg += `【${i + 1}】✦ 𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓\n`;
          levelMsg += `   ╰─ Level: ${expToLevel(allExp[i].exp)} ✨\n\n`;
        }
      }
      
      levelMsg += "✦✦✦ 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒖𝒍𝒂𝒕𝒊𝒐𝒏𝒔 𝒕𝒐 𝒂𝒍𝒍 𝒕𝒉𝒆 𝒕𝒐𝒑 𝒖𝒔𝒆𝒓𝒔! ✦✦✦";
      api.sendMessage(levelMsg, threadID, messageID);
      break;

    case "thread":
      try {
        const threadList = (await api.getThreadList(option + 10, null, ["INBOX"]))
          .filter(t => t.isGroup)
          .sort((a, b) => b.messageCount - a.messageCount)
          .slice(0, option);

        let threadMsg = "╔══════════════════════════╗\n";
        threadMsg +=     "║    📊 𝐓𝐎𝐏 𝐀𝐂𝐓𝐈𝐕𝐄 𝐆𝐑𝐎𝐔𝐏𝐒 📊    ║\n";
        threadMsg +=     "╚══════════════════════════╝\n\n";
        
        threadList.forEach((t, i) => {
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
          threadMsg += `${medal} 【${i + 1}】${t.name || "𝑼𝒏𝒏𝒂𝒎𝒆𝒅 𝑮𝒓𝒐𝒖𝒑"}\n`;
          threadMsg += `   ╭─ 📝 Messages: ${t.messageCount.toLocaleString()}\n`;
          threadMsg += `   ╰─ 🆔 Thread ID: ${t.threadID}\n\n`;
        });
        
        threadMsg += "✦ 𝑻𝒉𝒆𝒔𝒆 𝒂𝒓𝒆 𝒕𝒉𝒆 𝒎𝒐𝒔𝒕 𝒂𝒄𝒕𝒊𝒗𝒆 𝒈𝒓𝒐𝒖𝒑𝒔 𝒊𝒏 𝒕𝒉𝒆 𝒔𝒆𝒓𝒗𝒆𝒓! ✦";
        api.sendMessage(threadMsg, threadID, messageID);
      } catch {
        api.sendMessage("❌ 𝑮𝒓𝒐𝒖𝒑 𝒍𝒊𝒔𝒕 𝒓𝒆𝒕𝒓𝒊𝒆𝒗𝒂𝒍 𝒇𝒂𝒊𝒍𝒆𝒅", threadID, messageID);
      }
      break;

    case "money":
      const allMoney = await Currencies.getAll(["userID", "money"]);
      allMoney.sort((a, b) => b.money - a.money);
      
      let moneyMsg = "╔════════════════════════╗\n";
      moneyMsg +=     "║    💰 𝐓𝐎𝐏 𝐑𝐈𝐂𝐇𝐄𝐒𝐓 💰    ║\n";
      moneyMsg +=     "╚════════════════════════╝\n\n";
      
      for (let i = 0; i < Math.min(10, allMoney.length); i++) {
        try {
          const userInfo = await Users.getData(allMoney[i].userID);
          const money = allMoney[i].money.toLocaleString();
          
          // Create a crown for top 3
          const crown = i === 0 ? "👑" : i === 1 ? "💎" : i === 2 ? "⭐" : "🔸";
          
          moneyMsg += `${crown} 【${i + 1}】✦ ${userInfo.name || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔"}\n`;
          moneyMsg += `   ╰─ 💵 ${money} 𝑷𝒐𝒆𝒔𝒐\n\n`;
        } catch {
          moneyMsg += `🔸 【${i + 1}】✦ 𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓\n`;
          moneyMsg += `   ╰─ 💵 ${allMoney[i].money.toLocaleString()} 𝑷𝒐𝒆𝒔𝒐\n\n`;
        }
      }
      
      moneyMsg += "✦ 𝑴𝒐𝒏𝒆𝒚 𝒊𝒔𝒏'𝒕 𝒆𝒗𝒆𝒓𝒚𝒕𝒉𝒊𝒏𝒈, 𝒃𝒖𝒕 𝒊𝒕'𝒔 𝒂 𝒈𝒐𝒐𝒅 𝒔𝒕𝒂𝒓𝒕! ✦";
      api.sendMessage(moneyMsg, threadID, messageID);
      break;

    default:
      const helpMsg = "╔══════════════════════════╗\n";
      helpMsg +=     "║    📖 𝐓𝐎𝐏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐇𝐄𝐋𝐏 📖    ║\n";
      helpMsg +=     "╚══════════════════════════╝\n\n";
      helpMsg +=     "✨ 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐎𝐩𝐭𝐢𝐨𝐧𝐬:\n\n";
      helpMsg +=     "▸ top thread [number] - 𝐒𝐡𝐨𝐰𝐬 𝐭𝐨𝐩 𝐚𝐜𝐭𝐢𝐯𝐞 𝐠𝐫𝐨𝐮𝐩𝐬\n";
      helpMsg +=     "   ↳ 𝐄𝐱: top thread 5\n\n";
      helpMsg +=     "▸ top money - 𝐒𝐡𝐨𝐰𝐬 𝐭𝐨𝐩 𝟏𝟎 𝐫𝐢𝐜𝐡𝐞𝐬𝐭 𝐮𝐬𝐞𝐫𝐬\n";
      helpMsg +=     "   ↳ 𝐄𝐱: top money\n\n";
      helpMsg +=     "▸ top level - 𝐒𝐡𝐨𝐰𝐬 𝐭𝐨𝐩 𝟏𝟎 𝐡𝐢𝐠𝐡𝐞𝐬𝐭 𝐥𝐞𝐯𝐞𝐥 𝐮𝐬𝐞𝐫𝐬\n";
      helpMsg +=     "   ↳ 𝐄𝐱: top level\n\n";
      helpMsg +=     "▸ top user - 𝐀𝐥𝐢𝐚𝐬 𝐟𝐨𝐫 'top level'\n";
      helpMsg +=     "   ↳ 𝐄𝐱: top user\n\n";
      helpMsg +=     "✦ 𝑻𝒓𝒚 𝒕𝒉𝒆𝒔𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒕𝒐 𝒔𝒆𝒆 𝒘𝒉𝒐'𝒔 𝒐𝒏 𝒕𝒐𝒑! ✦";
      
      api.sendMessage(helpMsg, threadID, messageID);
  }
};
